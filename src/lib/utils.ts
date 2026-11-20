import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formata telefone brasileiro enquanto a pessoa digita.
 *
 *   71          →  (71
 *   7198362     →  (71) 9836-2                  (vai virando fixo)
 *   7198362233  →  (71) 9836-2233               (10 dígitos: fixo)
 *   71983622332 →  (71) 98362-2332              (11 dígitos: celular)
 *
 * Trabalha só com os dígitos, então apagar, colar texto com traço ou digitar
 * no meio do número continua funcionando. Se a pessoa colar no formato do
 * WhatsApp (+55 71 98362-2332), o código do país é descartado.
 */
export function maskPhone(value: string): string {
  let digits = value.replace(/\D/g, '');

  // Colado com código do país na frente: tira o 55 antes de formatar.
  if (digits.length > 11 && digits.startsWith('55')) {
    digits = digits.slice(2);
  }

  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  // Até 10 dígitos trata como fixo (4+4); com 11, celular (5+4).
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
