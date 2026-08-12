import type { AtmosphereCleanup, AtmosphereOptions } from './types';

/**
 * Dibuja halo radial, grilla punteada y anillos concentricos sobre un canvas 2D.
 * Portado sin cambios desde tools/tinto-web/canvas-atmosphere.mjs (CNV-01/CNV-02).
 * La logica no se altera sin ticket: solo se ajustan parametros.
 */
export function attachAtmosphere(
  canvas: HTMLCanvasElement | null,
  options?: AtmosphereOptions,
): AtmosphereCleanup;
