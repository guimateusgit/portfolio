'use client';

import { useEffect, useState } from 'react';
import type {
  GithubLanguage,
  GithubPayload,
  GithubProfile,
  GithubRepo,
} from '@/lib/github-types';
import { sections } from '@/lib/sections';
import { CountUp } from './fx/count-up';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

type ReadyData = {
  profile: GithubProfile;
  totals: NonNullable<GithubPayload['totals']>;
  languages: GithubLanguage[];
  topRepos: GithubRepo[];
};

type State = { status: 'loading' } | { status: 'hidden' } | { status: 'ready'; data: ReadyData };

function formatRelative(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months}m`;
  return `há ${Math.floor(months / 12)}a`;
}

export function GithubActivity() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch('/api/github');
        if (!response.ok) throw new Error('falha');

        const data: GithubPayload = await response.json();
        if (!active) return;

        if (data.disabled || !data.profile || !data.totals || !data.languages || !data.topRepos) {
          setState({ status: 'hidden' });
          return;
        }

        setState({
          status: 'ready',
          data: {
            profile: data.profile,
            totals: data.totals,
            languages: data.languages,
            topRepos: data.topRepos,
          },
        });
      } catch {
        if (active) setState({ status: 'hidden' });
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  if (state.status === 'hidden') return null;

  return (
    <SectionBlock section={sections.github}>
      {state.status === 'loading' ? <Skeleton /> : <Loaded data={state.data} />}
    </SectionBlock>
  );
}

function Skeleton() {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="panel h-28" />
      ))}
    </div>
  );
}

function Loaded({ data }: { data: ReadyData }) {
  const { profile, totals, languages, topRepos } = data;

  const readout = [
    { key: 'Projetos publicados', value: totals.repos },
    { key: 'Estrelas de outros programadores', value: totals.stars },
    { key: 'Linguagens usadas', value: totals.languages },
    ...(totals.contributions !== null
      ? [{ key: 'Alterações em 12 meses', value: totals.contributions }]
      : []),
  ];

  return (
    <>
      {/* Explicação para quem não é da área */}
      <Reveal>
        <div className="panel mb-6 border-l-2 p-6" style={{ borderLeftColor: 'var(--cyan)' }}>
          <p className="label mb-3">o que é isso?</p>
          <p className="prose-text text-muted max-w-2xl text-pretty text-[15px] leading-relaxed">
            O GitHub é o lugar público onde programadores guardam e publicam
            código aberto. Os números abaixo vêm direto de lá, ao vivo. Vale
            dizer que boa parte do meu trabalho não aparece aqui: código feito
            para cliente costuma ser privado. Se quiser ver resultado de
            verdade, os sites na seção de projetos estão todos no ar.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {readout.map((item) => (
            <div key={item.key} className="panel panel-live p-6">
              <dt className="grad-text data text-[2.2rem] font-bold leading-none">
                <CountUp value={item.value} />
              </dt>
              <dd className="prose-text text-muted mt-2 text-[13px]">{item.key}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Linguagens — série única, uma cor só */}
        <Reveal delay={0.08}>
          <div className="panel h-full p-6">
            <h3 className="text-[15px] font-semibold">Linguagens</h3>
            <p className="prose-text text-faint mt-1.5 max-w-sm text-pretty text-[13px] leading-relaxed">
              Em quais linguagens de programação eu mais escrevo. É como dizer
              quais idiomas alguém fala — e com que frequência usa cada um.
            </p>

            {languages.length === 0 ? (
              <p className="text-muted mt-5 text-[13px]">
                Ainda não há projetos públicos com linguagem detectada.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {languages.map((language) => (
                  <li key={language.name}>
                    <div className="flex items-baseline justify-between gap-3 text-[13px]">
                      <span>{language.name}</span>
                      <span className="data text-muted">
                        {language.percent.toFixed(0)}%
                        <span className="text-faint ml-2">
                          {language.repos} {language.repos === 1 ? 'projeto' : 'projetos'}
                        </span>
                      </span>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full"
                      style={{ background: 'var(--line)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(language.percent, 2)}%`,
                          background: 'linear-gradient(90deg, var(--accent), var(--cyan))',
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        {/* Projetos públicos */}
        <Reveal delay={0.14}>
          <div className="panel h-full p-6">
            <div className="flex items-baseline gap-3">
              <h3 className="text-[15px] font-semibold">Projetos públicos</h3>
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted data ml-auto shrink-0 text-[12px] transition hover:text-[color:var(--cyan)]"
              >
                @{profile.login} ↗
              </a>
            </div>
            <p className="prose-text text-faint mt-1.5 max-w-sm text-pretty text-[13px] leading-relaxed">
              Os mais relevantes do meu perfil. Clique em qualquer um para ver o
              código aberto, por completo.
            </p>

            {topRepos.length === 0 ? (
              <p className="text-muted mt-5 text-[13px]">
                Nenhum projeto público para mostrar ainda.
              </p>
            ) : (
              <ul className="mt-5 space-y-2.5">
                {topRepos.map((repo) => (
                  <li key={repo.name}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="panel sweep group block p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--cyan)]"
                    >
                      <span className="sweep-bar" aria-hidden />

                      <div className="flex items-baseline gap-2">
                        <span className="data text-accent truncate text-[13px]">
                          {repo.name}
                        </span>
                        {repo.stars > 0 ? (
                          <span className="data text-faint ml-auto shrink-0 text-[11px]">
                            ★ {repo.stars}
                          </span>
                        ) : null}
                      </div>

                      {repo.description ? (
                        <p className="prose-text text-muted mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed">
                          {repo.description}
                        </p>
                      ) : null}

                      <p className="data text-faint mt-2 text-[11px]">
                        {repo.language ? `${repo.language} · ` : ''}
                        {formatRelative(repo.pushedAt)}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </>
  );
}
