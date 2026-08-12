'use client';

import { Atmosphere } from './Atmosphere';

export const Hero = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-void-900">
      {/* Fondo degradado: void-950 → void-900 → copper con opacidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-void-950 via-void-900 to-copper-500/5" />

      {/* Capa Z1 — atmosfera generativa (CNV-01). Reemplaza los glows
          placeholder del paso anterior. */}
      <Atmosphere tone="copper" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Tag de exploración */}
        <div className="mb-6 inline-block">
          <span className="text-xs uppercase tracking-widest text-text-faint px-3 py-1 rounded-full border border-line bg-void-900/60 backdrop-blur">
            Exploración inicial
          </span>
        </div>

        {/* Título */}
        <h1 className="text-display text-ivory-050 mb-6">
          TINTO
        </h1>

        {/* Subtítulo */}
        <p className="text-subtitle text-ivory-100 max-w-2xl mx-auto mb-8">
          Ecosistema financiero pensado para colombianos en el exterior.
        </p>

        {/* CTA primario */}
        <button
          className="inline-flex items-center justify-center px-7 py-3 rounded-pill bg-gradient-to-r from-copper-500 to-copper-600 text-ivory-050 font-medium text-sm tracking-tight border border-gold-300/30 hover:shadow-glow-action hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-3 focus-visible:ring-offset-void-900 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Explorar TINTO"
        >
          Explorar
        </button>

        {/* Microcopy */}
        <p className="mt-6 text-xs text-text-faint max-w-md mx-auto">
          Esta es una exploración de conceptos. No es una oferta confirmada.
        </p>
      </div>
    </section>
  );
};
