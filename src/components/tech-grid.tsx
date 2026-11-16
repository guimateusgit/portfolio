'use client';

import { useState } from 'react';
import { TECH_ICON_COLOR, techCategories, type Tech, type TechCategory } from '@/data/tech';

function TechIcon({ tech }: { tech: Tech }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-faint w-[18px] text-center text-[11px] font-bold" aria-hidden>
        {tech.name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${tech.slug}/${TECH_ICON_COLOR}`}
      alt=""
      width={18}
      height={18}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-[18px] shrink-0 opacity-70 transition group-hover/tech:opacity-100"
    />
  );
}

/**
 * Grade de tecnologias com um painel de leitura compartilhado: ao passar o
 * mouse em qualquer item, a explicação daquele grupo aparece embaixo, em
 * português. É o que torna a lista útil para quem não é da área.
 */
export function TechGrid() {
  const [active, setActive] = useState<TechCategory | null>(null);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {techCategories.map((category) => (
          <div
            key={category.label}
            className="panel panel-live p-5"
            onMouseEnter={() => setActive(category)}
            onMouseLeave={() => setActive(null)}
          >
            <h4 className="label">{category.label}</h4>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2.5">
              {category.items.map((tech) => (
                <li
                  key={tech.name}
                  className="group/tech flex items-center gap-2 text-[13px] transition hover:text-[color:var(--cyan)]"
                >
                  <TechIcon tech={tech} />
                  {tech.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Painel de leitura */}
      <div className="panel mt-4 flex min-h-[4.5rem] items-center gap-4 p-5">
        <span
          className="pulse-soft size-1.5 shrink-0 rounded-full"
          style={{ background: active ? 'var(--cyan)' : 'var(--line-strong)' }}
          aria-hidden
        />
        <p className="prose-text text-pretty text-[14px] leading-relaxed">
          {active ? (
            <>
              <strong className="font-semibold">{active.label}:</strong>{' '}
              <span className="text-muted">{active.hint}</span>
            </>
          ) : (
            <span className="text-faint">
              Passe o mouse em um dos grupos acima para ver, em português, para
              que aquilo serve.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
