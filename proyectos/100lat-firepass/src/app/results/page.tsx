'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getSegment } from '@/types';
import { saveLead } from '@/lib/supabase';

// ─── Textos finales (ajustar cuando el cliente defina copy final) ────────────
const TIER_CONFIG = {
  low: {
    emoji: '💪',
    title: '¡No te rindas!',
    subtitle: 'Cada intento te acerca más al 1%.',
    body: 'Esta vez no fue tu día… pero la Fórmula FIRE PASS™ está esperando.',
    scoreColor: '#e06060',
    bg: 'rgba(224,96,96,0.1)',
    border: 'rgba(224,96,96,0.3)',
  },
  medium: {
    emoji: '📥',
    title: '¡Buen intento!',
    subtitle: 'Podrías estar dejando dinero sobre la mesa.',
    body: 'Descarga tu guía gratuita y descubre lo que el 1% ya sabe.',
    scoreColor: '#F1C40F',
    bg: 'rgba(241,196,15,0.1)',
    border: 'rgba(241,196,15,0.3)',
  },
  high: {
    emoji: '🏆',
    title: '¡Eres del 1%!',
    subtitle: 'Has desbloqueado la Fórmula FIRE PASS™',
    body: 'Muy pocos llegan aquí. Un especialista quiere hablar contigo personalmente.',
    scoreColor: '#2ECC71',
    bg: 'rgba(46,204,113,0.1)',
    border: 'rgba(46,204,113,0.3)',
  },
};

