import { sections } from '@/lib/sections';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

const steps = [
  {
    number: '01',
    title: 'Conversa inicial',
    duration: 'sem custo · 30 min',
    text: 'Entendo o problema, o contexto do negócio e o que precisa estar pronto. Se eu não for a melhor pessoa para o projeto, eu digo na hora.',
  },
  {
    number: '02',
    title: 'Proposta e escopo',
    duration: 'até 3 dias úteis',
    text: 'Você recebe um documento com o que será entregue, prazos por etapa, tecnologias e valor fechado. Sem letra miúda.',
  },
  {
    number: '03',
    title: 'Desenvolvimento em ciclos',
    duration: 'entregas semanais',
    text: 'Uma versão de teste fica no ar desde a primeira semana. Você acompanha o progresso e valida cada etapa antes de seguir.',
  },
  {
    number: '04',
    title: 'Entrega e evolução',
    duration: '30 dias de garantia',
    text: 'Publicação, documentação, transferência do código e acompanhamento. Depois, manutenção mensal se você quiser.',
  },
] as const;

export function Process() {
  return (
    <SectionBlock section={sections.processo}>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Reveal key={step.number} delay={index * 0.07}>
            <li className="panel panel-live sweep group relative h-full p-6 transition duration-300 hover:-translate-y-1.5">
              <span className="sweep-bar" aria-hidden />

              <span className="grad-text data text-[2.4rem] font-bold leading-none">
                {step.number}
              </span>

              <h3 className="mt-4 text-[16px] font-semibold">{step.title}</h3>
              <p className="data text-accent mt-1 text-[11px]">{step.duration}</p>
              <p className="prose-text text-muted mt-3 text-pretty text-[14.5px] leading-relaxed">
                {step.text}
              </p>

              {/* conector entre as etapas */}
              {index < steps.length - 1 ? (
                <span
                  className="absolute -right-4 top-1/2 hidden h-px w-4 lg:block"
                  style={{ background: 'var(--line)' }}
                  aria-hidden
                />
              ) : null}
            </li>
          </Reveal>
        ))}
      </ol>
    </SectionBlock>
  );
}
