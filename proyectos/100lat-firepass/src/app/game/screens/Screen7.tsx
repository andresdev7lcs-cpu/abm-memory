'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Gloria from '@/components/avatars/Gloria';
import { useGameStore } from '@/store/gameStore';

export default function Screen7() {
  const router = useRouter();
  const { score, calculateSegment, unlockGuide } = useGameStore();
  const segment = calculateSegment(score);

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-5">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Gloria />
          <p className="fire-h1 mt-4 text-5xl font-black">{score}/7</p>
          <p className="mt-2 text-lg text-white/70">{segment} profile</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            unlockGuide();
            router.push('/guide');
          }}
          className="btn-glow-green rounded-2xl px-4 py-3 font-extrabold text-[#08111d]"
        >
          Desbloquear Guía 72h
        </motion.button>
      </div>
    </main>
  );
}
