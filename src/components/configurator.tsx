'use client';

import { ArrowRight, Check } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import {
  budgetChoices,
  deadlines,
  extras,
  projectTypes,
  sizes,
  type ExtraOption,
  type FactorOption,
  type TypeOption,
} from '@/data/configurator';
import { sendContactPrefill } from '@/lib/contact-prefill';
import { sections } from '@/lib/sections';
import { SectionBlock } from './shell/section-block';
import { Reveal } from './ui/reveal';

export function Configurator() {
  const [type, setType] = useState<TypeOption | null>(null);
  const [size, setSize] = useState<FactorOption | null>(null);
  const [deadline, setDeadline] = useState<FactorOption | null>(null);
  const [chosenExtras, setChosenExtras] = useState<ExtraOption[]>([]);
  const [budget, setBudget] = useState<string | null>(null);

  /** Só prazo. Valor não se estima em site — se negocia em conversa. */
  const weeks = useMemo(() => {
    if (!type) return null;

    const factor = size?.factor ?? 1;
    const extraWeeks = chosenExtras.reduce((total, item) => total + item.addWeeks, 0);

    const min = Math.max(1, Math.round((type.weeks[0] + extraWeeks) * factor));
    const max = Math.max(min + 1, Math.round((type.weeks[1] + extraWeeks) * factor));

    return { min, max };
  }, [type, size, chosenExtras]);

  const ready = Boolean(type && size && deadline);

  function toggleExtra(extra: ExtraOption) {
    setChosenExtras((current) =>
      current.some((item) => item.id === extra.id)
        ? current.filter((item) => item.id !== extra.id)
        : [...current, extra],
    );
  }

  function sendToForm() {
    if (!type) return;

    const lines = [
      `O que eu preciso: ${type.label}`,
      size ? `Porte: ${size.label} (${size.hint})` : null,
      deadline ? `Prazo que eu gostaria: ${deadline.label} (${deadline.hint})` : null,
      chosenExtras.length > 0
        ? `Também quero: ${chosenExtras.map((item) => item.label).join(', ')}`
        : null,
      weeks ? `Estimativa de prazo que o site mostrou: ${weeks.min} a ${weeks.max} semanas.` : null,
      '',
      'Contexto do meu caso: ',
    ].filter((line): line is string => line !== null);

    sendContactPrefill({
      projectType: type.formValue,
      budget: budget ?? 'Ainda não sei',
      message: lines.join('\n'),
    });

    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <SectionBlock section={sections.montar}>
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
        {/* ------------------ perguntas ------------------ */}
        <div className="space-y-10">
          <Group
            step="01"
            question="O que você precisa?"
            help="Se não souber, marque a última — é bem comum."
          >
            {projectTypes.map((option) => (
              <Choice
                key={option.id}
                label={option.label}
                hint={option.hint}
                selected={type?.id === option.id}
                onSelect={() => setType(option)}
              />
            ))}
          </Group>

          <Group
            step="02"
            question="Qual o tamanho disso?"
            help="Dá para começar enxuto e crescer depois — quase sempre é o caminho mais barato."
          >
            {sizes.map((option) => (
              <Choice
                key={option.id}
                label={option.label}
                hint={option.hint}
                selected={size?.id === option.id}
                onSelect={() => setSize(option)}
              />
            ))}
          </Group>

          <Group
            step="03"
            question="Para quando?"
            help="Serve para eu saber se consigo encaixar na agenda."
          >
            {deadlines.map((option) => (
              <Choice
                key={option.id}
                label={option.label}
                hint={option.hint}
                selected={deadline?.id === option.id}
                onSelect={() => setDeadline(option)}
              />
            ))}
          </Group>

          <Group
            step="04"
            question="Mais alguma coisa?"
            help="Pode marcar quantas quiser, ou nenhuma."
          >
            {extras.map((option) => (
              <Choice
                key={option.id}
                label={option.label}
                hint={option.hint}
                selected={chosenExtras.some((item) => item.id === option.id)}
                onSelect={() => toggleExtra(option)}
                multi
              />
            ))}
          </Group>

          <Group
            step="05"
            question="Tem uma faixa de investimento em mente?"
            help="Opcional, e nada aqui é compromisso. Me ajuda a propor o escopo certo em vez de um orçamento que não cabe."
          >
            {budgetChoices.map((option) => (
              <Choice
                key={option.label}
                label={option.label}
                hint={option.hint}
                selected={budget === option.label}
                onSelect={() => setBudget(option.label)}
              />
            ))}
          </Group>
        </div>

        {/* ------------------ resumo ao vivo ------------------ */}
        <Reveal delay={0.1}>
          <div className="panel panel-live sticky top-24 overflow-hidden p-7">
            <p className="label">resumo ao vivo</p>

            {!type ? (
              <p className="prose-text text-muted mt-6 text-pretty text-[15px] leading-relaxed">
                Comece escolhendo o que você precisa na primeira pergunta. O
                resumo aparece aqui conforme você clica.
              </p>
            ) : (
              <>
                <dl className="mt-6 space-y-3 text-[13px]">
                  <Row label="o quê" value={type.label} />
                  <Row label="tamanho" value={size?.label ?? '—'} />
                  <Row label="prazo" value={deadline?.label ?? '—'} />
                  <Row
                    label="extras"
                    value={
                      chosenExtras.length > 0
                        ? chosenExtras.map((item) => item.label).join(', ')
                        : 'nenhum'
                    }
                  />
                  <Row label="faixa" value={budget ?? 'não informada'} />
                </dl>

                {weeks ? (
                  <div className="mt-7 border-t pt-6">
                    <p className="label">estimativa de prazo</p>
                    <p className="grad-text data mt-3 text-[clamp(1.4rem,3vw,2rem)] font-bold leading-tight">
                      {weeks.min} a {weeks.max} semanas
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 border-t pt-6">
                  <p className="label">e o valor?</p>
                  <p className="prose-text text-muted mt-3 text-pretty text-[13.5px] leading-relaxed">
                    Eu não coloco tabela de preço no site de propósito. Dois
                    projetos com o mesmo nome podem custar coisas muito
                    diferentes, e número fixo numa página só serve para
                    engessar a conversa.
                  </p>
                  <p className="prose-text text-muted mt-2.5 text-pretty text-[13.5px] leading-relaxed">
                    <strong className="font-semibold">Tudo é negociável.</strong>{' '}
                    Me mande o que você montou aqui, a gente conversa sem
                    compromisso e eu envio uma proposta com escopo e valor
                    fechados — aí sim, feita para o seu caso.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={sendToForm}
                  disabled={!ready}
                  className="btn-primary group mt-7 w-full disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
                >
                  {ready ? 'Enviar isso para o Mateus' : 'Responda as 3 primeiras'}
                  {ready ? (
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  ) : null}
                </button>

                {ready ? (
                  <p className="text-faint mt-3 text-center text-[11px]">
                    leva você ao formulário, já preenchido
                  </p>
                ) : null}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </SectionBlock>
  );
}

/* ------------------------------------------------------------------ */

function Group({
  step,
  question,
  help,
  children,
}: {
  step: string;
  question: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <fieldset>
        <legend className="flex flex-wrap items-baseline gap-3">
          <span className="data text-faint text-[11px]">{step}</span>
          <span className="text-[17px] font-semibold">{question}</span>
        </legend>
        <p className="prose-text text-faint mt-1.5 max-w-xl text-pretty text-[13px] leading-relaxed">
          {help}
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">{children}</div>
      </fieldset>
    </Reveal>
  );
}

function Choice({
  label,
  hint,
  selected,
  onSelect,
  multi = false,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onSelect: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`sweep panel group relative px-4 py-3 text-left transition duration-300 ${
        selected
          ? 'border-[color:var(--accent)]'
          : 'hover:-translate-y-0.5 hover:border-[color:var(--line-strong)]'
      }`}
      style={selected ? { backgroundColor: 'var(--accent-soft)' } : undefined}
    >
      <span className="sweep-bar" aria-hidden />

      <span className="flex items-center gap-2">
        <span
          className={`grid size-4 shrink-0 place-items-center border transition ${
            multi ? 'rounded-[4px]' : 'rounded-full'
          }`}
          style={{
            borderColor: selected ? 'var(--accent)' : 'var(--line-strong)',
            backgroundColor: selected ? 'var(--accent)' : 'transparent',
          }}
          aria-hidden
        >
          {selected ? <Check className="size-3" style={{ color: 'var(--accent-ink)' }} /> : null}
        </span>
        <span className="text-[14px] font-medium">{label}</span>
      </span>

      <span className="prose-text text-faint mt-1 block pl-6 text-[12px]">{hint}</span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="label w-[4.5rem] shrink-0 pt-0.5">{label}</dt>
      <dd className="prose-text flex-1 text-pretty">{value}</dd>
    </div>
  );
}
