import { Briefcase, GraduationCap } from 'lucide-react';
import { timeline } from '@/data/experience';
import { sections } from '@/lib/sections';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

export function Experience() {
  return (
    <SectionBlock section={sections.experiencia}>
      <ol className="relative">
        {/* trilho vertical */}
        <span
          className="absolute left-5 top-3 bottom-3 w-px md:left-6"
          style={{
            background:
              'linear-gradient(to bottom, var(--accent), var(--line) 30%, transparent)',
          }}
          aria-hidden
        />

        {timeline.map((entry, index) => (
          <Reveal key={`${entry.org}-${entry.period}`} delay={index * 0.06}>
            <li className="relative pb-5 pl-16 last:pb-0 md:pl-20">
              <span
                className="absolute left-0 top-2 grid size-10 place-items-center rounded-xl border md:size-12"
                style={{
                  borderColor: entry.current ? 'var(--accent)' : 'var(--line)',
                  background: 'var(--panel-solid)',
                  color: entry.current ? 'var(--accent)' : 'var(--text-faint)',
                }}
                aria-hidden
              >
                {entry.kind === 'education' ? (
                  <GraduationCap className="size-[18px]" />
                ) : (
                  <Briefcase className="size-[18px]" />
                )}
              </span>

              <article className="panel panel-live sweep group p-6 transition duration-300 hover:-translate-y-1 md:p-7">
                <span className="sweep-bar" aria-hidden />

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="data text-accent text-[12px]">{entry.period}</span>
                  <span className="label">
                    {entry.kind === 'education' ? 'formação' : 'trabalho'}
                  </span>

                  {entry.current ? (
                    <span className="chip gap-1.5 py-0.5 text-[10.5px]">
                      <span
                        className="pulse-soft size-1.5 rounded-full"
                        style={{ background: 'var(--accent)' }}
                        aria-hidden
                      />
                      em andamento
                    </span>
                  ) : null}

                  {entry.placeholder ? (
                    <span
                      className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide"
                      style={{ borderColor: 'var(--violet)', color: 'var(--violet)' }}
                    >
                      preencher
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-[16px] font-semibold leading-snug">{entry.role}</h3>
                <p className="text-muted mt-0.5 text-[13px]">{entry.org}</p>

                <p className="prose-text text-muted mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed">
                  {entry.description}
                </p>

                {entry.bullets.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-[14px]">
                        <span className="text-accent shrink-0" aria-hidden>
                          →
                        </span>
                        <span className="prose-text text-muted leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.tags.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <li key={tag} className="chip px-2 py-0.5 text-[10.5px]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          </Reveal>
        ))}
      </ol>
    </SectionBlock>
  );
}
