import { faqItems } from '@/data/faq';
import { sections } from '@/lib/sections';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

export function Faq() {
  return (
    <SectionBlock section={sections.faq}>
      <div className="grid gap-3">
        {faqItems.map((item, index) => (
          <Reveal key={item.question} delay={index * 0.04}>
            <details className="panel panel-live group px-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-baseline gap-4 py-5">
                <span className="data text-faint shrink-0 text-[11px] transition group-hover:text-[color:var(--accent)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[15.5px] font-semibold leading-snug transition group-hover:text-[color:var(--cyan)]">
                  {item.question}
                </span>
                <span
                  className="shrink-0 text-[18px] leading-none transition duration-300 group-open:rotate-45"
                  style={{ color: 'var(--accent)' }}
                  aria-hidden
                >
                  +
                </span>
              </summary>

              <p className="prose-text text-muted max-w-2xl text-pretty pb-6 pl-[2.1rem] text-[15px] leading-relaxed">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </SectionBlock>
  );
}
