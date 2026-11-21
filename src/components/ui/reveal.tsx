'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * useLayoutEffect avisa no console quando roda no servidor — e no servidor ele
 * nunca executa mesmo. Esta troca silencia o aviso sem mudar o comportamento.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type RevealProps = {
  children: ReactNode;
  /** Atraso da entrada, em segundos. Serve para escalonar itens de uma lista. */
  delay?: number;
  /** Distância que o bloco sobe ao aparecer, em pixels. */
  y?: number;
  /** Escala inicial, quando o elemento também deve crescer ao entrar. */
  scale?: number;
  className?: string;
};

type Phase = 'visivel' | 'escondido' | 'entrando';

/**
 * ============================================================================
 *  ENTRADA SUAVE AO ROLAR A PÁGINA
 * ============================================================================
 *
 *  O conteúdo nasce VISÍVEL e só é escondido depois, pelo JavaScript. Parece
 *  rebuscado, mas é a diferença entre um site quebrado e um site sem animação.
 *
 *  A versão anterior fazia o contrário: o HTML saía do servidor com tudo em
 *  `opacity: 0`, esperando o JavaScript mandar aparecer. Quando o JavaScript
 *  falhava — erro de hidratação, um pedaço do pacote que não baixou, conexão
 *  ruim no meio do carregamento, extensão de navegador atrapalhando — o
 *  visitante ficava olhando uma página vazia. O texto estava lá no HTML, só
 *  que invisível, e nada iria mostrá-lo.
 *
 *  Agora a pior hipótese é alguém ver o site inteiro sem animação nenhuma.
 *
 *  O esconder acontece dentro de `useLayoutEffect`, que roda ANTES da primeira
 *  pintura da tela — então ninguém enxerga o conteúdo piscar antes de sumir.
 * ============================================================================
 */
export function Reveal({ children, delay = 0, y = 22, scale, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fase, setFase] = useState<Phase>('visivel');

  useIsomorphicLayoutEffect(() => {
    // Com movimento reduzido no sistema, nada se mexe: fica visível e parado.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setFase('escondido');
  }, []);

  useEffect(() => {
    if (fase !== 'escondido') return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        setFase('entrando');
      },
      // Espera o bloco entrar 80px na tela: a animação começa quando ele já
      // está confortavelmente visível, não na borda.
      { rootMargin: '-80px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fase]);

  const escondido = fase === 'escondido';
  const animando = fase !== 'visivel';

  return (
    <div
      ref={ref}
      className={className}
      style={
        animando
          ? {
              opacity: escondido ? 0 : 1,
              transform: escondido
                ? `translateY(${y}px)${scale ? ` scale(${scale})` : ''}`
                : undefined,
              transition: escondido
                ? undefined
                : `opacity 650ms cubic-bezier(.22,1,.36,1) ${delay}s, transform 650ms cubic-bezier(.22,1,.36,1) ${delay}s`,
              willChange: 'opacity, transform',
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
