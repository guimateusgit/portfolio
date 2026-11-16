'use client';

import { useEffect, useState } from 'react';
import { sectionList } from '@/lib/sections';

/**
 * Trilha vertical fixa à esquerda com um ponto por seção.
 * O ponto da seção visível acende e mostra o nome. Só em telas largas —
 * no mobile a navegação fica no menu do topo.
 */
export function ProgressRail() {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.4] },
    );

    for (const section of sectionList) {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Progresso da leitura"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col gap-3">
        {sectionList.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className="block h-px transition-all duration-300"
                  style={{
                    width: isActive ? '26px' : '14px',
                    background: isActive ? 'var(--accent)' : 'var(--line-strong)',
                  }}
                  aria-hidden
                />
                <span
                  className="data whitespace-nowrap text-[10.5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-faint)' }}
                >
                  {section.index} {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
