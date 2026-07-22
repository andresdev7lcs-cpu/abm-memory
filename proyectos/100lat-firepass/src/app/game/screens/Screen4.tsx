'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        <h1 className="fire-h1 text-4xl font-black">Resultado bajo</h1>
        <p className="text-white/75">Terminaste el quiz. La guía ya puede abrirse.</p>
        <Button onClick={() => router.push('/game/screen6')}>Abrir guía</Button>
      </div>
    </main>
  );
}
