export type StackGroup = {
  label: string;
  hint: string;
  items: readonly string[];
};

export const stackGroups: readonly StackGroup[] = [
  {
    label: 'Front-end',
    hint: 'Interfaces rápidas, acessíveis e agradáveis de usar',
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'React Hook Form',
      'Zod',
      'shadcn/ui',
      'TanStack Query',
    ],
  },
  {
    label: 'Back-end',
    hint: 'APIs seguras, testadas e prontas para escalar',
    items: [
      'Node.js',
      'NestJS',
      'Express',
      'Prisma ORM',
      'REST',
      'GraphQL',
      'tRPC',
      'Python',
      'FastAPI',
    ],
  },
  {
    label: 'Dados',
    hint: 'Modelagem, consultas eficientes e integridade',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Drizzle', 'pgvector'],
  },
  {
    label: 'Cloud & DevOps',
    hint: 'Deploy contínuo, observabilidade e custo sob controle',
    items: [
      'Vercel',
      'AWS',
      'Docker',
      'GitHub Actions',
      'Cloudflare',
      'Nginx',
      'Sentry',
      'Railway',
    ],
  },
  {
    label: 'Inteligência Artificial',
    hint: 'Da prototipagem ao agente em produção',
    items: [
      'Claude (Anthropic)',
      'OpenAI API',
      'LangChain',
      'RAG / Embeddings',
      'Vector DBs',
      'n8n',
      'Function calling',
      'Claude Code',
    ],
  },
  {
    label: 'Qualidade & Processo',
    hint: 'Código que outra pessoa consegue manter',
    items: [
      'Git / GitHub',
      'Vitest',
      'Playwright',
      'ESLint + Prettier',
      'Conventional Commits',
      'Code review',
      'Scrum / Kanban',
    ],
  },
];

/** Tecnologias exibidas no carrossel infinito abaixo do hero. */
export const marqueeItems: readonly string[] = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'Prisma',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'Vercel',
  'Python',
  'OpenAI',
  'Claude',
  'LangChain',
  'Redis',
  'GraphQL',
  'GitHub Actions',
];
