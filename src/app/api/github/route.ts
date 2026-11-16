import { NextResponse } from 'next/server';
import type { GithubLanguage, GithubPayload, GithubRepo } from '@/lib/github-types';
import { site } from '@/lib/site';

/** Cache de 1 hora — evita estourar o limite da API pública do GitHub. */
export const revalidate = 3600;

const API = 'https://api.github.com';
const MAX_LANGUAGES = 6;

/**
 * Mínimo de repositórios públicos para a seção aparecer no site.
 *
 * Com perfil novo ou quase vazio, esta seção trabalha contra você: "1 projeto
 * publicado · 0 estrelas" diz menos do que não dizer nada, e o público
 * principal do site (quem não é da área) nem entende a métrica. A prova forte
 * já está em Projetos e Experiência.
 *
 * Com 4 ou mais repositórios o perfil começa a contar uma história sozinho —
 * aí a seção volta automaticamente, sem precisar mexer em código.
 *
 * Quer desligar de vez? Apague `<GithubActivity />` de src/app/page.tsx.
 * Quer ligar agora mesmo? Baixe este número para 1.
 */
const MIN_PUBLIC_REPOS = 4;

type RawUser = {
  login: string;
  name: string | null;
  html_url: string;
  avatar_url: string;
  followers: number;
  public_repos: number;
  created_at: string;
};

type RawRepo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-site',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Contribuições dos últimos 12 meses só existem na API GraphQL, que exige
 * token. Sem token, devolvemos null e a interface simplesmente não mostra
 * esse número.
 */
async function fetchContributions(login: string): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const response = await fetch(`${API}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-site',
      },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar { totalContributions }
            }
          }
        }`,
        variables: { login },
      }),
      next: { revalidate },
    });

    if (!response.ok) return null;

    const json: {
      data?: {
        user?: { contributionsCollection?: { contributionCalendar?: { totalContributions?: number } } };
      };
    } = await response.json();

    const total =
      json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions;

    return typeof total === 'number' ? total : null;
  } catch {
    return null;
  }
}

export async function GET(): Promise<Response> {
  const login = site.githubUser.trim();

  if (!login || login.startsWith('SEU-USUARIO')) {
    return NextResponse.json({ disabled: true });
  }

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`${API}/users/${login}`, {
        headers: buildHeaders(),
        next: { revalidate },
      }),
      fetch(`${API}/users/${login}/repos?per_page=100&sort=pushed&type=owner`, {
        headers: buildHeaders(),
        next: { revalidate },
      }),
    ]);

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: `GitHub respondeu ${userResponse.status} para o usuário "${login}".` },
        { status: 502 },
      );
    }

    const user: RawUser = await userResponse.json();
    const rawRepos: RawRepo[] = reposResponse.ok ? await reposResponse.json() : [];

    const ownRepos = rawRepos.filter((repo) => !repo.fork && !repo.archived);

    // Perfil ainda vazio: melhor não mostrar a seção do que mostrar zeros.
    if (ownRepos.length < MIN_PUBLIC_REPOS) {
      return NextResponse.json({ disabled: true });
    }

    const stars = ownRepos.reduce((total, repo) => total + repo.stargazers_count, 0);

    // Distribuição por linguagem principal de cada repositório.
    const counts = new Map<string, number>();
    for (const repo of ownRepos) {
      if (!repo.language) continue;
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    }

    const totalWithLanguage = [...counts.values()].reduce((a, b) => a + b, 0);

    const sorted = [...counts.entries()]
      .map(([name, repos]) => ({
        name,
        repos,
        percent: totalWithLanguage > 0 ? (repos / totalWithLanguage) * 100 : 0,
      }))
      .sort((a, b) => b.repos - a.repos);

    const head = sorted.slice(0, MAX_LANGUAGES);
    const tail = sorted.slice(MAX_LANGUAGES);

    const languages: GithubLanguage[] = [...head];
    if (tail.length > 0) {
      languages.push({
        name: 'Outras',
        repos: tail.reduce((total, item) => total + item.repos, 0),
        percent: tail.reduce((total, item) => total + item.percent, 0),
      });
    }

    const topRepos: GithubRepo[] = [...ownRepos]
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
      )
      .slice(0, 4)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        pushedAt: repo.pushed_at,
      }));

    const payload: GithubPayload = {
      profile: {
        login: user.login,
        name: user.name,
        url: user.html_url,
        avatarUrl: user.avatar_url,
        followers: user.followers,
        publicRepos: user.public_repos,
        createdAt: user.created_at,
      },
      totals: {
        repos: ownRepos.length || user.public_repos,
        stars,
        languages: counts.size,
        contributions: await fetchContributions(login),
      },
      languages,
      topRepos,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('[github] Falha ao consultar a API:', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar os dados do GitHub agora.' },
      { status: 502 },
    );
  }
}
