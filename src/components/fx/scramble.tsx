'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '#$%&/()=?*+[]{}<>_-01';

type ScrambleProps = {
  text: string;
  className?: string;
  /** Milissegundos por caractere revelado. */
  speed?: number;
};

/**
 * Revela o texto "decodificando": os caracteres entram embaralhados e vão se
 * assentando da esquerda para a direita quando o elemento aparece na tela.
 *
 * O texto real fica sempre no DOM (via sr-only) para leitores de tela e para o
 * Google — a animação é só visual.
 */
export function Scramble({ text, className, speed = 28 }: ScrambleProps) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || done.current) return;
        done.current = true;
        observer.disconnect();

        let revealed = 0;
        const timer = window.setInterval(() => {
          revealed += 1;

          setDisplay(
            text
              .split('')
              .map((char, index) => {
                if (index < revealed || char === ' ') return char;
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char;
              })
              .join(''),
          );

          if (revealed >= text.length) {
            window.clearInterval(timer);
            setDisplay(text);
          }
        }, speed);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display}</span>
    </span>
  );
}
