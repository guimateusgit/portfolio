'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Loader2, Mail, MapPin, Timer } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { CONTACT_PREFILL_EVENT, type ContactPrefill } from '@/lib/contact-prefill';
import {
  budgetOptions,
  contactSchema,
  projectTypeOptions,
  type ContactInput,
} from '@/lib/contact-schema';
import { sections } from '@/lib/sections';
import { site, whatsappLink } from '@/lib/site';
import { maskPhone } from '@/lib/utils';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldBase =
  'w-full rounded-[10px] border bg-[color:var(--panel-solid)] px-3.5 py-2.5 text-[14px] outline-none transition placeholder:text-[color:var(--text-faint)] focus:border-[color:var(--cyan)]';

/** Campo com borda de alerta quando a validação reprova. */
function fieldClass(hasError?: string): string {
  return hasError ? `${fieldBase} border-[color:var(--danger)]` : fieldBase;
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  // Registrado à parte porque o onChange é interceptado pela máscara.
  const phoneField = register('phone');

  /**
   * Instante em que o formulário apareceu. A diferença até o envio vai junto
   * no corpo da requisição: robô preenche em menos de um segundo, pessoa leva
   * dezenas. O servidor descarta o que for rápido demais.
   */
  const openedAt = useRef(Date.now());

  /** Quantos campos a validação reprovou — alimenta o resumo acima do botão. */
  const invalidCount = Object.keys(errors).length;

  // Recebe o que o configurador "Monte seu projeto" montou.
  useEffect(() => {
    function onPrefill(event: Event) {
      const detail = (event as CustomEvent<ContactPrefill>).detail;
      if (!detail) return;

      setStatus('idle');
      setValue('projectType', detail.projectType as ContactInput['projectType']);
      setValue('budget', detail.budget as ContactInput['budget']);
      setValue('message', detail.message);
      setPrefilled(true);

      window.setTimeout(() => {
        document.getElementById('message')?.focus();
      }, 700);
    }

    window.addEventListener(CONTACT_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(CONTACT_PREFILL_EVENT, onPrefill);
  }, [setValue]);

  async function onSubmit(values: ContactInput) {
    setStatus('sending');
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, elapsedMs: Date.now() - openedAt.current }),
      });

      const data: { ok?: boolean; error?: string } = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Não foi possível enviar sua mensagem.');
      }

      setStatus('success');
      setPrefilled(false);
      reset();
      openedAt.current = Date.now();
    } catch (error) {
      setStatus('error');
      setServerError(
        error instanceof Error ? error.message : 'Não foi possível enviar sua mensagem.',
      );
    }
  }

  return (
    <SectionBlock section={sections.contato}>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        {/* Canais diretos */}
        <Reveal>
          <div className="panel panel-live h-full p-7">
            <h3 className="text-[15px] font-semibold">Prefere falar direto?</h3>
            <p className="prose-text text-muted mt-2 text-pretty text-[14px] leading-relaxed">
              Sem problema — escolha o canal mais confortável para você.
            </p>

            <ul className="mt-6 space-y-2.5">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel sweep group flex items-center gap-3.5 p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"
                >
                  <span className="sweep-bar" aria-hidden />
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-lg border"
                    style={{ borderColor: 'var(--line)', color: 'var(--accent)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="label block">whatsapp</span>
                    <span className="mt-1 block truncate text-[14px]">{site.phone.display}</span>
                  </span>
                  <span className="text-faint ml-auto text-xs">↗</span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="panel sweep group flex items-center gap-3.5 p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--cyan)]"
                >
                  <span className="sweep-bar" aria-hidden />
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-lg border"
                    style={{ borderColor: 'var(--line)', color: 'var(--cyan)' }}
                  >
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="label block">e-mail</span>
                    <span className="mt-1 block truncate text-[14px]">{site.email}</span>
                  </span>
                  <span className="text-faint ml-auto text-xs">↗</span>
                </a>
              </li>

              <li className="panel flex items-center gap-3.5 p-4">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg border"
                  style={{ borderColor: 'var(--line)', color: 'var(--text-faint)' }}
                >
                  <MapPin className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="label block">onde eu estou</span>
                  <span className="text-muted mt-1 block text-[14px]">{site.location}</span>
                </span>
              </li>

              <li className="panel flex items-center gap-3.5 p-4">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg border"
                  style={{ borderColor: 'var(--line)', color: 'var(--text-faint)' }}
                >
                  <Timer className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="label block">resposta</span>
                  <span className="text-muted mt-1 block text-[14px]">
                    até 24h em dias úteis
                  </span>
                </span>
              </li>
            </ul>

            <p className="prose-text text-faint mt-6 text-pretty text-[13px] leading-relaxed">
              Conversar não custa nada e não te obriga a nada — você só paga se
              fecharmos um projeto. Se eu não for a melhor pessoa para o seu, eu
              digo na hora.
            </p>
          </div>
        </Reveal>

        {/* Formulário */}
        <Reveal delay={0.08}>
          <div className="panel panel-live p-7 md:p-9">
            {status === 'success' ? (
              <div className="py-12 text-center">
                <span
                  className="mx-auto grid size-14 place-items-center rounded-2xl border"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  <Check className="size-6" aria-hidden />
                </span>
                <h3 className="mt-6 text-[22px] font-bold">Recebi os detalhes</h3>
                <p className="prose-text text-muted mx-auto mt-3 max-w-sm text-pretty text-[15px] leading-relaxed">
                  Retorno em até 24 horas úteis no e-mail que você informou.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Falar agora no WhatsApp
                  </a>
                  <button type="button" onClick={() => setStatus('idle')} className="btn-ghost">
                    Enviar outra
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {prefilled ? (
                  <p
                    className="rise flex items-center gap-2.5 rounded-[10px] border px-4 py-3 text-[13px]"
                    style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}
                  >
                    <Check className="size-4 shrink-0" style={{ color: 'var(--accent)' }} />
                    Preenchi com o que você montou lá em cima. Complete o
                    contexto no final da mensagem e envie.
                  </p>
                ) : null}

                {/* Armadilha invisível para bots */}
                <div className="absolute -left-[9999px]" aria-hidden>
                  <label htmlFor="website">Não preencha este campo</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('website')}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="nome" htmlFor="name" error={errors.name?.message} required>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="como devo te chamar?"
                      className={fieldClass(errors.name?.message)}
                      aria-invalid={errors.name ? true : undefined}
                      {...register('name')}
                    />
                  </Field>

                  <Field label="e-mail" htmlFor="email" error={errors.email?.message} required>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@empresa.com"
                      className={fieldClass(errors.email?.message)}
                      aria-invalid={errors.email ? true : undefined}
                      {...register('email')}
                    />
                  </Field>

                  <Field label="empresa" htmlFor="company" error={errors.company?.message}>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="opcional"
                      className={fieldClass(errors.company?.message)}
                      aria-invalid={errors.company ? true : undefined}
                      {...register('company')}
                    />
                  </Field>

                  <Field
                    label="telefone / whatsapp"
                    htmlFor="phone"
                    error={errors.phone?.message}
                  >
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={15}
                      placeholder="(71) 99999-9999 — opcional"
                      className={fieldClass(errors.phone?.message)}
                      aria-invalid={errors.phone ? true : undefined}
                      {...phoneField}
                      onChange={(event) => {
                        event.target.value = maskPhone(event.target.value);
                        void phoneField.onChange(event);
                      }}
                    />
                  </Field>

                  <Field
                    label="tipo de projeto"
                    htmlFor="projectType"
                    error={errors.projectType?.message}
                    required
                  >
                    <select
                      id="projectType"
                      defaultValue=""
                      className={fieldClass(errors.projectType?.message)}
                      aria-invalid={errors.projectType ? true : undefined}
                      {...register('projectType')}
                    >
                      <option value="" disabled>
                        selecione…
                      </option>
                      {projectTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="orçamento"
                    htmlFor="budget"
                    error={errors.budget?.message}
                    required
                  >
                    <select
                      id="budget"
                      defaultValue=""
                      className={fieldClass(errors.budget?.message)}
                      aria-invalid={errors.budget ? true : undefined}
                      {...register('budget')}
                    >
                      <option value="" disabled>
                        selecione…
                      </option>
                      {budgetOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field
                  label="sobre o projeto"
                  htmlFor="message"
                  error={errors.message?.message}
                  required
                >
                  <textarea
                    id="message"
                    rows={7}
                    placeholder="qual problema você precisa resolver? existe prazo? já existe um sistema hoje?"
                    className={`${fieldClass(errors.message?.message)} prose-text resize-y`}
                    aria-invalid={errors.message ? true : undefined}
                    {...register('message')}
                  />
                </Field>

                {/* Resumo: aparece quando o envio é barrado pela validação */}
                {invalidCount > 0 ? (
                  <p
                    role="alert"
                    className="text-danger flex items-start gap-2.5 rounded-[10px] border px-4 py-3 text-[13px] leading-relaxed"
                    style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)' }}
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {invalidCount === 1
                      ? 'Falta ajustar 1 campo — está marcado abaixo.'
                      : `Faltam ajustar ${invalidCount} campos — estão marcados abaixo.`}
                  </p>
                ) : null}

                {/* Erro vindo do servidor */}
                {status === 'error' && serverError ? (
                  <p
                    role="alert"
                    className="text-danger flex items-start gap-2.5 rounded-[10px] border px-4 py-3 text-[13px] leading-relaxed"
                    style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)' }}
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      {serverError} Se preferir, fale comigo direto pelo{' '}
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        WhatsApp
                      </a>
                      .
                    </span>
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Enviando…
                    </>
                  ) : (
                    'Enviar mensagem →'
                  )}
                </button>

                {/* Anunciado por leitor de tela sem roubar o foco de quem digita */}
                <span aria-live="polite" className="sr-only">
                  {status === 'sending' ? 'Enviando sua mensagem.' : ''}
                </span>

                <p className="prose-text text-faint text-center text-[11.5px] leading-relaxed">
                  Seus dados são usados apenas para responder este contato. Sem
                  spam, sem repasse a terceiros.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </SectionBlock>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

function Field({ label, htmlFor, error, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="label block">
        {label}
        {required ? (
          <span style={{ color: 'var(--accent)' }} className="ml-1">
            *
          </span>
        ) : null}
      </label>

      {children}

      {/* `role="alert"` faz o leitor de tela anunciar o erro assim que aparece */}
      {error ? (
        <p
          id={`${htmlFor}-erro`}
          role="alert"
          className="text-danger flex items-start gap-1.5 text-[11.5px] leading-snug"
        >
          <span aria-hidden>↳</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
