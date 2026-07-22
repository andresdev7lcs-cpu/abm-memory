'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Charlie from '@/components/avatars/Charlie';
import { useGameStore } from '@/store/gameStore';

export default function Screen2() {
  const router = useRouter();
  const { setCurrentScreen } = useGameStore();

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <Charlie />
          <p className="fire-card-soft p-4 text-sm text-white/80">
            Vas a responder 7 preguntas sobre finanzas. Cada respuesta suma puntos. Al final, unlock guía 72h.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            setCurrentScreen(3);
            router.push('/game/screen3');
          }}
          className="btn-glow-green rounded-2xl px-4 py-3 font-extrabold text-[#08111d]"
        >
          Empezar
        </motion.button>
      </div>
    </main>
  );
}
