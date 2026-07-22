'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';

export default function Chapter1Page() {
  const router = useRouter();
  const { currentChapter } = useGameStore();
  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto max-w-2xl fire-card p-6">
        <h1 className="fire-h1 text-2xl font-black">Chapter {currentChapter ?? 1}</h1>
        <p className="mt-3 text-white/70">Reader stub listo para la siguiente iteración.</p>
        <button onClick={() => router.push('/guide')} className="btn-glow-green mt-6 rounded-2xl px-4 py-3 font-extrabold text-[#08111d]">Volver</button>
      </div>
    </main>
  );
}
