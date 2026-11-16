import { services } from '@/data/services';
import { sections } from '@/lib/sections';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

export function Services() {
  return (
    <SectionBlock section={sections.servicos}>
      <ul className="grid gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={(index % 2) * 0.06}>
            <li className="panel panel-live sweep group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 md:p-7">
              <span className="sweep-bar" aria-hidden />

              <div className="flex items-start gap-4">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-xl border transition group-hover:scale-110"
                  style={{ borderColor: 'var(--line)', color: 'var(--accent)' }}
                >
                  <service.icon className="size-5" aria-hidden />
                </span>
                <h3 className="pt-2 text-[16px] font-semibold leading-snug">{service.title}</h3>
              </div>

              <p className="prose-text text-muted mt-4 text-pretty text-[15px] leading-relaxed">
                {service.description}
              </p>

              <div className="mt-auto pt-6">
                <p className="label mb-2">o que muda na prática</p>
                <p
                  className="prose-text text-pretty border-l-2 pl-4 text-[15px] leading-relaxed"
                  style={{ borderColor: 'var(--accent)' }}
                >
                  {service.outcome}
                </p>
                <p className="data text-faint mt-3 pl-4 text-[11px]">
                  {service.bullets.join(' · ')}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.08}>
        <p className="prose-text text-muted mt-8 text-pretty text-[15px] leading-relaxed">
          Não sabe em qual desses o seu caso se encaixa? Normal — essa é a minha
          parte do trabalho.{' '}
          <a href="#montar" className="text-cyan link-underline">
            Monte o projeto logo abaixo
          </a>{' '}
          ou me descreva a situação, e eu digo qual caminho faz sentido.
        </p>
      </Reveal>
    </SectionBlock>
  );
}
