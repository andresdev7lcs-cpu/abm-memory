/** Tier de rendimiento. Determina densidad visual y loops continuos. */
export type PerformanceMode = 'cinematic' | 'balanced' | 'reduced';

/**
 * Tono de territorio. Los nombres son etiquetas heredadas del codigo y no
 * describen el color real: `forest` es vino, `petrol` es cacao/cobre.
 * No renombrar — romperia content.mjs y canvas-atmosphere.mjs.
 */
export type Tone = 'forest' | 'petrol' | 'copper' | 'default';

export interface AtmosphereOptions {
  mode?: PerformanceMode;
  reducedMotion?: boolean;
  tone?: Tone;
}

/** Cancela el rAF y desmonta los listeners del canvas. */
export type AtmosphereCleanup = () => void;
