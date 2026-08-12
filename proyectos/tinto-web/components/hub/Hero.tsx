'use client';

import { useRef } from 'react';
import {
  ASSETS,
  ENDINGS,
  GESTURE_END_S,
  GHOSTS,
  ROW_H,
  SERVICES,
  type ServiceId,
} from '@/lib/hub-content';
import { useParallax } from '@/hooks/useParallax';
import { useTypewriter } from '@/hooks/useTypewriter';
import { TintoMark } from './TintoMark';

interface HeroProps {
  touching: boolean;
  pendingId: ServiceId | null;
  reducedMotion: boolean;
  onSelectService: (id: ServiceId) => void;
  onGestureComplete: () => void;
  onOpenDiagnostic: () => void;
}

export const Hero = ({
  touching,
  pendingId,
  reducedMotion,
  onSelectService,
  onGestureComplete,
  onOpenDiagnostic,
}: HeroProps) => {
  const containerRef = useParallax<HTMLElement>(!reducedMotion);
  const clickVideoRef = useRef<HTMLVideoElement>(null);
  const typed = useTypewriter(ENDINGS, !reducedMotion);

  // El gesto se reinicia en cada seleccion. Nunca se toca `src`: los dos
  // videos ya estan cargados y en loop, asi que el navegador no vuelve a
  // pedir permiso de autoplay — el cambio es solo de opacidad.
  // El rebobinado va aqui, sincrono con el clic: el video lleva rato en loop,
  // asi que sin esto el gesto arranca en un punto arbitrario del ciclo y el
  // toque a la pantalla (ultimo tramo del clip) no alcanza a verse.
  const handleSelect = (id: ServiceId) => {
    const el = clickVideoRef.current;
    if (el) {
      try {
        el.currentTime = 0;
      } catch {
        // Safari puede rechazar el seek si aun no hay metadata; es opcional.
      }
      el.muted = true;
      void el.play().catch(() => {});
    }
    onSelectService(id);
  };

  // Orden de las tarjetas: la elegida sube a la posicion 0.
  const order = SERVICES.map((_, i) => i);
  if (pendingId) {
    const sel = SERVICES.findIndex((x) => x.id === pendingId);
    if (sel >= 0) {
      order.splice(order.indexOf(sel), 1);
      order.unshift(sel);
    }
  }

  return (
    <section
      ref={containerRef}
      data-screen-label="01 Hero"
      className="hub-scene relative h-screen w-full overflow-hidden"
      style={{ animation: 'tSoftFade 1.5s cubic-bezier(.22,.7,.2,1) both' }}
    >
      {/* c1 · degradado base */}
      <div aria-hidden="true" className="hub-hero-gradient absolute inset-0" />

      {/* c1 · luces calidas */}
      <div
        aria-hidden="true"
        data-px="30"
        className="absolute -right-[14%] -top-[16%] h-[130vh] w-[78vw] blur-[90px]"
        style={{
          opacity: 0.55,
          background:
            'radial-gradient(48% 48% at 58% 42%,rgba(215,154,85,.6),transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        data-px="-18"
        className="absolute -bottom-[26%] -left-[18%] h-[90vh] w-[62vw] blur-[110px]"
        style={{
          opacity: 0.32,
          background:
            'radial-gradient(circle,rgba(110,68,51,.85),transparent 68%)',
        }}
      />

      {/* Loop ambiental, cuadrante inferior izquierdo. Decorativo: nunca
          debe leerse como protagonista. */}
      <div
        aria-hidden="true"
        className="hub-ambient-mask pointer-events-none absolute bottom-0 left-[10%] w-[26vw] max-w-[340px] overflow-hidden"
        style={{ opacity: 0.25 }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={ASSETS.ambientLoop}
          className="block h-auto w-full blur-[2px]"
        />
      </div>

      {/* c2 · textura de puntos */}
      <div
        aria-hidden="true"
        data-px="12"
        className="hub-texture-mask absolute -inset-[6%]"
        style={{
          opacity: 0.45,
          backgroundImage:
            'radial-gradient(rgba(244,238,231,.09) 1px,transparent 1px)',
          backgroundSize: '26px 26px',
          animation: 'tSlowDrift 40s ease-in-out infinite',
        }}
      />

      {/* c3 · palabras fantasma */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden font-serif text-cream"
        style={{ mixBlendMode: 'overlay' }}
      >
        {GHOSTS.map((g) => (
          <span
            key={g.word}
            className="absolute"
            style={{
              top: g.top,
              left: g.left,
              fontSize: g.size,
              opacity: 0.09,
              animationDelay: g.delay,
            }}
          >
            <span
              className="whitespace-nowrap font-light"
              style={{ animation: 'tGhostDrift 20s ease-in-out infinite' }}
            >
              {g.word}
            </span>
          </span>
        ))}
      </div>

      {/* Fundadora — composicion principal. Posicion fija, sin data-px: no
          debe seguir al cursor.

          El video es 720x1280 (vertical) y `cover` recorta el alto. Estrechar
          la caja baja el zoom: a 42vw el recorte queda en ~167px, con ~41px de
          aire sobre la frente y el gesto (al ~79% del alto) bien dentro.
          Desplazada 5% al centro respecto del borde derecho. */}
      <div
        aria-hidden="true"
        className="hub-founder-mask absolute right-[3%] bottom-0 top-0 w-[min(42vw,760px)]"
      >
        <div className="lighten absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={ASSETS.founderIdle}
            className="absolute inset-0 block h-full w-full object-cover transition-opacity duration-[350ms]"
            style={{ objectPosition: '52% 33%', opacity: touching ? 0 : 1 }}
          />
          <video
            ref={clickVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={ASSETS.founderClick}
            onTimeUpdate={(e) => {
              // Pasa al puente cuando el gesto ya se vio, no por reloj: el
              // clip decodifica mas lento que el tiempo de pared.
              if (touching && e.currentTarget.currentTime >= GESTURE_END_S) {
                onGestureComplete();
              }
            }}
            className="absolute inset-0 block h-full w-full object-cover transition-opacity duration-[350ms]"
            style={{ objectPosition: '52% 33%', opacity: touching ? 1 : 0 }}
          />
        </div>
      </div>

      {/* Panel de oportunidades */}
      <div className="absolute right-[clamp(20px,4vw,56px)] top-1/2 z-[6] flex w-[min(32vw,480px)] -translate-y-1/2 flex-col gap-2">
        <div
          className="flex flex-col gap-2"
          style={{
            animation: 'tFadeUp .8s cubic-bezier(.2,.7,.2,1) .15s both',
          }}
        >
          <div className="flex items-center justify-between px-1 pb-1.5">
            <span
              className="text-[11.5px] font-bold uppercase text-cream"
              style={{
                letterSpacing: '.2em',
                textShadow: '0 1px 6px rgba(0,0,0,.8)',
              }}
            >
              Oportunidades de inversión
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-amber"
              style={{
                boxShadow: '0 0 10px var(--p-amber)',
                animation: 'tGlow 2.4s ease-in-out infinite',
              }}
            />
          </div>

          <div
            className="relative"
            style={{ height: SERVICES.length * ROW_H - 12 }}
          >
            {SERVICES.map((x, i) => {
              const active = touching && pendingId === x.id;
              const pos = order.indexOf(i);

              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => handleSelect(x.id)}
                  className="absolute left-0 right-0 flex cursor-pointer items-center gap-3.5 rounded-[14px] border px-[18px] py-3.5 text-left hover:border-amber"
                  style={{
                    top: pos * ROW_H,
                    minHeight: ROW_H - 12,
                    boxSizing: 'border-box',
                    font: 'inherit',
                    transition:
                      'top .55s cubic-bezier(.3,.75,.25,1), border-color .25s, background .25s',
                    borderColor: active
                      ? 'var(--p-amber)'
                      : 'rgba(221,185,129,.4)',
                    background: active
                      ? 'rgba(45,32,25,.35)'
                      : 'rgba(17,14,13,.25)',
                    // Oscurece el video detras sin depender del frame.
                    backdropFilter: 'blur(6px) brightness(.62) saturate(.9)',
                    WebkitBackdropFilter:
                      'blur(6px) brightness(.62) saturate(.9)',
                    boxShadow: '0 18px 46px rgba(0,0,0,.35)',
                  }}
                >
                  <span className="w-8 flex-none font-serif text-[25px] text-amber">
                    {'0' + (i + 1)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                    <span
                      className="text-[19px] font-semibold text-cream"
                      style={{
                        textShadow:
                          '0 1px 3px rgba(0,0,0,.9),0 2px 10px rgba(0,0,0,.85)',
                      }}
                    >
                      {x.short}
                    </span>
                    <span
                      className="text-[14px] leading-[1.4] text-cream"
                      style={{
                        opacity: 0.92,
                        textShadow:
                          '0 1px 3px rgba(0,0,0,.9),0 2px 10px rgba(0,0,0,.85)',
                      }}
                    >
                      {x.hook}
                    </span>
                  </span>

                  {active && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[16px] border border-amber"
                      style={{ animation: 'tPulseRing 1s ease-out both' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Columna de texto */}
      <div className="relative z-[6] flex h-full max-w-[min(40vw,600px)] flex-col justify-center gap-[clamp(18px,2.4vw,30px)] px-[clamp(20px,5vw,86px)]">
        <div
          className="flex items-center gap-3.5"
          style={{ animation: 'tFadeUp .7s cubic-bezier(.2,.7,.2,1) both' }}
        >
          <div
            className="relative h-[46px] w-[46px] flex-none"
            style={{ animation: 'tBreathe 4s ease-in-out infinite' }}
          >
            <div
              className="absolute -inset-[26%] rounded-full blur-[15px]"
              style={{
                background:
                  'radial-gradient(circle,rgba(215,154,85,.46),transparent 68%)',
                animation: 'tGlow 4s ease-in-out infinite',
              }}
            />
            <TintoMark />
          </div>
          <div className="flex flex-col gap-[3px]">
            <span
              className="font-serif text-[19px] text-cream"
              style={{ letterSpacing: '.34em', textIndent: '.34em' }}
            >
              TINTO
            </span>
            <span
              className="text-[10px] uppercase text-muted"
              style={{ letterSpacing: '.2em' }}
            >
              Bienvenido a TINTO
            </span>
          </div>
        </div>

        <h1
          className="m-0 font-serif font-normal text-cream"
          style={{
            fontSize: 'clamp(38px,4.4vw,65px)',
            lineHeight: 1.22,
            letterSpacing: '-.01em',
          }}
        >
          <span
            className="block whitespace-nowrap"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,.55)' }}
          >
            Las decisiones importantes
          </span>
          <span className="block whitespace-nowrap">comienzan con</span>
          <span
            className="block whitespace-nowrap text-amber"
            style={{ minHeight: '1.22em' }}
          >
            {typed}
            <span
              aria-hidden="true"
              className="inline-block bg-amber"
              style={{
                width: '.045em',
                height: '.85em',
                marginLeft: '.06em',
                verticalAlign: '-.06em',
                animation: 'tCaret 1s step-end infinite',
              }}
            />
          </span>
        </h1>

        <h2
          className="m-0 max-w-[30em] font-sans font-normal text-muted"
          style={{
            fontSize: 'clamp(15px,1.2vw,18px)',
            lineHeight: 1.65,
            textWrap: 'pretty',
          }}
        >
          En TINTO encuentras las respuestas que te llevan a tu primera
          inversión en Colombia desde el exterior.
        </h2>

        <div className="flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={onOpenDiagnostic}
            className="relative overflow-hidden rounded-pill border border-amber px-[26px] py-3.5 font-sans text-[15px] text-cream transition-colors duration-200 hover:bg-[rgba(110,68,51,.32)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-full w-[38%]"
              style={{
                background:
                  'linear-gradient(90deg,transparent,rgba(244,238,231,.24),transparent)',
                animation: 'tSheen 3.6s ease-in-out infinite',
              }}
            />
            Quiero asesoría
          </button>
        </div>
      </div>
    </section>
  );
};
