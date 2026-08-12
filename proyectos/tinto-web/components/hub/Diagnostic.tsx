'use client';

import { STEPS } from '@/lib/hub-content';
import { TintoMark } from './TintoMark';

interface DiagnosticProps {
  step: number;
  answers: Record<string, string>;
  consent: boolean;
  done: boolean;
  onPick: (key: string, value: string) => void;
  onToggleConsent: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const FIELD_STYLE = {
  minHeight: 44,
  fontSize: 15,
  background: 'rgba(14,12,11,.7)',
  border: '1px solid rgba(255,255,255,.16)',
  borderRadius: 11,
  color: 'var(--p-cream)',
  padding: '0 14px',
  width: '100%',
} as const;

export const Diagnostic = ({
  step,
  answers,
  consent,
  done,
  onPick,
  onToggleConsent,
  onNext,
  onPrev,
  onClose,
}: DiagnosticProps) => {
  const current = STEPS[step];

  // Validacion por paso: "Continuar" no se habilita hasta que hay respuesta.
  let nextDisabled = false;
  if (current.kind === 'choice') nextDisabled = !answers[current.id];
  if (current.kind === 'area') nextDisabled = !(answers.situation ?? '').trim();
  if (current.kind === 'text')
    nextDisabled =
      !(answers.name ?? '').trim() || !(answers.email ?? '').trim();
  if (current.kind === 'consent') nextDisabled = !consent;

  return (
    <section
      data-screen-label="03 Diagnóstico"
      className="hub-scene relative z-[7] flex min-h-screen justify-center px-[clamp(20px,5vw,72px)] pb-[130px] pt-[clamp(84px,9vh,116px)]"
      style={{
        alignItems: 'flex-start',
        background: 'linear-gradient(150deg,#080807,#171310 58%,#33241b)',
        animation: 'tFade .5s ease both',
      }}
    >
      <div
        className="flex w-[min(620px,100%)] flex-col gap-6 rounded-[22px] border border-line p-[clamp(24px,3.2vw,40px)]"
        style={{
          background:
            'linear-gradient(160deg,rgba(58,46,38,.6),rgba(14,12,11,.9))',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 40px 100px rgba(0,0,0,.55)',
        }}
      >
        {done ? (
          <div
            className="flex flex-col items-start gap-4"
            style={{ animation: 'tFadeUp .5s ease both' }}
          >
            <div className="relative grid h-[66px] w-[66px] place-items-center">
              <div
                className="absolute -inset-[22%] rounded-full blur-[20px]"
                style={{
                  background:
                    'radial-gradient(circle,rgba(215,154,85,.5),transparent 68%)',
                  animation: 'tGlow 3.4s ease-in-out infinite',
                }}
              />
              <TintoMark />
            </div>
            <h2
              className="m-0 font-serif font-normal text-cream"
              style={{ fontSize: 'clamp(22px,2.4vw,30px)', lineHeight: 1.2 }}
            >
              Gracias. Revisaremos tu situación antes de proponerte el siguiente
              paso.
            </h2>
            <p className="m-0 text-[14px] leading-[1.65] text-muted">
              Ninguna respuesta se evalúa de forma automática. Una persona leerá
              lo que compartiste.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-pill border border-line px-5 py-3 text-[14px] text-muted transition-colors duration-200 hover:border-amber hover:text-cream"
            >
              Volver al servicio
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-[10px] uppercase text-gold-soft"
                  style={{ letterSpacing: '.2em' }}
                >
                  Paso {step + 1} de {STEPS.length}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-pill border border-line px-3 py-1.5 text-[12px] text-muted transition-colors duration-200 hover:border-amber hover:text-cream"
                >
                  Cerrar
                </button>
              </div>
              <div
                className="h-0.5 overflow-hidden rounded-sm"
                style={{ background: 'rgba(255,255,255,.1)' }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${Math.round(((step + 1) / STEPS.length) * 100)}%`,
                    background:
                      'linear-gradient(90deg,var(--p-coffee),var(--p-amber))',
                    transition: 'width .45s cubic-bezier(.2,.7,.2,1)',
                  }}
                />
              </div>
            </div>

            <h2
              className="m-0 font-serif font-normal text-cream"
              style={{
                fontSize: 'clamp(22px,2.4vw,30px)',
                lineHeight: 1.22,
                textWrap: 'pretty',
              }}
            >
              {current.q}
            </h2>

            {current.kind === 'choice' && (
              <div className="flex flex-col gap-2.5">
                {(current.options ?? []).map((opt) => {
                  const on = answers[current.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onPick(current.id, opt)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border px-[18px] py-[15px] text-left text-[15px] text-cream hover:border-amber"
                      style={{
                        font: 'inherit',
                        transition: 'border-color .22s, background .22s',
                        borderColor: on
                          ? 'var(--p-amber)'
                          : 'rgba(255,255,255,0.12)',
                        background: on
                          ? 'rgba(110,68,51,0.34)'
                          : 'rgba(14,12,11,0.55)',
                      }}
                    >
                      <span
                        className="grid h-3.5 w-3.5 flex-none place-items-center rounded-full"
                        style={{ border: '1px solid rgba(221,185,129,.6)' }}
                      >
                        <span
                          className="h-[7px] w-[7px] rounded-full"
                          style={{
                            transition: 'background .2s',
                            background: on ? 'var(--p-amber)' : 'transparent',
                          }}
                        />
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {current.kind === 'text' && (
              <div className="flex flex-col gap-3.5">
                {(current.fields ?? []).map((f) => (
                  <label
                    key={f.key}
                    className="flex flex-col gap-[7px] text-[11px] text-muted"
                    style={{ letterSpacing: '.12em' }}
                  >
                    {f.label}
                    <input
                      type="text"
                      value={answers[f.key] ?? ''}
                      onChange={(e) => onPick(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={FIELD_STYLE}
                    />
                  </label>
                ))}
              </div>
            )}

            {current.kind === 'area' && (
              <textarea
                rows={4}
                value={answers.situation ?? ''}
                onChange={(e) => onPick('situation', e.target.value)}
                placeholder="Escribe con tus palabras la decisión que tienes frente a ti."
                style={{
                  ...FIELD_STYLE,
                  minHeight: undefined,
                  lineHeight: 1.6,
                  padding: 14,
                  resize: 'vertical',
                }}
              />
            )}

            {current.kind === 'consent' && (
              <button
                type="button"
                onClick={onToggleConsent}
                aria-pressed={consent}
                className="flex cursor-pointer items-start gap-3 rounded-xl px-[18px] py-4 text-left text-[14px] leading-[1.6] text-muted hover:border-amber"
                style={{
                  font: 'inherit',
                  background: 'rgba(14,12,11,0.55)',
                  transition: 'border-color .22s',
                  border: `1px solid ${
                    consent ? 'var(--p-amber)' : 'rgba(255,255,255,0.12)'
                  }`,
                }}
              >
                <span
                  className="mt-0.5 grid h-4 w-4 flex-none place-items-center rounded"
                  style={{
                    border: '1px solid rgba(221,185,129,0.6)',
                    fontSize: 11,
                    color: '#0b0a09',
                    background: consent ? 'var(--p-amber)' : 'transparent',
                  }}
                >
                  {consent ? '✓' : ''}
                </span>
                Autorizo a TINTO a contactarme para dar seguimiento a esta
                conversación. No recibiré promesas de resultado ni evaluación
                automática.
              </button>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="rounded-pill border border-amber px-6 py-[13px] text-[14px] text-cream transition-colors duration-200 hover:bg-[rgba(110,68,51,.32)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                {step >= STEPS.length - 1 ? 'Enviar' : 'Continuar'}
              </button>
              {step > 0 && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="rounded-pill border border-line px-[18px] py-[13px] text-[14px] text-muted transition-colors duration-200 hover:border-amber hover:text-cream"
                >
                  Atrás
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
