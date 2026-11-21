import { pains } from '@/data/pains';
import { sections } from '@/lib/sections';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

export function Pains() {
  return (
    <SectionBlock section={sections.desafios}>
      <ul className="grid gap-4">
        {pains.map((pain, index) => (
          <Reveal key={pain.quote} delay={index * 0.05}>
            <li className="panel panel-live sweep group grid gap-x-8 gap-y-4 p-6 transition duration-300 hover:-translate-y-0.5 md:grid-cols-2 md:p-8">
              <span className="sweep-bar" aria-hidden />

              <p className="prose-text text-pretty text-[18px] font-medium leading-snug sm:text-[20px]">
                <span className="text-accent mr-1" aria-hidden>
                  “
                </span>
                {pain.quote}
                <span className="text-accent ml-0.5" aria-hidden>
                  ”
                </span>
              </p>

              <div>
                <p className="label mb-2.5">o que eu faço</p>
                <p className="prose-text text-muted text-pretty text-[15px] leading-relaxed">
                  {pain.answer}
                </p>
                <p className="data text-faint mt-3 text-[11px]">{pain.tech}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.1}>
        <p className="prose-text text-muted mt-8 text-pretty text-[15px] leading-relaxed">
          Não achou o seu caso aqui? Me conta mesmo assim.{' '}
          <a href="#contato" className="text-cyan link-underline">
            Conversar não custa nada
          </a>{' '}
          e, se eu não for a pessoa certa para o seu problema, eu digo na hora.
        </p>
      </Reveal>
    </SectionBlock>
  );
}
