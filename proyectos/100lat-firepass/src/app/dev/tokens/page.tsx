import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const colors = [
  ['fire', '#FF6B35'],
  ['fire-light', '#FFB627'],
  ['fire-dark', '#D94520'],
  ['royal', '#6C3FA0'],
  ['royal-light', '#8B5FBF'],
  ['royal-dark', '#4A2961'],
  ['gold', '#FFD700'],
  ['gold-shine', '#FFF44F'],
  ['gold-dark', '#DAA520'],
  ['magenta', '#FF006E'],
  ['sky', '#00D9FF'],
  ['success', '#4ADE80'],
  ['success-dark', '#22C55E'],
  ['coral', '#FF5252'],
  ['navy', '#1A1A2E'],
  ['navy-800', '#2D2D44'],
  ['cream', '#FFF8F0'],
  ['cream-light', '#F0F0F8'],
  ['ink', '#1C1C1C'],
] as const;

const gradients = [
  ['--grad-levelup', 'linear-gradient(135deg,#FF6B35 0%,#FFB627 50%,#FFD700 100%)'],
  ['--grad-success', 'linear-gradient(135deg,#4ADE80 0%,#00D9FF 100%)'],
  ['--grad-royal', 'linear-gradient(135deg,#6C3FA0 0%,#8B5FBF 100%)'],
  ['--grad-fire', 'linear-gradient(135deg,#FF006E 0%,#FF6B35 100%)'],
  ['--grad-card', 'linear-gradient(135deg,#F0F0F8 0%,#E8E0F5 100%)'],
] as const;

const shadows = [
  ['--shadow-cta', '0 0 20px rgba(255,107,53,.6), 0 8px 16px rgba(0,0,0,.2)'],
  ['--shadow-card', '0 8px 20px rgba(108,63,160,.2)'],
  ['--shadow-card-hover', '0 16px 40px rgba(108,63,160,.4)'],
] as const;

export default function DevTokensPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-[var(--color-navy)] px-6 py-10 text-[var(--color-cream)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">Dev only</p>
          <h1 className="font-display text-4xl font-black">Tokens v2</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Vista de inspección para colores, gradientes, sombras y tipografía.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-extrabold">Colors</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.map(([name, hex]) => (
              <article key={name} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[var(--shadow-card)]">
                <div className="h-24 rounded-2xl border border-white/10" style={{ background: hex }} />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-extrabold">{name}</span>
                  <code className="rounded-full bg-black/20 px-3 py-1 text-xs">{hex}</code>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-extrabold">Gradients</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {gradients.map(([name, value]) => (
              <article key={name} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[var(--shadow-card)]">
                <div className="h-28 rounded-2xl border border-white/10" style={{ background: `var(${name})` }} />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-extrabold">{name}</span>
                  <code className="max-w-[18rem] truncate rounded-full bg-black/20 px-3 py-1 text-xs">{value}</code>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-extrabold">Shadows</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {shadows.map(([name, value]) => (
              <article key={name} className="rounded-3xl bg-[var(--color-cream-light)] p-4 text-[var(--color-ink)]" style={{ boxShadow: `var(${name})` }}>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-[var(--color-cream)] p-4">
                    <p className="font-display text-lg font-extrabold">{name}</p>
                    <p className="text-sm text-black/60">Card shadow sample</p>
                  </div>
                  <code className="block rounded-2xl bg-white/70 p-3 text-xs">{value}</code>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-extrabold">Typography</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-card)]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Nunito</p>
              <p className="mt-3 font-display text-5xl font-extrabold">Nunito 800</p>
              <p className="font-display text-5xl font-black">Nunito 900</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-card)]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Inter</p>
              <p className="mt-3 text-2xl font-normal">Inter 400</p>
              <p className="text-2xl font-semibold">Inter 600</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
