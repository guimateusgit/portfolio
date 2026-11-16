/**
 * Configuração central do site.
 * Altere aqui e o valor se propaga para todo o portfólio.
 */

const rawPhone = '5571993497489';

export const site = {
  name: 'Mateus Guimarães',
  firstName: 'Mateus',
  handle: 'mateus',
  role: 'Full Stack Developer & AI Automation Engineer',
  shortRole: 'Desenvolvedor Full Stack',
  age: 23,
  location: 'Brasil — atendimento 100% remoto',
  shortLocation: 'BA · BR',
  email: 'mateussadev@gmail.com',
  phone: {
    raw: rawPhone,
    display: '(71) 99349-7489',
    tel: `+${rawPhone}`,
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mateusguimaraes.dev',
  tagline: 'Desenvolvo software sob medida e automações com IA que geram resultado.',
  description:
    'Mateus Guimarães — Desenvolvedor Full Stack especializado em aplicações web modernas (React, Next.js, TypeScript, Node.js) e automações com Inteligência Artificial. Transformo processos manuais em sistemas rápidos, escaláveis e mensuráveis.',

  /**
   * Usuário do GitHub que alimenta a seção "Prova de que eu programo mesmo".
   *
   * A seção só aparece no site quando o perfil tiver pelo menos um
   * repositório público (ver MIN_PUBLIC_REPOS em src/app/api/github/route.ts).
   * Enquanto estiver vazio, ela some sozinha — e volta sozinha no primeiro
   * push. Não precisa mexer em código de novo.
   */
  githubUser: 'guimateusgit',

  socials: {
    github: 'https://github.com/guimateusgit',
    linkedin: 'https://www.linkedin.com/in/SEU-PERFIL-AQUI', // 👉 troque
  },
} as const;

/**
 * Um link social só é exibido quando foi realmente configurado.
 * Evita mandar um visitante para uma página que não existe.
 */
export function socialConfigured(url: string): boolean {
  return !url.includes('SEU-');
}

/**
 * Números exibidos na seção "sobre.md".
 * 👉 AJUSTE PARA A SUA REALIDADE. Use só o que você sustenta numa entrevista.
 */
export const aboutStats = [
  { value: '2+', label: 'anos escrevendo código' },
  { value: '15+', label: 'projetos construídos' },
  { value: '25+', label: 'tecnologias no dia a dia' },
] as const;

/** Stack resumida, exibida na saída do comando `whoami`. */
export const heroTags = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'Docker',
  'IA / Agentes',
] as const;

export const whatsappMessage =
  'Olá, Mateus! Vim pelo seu portfólio e gostaria de conversar sobre um projeto.';

export const whatsappLink = `https://wa.me/${site.phone.raw}?text=${encodeURIComponent(
  whatsappMessage,
)}`;
