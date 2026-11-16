'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navSections, sectionList } from '@/lib/sections';
import { site } from '@/lib/site';
import { openPalette } from './command-palette';

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState('');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: [0.05, 0.4] },
    );

    for (const section of sectionList) {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      window.localStorage.setItem('theme', next);
    } catch {
      /* ignora */
    }
  }

  return (
    <header className="bar-blur fixed inset-x-0 top-0 z-50 border-b">
      {/* Barra de progresso da rolagem */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] origin-left"
        style={{
          scaleX: progress,
          background: 'linear-gradient(90deg, var(--accent), var(--cyan))',
        }}
        aria-hidden
      />

      <div className="container-page flex h-16 items-center gap-5">
        <a href="#topo" className="flex shrink-0 items-center gap-2.5">
          <span
            className="grid size-7 place-items-center rounded-lg text-[11px] font-bold"
            style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
          >
            MG
          </span>
          <span className="hidden text-[14px] font-semibold sm:inline">{site.firstName}</span>
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Seções">
          {navSections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`relative rounded-lg px-3 py-2 text-[13.5px] transition ${
                  isActive ? 'text-[color:var(--text)]' : 'text-muted hover:text-[color:var(--text)]'
                }`}
              >
                {section.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg border"
                    style={{ borderColor: 'var(--line)', background: 'var(--panel)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    aria-hidden
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={openPalette}
            className="chip"
            aria-label="Buscar seções do site"
          >
            <Search className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">buscar</span>
            <kbd className="text-faint rounded border px-1 text-[10px] leading-4">⌘K</kbd>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="grid size-9 place-items-center rounded-lg border transition hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]"
          >
            {mounted && theme === 'light' ? (
              <Moon className="size-4" aria-hidden />
            ) : (
              <Sun className="size-4" aria-hidden />
            )}
          </button>

          <a
            href="#montar"
            className="btn-primary hidden px-4 py-2 text-[13px] sm:inline-flex"
          >
            Montar projeto
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            className="grid size-9 place-items-center rounded-lg border lg:hidden"
          >
            {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t bg-[color:var(--bg)] lg:hidden" aria-label="Seções — menu móvel">
          <ul className="container-page py-2">
            {sectionList.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-3.5 border-b py-3.5 text-[15px] last:border-b-0"
                >
                  <span className="data text-faint text-[11px]">{section.index}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
