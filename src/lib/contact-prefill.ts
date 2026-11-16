/**
 * Ponte entre o configurador "Monte seu projeto" e o formulário de contato.
 *
 * O configurador dispara um evento no `window`; o formulário escuta e se
 * preenche sozinho. Assim os dois componentes não precisam se conhecer nem
 * dividir estado — e a seção de contato continua funcionando sozinha se o
 * configurador for removido.
 */

export const CONTACT_PREFILL_EVENT = 'contato:preencher';

export type ContactPrefill = {
  /** Precisa ser um dos valores de `projectTypeOptions`. */
  projectType: string;
  /** Precisa ser um dos valores de `budgetOptions`. */
  budget: string;
  /** Texto que vai para o campo "sobre o projeto". */
  message: string;
};

export function sendContactPrefill(payload: ContactPrefill): void {
  window.dispatchEvent(new CustomEvent<ContactPrefill>(CONTACT_PREFILL_EVENT, { detail: payload }));
}
