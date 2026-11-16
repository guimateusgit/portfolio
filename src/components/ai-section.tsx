import {
  Bot,
  FileSearch,
  GitPullRequestArrow,
  Headphones,
  Rocket,
  ScanText,
  ShieldCheck,
  TestTube2,
  type LucideIcon,
} from 'lucide-react';
import { sections } from '@/lib/sections';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

/** Como a IA acelera o MEU trabalho — benefício para quem contrata. */
const workflow = [
  {
    icon: Rocket,
    title: 'Prototipagem em horas, não semanas',
    text: 'Transformo uma ideia em versão navegável rapidamente, para você validar a direção antes de investir no desenvolvimento completo.',
  },
  {
    icon: TestTube2,
    title: 'Cobertura de testes ampliada',
    text: 'Gero casos de teste e cenários de borda que normalmente ficariam de fora por falta de tempo. Menos bug chegando em produção.',
  },
  {
    icon: GitPullRequestArrow,
    title: 'Revisão de código em duas camadas',
    text: 'Toda alteração passa por análise automatizada buscando falhas, riscos de segurança e código duplicado — e depois pela minha revisão humana.',
  },
  {
    icon: ShieldCheck,
    title: 'A responsabilidade técnica é minha',
    text: 'A IA é ferramenta, não autora. Nada vai para produção sem eu entender, testar e assinar embaixo. Você contrata um engenheiro, não um gerador de texto.',
  },
] as const;

/** O que eu construo COM IA para o cliente — serviço vendável. */
const solutions = [
  {
    icon: Headphones,
    title: 'Atendimento automatizado',
    text: 'Agente que responde clientes 24/7 no WhatsApp ou no site, qualifica o lead e entrega a conversa pronta para o time comercial.',
    tags: ['WhatsApp API', 'RAG'],
  },
  {
    icon: ScanText,
    title: 'Leitura de documentos',
    text: 'Notas fiscais, contratos e planilhas lidos automaticamente e transformados em dados estruturados dentro do seu sistema.',
    tags: ['OCR', 'Extração'],
  },
  {
    icon: FileSearch,
    title: 'Busca inteligente interna',
    text: 'Sua equipe pergunta em linguagem natural e recebe a resposta com a fonte, buscando na base de conhecimento da própria empresa.',
    tags: ['Embeddings', 'pgvector'],
  },
  {
    icon: Bot,
    title: 'Automação de processos',
    text: 'Fluxos que conectam sistemas, classificam informações e disparam ações — eliminando o copiar-e-colar diário da operação.',
    tags: ['Agentes', 'n8n'],
  },
] as const;

type Item = {
  icon: LucideIcon;
  title: string;
  text: string;
  tags?: readonly string[];
};

function Block({ label, items }: { label: string; items: readonly Item[] }) {
  return (
    <div>
      <Reveal>
        <div className="flex items-baseline gap-4">
          <h3 className="text-[15px] font-semibold">{label}</h3>
          <span className="rule flex-1" aria-hidden />
        </div>
      </Reveal>

      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={(index % 2) * 0.06}>
            <li className="panel panel-live sweep group flex h-full gap-4 p-6 transition duration-300 hover:-translate-y-1">
              <span className="sweep-bar" aria-hidden />

              <span
                className="grid size-10 shrink-0 place-items-center rounded-lg border transition group-hover:scale-110"
                style={{ borderColor: 'var(--line)', color: 'var(--violet)' }}
              >
                <item.icon className="size-[18px]" aria-hidden />
              </span>

              <div>
                <h4 className="text-[15px] font-semibold leading-snug">{item.title}</h4>
                <p className="prose-text text-muted mt-2 text-pretty text-[14.5px] leading-relaxed">
                  {item.text}
                </p>

                {item.tags ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="chip px-2 py-0.5 text-[10.5px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function AiSection() {
  return (
    <SectionBlock section={sections.ia}>
      <div className="space-y-14">
        <Block label="A IA que acelera o meu trabalho" items={workflow} />
        <Block label="A IA que eu instalo na sua empresa" items={solutions} />
      </div>

      <Reveal delay={0.08}>
        <div
          className="panel mt-12 border-l-2 p-7"
          style={{ borderLeftColor: 'var(--accent)' }}
        >
          <p className="label mb-3">nota de transparência</p>
          <p className="prose-text text-muted max-w-2xl text-pretty text-[15px] leading-relaxed">
            Empresas costumam perguntar se código feito com apoio de IA é
            confiável. A resposta honesta: a ferramenta acelera, mas não
            substitui engenharia. Todo projeto passa por revisão humana, testes
            automatizados e documentação — e eu explico qualquer decisão técnica
            sempre que você perguntar.
          </p>
        </div>
      </Reveal>
    </SectionBlock>
  );
}
