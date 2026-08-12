'use client';

import { useEffect, useRef } from 'react';

/**
 * Parallax sutil de las capas decorativas: cada `[data-px]` dentro del
 * contenedor se desplaza segun su profundidad (el atributo, en px).
 *
 * El video de la fundadora queda fuera a proposito — el prototipo lo fija
 * y no debe seguir al cursor.
 *
 * Escribe el transform directo en el nodo dentro de un rAF; pasar por estado
 * de React en cada pointermove seria un re-render por frame.
 */
export function useParallax<T extends HTMLElement>(enabled: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    let mx = 0;
    let my = 0;
    let raf: number | null = null;

    const apply = () => {
      raf = null;
      const layers = container.querySelectorAll<HTMLElement>('[data-px]');
      layers.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-px') ?? '0') || 0;
        el.style.transform = `translate3d(${(-mx * depth).toFixed(2)}px,${(
          -my * depth
        ).toFixed(2)}px,0)`;
      });
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (raf === null) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return containerRef;
}
