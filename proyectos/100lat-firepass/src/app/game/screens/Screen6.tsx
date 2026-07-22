'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

export default function Screen6() {
  const router = useRouter();
  const { guideUnlockedAt, unlockGuide, name } = useGameStore();
  const [status, setStatus] = useState<'idle' | 'ready'>('idle');

  useEffect(() => {
    if (guideUnlockedAt) {
      setStatus('ready');
      return;
    }
    unlockGuide();
    setStatus('ready');
  }, [guideUnlockedAt, unlockGuide]);

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center gap-5">
        <h1 className="fire-h1 text-4xl font-black">Tu guía está lista</h1>
        <p className="text-white/75">{name ? `Listo, ${name}.` : 'Listo.'} El acceso queda abierto ahora.</p>
        <p className="text-sm text-white/50">Estado: {status}</p>
        <Button onClick={() => router.push('/guide')}>Ir a la guía</Button>
      </div>
    </main>
  );
}
