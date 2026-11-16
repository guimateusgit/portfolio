/**
 * Tecnologias exibidas na seção "Sobre".
 *
 * `slug` é o identificador do Simple Icons (https://simpleicons.org).
 * O logo vem de https://cdn.simpleicons.org/<slug>/<cor> — sem dependência
 * extra no projeto. Se um slug não existir, o nome continua aparecendo.
 *
 * `hint` existe para quem não é da área: explica, em uma linha, o que aquele
 * grupo de ferramentas faz. Sem isso, a lista é só um monte de nome estranho.
 *
 * 👉 Remova o que você não usa. Portfólio honesto converte mais.
 */

export type Tech = {
  name: string;
  slug: string;
};

export type TechCategory = {
  label: string;
  /** Explicação em português claro, para quem não programa. */
  hint: string;
  items: readonly Tech[];
};

export const techCategories: readonly TechCategory[] = [
  {
    label: 'Front-end',
    hint: 'A parte que o seu cliente vê e usa na tela.',
    items: [
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextdotjs' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'Tailwind CSS', slug: 'tailwindcss' },
      { name: 'Framer Motion', slug: 'framer' },
      { name: 'HTML5', slug: 'html5' },
      // O Simple Icons renomeou o ícone do CSS de "css3" para "css".
      { name: 'CSS', slug: 'css' },
    ],
  },
  {
    label: 'Back-end',
    hint: 'O motor por trás: as regras do negócio e a conversa entre sistemas.',
    items: [
      { name: 'Node.js', slug: 'nodedotjs' },
      { name: 'NestJS', slug: 'nestjs' },
      { name: 'Express', slug: 'express' },
      { name: 'Prisma', slug: 'prisma' },
      { name: 'GraphQL', slug: 'graphql' },
      { name: 'Python', slug: 'python' },
      { name: 'FastAPI', slug: 'fastapi' },
      { name: 'Socket.IO', slug: 'socketdotio' },
    ],
  },
  {
    label: 'Dados e servidor',
    hint: 'Onde as informações ficam guardadas com segurança e como o sistema se mantém no ar.',
    items: [
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'MySQL', slug: 'mysql' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Redis', slug: 'redis' },
      { name: 'Supabase', slug: 'supabase' },
      { name: 'Docker', slug: 'docker' },
      { name: 'Vercel', slug: 'vercel' },
      { name: 'Cloudflare', slug: 'cloudflare' },
    ],
  },
  {
    label: 'IA e ferramentas',
    hint: 'O que eu uso para automatizar tarefas e para trabalhar mais rápido.',
    items: [
      { name: 'Claude', slug: 'anthropic' },
      { name: 'OpenAI', slug: 'openai' },
      { name: 'LangChain', slug: 'langchain' },
      { name: 'n8n', slug: 'n8n' },
      { name: 'Git', slug: 'git' },
      { name: 'GitHub', slug: 'github' },
      { name: 'Postman', slug: 'postman' },
      { name: 'Figma', slug: 'figma' },
    ],
  },
];

/** Cor única dos logos — legível no tema claro e no escuro. */
export const TECH_ICON_COLOR = '94a3b8';
