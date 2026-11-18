'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * useLayoutEffect avisa no console quando roda no servidor — e no servidor ele
 * nunca executa mesmo. Esta troca silencia o aviso sem mudar o comportamento.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type CountUpProps = {
  value: number;
  /** Texto colado depois do número, como "+" ou "%". */
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Conta de zero até o valor quando o número entra na tela.
 *
 * Começa no valor FINAL, não em zero. Parece detalhe, mas é o que o HTML
 * gerado no servidor carrega — e é esse HTML que buscador, prévia de link no
 * WhatsApp e visitante sem JavaScript enxergam. Começando em zero, o Google
 * leria "0+ anos escrevendo código".
 *
 * O zero é aplicado em seguida, antes da primeira pintura da tela, para a
 * animação acontecer sem o número final piscar antes.
 */
export function CountUp({ value, suffix = '', duration = 1100, className }: CountUpProps) {
  const [current, setCurrent] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const frame = useRef(0);

  useIsomorphicLayoutEffect(() => {
    // Com movimento reduzido, o número fica parado no valor certo.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setCurrent(0);
  }, []);

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

        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutExpo: arranca rápido e assenta devagar
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCurrent(Math.round(eased * value));
          if (progress < 1) frame.current = requestAnimationFrame(tick);
        }

        frame.current = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {current.toLocaleString('pt-BR')}
      {suffix}
    </span>
  );
}
