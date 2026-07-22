'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import chapters from '@/data/guide_chapters.json';
import { useGameStore } from '@/store/gameStore';

export default function GuidePage() {
  const router = useRouter();
  const { guideUnlockedAt, setCurrentChapter } = useGameStore();
  const unlocked = Boolean(guideUnlockedAt);

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="fire-h1 text-3xl font-black">Guide Chapters</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {chapters.map((chapter, idx) => {
            const chapterUnlocked = idx === 0 && unlocked;
            return (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  if (!chapterUnlocked) return;
                  setCurrentChapter(chapter.id);
                  router.push('/guide/chapter-1');
                }}
                className="fire-card p-5 text-left disabled:opacity-60"
              >
                <div className="flex items-center justify-between">
                  <h2 className="fire-h1 text-xl font-bold">{chapter.title}</h2>
                  <span className="text-xs text-[#ffd166]">{chapter.duration}</span>
                </div>
                <p className="mt-2 text-sm text-white/70">{chapter.description}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em]">{chapterUnlocked ? 'Unlocked' : 'Locked 72h'}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
