/**
 * ============================================================================
 *  PROJETOS EM DESTAQUE
 * ============================================================================
 *  Estes são trabalhos reais. Mantenha assim: nada de case inventado — empresa
 *  séria checa, e um projeto que não se sustenta numa reunião custa mais caro
 *  que um portfólio menor.
 *
 *  Campos:
 *   - `kind`     → 'cliente' | 'pessoal' | 'exemplo' (aparece como etiqueta)
 *   - `metric`   → resultado medido ("−70% no tempo de atendimento").
 *                  Deixe `undefined` enquanto não tiver número real.
 *   - `liveUrl`  → só link estável e público. Endereço de homologação
 *                  (com IP, sslip.io, vercel.app temporário) NÃO entra aqui:
 *                  cai a qualquer hora e passa impressão de inacabado.
 *   - `repoUrl`  → deixe `undefined` se o código for do cliente.
 *   - `image`    → print do site, guardado em `public/projetos/`. Pode ser a
 *                  página inteira, bem comprida: o cartão mostra o topo e rola
 *                  até o rodapé quando o visitante passa o mouse. `width` e
 *                  `height` têm que ser os do arquivo de verdade — é o que
 *                  reserva o espaço antes de carregar e impede o texto de
 *                  pular na tela.
 *
 *  Para acrescentar um projeto, copie o modelo comentado no fim do arquivo.
 * ============================================================================
 */

export type Project = {
  slug: string;
  title: string;
  kind: 'cliente' | 'pessoal' | 'exemplo';
  summary: string;
  problem: string;
  solution: string;
  metric?: string;
  tags: readonly string[];
  liveUrl?: string;
  repoUrl?: string;
  image?: ProjectImage;
  accent: 'brand' | 'accent' | 'emerald';
};

/**
 * Print do projeto.
 *
 * `alt` é lido em voz alta por leitor de tela e aparece se a imagem falhar —
 * descreva o que se vê, não repita o nome do projeto, que já está no título
 * logo abaixo.
 */
export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const projects: readonly Project[] = [
  {
    slug: 'kryoos',
    title: 'Kryoos — plataforma de fisioterapia esportiva',
    kind: 'cliente',
    summary:
      'Página de entrada de uma plataforma de conteúdo científico por assinatura, voltada a fisioterapeutas esportivos.',
    problem:
      'Conteúdo técnico por assinatura é difícil de vender numa página só: o visitante precisa entender o que recebe, confiar na qualidade e decidir pagar, tudo na mesma rolagem.',
    solution:
      'Construí a página em Next.js e TypeScript seguindo a ordem das objeções reais: o problema do profissional, a solução, prova social, catálogo de lesões com avaliações, planos e dúvidas — terminando no teste gratuito.',
    tags: ['Next.js', 'TypeScript', 'Landing page', 'SEO'],
    liveUrl: 'https://kryoos.com/',
    image: {
      src: '/projetos/kryoos.webp',
      alt: 'Página da Kryoos em tema escuro: chamada principal, os três problemas que o fisioterapeuta enfrenta, o que a plataforma oferece e os passos para começar.',
      width: 578,
      height: 956,
    },
    accent: 'brand',
  },
  {
    slug: 'recanto-do-sono',
    title: 'Pousada Recanto do Sono — site e reservas',
    kind: 'cliente',
    summary:
      'Site de uma pousada de beira de estrada na BR-116, em Milagres (BA), feito para quem decide a parada no celular, em movimento.',
    problem:
      'O hóspede dessa pousada é um viajante cansado olhando o celular na estrada. Ele precisa ver quarto, estrutura e localização e falar com alguém em poucos toques — formulário longo ou cadastro mata a reserva.',
    solution:
      'Página única com as quatro suítes em carrossel, estrutura, mapa e rota. Cada botão de reserva abre o WhatsApp com a mensagem pronta e o tipo de quarto já escrito: a pousada recebe o pedido formatado sem precisar operar nenhum sistema novo.',
    tags: ['Reserva via WhatsApp', 'Mobile first', 'Google Maps', 'SEO local'],
    image: {
      src: '/projetos/recanto-do-sono.webp',
      alt: 'Página do site da pousada: chamada de boas-vindas, as quatro suítes lado a lado, a estrutura do lugar e um mapa de como chegar.',
      width: 561,
      height: 958,
    },
    // 👉 Trocar pelo domínio definitivo quando subir para produção.
    //    Hoje está em homologação: recanto-do-sono.production.pousada.158-220-102-187.sslip.io
    accent: 'emerald',
  },
];

/* ----------------------------------------------------------------------------
 * MODELO para o próximo projeto — copie, descomente e preencha:
 *
 *  {
 *    slug: 'nome-curto-sem-espaco',
 *    title: 'Nome do projeto — o que é',
 *    kind: 'cliente',
 *    summary: 'Uma frase dizendo o que é e para quem.',
 *    problem: 'A dor concreta de quem contratou. Nas palavras do cliente, se possível.',
 *    solution: 'O que você construiu e por que desse jeito.',
 *    metric: '−40% no tempo de atendimento',   // só se for número real
 *    tags: ['Next.js', 'PostgreSQL'],
 *    liveUrl: 'https://exemplo.com',
 *    image: {
 *      src: '/projetos/nome-curto-sem-espaco.webp',
 *      alt: 'O que se vê na imagem, em uma frase.',
 *      width: 1200,                             // tamanho real do arquivo
 *      height: 2000,
 *    },
 *    accent: 'accent',                          // 'brand' | 'accent' | 'emerald'
 *  },
 * -------------------------------------------------------------------------- */
