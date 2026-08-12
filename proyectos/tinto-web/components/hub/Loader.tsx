'use client';

import { TintoMark } from './TintoMark';

/** Escena 0 — logo vivo. Pasa al hero solo, o con "Omitir intro". */
export const Loader = ({ onSkip }: { onSkip: () => void }) => (
  <div
    role="status"
    aria-label="Cargando TINTO"
    className="hub-scene fixed inset-0 z-[90] grid place-items-center bg-ink-deep"
    style={{ animation: 'tFade .4s ease both' }}
  >
    <div
      className="flex flex-col items-center gap-[22px]"
      style={{ animation: 'tLoaderBeat 2.5s ease-in-out both' }}
    >
      <div
        className="relative h-[168px] w-[168px]"
        style={{ animation: 'tBreathe 3.4s ease-in-out infinite' }}
      >
        <div
          className="absolute -inset-[18%] rounded-full blur-[28px]"
          style={{
            background:
              'radial-gradient(circle,rgba(215,154,85,.5),transparent 66%)',
            animation: 'tGlow 3.4s ease-in-out infinite',
          }}
        />
        <TintoMark traced />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div
          className="font-serif text-[26px] font-normal text-cream"
          style={{ letterSpacing: '.42em', textIndent: '.42em' }}
        >
          TINTO
        </div>
        <div
          className="text-[10px] uppercase text-muted"
          style={{ letterSpacing: '.24em' }}
        >
          Prototipo · contenido provisional
        </div>
      </div>
    </div>

    <button
      type="button"
      onClick={onSkip}
      className="absolute bottom-6 right-6 rounded-pill border border-line px-4 py-2 text-[12px] text-muted transition-colors duration-200 hover:border-amber hover:text-cream"
      style={{ letterSpacing: '.08em' }}
    >
      Omitir intro
    </button>
  </div>
);
