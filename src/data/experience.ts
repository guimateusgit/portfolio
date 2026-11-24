/**
 * ============================================================================
 *  TIMELINE — "Onde eu trabalhei e estudei"
 * ============================================================================
 *  Entradas com `placeholder: true` ainda são modelo e aparecem no site com
 *  etiqueta roxa "preencher". Troque pelos dados reais e remova a flag.
 *
 *  Regras de ouro:
 *   - `period`: use "2025 — atual" para o que está em andamento (e `current: true`).
 *   - `bullets`: 2 a 3 linhas, cada uma começando com verbo de ação e, quando
 *     possível, terminando em resultado.
 *   - Não invente cargo nem empresa. Estágio, freelance e projeto pessoal
 *     contam — e contam bem, quando descritos com honestidade.
 *   - Ordem: mais recente primeiro.
 *   - Não coloque CNPJ, endereço ou dado de contrato. Isso é página pública.
 * ============================================================================
 */

export type TimelineEntry = {
  kind: 'work' | 'education';
  role: string;
  org: string;
  period: string;
  /** Mostra a etiqueta "em andamento" e destaca o marcador na linha do tempo. */
  current?: boolean;
  /** Mostra a etiqueta roxa "preencher". Remova quando preencher de verdade. */
  placeholder?: boolean;
  /**
   * Site da empresa ou instituição. Quando existe, o nome vira link.
   *
   * Só vale endereço público e estável: quem lê o portfólio clica para
   * confirmar que o lugar existe, e um link morto faz o efeito contrário.
   */
  orgUrl?: string;
  description: string;
  bullets: readonly string[];
  tags: readonly string[];
};

export const timeline: readonly TimelineEntry[] = [
  {
    kind: 'work',
    role: 'Desenvolvedor full stack',
    org: 'cajuPay — fintech de pagamentos',
    orgUrl: 'https://cajupay.com.br/',
    period: 'nov/2026 — atual',
    current: true,
    description:
      'Trabalho com Go no servidor e React na interface, pegando funcionalidades de ponta a ponta. É um contexto que exige cuidado: o sistema mexe com dinheiro de terceiros.',
    bullets: [
      'Construí o módulo de campanhas e automações de marketing, com envio por WhatsApp, SMS e e-mail e disparos automáticos por evento.',
      'Implementei a carteira pré-paga que controla esses envios, com débito por mensagem e estorno quando a entrega falha.',
      'Entreguei o rastreio de pedidos físicos e evoluí a área de membros.',
    ],
    tags: ['Go', 'React', 'APIs e webhooks', 'Pagamentos'],
  },
  {
    kind: 'work',
    role: 'Desenvolvedor web (freelance)',
    org: 'Projetos para clientes',
    period: '2024 — atual',
    current: true,
    description:
      'Atendo clientes por conta própria desde 2024, sem interrupção — sempre em paralelo ao estágio e ao trabalho formal. Cuido do começo ao fim: entender o problema, propor o escopo, desenvolver, publicar e dar suporte depois da entrega.',
    bullets: [
      'Desenvolvi a página de captação da Kryoos, plataforma de conteúdo científico por assinatura para fisioterapeutas esportivos, em Next.js e TypeScript.',
      'Construí o site da Pousada Recanto do Sono, na BR-116, com reserva direta pelo WhatsApp e foco em quem acessa pelo celular na estrada.',
      'Conciliei os projetos com a rotina de trabalho fixo, entregando dentro do prazo combinado com cada cliente.',
    ],
    tags: ['Next.js', 'TypeScript', 'React', 'SEO'],
  },
  {
    kind: 'work',
    role: 'Estagiário em cadastro e qualidade de dados',
    org: 'Stringhini Serviços — tecnologia para o varejo',
    period: 'nov/2024 — abr/2026',
    description:
      'Primeira experiência formal, em uma empresa de tecnologia voltada ao varejo. Trabalhei na base de produtos que alimenta os sistemas usados pelos clientes da empresa — o tipo de dado em que um erro silencioso se espalha por toda a operação.',
    bullets: [
      'Cadastrei produtos de clientes no banco de dados da empresa, mantendo o catálogo íntegro e consultável.',
      'Identifiquei e classifiquei produtos nos sistemas internos, aplicando as marcações usadas pela operação.',
      'Assegurei a qualidade das informações: conferência e correção dos dados antes de entrarem em uso.',
    ],
    tags: ['Banco de dados', 'Qualidade de dados', 'Cadastro de produtos', 'Varejo'],
  },
  {
    kind: 'education',
    role: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
    org: 'Centro Universitário FAVIP Wyden',
    // 👉 Se quiser mostrar o período completo, troque por "20XX — 2026".
    period: 'concluído em 2026',
    description:
      'Formação superior na área, concluída em julho de 2026, com colação de grau em setembro. O curso cobre desenvolvimento de software, banco de dados, análise de sistemas e infraestrutura — a base formal do que eu já vinha praticando em projeto real.',
    bullets: [],
    tags: [],
  },
];
