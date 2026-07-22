'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Charlie from '@/components/avatars/Charlie';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { isWin } from '@/lib/quiz';

export default function Screen4() {
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
    if (isWin(score)) {
      router.push('/game/screen5');
    }
  }, [router, score]);

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <Charlie />
          <h1 className="fire-h1 text-3xl font-black leading-tight">No es tu culpa.<br />Nadie nos enseñó esto.</h1>
        </div>
        <div className="fire-card rounded-2xl px-5 py-6 text-center">
          <p className="text-sm text-white/70">Con los hábitos financieros promedio, los latinos dejan de acumular hasta</p>
          <p className="my-2 text-4xl font-black text-[var(--color-gold)]">$340,000</p>
          <p className="text-sm text-white/70">para su retiro</p>
        </div>
        <Button variant="gold" onClick={() => router.push('/game/screen6')}>
          QUIERO MI GUÍA GRATUITA →
        </Button>
        <p className="text-center text-xs text-white/40">La guía que el 90% no llega a ver · gratis por 72 horas</p>
      </div>
    </main>
  );
}
