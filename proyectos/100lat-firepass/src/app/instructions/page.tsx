'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

const rules = [
  { icon: '📋', text: 'Responderás 10 preguntas.' },
  { icon: '⏱️', text: 'Tienes 30 segundos por pregunta.' },
  { icon: '🤫', text: 'No sabrás cuáles acertaste hasta el final.' },
  { icon: '🔑', text: 'Solo 10/10 desbloquea la Fórmula Especial.' },
];

export default function InstructionsPage() {
  const router = useRouter();
  const avatar = useGameStore((s) => s.avatar);

  return (
    <main className="stage-bg min-h-dvh flex flex-col px-5 py-6 screen-enter">

      {/* Presenter + speech */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-end gap-3 mb-5">
        <div className="flex flex-col items-start gap-1">
          <div className="speech-bubble">¡Ya casi comenzamos!</div>
          <img src="/images/presenter.png" alt="Presentador"
               className="object-contain animate-float" style={{ width: 80, height: 80 }} />
        </div>
        <div className="flex-1 pb-2">
          <span className="text-xs font-bold text-brand-gold tracking-widest uppercase">FIRE PASS™</span>
          <h1 className="text-xl font-extrabold text-white mt-0.5 leading-tight">¿Cómo funciona?</h1>
          <p className="text-white/40 text-xs mt-0.5">Lee bien antes de empezar</p>
        </div>
      </motion.div>

      {/* Rules */}
      <div className="flex flex-col gap-2.5 flex-1">
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-xl flex-shrink-0">{rule.icon}</span>
            <p className="text-white font-medium text-sm leading-snug">{rule.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Prize teaser */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="my-4 rounded-2xl px-4 py-3 text-center"
        style={{ background: 'rgba(241,196,15,0.1)', border: '1px solid rgba(241,196,15,0.3)' }}
      >
        <p className="text-brand-gold font-semibold text-sm">
          🏆 Solo 10/10 desbloquea la{' '}
          <span className="font-extrabold">Fórmula FIRE PASS™</span>
        </p>
      </motion.div>

      {/* CTA */}
      <button
        onClick={() => router.push('/game')}
        className="btn-glow-green w-full rounded-2xl py-3.5 font-extrabold text-white text-base"
      >
        ¡Empezar el juego! 🎯
      </button>
    </main>
  );
}
