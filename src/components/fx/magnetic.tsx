'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import type { ReactNode } from 'react';

type MagneticProps = {
  children: ReactNode;
  /** Quanto o elemento "persegue" o cursor. 0.2 a 0.5 funciona bem. */
  strength?: number;
  className?: string;
};

/**
 * Faz o elemento inclinar-se levemente na direção do cursor enquanto o mouse
 * está em cima. Usado nos botões principais — dá a sensação de que a interface
 * responde antes mesmo do clique.
 *
 * Em telas de toque e com `prefers-reduced-motion`, não faz nada.
 */
export function Magnetic({ children, strength = 0.32, className }: MagneticProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={`inline-block ${className ?? ''}`}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
