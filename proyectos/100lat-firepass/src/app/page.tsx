'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function HomePage() {
  const router = useRouter();
  const { resetGame } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    resetGame();
  }, [resetGame]);

  const handleStart = () => {
    router.push('/select');
  };

  if (!mounted) return null;

  return (
    <main className="stage-bg min-h-dvh flex flex-col items-center justify-center px-6 py-10 screen-enter">

      {/* Hero content */}
      <div className="flex flex-col items-center text-center max-w-md">

        {/* Presenter image */}
        <motion.img
          src="/images/presenter.png"
          alt="Presentador"
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
          className="object-contain mb-6 animate-float"
          style={{ width: 120, height: 120 }}
        />

        {/* Logo badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-bold text-brand-gold tracking-widest uppercase mb-4"
        >
          FIRE PASS™
        </motion.span>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-3xl font-extrabold text-white leading-tight mb-3"
        >
          100 Latinos en USA dijeron…
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-white/80 mb-8"
        >
          ¿Estás dentro del promedio… o dentro del 1%?
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="btn-glow-green w-full rounded-2xl py-4 font-extrabold text-white text-lg mb-6"
        >
          ¡JUGAR AHORA! →
        </motion.button>

        {/* Bottom copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/40 text-xs leading-relaxed"
        >
          10 preguntas · 30 segundos c/u · Descubre qué tan preparado estás para tu futuro financiero
        </motion.p>
      </div>

    </main>
  );
}
