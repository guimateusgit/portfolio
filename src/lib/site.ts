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
   * 👉 TROQUE PELO SEU USUÁRIO REAL DO GITHUB.
   * Alimenta a seção "github.json". Se ficar vazio ou com o valor de exemplo,
   * a seção simplesmente não aparece no site.
   */
  githubUser: 'https://github.com/guimateusgit',

  socials: {
    github: 'https://github.com/guimateusgit', // 👉 troque
    linkedin: 'https://www.linkedin.com/in/SEU-PERFIL-AQUI', // 👉 troque
  },
} as const;

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
