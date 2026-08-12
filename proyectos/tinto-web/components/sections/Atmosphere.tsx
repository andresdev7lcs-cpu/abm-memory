'use client';

import { useEffect, useRef, useState } from 'react';
import { attachAtmosphere } from '@/lib/canvas-atmosphere.mjs';
import { detectPerformanceMode, isReducedMotion } from '@/lib/performance-mode.mjs';
import type { PerformanceMode, Tone } from '@/lib/types';

interface AtmosphereProps {
  /** Tono de territorio. Etiqueta heredada, no describe el color real. */
  tone?: Tone;
}

/**
 * Capa Z1 — atmosfera generativa (CNV-01 / CNV-02).
 *
 * La logica de dibujo vive en lib/canvas-atmosphere.mjs, portada sin cambios
 * desde tools/tinto-web. Este componente solo la monta y la desmonta.
 *
 * Restricciones de VISUAL_REFINEMENT §229:
 *   - opacidad <= 0.16
 *   - pointer-events: none
 *   - la atmosfera es fondo, nunca compite con el contenido
 *
 * RESPONSIVE_PLAN §3: canvas desactivado bajo 375px, activo desde 768px.
 * Cuando esta desactivado queda el fallback: gradiente radial CSS por tono.
 */
export const Atmosphere = ({ tone = 'default' }: AtmosphereProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Bajo 375px el costo de render no compensa: solo fallback CSS.
    const viewport = window.matchMedia('(min-width: 375px)');

    const sync = () => setEnabled(viewport.matches);
    sync();
    viewport.addEventListener('change', sync);

    return () => viewport.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!enabled || !canvasRef.current) {
      return;
    }

    // Entre 375px y 768px la spec pide canvas simplificado, no completo.
    const simplified = !window.matchMedia('(min-width: 768px)').matches;
    const mode: PerformanceMode = simplified ? 'balanced' : detectPerformanceMode();

    return attachAtmosphere(canvasRef.current, {
      mode,
      reducedMotion: isReducedMotion(),
      tone,
    });
  }, [enabled, tone]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-atmosphere overflow-hidden"
    >
      {/* Fallback permanente: gradiente radial por tono. Visible tambien
          bajo el canvas, que se compone encima con transparencia. */}
      <div className="atmosphere-fallback absolute inset-0" />

      {enabled ? (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-atmosphere" />
      ) : null}
    </div>
  );
};
