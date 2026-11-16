/**
 * Registro único das seções do site.
 *
 * Alimenta a navegação do topo, a busca (⌘K), a trilha lateral de progresso e
 * o rodapé. Mexeu aqui, mudou em todos os lugares.
 *
 * REGRA DE ESCRITA: `title` e `summary` são lidos por quem NÃO é programador.
 * Nada de jargão. Termos técnicos vivem nos arquivos de dados, nunca aqui.
 *
 * A ORDEM DAS CHAVES É A ORDEM DA NAVEGAÇÃO E DOS NÚMEROS. Para reordenar o
 * site, mova os blocos aqui e ajuste `index` — depois espelhe a mesma ordem em
 * `src/app/page.tsx`.
 */

export type SectionDef = {
  /** Âncora da URL (#sobre). */
  id: string;
  /** Número exibido na trilha lateral e no cabeçalho da seção. */
  index: string;
  /** Nome curto e humano. */
  label: string;
  /** Título legível, em português claro. */
  title: string;
  /** Uma ou duas frases explicando a seção para qualquer pessoa. */
  summary: string;
  /** Termos extras para a busca do ⌘K. */
  keywords: readonly string[];
  /** Aparece na navegação principal do topo. */
  nav?: boolean;
};

export const sections = {
  desafios: {
    id: 'desafios',
    index: '01',
    label: 'Desafios',
    title: 'Isso parece com o seu dia a dia?',
    summary:
      'Cinco situações que eu escuto toda semana. Se você se reconhecer em alguma, é exatamente disso que eu cuido.',
    keywords: ['problema', 'dor', 'desafio', 'ajuda', 'preciso', 'situação'],
    nav: true,
  },
  sobre: {
    id: 'sobre',
    index: '02',
    label: 'Sobre',
    title: 'Quem está do outro lado',
    summary:
      'Quem vai cuidar do seu projeto, como eu trabalho e com quais ferramentas. Em português, sem enrolação.',
    keywords: ['perfil', 'bio', 'quem', 'mateus', 'tecnologias', 'ferramentas'],
    nav: true,
  },
  servicos: {
    id: 'servicos',
    index: '03',
    label: 'Serviços',
    title: 'O que eu construo',
    summary:
      'Seis tipos de trabalho que eu entrego. Em cada um, o que muda na prática para a sua empresa.',
    keywords: ['serviço', 'site', 'sistema', 'automação', 'integração'],
    nav: true,
  },
  ia: {
    id: 'ia',
    index: '04',
    label: 'IA',
    title: 'Onde a Inteligência Artificial entra',
    summary:
      'Duas coisas diferentes: a IA que acelera o meu trabalho, e a IA que eu instalo na sua operação para fazer tarefa sozinha.',
    keywords: ['ia', 'inteligência artificial', 'robô', 'automação', 'chatgpt', 'chatbot'],
    nav: true,
  },
  montar: {
    id: 'montar',
    index: '05',
    label: 'Monte seu projeto',
    title: 'Monte o seu projeto em 30 segundos',
    summary:
      'Clique no que faz sentido para você. Conforme escolhe, aparece um resumo do escopo — e o formulário de contato já vai preenchido com tudo isso, para a gente começar a conversa adiantada.',
    keywords: ['orçamento', 'simulador', 'montar', 'escopo', 'proposta', 'quanto custa'],
    nav: true,
  },
  experiencia: {
    id: 'experiencia',
    index: '06',
    label: 'Experiência',
    title: 'Onde eu trabalhei e estudei',
    summary: 'Minha trajetória até aqui — curta e honesta. Comecei cedo e aprendi entregando.',
    keywords: ['experiência', 'carreira', 'emprego', 'formação', 'currículo', 'cv'],
  },
  github: {
    id: 'github',
    index: '07',
    label: 'GitHub',
    title: 'Prova de que eu programo mesmo',
    summary:
      'Números públicos do meu perfil de programador, puxados ao vivo e atualizados sozinhos. Não dá para maquiar.',
    keywords: ['github', 'código', 'repositório', 'prova', 'portfólio técnico'],
  },
  projetos: {
    id: 'projetos',
    index: '08',
    label: 'Projetos',
    title: 'Projetos em destaque',
    summary:
      'Cada um começa com um problema real de alguma empresa e termina com um sistema funcionando.',
    keywords: ['projeto', 'portfólio', 'cases', 'trabalhos', 'exemplos'],
    nav: true,
  },
  processo: {
    id: 'processo',
    index: '09',
    label: 'Processo',
    title: 'Como funciona, do primeiro contato à entrega',
    summary: 'Quatro etapas, sem surpresa no meio do caminho e sem você ficar no escuro.',
    keywords: ['processo', 'como funciona', 'etapas', 'prazo', 'contrato'],
  },
  faq: {
    id: 'faq',
    index: '10',
    label: 'Dúvidas',
    title: 'Perguntas que sempre me fazem',
    summary: 'As seis que mais aparecem na primeira conversa, respondidas antes de você perguntar.',
    keywords: ['dúvida', 'faq', 'pergunta', 'garantia', 'contrato', 'nota fiscal', 'quanto custa'],
  },
  contato: {
    id: 'contato',
    index: '11',
    label: 'Contato',
    title: 'Vamos conversar sobre o seu projeto',
    summary:
      'Me conte o que está te incomodando hoje. Quanto mais contexto, mais precisa é a proposta — e a primeira conversa é gratuita.',
    keywords: ['contato', 'orçamento', 'falar', 'email', 'whatsapp', 'proposta', 'preço'],
    nav: true,
  },
} as const satisfies Record<string, SectionDef>;

export type SectionKey = keyof typeof sections;

export const sectionList: readonly SectionDef[] = Object.values(sections);

export const navSections: readonly SectionDef[] = sectionList.filter((section) => section.nav);
