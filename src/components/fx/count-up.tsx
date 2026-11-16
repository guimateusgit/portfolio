'use client';

import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  value: number;
  /** Texto colado depois do número, como "+" ou "%". */
  suffix?: string;
  duration?: number;
  className?: string;
};

/** Conta de zero até o valor quando o número entra na tela. */
export function CountUp({ value, suffix = '', duration = 1100, className }: CountUpProps) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || done.current) return;
        done.current = true;
        observer.disconnect();

        const start = performance.now();
        let frame = 0;

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutExpo: arranca rápido e assenta devagar
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCurrent(Math.round(eased * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        }

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {current.toLocaleString('pt-BR')}
      {suffix}
    </span>
  );
}
