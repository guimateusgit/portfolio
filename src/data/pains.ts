/**
 * Seção "Isso parece com o seu dia a dia?".
 *
 * É a parte do site escrita para quem NÃO é da área. Cada item começa com a
 * frase que a pessoa diria em uma reunião — nas palavras dela, não nas minhas.
 *
 * 👉 Ajuste para o tipo de cliente que você quer atrair. Se você quiser focar
 * em clínicas, escritórios de advocacia ou e-commerce, troque as falas por
 * problemas reais desses setores.
 */

export type Pain = {
  /** A fala do cliente, entre aspas, nas palavras dele. */
  quote: string;
  /** O que eu faço a respeito — uma frase, sem jargão. */
  answer: string;
  /** O nome técnico da solução. Fica pequeno, só para quem quiser saber. */
  tech: string;
};

export const pains: readonly Pain[] = [
  {
    quote: 'Minha equipe passa o dia copiando informação de um lugar para outro.',
    answer:
      'Eu ligo os programas que você já usa, para o dado ser digitado uma vez só e aparecer sozinho onde precisa.',
    tech: 'integração de sistemas · API',
  },
  {
    quote: 'Respondo as mesmas perguntas no WhatsApp o dia inteiro.',
    answer:
      'Monto um atendente com IA que responde 24 horas, entende o que o cliente quer e só chama você quando a conversa está madura.',
    tech: 'agente de IA · WhatsApp',
  },
  {
    quote: 'Tenho cinco planilhas e ninguém sabe qual é a certa.',
    answer:
      'Transformo tudo em um sistema só, com login por pessoa, permissão por cargo e histórico de quem mexeu em quê.',
    tech: 'sistema web sob medida',
  },
  {
    quote: 'Meu site é bonito, mas não me traz cliente nenhum.',
    answer:
      'Refaço com foco em velocidade, em aparecer no Google e em medir de onde vem cada contato — para você parar de chutar.',
    tech: 'landing page · SEO · analytics',
  },
  {
    quote: 'O sistema que eu tenho trava quando o movimento aumenta.',
    answer:
      'Encontro o gargalo, corrijo e deixo a estrutura preparada para aguentar o crescimento sem você trocar tudo de novo.',
    tech: 'performance · arquitetura',
  },
];
