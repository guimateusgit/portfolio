/** Tipos compartilhados entre a rota /api/github e a seção que a consome. */

export type GithubLanguage = {
  name: string;
  repos: number;
  percent: number;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  pushedAt: string;
};

export type GithubProfile = {
  login: string;
  name: string | null;
  url: string;
  avatarUrl: string;
  followers: number;
  publicRepos: number;
  createdAt: string;
};

export type GithubPayload = {
  /** Vem `true` quando `site.githubUser` não foi configurado. */
  disabled?: boolean;
  profile?: GithubProfile;
  totals?: {
    repos: number;
    stars: number;
    languages: number;
    /** Contribuições nos últimos 12 meses — só com GITHUB_TOKEN configurado. */
    contributions: number | null;
  };
  languages?: GithubLanguage[];
  topRepos?: GithubRepo[];
};