export default function ResultsPage() {
  const router = useRouter();
  const { score, avatar, userName, leadSubmitted, setLeadData, setLeadSubmitted, resetGame } = useGameStore();

  const segment = getSegment(score);
  const tier    = TIER_CONFIG[segment];

  const [name,      setName]      = useState(userName || '');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(leadSubmitted);
  const confettiRef = useRef(false);

  useEffect(() => {
    if (score === 10 && !confettiRef.current) {
      confettiRef.current = true;
      import('canvas-confetti').then((mod) => {
        mod.default({
          particleCount: 280, spread: 90, origin: { y: 0.35 },
          colors: ['#2ECC71', '#F1C40F', '#1D3557', '#ffffff', '#E91E8C'],
        });
      });
    }
  }, [score]);

  useEffect(() => { if (!avatar) router.replace('/'); }, [avatar, router]);

  const handleRetry = () => { resetGame(); router.push('/'); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setFormError('El correo es obligatorio.'); return; }
    setLoading(true);
    setFormError('');
    setLeadData(name || 'Invitado', email, phone);
    const { error } = await saveLead({ name: name || 'Invitado', email, phone, score, segment, avatar });
    setLoading(false);
    if (error) { setFormError('Hubo un problema. Intenta de nuevo.'); return; }
    setLeadSubmitted();
    setSubmitted(true);
  };

  const handleCta = () => {
    if (segment === 'medium') {
      // ← reemplazar con URL real del PDF cuando esté listo
      window.open('/downloads/guia-fire-pass.pdf', '_blank');
    }
    if (segment === 'high') {
      // ← reemplazar con link real de Calendly u otra herramienta
      window.open('https://calendly.com/TU-LINK-AQUI', '_blank');
    }
  };

  const ctaLabel = segment === 'high'
    ? 'Agendar llamada con un especialista'
    : 'Descargar guía gratuita (PDF)';

  const ctaBtnClass = segment === 'high' ? 'btn-cta-gold' : 'btn-glow-green';

  return (
    <main className="stage-bg min-h-dvh flex flex-col screen-enter">

      {/* Score hero */}
      <div className="flex flex-col items-center pt-8 pb-10 px-6">
        <motion.img
          src="/images/presenter.png" alt="Presentador"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'backOut' }}
          className="object-contain mb-3 animate-float" style={{ width: 80, height: 80 }}
        />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
          <motion.p className="text-5xl mb-2" initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 220 }}>
            {tier.emoji}
          </motion.p>

          <motion.p
            className="font-extrabold tabular-nums"
            style={{ fontSize: '5rem', color: tier.scoreColor, lineHeight: 1, textShadow: `0 0 30px ${tier.scoreColor}88` }}
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 160 }}
          >
            {score}<span className="text-2xl text-white/40">/10</span>
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-2 inline-block px-4 py-1 rounded-full text-xs font-bold"
            style={{ background: tier.bg, border: `1.5px solid ${tier.border}`, color: tier.scoreColor }}>
            {tier.title}
          </motion.div>

          <p className="mt-3 text-white/75 font-medium text-sm leading-snug px-4 max-w-xs mx-auto">
            {tier.subtitle}
          </p>
        </motion.div>
      </div>

      {/* White card */}
      <div className="-mt-6 bg-white rounded-t-3xl px-5 pt-6 pb-10 flex-1">

        {/* ── TIER LOW — solo reintentar ── */}
        {segment === 'low' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5 pt-2">
            <p className="text-brand-blue font-extrabold text-lg text-center">{tier.body}</p>
            <p className="text-gray-400 text-sm text-center">¿Te atreves a volver a intentarlo?</p>
            <div className="w-full rounded-2xl px-4 py-3 text-center"
              style={{ background: 'rgba(224,96,96,0.08)', border: '1.5px solid rgba(224,96,96,0.2)' }}>
              <p className="text-gray-500 text-sm">
                Tu puntuación: <span className="font-extrabold" style={{ color: tier.scoreColor }}>{score}/10</span>
              </p>
            </div>
            <button onClick={handleRetry}
              className="btn-glow-green w-full rounded-2xl py-4 font-extrabold text-white text-base">
              🔄 Volver a intentarlo
            </button>
          </motion.div>
        )}

        {/* ── TIERS MEDIUM & HIGH — formulario → CTA ── */}
        {(segment === 'medium' || segment === 'high') && (
          <>
            {!submitted ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-lg font-extrabold text-brand-blue mb-1">
                  {segment === 'high' ? '¡Desbloquea tu acceso!' : '¡Tu guía te está esperando!'}
                </h2>
                <p className="text-gray-400 text-xs mb-4">{tier.body}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-brand-blue block mb-1">Tu nombre</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="María García"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-brand-blue font-medium text-sm focus:border-brand-green outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-blue block mb-1">Correo electrónico *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="maria@email.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-brand-blue font-medium text-sm focus:border-brand-green outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-blue block mb-1">
                      Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-brand-blue font-medium text-sm focus:border-brand-green outline-none transition-colors" />
                  </div>

                  {formError && <p className="text-red-500 text-xs">{formError}</p>}

                  <button type="submit" disabled={loading}
                    className={`${ctaBtnClass} w-full rounded-2xl py-3.5 font-extrabold text-white text-sm disabled:opacity-50`}>
                    {loading ? 'Enviando…' : `${ctaLabel} →`}
                  </button>
                  <p className="text-gray-400 text-xs text-center">Sin spam. Tus datos están seguros.</p>
                </form>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-4">
                <motion.span className="text-5xl" initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                  {segment === 'high' ? '🏆' : '📥'}
                </motion.span>
                <h2 className="text-xl font-extrabold text-brand-blue">
                  {segment === 'high' ? '¡Acceso desbloqueado!' : '¡Listo! Revisa tu correo.'}
                </h2>
                <p className="text-gray-500 text-sm">
                  {segment === 'high'
                    ? 'Agenda tu llamada con un especialista ahora.'
                    : 'En breve recibirás tu guía personalizada.'}
                </p>
                <div className="bg-gray-50 rounded-2xl p-4 w-full text-left">
                  <p className="text-xs text-gray-400 mb-1">Tu puntuación</p>
                  <p className="text-2xl font-extrabold text-brand-blue">
                    {score}/10 — <span style={{ color: tier.scoreColor }}>{tier.title}</span>
                  </p>
                </div>
                <button onClick={handleCta}
                  className={`${ctaBtnClass} w-full rounded-2xl py-3.5 font-extrabold text-white text-sm`}>
                  {ctaLabel} →
                </button>
                <button onClick={() => { resetGame(); router.push('/'); }}
                  className="w-full rounded-2xl py-3 font-bold text-brand-blue border-2 border-brand-blue/20 text-sm">
                  Jugar de nuevo
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
