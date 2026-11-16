'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { sectionList } from '@/lib/sections';
import { site, whatsappLink } from '@/lib/site';

export const PALETTE_EVENT = 'palette:open';

/** Dispara a abertura da busca de qualquer lugar do site. */
export function openPalette(): void {
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
}

type Item = {
  id: string;
  group: 'Seções' | 'Ações';
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
};

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function goTo(id: string): void {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  }
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const items = useMemo<Item[]>(() => {
    const fromSections: Item[] = sectionList.map((section) => ({
      id: `secao-${section.id}`,
      group: 'Seções',
      label: section.title,
      hint: section.label,
      keywords: `${section.label} ${section.id} ${section.keywords.join(' ')}`,
      run: () => goTo(section.id),
    }));

    const actions: Item[] = [
      {
        id: 'acao-montar',
        group: 'Ações',
        label: 'Montar meu projeto',
        hint: '30 segundos',
        keywords: 'montar simulador escopo orçamento proposta',
        run: () => goTo('montar'),
      },
      {
        id: 'acao-whatsapp',
        group: 'Ações',
        label: 'Abrir conversa no WhatsApp',
        hint: site.phone.display,
        keywords: 'whatsapp zap telefone ligar falar contato',
        run: () => window.open(whatsappLink, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'acao-email-copiar',
        group: 'Ações',
        label: 'Copiar e-mail',
        hint: site.email,
        keywords: 'email copiar endereço contato',
        run: () => {
          void navigator.clipboard
            ?.writeText(site.email)
            .then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2200);
            })
            .catch(() => {
              window.location.href = `mailto:${site.email}`;
            });
        },
      },
      {
        id: 'acao-github',
        group: 'Ações',
        label: 'Abrir meu GitHub',
        hint: 'github.com',
        keywords: 'github código repositório perfil',
        run: () => window.open(site.socials.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'acao-linkedin',
        group: 'Ações',
        label: 'Abrir meu LinkedIn',
        hint: 'linkedin.com',
        keywords: 'linkedin perfil rede currículo',
        run: () => window.open(site.socials.linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'acao-tema',
        group: 'Ações',
        label: 'Alternar tema claro / escuro',
        hint: 'tema',
        keywords: 'tema claro escuro dark light cor',
        run: () => {
          const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', next === 'dark');
          try {
            window.localStorage.setItem('theme', next);
          } catch {
            /* ignora */
          }
        },
      },
      {
        id: 'acao-topo',
        group: 'Ações',
        label: 'Voltar ao topo',
        hint: 'início',
        keywords: 'topo início home voltar',
        run: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      },
    ];

    return [...fromSections, ...actions];
  }, []);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return items;
    return items.filter((item) =>
      normalize(`${item.label} ${item.hint} ${item.keywords}`).includes(term),
    );
  }, [items, query]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }

    function onOpen() {
      setOpen(true);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(PALETTE_EVENT, onOpen);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({
      block: 'nearest',
    });
  }, [active]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (results.length === 0 ? 0 : (index + 1) % results.length));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) =>
        results.length === 0 ? 0 : (index - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const item = results[active];
      if (item) {
        item.run();
        if (item.id !== 'acao-email-copiar') close();
      }
    }
  }

  if (!open) return null;

  let lastGroup = '';

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar no site"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Fechar busca"
        onClick={close}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      <div className="panel rise relative w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <span style={{ color: 'var(--accent)' }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="buscar seção ou ação…"
            aria-label="Buscar seção ou ação"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[color:var(--text-faint)]"
          />
          <kbd className="label rounded border px-1.5 py-1">ESC</kbd>
        </div>

        <ul ref={listRef} className="max-h-[48vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="text-faint px-5 py-8 text-center text-[14px]">
              nada encontrado para &quot;{query}&quot;
            </li>
          ) : (
            results.map((item, index) => {
              const showGroup = item.group !== lastGroup;
              lastGroup = item.group;
              const isActive = index === active;

              return (
                <li key={item.id}>
                  {showGroup ? <p className="label px-5 pb-2 pt-3">{item.group}</p> : null}

                  <button
                    type="button"
                    data-active={isActive}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => {
                      item.run();
                      if (item.id !== 'acao-email-copiar') close();
                    }}
                    className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-[14px] transition"
                    style={
                      isActive
                        ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                        : undefined
                    }
                  >
                    <span className={isActive ? '' : 'text-faint'}>→</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="text-faint shrink-0 text-[12px]">{item.hint}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center gap-4 border-t px-5 py-2.5">
          <span className="label">↑↓ navegar</span>
          <span className="label">⏎ abrir</span>
          <span className="label">esc fechar</span>
          {copied ? (
            <span className="text-accent ml-auto text-[12px]">e-mail copiado ✓</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
