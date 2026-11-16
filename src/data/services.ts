import type { LucideIcon } from 'lucide-react';
import { Bot, Code2, Gauge, LayoutTemplate, Plug, ShieldCheck } from 'lucide-react';

export type Service = {
  icon: LucideIcon;
  title: string;
  /** O que é, em português claro. Nada de nome de tecnologia aqui. */
  description: string;
  /** O que muda na prática para o cliente. É a linha mais importante. */
  outcome: string;
  /** Nomes técnicos — ficam pequenos e discretos, só para quem quiser saber. */
  bullets: readonly string[];
};

export const services: readonly Service[] = [
  {
    icon: Code2,
    title: 'Sistema web sob medida',
    description:
      'Um programa feito para a sua operação, que abre no navegador e cada pessoa acessa com o próprio login. Substitui a planilha compartilhada e o caderno.',
    outcome:
      'Sua operação inteira em um lugar só, com permissão por cargo e histórico de quem fez o quê.',
    bullets: ['Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    icon: Plug,
    title: 'Integração entre programas',
    description:
      'Faço os sistemas que você já usa conversarem entre si: sistema de vendas, emissor de nota, planilha, meio de pagamento, WhatsApp.',
    outcome: 'O dado é digitado uma vez só e aparece sozinho em todos os lugares.',
    bullets: ['API', 'Webhooks', 'Stripe · Pix'],
  },
  {
    icon: Bot,
    title: 'Automação com Inteligência Artificial',
    description:
      'Coloco a IA para fazer o trabalho repetitivo: responder cliente, ler documento, organizar informação, separar o que é urgente do que não é.',
    outcome: 'Tarefa que tomava horas da equipe passa a acontecer sozinha, dia e noite.',
    bullets: ['Agentes', 'RAG', 'Claude · OpenAI'],
  },
  {
    icon: LayoutTemplate,
    title: 'Site e página de captação',
    description:
      'Página rápida, que carrega em menos de um segundo, aparece no Google e registra de onde veio cada pessoa que entrou em contato.',
    outcome: 'Mais gente preenchendo o formulário — e você sabendo qual anúncio trouxe cada uma.',
    bullets: ['SEO', 'Core Web Vitals', 'Analytics'],
  },
  {
    icon: Gauge,
    title: 'Deixar o que já existe mais rápido',
    description:
      'Seu site ou sistema está lento, trava no horário de pico ou a conta do servidor subiu sem explicação. Eu encontro o motivo e corrijo.',
    outcome: 'Cliente para de desistir no meio e a sua equipe para de esperar a tela carregar.',
    bullets: ['Auditoria', 'Cache · CDN', 'Banco de dados'],
  },
  {
    icon: ShieldCheck,
    title: 'Manutenção e evolução mensal',
    description:
      'Depois que está no ar, alguém precisa cuidar: corrigir o que quebra, acrescentar o que faltou e manter tudo atualizado e seguro.',
    outcome: 'Você tem um responsável fixo, em vez de caçar freelancer toda vez que algo falha.',
    bullets: ['SLA combinado', 'Monitoramento', 'Deploy contínuo'],
  },
];
