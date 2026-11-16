'use client';

import { useEffect } from 'react';

/**
 * Camada de fundo fixa do site inteiro.
 *
 * Três coisas empilhadas:
 *  1. duas manchas de luz gigantes que derivam devagar (a "aurora");
 *  2. uma malha de pontos que some nas bordas;
 *  3. um brilho que acompanha o cursor do mouse.
 *
 * O brilho do cursor é feito com variáveis CSS (--mx / --my) atualizadas aqui
 * dentro de um requestAnimationFrame. Nada de re-render do React a cada
 * movimento do mouse — isso derrubaria a performance da página.
 */
export function Backdrop() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    function apply() {
      frame = 0;
      document.documentElement.style.setProperty('--mx', `${x}px`);
      document.documentElement.style.setProperty('--my', `${y}px`);
    }

    function onMove(event: MouseEvent) {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(apply);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% -10%, var(--bg-2), var(--bg) 60%)',
        }}
      />

      {/* aurora */}
      <div
        className="aurora-a absolute -top-[30vh] left-[8vw] size-[70vw] rounded-full blur-[130px]"
        style={{ background: 'var(--aurora-a)' }}
      />
      <div
        className="aurora-b absolute top-[25vh] right-[2vw] size-[55vw] rounded-full blur-[140px]"
        style={{ background: 'var(--aurora-b)' }}
      />

      {/* malha */}
      <div className="grid-fade absolute inset-0 opacity-70" />

      {/* luz do cursor */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx) var(--my), var(--cursor-glow), transparent 70%)',
        }}
      />
    </div>
  );
}
