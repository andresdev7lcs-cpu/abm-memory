'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import Charlie from '@/components/avatars/Charlie';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { isWin } from '@/lib/quiz';

export default function Screen5() {
  const router = useRouter();
  const { score, completeQuiz, email } = useGameStore();

  useEffect(() => {
    completeQuiz({ score });
    void fetch('/api/guide/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }, [completeQuiz, email, score]);

  useEffect(() => {
    if (!isWin(score)) {
      router.push('/game/screen4');
      return;
    }
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });
    const timer = window.setTimeout(() => {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [router, score]);

  if (!isWin(score)) return null;

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col items-center justify-center gap-5 text-center">
        <Charlie />
        <p className="text-5xl font-black text-[var(--color-gold)]">{score}/10</p>
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-gold)] text-sm font-black text-[var(--color-navy)]">
          TOP 10%
        </div>
        <h1 className="fire-h1 text-3xl font-black">¡Eres del 10% que lo sabe!</h1>
        <p className="text-white/75">Ahora descubre cómo usar lo que sabes para cambiar tu futuro financiero</p>
        <Button variant="gold" onClick={() => router.push('/game/screen6')}>
          QUIERO MI GUÍA GRATUITA →
        </Button>
      </div>
    </main>
  );
}
