import type { ReactNode } from 'react';
import type { SectionDef } from '@/lib/sections';
import { Scramble } from '../fx/scramble';
import { Reveal } from '../ui/reveal';

type SectionBlockProps = {
  section: SectionDef;
  children: ReactNode;
};

/**
 * Casca visual compartilhada por todas as seções: o número, o rótulo, o
 * título que se decodifica ao entrar na tela e o resumo.
 */
export function SectionBlock({ section, children }: SectionBlockProps) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-titulo`}
      className="scroll-mt-24 py-24 md:py-32"
    >
      <div className="container-page">
        <Reveal>
          {/* Faixa de identificação */}
          <div className="flex items-center gap-4">
            <span className="data text-accent rounded-md border border-[color:var(--line)] px-2 py-1 text-[11px]">
              {section.index}
            </span>
            <span className="label">
              <Scramble text={section.label} />
            </span>
            <span
              className="h-px flex-1"
              style={{
                background:
                  'linear-gradient(90deg, color-mix(in srgb, var(--accent) 55%, transparent), var(--line) 35%, transparent)',
              }}
              aria-hidden
            />
          </div>

          <h2
            id={`${section.id}-titulo`}
            className="mt-7 max-w-3xl text-balance text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.1] tracking-tight"
          >
            {section.title}
          </h2>

          <p className="prose-text text-muted mt-4 max-w-2xl text-pretty text-[16px] leading-relaxed">
            {section.summary}
          </p>
        </Reveal>

        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
