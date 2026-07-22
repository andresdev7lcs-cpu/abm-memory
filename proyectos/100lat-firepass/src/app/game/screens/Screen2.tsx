'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Charlie from '@/components/avatars/Charlie';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

const RULES = [
  { icon: '⏱️', text: '20 segundos por pregunta' },
  { icon: '🎯', text: '10 preguntas, sin segundas oportunidades' },
  { icon: '🛟', text: '2 comodines: 50/50 y una pista de Charlie' },
];

export default function Screen2() {
  const router = useRouter();
  const { name, setCurrentScreen } = useGameStore();

  useEffect(() => {
    if (!name) {
      router.replace('/');
    }
  }, [name, router]);

  if (!name) return null;

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 text-center">
          <Charlie />
          <h1 className="fire-h1 text-2xl font-black">Las reglas son simples, {name}:</h1>
        </motion.div>
        <div className="space-y-3">
          {RULES.map((rule, i) => (
            <motion.div
              key={rule.text}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="fire-card flex items-center gap-3 rounded-2xl px-4 py-4"
            >
              <span className="text-2xl">{rule.icon}</span>
              <span className="text-base font-medium text-white">{rule.text}</span>
            </motion.div>
          ))}
        </div>
        <Button
          onClick={() => {
            setCurrentScreen(3);
            router.push('/game/screen3');
          }}
        >
          ESTOY LISTO →
        </Button>
      </div>
    </main>
  );
}
