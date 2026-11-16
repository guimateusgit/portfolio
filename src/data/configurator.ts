/**
 * ============================================================================
 *  CONFIGURADOR "MONTE SEU PROJETO"
 * ============================================================================
 *  O configurador NÃO mostra preço. Decisão deliberada: faixa de valor fixa
 *  num site vira âncora contra você na negociação — o cliente chega preso ao
 *  número menor, e projetos diferentes com o mesmo rótulo custam coisas
 *  completamente diferentes.
 *
 *  Em vez de eu estimar quanto custa, o visitante informa a faixa que ELE tem
 *  em mente (última pergunta). Isso qualifica o lead antes da reunião e mantém
 *  o valor negociável, como tem que ser.
 *
 *  O que o configurador calcula é só uma ESTIMATIVA DE PRAZO, e o site diz com
 *  todas as letras que é aproximada.
 *
 *      prazo final = (semanas do tipo + semanas dos extras) × fator do porte
 *
 *  👉 Ajuste as semanas abaixo para o seu ritmo real de trabalho.
 * ============================================================================
 */

/** Valores devem bater com `projectTypeOptions` em src/lib/contact-schema.ts */
export type ProjectTypeValue =
  | 'Aplicação web / sistema'
  | 'Site institucional ou landing page'
  | 'API e integrações'
  | 'Automação com IA'
  | 'Manutenção e evolução de projeto'
  | 'Outro';

export type TypeOption = {
  id: string;
  label: string;
  hint: string;
  /** Prazo base em semanas [mínimo, máximo]. */
  weeks: readonly [number, number];
  /** Para onde isso vai no formulário de contato. */
  formValue: ProjectTypeValue;
};

export type FactorOption = {
  id: string;
  label: string;
  hint: string;
  /** Multiplica o prazo. Use 1 para não mexer. */
  factor: number;
};

export type ExtraOption = {
  id: string;
  label: string;
  hint: string;
  addWeeks: number;
};

export const projectTypes: readonly TypeOption[] = [
  {
    id: 'site',
    label: 'Site ou página de captação',
    hint: 'presença na internet, captar contato',
    weeks: [1, 3],
    formValue: 'Site institucional ou landing page',
  },
  {
    id: 'sistema',
    label: 'Sistema web sob medida',
    hint: 'substituir planilha, organizar a operação',
    weeks: [5, 12],
    formValue: 'Aplicação web / sistema',
  },
  {
    id: 'automacao',
    label: 'Automação com IA',
    hint: 'atendimento, leitura de documento, triagem',
    weeks: [3, 8],
    formValue: 'Automação com IA',
  },
  {
    id: 'integracao',
    label: 'Integração entre programas',
    hint: 'fazer os sistemas conversarem entre si',
    weeks: [2, 6],
    formValue: 'API e integrações',
  },
  {
    id: 'manutencao',
    label: 'Cuidar do que já existe',
    hint: 'corrigir, melhorar, manter no ar',
    weeks: [1, 4],
    formValue: 'Manutenção e evolução de projeto',
  },
  {
    id: 'naosei',
    label: 'Ainda não sei',
    hint: 'tenho um problema, não sei a solução',
    weeks: [2, 8],
    formValue: 'Outro',
  },
];

export const sizes: readonly FactorOption[] = [
  { id: 'enxuto', label: 'Enxuto', hint: 'o essencial para começar a usar', factor: 0.72 },
  { id: 'completo', label: 'Completo', hint: 'o que a operação precisa hoje', factor: 1 },
  { id: 'robusto', label: 'Robusto', hint: 'vários perfis de usuário e integrações', factor: 1.55 },
];

/** O prazo desejado não muda a estimativa — entra no resumo como contexto. */
export const deadlines: readonly FactorOption[] = [
  { id: 'tranquilo', label: 'Sem pressa', hint: 'mais de 3 meses', factor: 1 },
  { id: 'normal', label: 'Nos próximos meses', hint: '1 a 3 meses', factor: 1 },
  { id: 'urgente', label: 'É urgente', hint: 'preciso para ontem', factor: 1 },
];

export const extras: readonly ExtraOption[] = [
  {
    id: 'design',
    label: 'Design do zero',
    hint: 'não tenho identidade visual pronta',
    addWeeks: 1,
  },
  {
    id: 'painel',
    label: 'Painel administrativo',
    hint: 'minha equipe precisa gerenciar o conteúdo',
    addWeeks: 2,
  },
  {
    id: 'whatsapp',
    label: 'Integração com WhatsApp',
    hint: 'avisos e atendimento pelo WhatsApp',
    addWeeks: 1,
  },
  {
    id: 'suporte',
    label: 'Manutenção mensal',
    hint: 'alguém responsável depois da entrega',
    addWeeks: 0,
  },
];

/**
 * Faixas de investimento que o VISITANTE escolhe.
 *
 * Os rótulos precisam bater exatamente com `budgetOptions` em
 * src/lib/contact-schema.ts, porque alimentam o mesmo campo do formulário.
 * O `hint` é só para a escolha não parecer um interrogatório.
 */
export const budgetChoices: readonly { label: string; hint: string }[] = [
  { label: 'Até R$ 3.000', hint: 'algo pontual e específico' },
  { label: 'R$ 3.000 – R$ 10.000', hint: 'um projeto bem definido' },
  { label: 'R$ 10.000 – R$ 30.000', hint: 'um sistema para a operação' },
  { label: 'Acima de R$ 30.000', hint: 'produto completo, várias etapas' },
  { label: 'Ainda não sei', hint: 'me ajuda a entender o que cabe' },
];
