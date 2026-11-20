import { BrainCircuit, MessageSquareText, Target, Timer } from 'lucide-react';
import { aboutStats, site } from '@/lib/site';
import { sections } from '@/lib/sections';
import { CountUp } from './fx/count-up';
import { SectionBlock } from './shell/section-block';
import { TechGrid } from './tech-grid';
import { Reveal } from './ui/reveal';

const pillars = [
  {
    icon: Target,
    title: 'Foco no resultado, não na tecnologia',
    text: 'Antes de escrever a primeira linha eu entendo o problema de negócio. A ferramenta é consequência do objetivo — nunca o contrário.',
  },
  {
    icon: MessageSquareText,
    title: 'Comunicação sem jargão',
    text: 'Você recebe atualizações claras do andamento, em português, com o que foi feito, o que vem a seguir e o que precisa da sua decisão.',
  },
  {
    icon: Timer,
    title: 'Entrega contínua',
    text: 'Nada de sumir por dois meses. Ciclos curtos, com uma versão de teste disponível desde a primeira semana.',
  },
  {
    icon: BrainCircuit,
    title: 'IA como vantagem competitiva',
    text: 'Uso IA para acelerar o desenvolvimento e também para construir automações que reduzem custo operacional do seu lado.',
  },
] as const;

/** Separa "2+" em número e sufixo, para o contador animar só o número. */
function splitStat(value: string): { number: number; suffix: string } {
  const match = /^(\d+)(.*)$/.exec(value);
  if (!match) return { number: 0, suffix: value };
  return { number: Number(match[1]), suffix: match[2] ?? '' };
}

export function About() {
  return (
    <SectionBlock section={sections.sobre}>
      {/*
        Apresentação com foto.

        O resto desta seção é abstrato — números, pilares, ferramentas. Isto
        aqui é a única parte onde quem está decidindo te contratar vê um rosto
        e lê uma frase sua. É o que transforma "um portfólio" em "uma pessoa".

        O texto abaixo é um rascunho honesto, montado só com o que é verdade.
        Reescreva com as suas palavras quando sobrar um tempo — soa melhor
        vindo de você do que de um texto bem-comportado.
      */}
      <Reveal>
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,230px)_1fr] md:gap-12">
          <div className="panel mx-auto w-44 overflow-hidden rounded-2xl md:mx-0 md:w-full">
            <img
              src="/fotos/mateus.webp"
              alt="Mateus Guimarães, de camisa preta, olhando para a câmera."
              width={880}
              height={1100}
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </div>

          <div>
            <p className="text-[19px] font-semibold md:text-[21px]">Oi, eu sou o {site.firstName}.</p>
            <p className="prose-text text-muted mt-4 max-w-xl text-pretty text-[15.5px] leading-relaxed">
              Tenho {site.age} anos, sou formado em Análise e Desenvolvimento de
              Sistemas e construo projetos para clientes desde 2024.
            </p>
            <p className="prose-text text-muted mt-3.5 max-w-xl text-pretty text-[15.5px] leading-relaxed">
              Quem conversa com você do começo ao fim sou eu — não tem
              intermediário entre o que você pede e quem escreve o código. Na
              prática isso quer dizer resposta direta, e alguém que conhece o
              projeto inteiro no dia em que você precisar mudar alguma coisa.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Números que contam ao aparecer */}
      <Reveal>
        <dl className="mt-14 grid gap-4 sm:grid-cols-3">
          {aboutStats.map((stat) => {
            const parsed = splitStat(stat.value);
            return (
              <div key={stat.label} className="panel panel-live p-6">
                <dt className="grad-text data text-[2.6rem] font-bold leading-none">
                  <CountUp value={parsed.number} suffix={parsed.suffix} />
                </dt>
                <dd className="text-muted prose-text mt-2 text-[13px]">{stat.label}</dd>
              </div>
            );
          })}
        </dl>
      </Reveal>

      {/* Pilares */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 0.06}>
            <article className="panel panel-live sweep group h-full p-6 transition duration-300 hover:-translate-y-1">
              <span className="sweep-bar" aria-hidden />

              <span
                className="grid size-11 place-items-center rounded-xl border transition group-hover:scale-110"
                style={{ borderColor: 'var(--line)', color: 'var(--accent)' }}
              >
                <pillar.icon className="size-5" aria-hidden />
              </span>

              <h3 className="mt-5 text-[16px] font-semibold">{pillar.title}</h3>
              <p className="prose-text text-muted mt-2.5 text-pretty text-[15px] leading-relaxed">
                {pillar.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Ferramentas */}
      <Reveal delay={0.08}>
        <div className="mt-20 flex items-baseline gap-4">
          <h3 className="text-[15px] font-semibold">Com o que eu trabalho</h3>
          <span className="rule flex-1" aria-hidden />
          <span className="label hidden sm:inline">{site.shortLocation}</span>
        </div>
        <p className="prose-text text-muted mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed">
          Se esses nomes não significam nada para você, tudo bem — não precisam
          mesmo. Passe o mouse em qualquer um para ver o que faz. O que importa
          é que são ferramentas conhecidas e bem mantidas: se um dia você trocar
          de desenvolvedor, qualquer profissional da área consegue continuar o
          trabalho.
        </p>
      </Reveal>

      <div className="mt-8">
        <TechGrid />
      </div>
    </SectionBlock>
  );
}
