import { ArrowUpRight, Github, TrendingUp } from 'lucide-react';
import { projects, type Project } from '@/data/projects';
import { sections } from '@/lib/sections';
import { Tilt } from './fx/tilt';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

const kindLabel: Record<Project['kind'], string> = {
  cliente: 'cliente',
  pessoal: 'pessoal',
  exemplo: 'exemplo — substituir',
};

const accentVar: Record<Project['accent'], string> = {
  brand: 'var(--accent)',
  accent: 'var(--violet)',
  emerald: 'var(--cyan)',
};

export function Projects() {
  return (
    <SectionBlock section={sections.projetos}>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={(index % 3) * 0.07}>
            <Tilt className="h-full">
              <article className="panel panel-live sweep group flex h-full flex-col overflow-hidden">
                <span className="sweep-bar" aria-hidden />

                {/* topo com brilho da cor do projeto */}
                <div className="relative h-24 overflow-hidden border-b">
                  <div
                    className="absolute -right-8 -top-12 size-40 rounded-full blur-3xl"
                    style={{ background: accentVar[project.accent], opacity: 0.22 }}
                    aria-hidden
                  />
                  <span
                    className="data absolute bottom-3 left-5 text-[2.6rem] font-bold leading-none"
                    style={{ color: 'var(--line)' }}
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="absolute right-4 top-4 rounded-full border px-2.5 py-0.5 text-[10.5px]"
                    style={{
                      borderColor:
                        project.kind === 'exemplo' ? 'var(--violet)' : 'var(--line-strong)',
                      color: project.kind === 'exemplo' ? 'var(--violet)' : 'var(--text-faint)',
                    }}
                  >
                    {kindLabel[project.kind]}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-balance text-[16px] font-semibold leading-snug">
                    {project.title}
                  </h3>
                  <p className="prose-text text-muted mt-2.5 text-pretty text-[14.5px] leading-relaxed">
                    {project.summary}
                  </p>

                  <dl className="mt-5 space-y-4">
                    <div>
                      <dt className="label mb-1.5">desafio</dt>
                      <dd className="prose-text text-muted text-[14px] leading-relaxed">
                        {project.problem}
                      </dd>
                    </div>
                    <div>
                      <dt className="label mb-1.5" style={{ color: 'var(--accent)' }}>
                        solução
                      </dt>
                      <dd className="prose-text text-muted text-[14px] leading-relaxed">
                        {project.solution}
                      </dd>
                    </div>
                  </dl>

                  {project.metric ? (
                    <p className="panel mt-5 flex items-start gap-2.5 p-3 text-[13px]">
                      <TrendingUp
                        className="mt-0.5 size-4 shrink-0"
                        style={{ color: 'var(--cyan)' }}
                        aria-hidden
                      />
                      <span className="prose-text">{project.metric}</span>
                    </p>
                  ) : null}

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <li key={tag} className="chip px-2 py-0.5 text-[10.5px]">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  {project.liveUrl || project.repoUrl ? (
                    <div className="mt-auto flex gap-2 pt-6">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex-1 px-4 py-2.5 text-[13px]"
                        >
                          Ver ao vivo
                          <ArrowUpRight className="size-4" aria-hidden />
                        </a>
                      ) : null}
                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Código de ${project.title}`}
                          className="btn-ghost px-4 py-2.5"
                        >
                          <Github className="size-4" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </article>
            </Tilt>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="prose-text text-muted mt-8 text-pretty text-[15px] leading-relaxed">
          Quer ver algo parecido com o seu caso?{' '}
          <a href="#contato" className="text-cyan link-underline">
            Me conte o desafio
          </a>{' '}
          e eu mostro como resolveria.
        </p>
      </Reveal>
    </SectionBlock>
  );
}
