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
  accent: 'brand' | 'accent' | 'emerald';
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
 *    accent: 'accent',                          // 'brand' | 'accent' | 'emerald'
 *  },
 * -------------------------------------------------------------------------- */
