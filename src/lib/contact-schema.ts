import { z } from 'zod';

export const budgetOptions = [
  'Até R$ 3.000',
  'R$ 3.000 – R$ 10.000',
  'R$ 10.000 – R$ 30.000',
  'Acima de R$ 30.000',
  'Ainda não sei',
] as const;

export const projectTypeOptions = [
  'Aplicação web / sistema',
  'Site institucional ou landing page',
  'API e integrações',
  'Automação com IA',
  'Manutenção e evolução de projeto',
  'Outro',
] as const;

/**
 * Validação do formulário de contato.
 *
 * O MESMO schema roda nos dois lados: no navegador, para dar erro na hora e
 * poupar o envio; e no servidor, que é onde a validação realmente vale. Quem
 * enviar direto na API, contornando a página, bate exatamente nas mesmas
 * regras — a validação do cliente é conveniência, nunca proteção.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(80, 'Nome muito longo.')
    // Bloqueia quebra de linha: evita injeção de cabeçalho no e-mail.
    .refine((value) => !/[\r\n]/.test(value), 'Nome inválido.'),

  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .email('E-mail inválido.')
    .max(120, 'E-mail muito longo.')
    .refine((value) => !/[\r\n]/.test(value), 'E-mail inválido.'),

  company: z
    .string()
    .trim()
    .max(80, 'Nome muito longo.')
    .refine((value) => !/[\r\n]/.test(value), 'Valor inválido.')
    .optional()
    .or(z.literal('')),

  // Opcional, mas se preencher tem que estar completo: DDD + número.
  // A conferência é feita só nos dígitos, então não depende da máscara.
  phone: z
    .string()
    .trim()
    .max(20, 'Telefone muito longo.')
    .refine(
      (value) => value === '' || value.replace(/\D/g, '').length >= 10,
      'Telefone incompleto — informe DDD e número.',
    )
    .optional()
    .or(z.literal('')),

  projectType: z.enum(projectTypeOptions, {
    errorMap: () => ({ message: 'Selecione o tipo de projeto.' }),
  }),

  budget: z.enum(budgetOptions, {
    errorMap: () => ({ message: 'Selecione um orçamento estimado.' }),
  }),

  message: z
    .string()
    .trim()
    .min(20, 'Conte um pouco mais — pelo menos 20 caracteres.')
    .max(3000, 'Mensagem muito longa.'),

  /**
   * Campo armadilha para robôs ("honeypot"). Fica invisível para pessoas, mas
   * preenchedores automáticos caem nele. Deve chegar sempre vazio.
   */
  website: z.string().max(0).optional().or(z.literal('')),

  /**
   * Quanto tempo a pessoa levou preenchendo, em milissegundos.
   * Robô preenche e envia em menos de um segundo; gente leva dezenas.
   * Opcional para não quebrar quem estiver com a página em cache antiga.
   */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
