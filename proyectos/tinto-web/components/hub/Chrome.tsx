'use client';

import { TICKER } from '@/lib/hub-content';
import { TintoMark } from './TintoMark';

/**
 * Chrome persistente — visible en Servicio y Diagnostico.
 * Logo fijo que vuelve al hero + barra inferior con ticker y WhatsApp.
 */
export const Chrome = ({
  whatsappNumber,
  onBackToHero,
}: {
  whatsappNumber: string;
  onBackToHero: () => void;
}) => {
  const waHref =
    'https://wa.me/' +
    whatsappNumber +
    '?text=' +
    encodeURIComponent('Hola, vengo de la web de TINTO.');

  // El ticker se duplica: la animacion recorre -50% y vuelve al inicio sin
  // salto visible.
  const loop = [...TICKER, ...TICKER];

  return (
    <>
      <button
        type="button"
        onClick={onBackToHero}
        aria-label="Volver al inicio"
        className="fixed left-[clamp(16px,4vw,40px)] top-5 z-40 flex cursor-pointer items-center gap-2.5 rounded-pill py-2 pl-2 pr-3.5 text-cream transition-colors duration-200 hover:border-amber"
        style={{
          font: 'inherit',
          border: '1px solid rgba(255,255,255,.12)',
          background: 'rgba(14,12,11,.62)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <span
          className="block h-[26px] w-[26px]"
          style={{ animation: 'tBreathe 4.5s ease-in-out infinite' }}
        >
          <TintoMark strokeWidth={4} barWidth={8} />
        </span>
        <span
          className="font-serif text-[13px]"
          style={{ letterSpacing: '.28em', textIndent: '.28em' }}
        >
          TINTO
        </span>
      </button>

      <div
        className="fixed bottom-0 left-0 right-0 z-[35] flex items-stretch"
        style={{
          borderTop: '1px solid rgba(221,185,129,.28)',
          background: '#141110',
        }}
      >
        <span
          className="flex flex-none items-center px-3.5 text-[10px] uppercase"
          style={{
            letterSpacing: '.18em',
            color: '#0b0a09',
            background: 'var(--p-amber)',
          }}
        >
          Datos financieros
        </span>

        <div className="min-w-0 flex-1 overflow-hidden py-[11px]">
          <div
            className="flex w-max gap-[38px]"
            style={{
              animation: 'tTicker 46s linear infinite',
              willChange: 'transform',
            }}
          >
            {loop.map((t, i) => (
              <span
                key={`${t.label}-${i}`}
                className="flex items-center gap-[9px] whitespace-nowrap text-[12.5px] text-muted"
              >
                <span className="h-[5px] w-[5px] flex-none rounded-full bg-amber" />
                <span className="text-cream">{t.label}</span>
                <span>{t.value}</span>
              </span>
            ))}
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          aria-label="Escribir por WhatsApp"
          className="my-1.5 ml-3 mr-[clamp(10px,2vw,18px)] flex flex-none items-center gap-[9px] rounded-pill px-4 py-[9px] text-[13px] font-medium no-underline transition-all duration-200 hover:-translate-y-px"
          style={{
            color: '#0b0a09',
            background:
              'linear-gradient(140deg,var(--p-gold-soft),var(--p-amber))',
          }}
        >
          <svg
            viewBox="0 0 256 256"
            className="h-[17px] w-[17px] flex-none"
            style={{ fill: 'currentColor' }}
            aria-hidden="true"
          >
            <path d="M128 24a104 104 0 0 0-89 157.6L24 232l51.4-14.6A104 104 0 1 0 128 24Zm0 192a87.6 87.6 0 0 1-44.6-12.2l-3.1-1.8-30.6 8.7 8.9-30.3-1.9-3.2A88 88 0 1 1 128 216Zm48.8-62.6c-2.6 7.4-15.1 14.1-21 14.6-5.9.5-11.2.8-19-.9-7.8-1.7-24.5-9.1-38.3-25.8-13.8-16.7-15.9-27.1-16.7-31.3-.8-4.2.9-11.2 4.6-15.1 3.7-3.9 6.3-4.4 8.4-4.4h4.7c2.1 0 3.9 0 5.5 3.7 1.6 3.7 5.7 14 6.2 15.1.5 1.1.8 2.4 0 3.9-.8 1.6-3.7 5.3-5.5 7.1-1.8 1.8-1.8 2.6-.8 4.4 1 1.8 5.1 8.5 11 13.7 7.6 6.7 13.9 8.9 15.9 9.9 2 1 3.4.8 4.7-.5 1.3-1.3 5.5-6.3 7-8.4 1.5-2.1 3-1.6 5-.8 2 .8 12.8 6 15 7.1 2.2 1.1 3.7 1.6 4.2 2.6.5 1 .5 6-2.1 13.4Z" />
          </svg>
          <span className="max-md:hidden">WhatsApp</span>
        </a>
      </div>
    </>
  );
};
