'use client';

import { ASSETS, type Service as ServiceModel } from '@/lib/hub-content';
import type { MenuId } from '@/hooks/useHubMachine';
import { useParallax } from '@/hooks/useParallax';

interface ServiceProps {
  service: ServiceModel;
  openMenu: MenuId;
  reducedMotion: boolean;
  onToggleMenu: (id: Exclude<MenuId, null>) => void;
  onOpenDiagnostic: () => void;
  onBackToHero: () => void;
}

export const Service = ({
  service,
  openMenu,
  reducedMotion,
  onToggleMenu,
  onOpenDiagnostic,
  onBackToHero,
}: ServiceProps) => {
  const containerRef = useParallax<HTMLElement>(!reducedMotion);

  const menus = [
    {
      id: 'faq' as const,
      label: 'Preguntas frecuentes',
      hint: 'Las preguntas que abren la conversación',
      items: service.faq,
    },
    {
      id: 'rec' as const,
      label: 'Recursos educativos',
      hint: 'Material de apoyo para decidir con criterio',
      items: service.recursos,
    },
  ];

  return (
    <section
      ref={containerRef}
      data-screen-label="02 Servicio"
      className="hub-scene relative min-h-screen w-full overflow-hidden"
      style={{ animation: 'tSoftFade 1.6s cubic-bezier(.22,.7,.2,1) both' }}
    >
      {/* Fondo: fundadora escribiendo, difuminada */}
      <div aria-hidden="true" className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={ASSETS.serviceBg}
          className="block h-full w-full object-cover"
          style={{
            objectPosition: '64% 24%',
            filter: 'blur(3px) saturate(.85) brightness(.72)',
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(96deg,#080807 0%,#0e0c0b 18%,rgba(20,17,15,.94) 34%,rgba(24,20,18,.62) 54%,rgba(30,23,19,.28) 78%,rgba(122,76,54,.18) 100%)',
        }}
      />

      {/* Capas decorativas: grid, puntos, ondas */}
      <div
        aria-hidden="true"
        data-px="10"
        className="hub-grid-mask absolute inset-0"
        style={{
          opacity: 0.3,
          backgroundImage:
            'linear-gradient(rgba(221,185,129,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(221,185,129,.1) 1px,transparent 1px)',
          backgroundSize: '120px 120px',
          animation: 'tGridScroll 26s linear infinite',
        }}
      />
      <div
        aria-hidden="true"
        data-px="18"
        className="hub-dots-mask absolute inset-0"
        style={{
          opacity: 0.4,
          backgroundImage:
            'radial-gradient(rgba(244,238,231,.1) 1px,transparent 1px)',
          backgroundSize: '22px 22px',
          animation: 'tSlowDrift 36s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[44vh] overflow-hidden"
        style={{ opacity: 0.3 }}
      >
        <svg
          viewBox="0 0 1600 400"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[200%]"
          style={{ animation: 'tWave 30s linear infinite' }}
        >
          <path
            d="M0 240 C200 170 400 300 800 230 C1200 160 1400 290 1600 220 L1600 400 L0 400 Z"
            fill="none"
            stroke="rgba(215,154,85,.32)"
            strokeWidth="1.5"
          />
          <path
            d="M0 300 C240 240 460 350 800 290 C1140 230 1380 340 1600 280"
            fill="none"
            stroke="rgba(221,185,129,.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Contenido */}
      <div className="relative z-[5] flex min-h-screen flex-col gap-[clamp(20px,3vh,36px)] px-[clamp(20px,5vw,72px)] pb-24 pt-[clamp(84px,10vh,116px)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div
            className="flex max-w-[min(56vw,720px)] flex-col gap-3"
            style={{ animation: 'tFadeUp 1s cubic-bezier(.22,.7,.2,1) both' }}
          >
            <span
              className="text-[10px] uppercase text-amber"
              style={{ letterSpacing: '.24em' }}
            >
              Oportunidad financiera
            </span>
            <h1
              className="m-0 font-serif font-normal text-cream"
              style={{
                fontSize: 'clamp(30px,4vw,58px)',
                lineHeight: 1.06,
                letterSpacing: '-.015em',
                textWrap: 'pretty',
              }}
            >
              {service.name}
            </h1>
            <p
              className="m-0 max-w-[32em] text-muted"
              style={{
                fontSize: 'clamp(14px,1.15vw,17px)',
                lineHeight: 1.65,
                textWrap: 'pretty',
              }}
            >
              {service.desc}
            </p>
          </div>
        </div>

        {/* Acordeones — cerrados por defecto: la informacion nunca se
            muestra toda de una vez. */}
        <div
          className="grid max-w-[min(76vw,1000px)] gap-[clamp(14px,1.6vw,22px)]"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit,minmax(min(100%,330px),1fr))',
            animation: 'tGrowBoard 1.1s cubic-bezier(.22,.75,.2,1) .2s both',
          }}
        >
          {menus.map((m) => {
            const open = openMenu === m.id;
            return (
              <div
                key={m.id}
                className="overflow-hidden rounded-[16px] border border-line"
                style={{
                  background:
                    'linear-gradient(158deg,rgba(58,46,38,.5),rgba(14,12,11,.72))',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: '0 26px 70px rgba(0,0,0,.45)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleMenu(m.id)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center justify-between gap-3.5 border-0 bg-transparent px-[22px] py-5 text-left text-[15px] font-medium text-cream transition-colors duration-200 hover:bg-[rgba(110,68,51,.28)]"
                  style={{ font: 'inherit', letterSpacing: '.01em' }}
                >
                  <span className="flex flex-col gap-[5px]">
                    {m.label}
                    <span className="text-[11px] font-normal text-muted">
                      {m.hint}
                    </span>
                  </span>
                  <span className="flex-none text-[20px] leading-none text-amber">
                    {open ? '−' : '+'}
                  </span>
                </button>

                {open && (
                  <div
                    className="flex flex-col gap-0.5 px-3 pb-3.5"
                    style={{ animation: 'tFadeUp .32s ease both' }}
                  >
                    {m.items.map((it) => (
                      <div
                        key={it}
                        className="flex gap-3 px-2.5 py-[13px] text-[13.5px] leading-[1.6] text-muted"
                        style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}
                      >
                        <span className="mt-2 h-[5px] w-[5px] flex-none rounded-full bg-amber" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="mt-auto flex flex-col gap-[22px]"
          style={{ animation: 'tSoftFade 1.2s ease .5s both' }}
        >
          <button
            type="button"
            onClick={onOpenDiagnostic}
            className="self-start rounded-pill border border-amber px-6 py-[13px] text-[14px] text-cream transition-colors duration-200 hover:bg-[rgba(110,68,51,.32)]"
          >
            Tomémonos un tinto y resolvemos tus inquietudes
          </button>
          <button
            type="button"
            onClick={onBackToHero}
            className="self-start rounded-pill border border-line px-5 py-[13px] text-[14px] text-muted transition-colors duration-200 hover:border-amber hover:text-cream"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
};
