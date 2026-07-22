'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Charlie from '@/components/avatars/Charlie';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

const PREVIEW = [
  { icon: '📖', text: '7 capítulos' },
  { icon: '🏅', text: '7 insignias' },
  { icon: '⏱️', text: '10 min por capítulo' },
];

export default function Screen6() {
  const router = useRouter();
  const { guideUnlockedAt, unlockGuide, name } = useGameStore();

  useEffect(() => {
    if (!guideUnlockedAt) unlockGuide();
  }, [guideUnlockedAt, unlockGuide]);

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-5">
        <div className="fire-card-soft rounded-2xl px-4 py-2 text-center text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-coral)]">
          Acceso por 72 horas
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <Charlie />
          <h1 className="fire-h1 text-2xl font-black">Tu guía está lista, {name || 'campeón'}.</h1>
          <p className="text-white/75">Tienes 72 horas de acceso.</p>
        </div>
        <div className="space-y-3">
          {PREVIEW.map((item) => (
            <div key={item.text} className="fire-card flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium text-white">{item.text}</span>
            </div>
          ))}
        </div>
        <Button variant="gold" onClick={() => router.push('/guide')}>
          ACCEDER AHORA →
        </Button>
      </div>
    </main>
  );
}
