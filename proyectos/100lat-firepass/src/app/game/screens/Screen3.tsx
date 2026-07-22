'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Timer from '@/components/ui/Timer';
import { useGameStore } from '@/store/gameStore';
import { buildQuizSession, type SessionQuestion } from '@/lib/quiz';

type Phase = 'showing' | 'locked' | 'reaction' | 'advance';

const TIME_LIMIT = 20;

export default function Screen3() {
  const router = useRouter();
  const { email, score, setScore, addAnswer, setQuizSession } = useGameStore();
  const [session] = useState(() => buildQuizSession(email || 'fire-pass'));
  const [questions] = useState<SessionQuestion[]>(() => session.questions);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('showing');
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hiddenIndexes, setHiddenIndexes] = useState<number[]>([]);
  const [hintShown, setHintShown] = useState(false);
  const [lifelines, setLifelines] = useState({ fifty: false, hint: false });

  useEffect(() => {
    setQuizSession({ questionIds: questions.map((question) => question.id), variant: session.variant });
  }, [questions, session.variant, setQuizSession]);

  useEffect(() => {
    if (phase !== 'showing') return;
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => (value <= 1 ? 0 : value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase === 'showing' && secondsLeft === 0) {
      handleChoice(-1);
    }
  }, [phase, secondsLeft]);

  const question = questions[index];
  function startReaction(nextSelectedIndex: number) {
    if (!question) return;
    const correct = nextSelectedIndex === question.correctIndex;
    setSelectedIndex(nextSelectedIndex);
    setPhase('locked');
    addAnswer(question.id, String(nextSelectedIndex));
    setScore(correct ? score + 1 : score);
    window.setTimeout(() => {
      setPhase('reaction');
      window.setTimeout(() => {
        if (index >= questions.length - 1) {
          router.push('/game/screen4');
          return;
        }
        setIndex((value) => value + 1);
        setSelectedIndex(null);
        setHiddenIndexes([]);
        setHintShown(false);
        setSecondsLeft(TIME_LIMIT);
        setPhase('showing');
      }, 1400);
    }, 80);
  }

  function handleChoice(choiceIndex: number) {
    if (phase !== 'showing') return;
    startReaction(choiceIndex);
  }

  if (!question) {
    return null;
  }

  return (
    <main className="min-h-dvh stage-bg px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col justify-between gap-5">
        <header className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
            Pregunta {index + 1} de 10
          </p>
          <Timer seconds={TIME_LIMIT} isRunning={phase === 'showing'} onTimeUp={() => handleChoice(-1)} />
        </header>
        <section className="space-y-5">
          <p className="fire-h1 min-h-[6rem] text-3xl font-black leading-tight">{question.resolvedText}</p>
          <div className="space-y-3">
            {question.resolvedOptions.map((option, optionIndex) => (
              <button
                key={option}
                disabled={phase !== 'showing' || hiddenIndexes.includes(optionIndex)}
                onClick={() => handleChoice(optionIndex)}
                className={`fire-card w-full rounded-2xl px-4 py-4 text-left text-base font-semibold text-white transition ${
                  hiddenIndexes.includes(optionIndex) ? 'opacity-30' : ''
                } ${selectedIndex === optionIndex ? 'ring-2 ring-[var(--color-gold)]' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
          {hintShown ? <p className="fire-card-soft p-4 text-sm text-white/80">{question.hint}</p> : null}
        </section>
        <section className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="md"
            fullWidth={false}
            disabled={lifelines.fifty || phase !== 'showing'}
            onClick={() => {
              const wrongIndexes = question.resolvedOptions
                .map((_, optionIndex) => optionIndex)
                .filter((optionIndex) => optionIndex !== question.correctIndex);
              setHiddenIndexes(wrongIndexes.slice(0, 2));
              setLifelines((state) => ({ ...state, fifty: true }));
            }}
          >
            50/50
          </Button>
          <Button
            variant="outline"
            size="md"
            fullWidth={false}
            disabled={lifelines.hint || phase !== 'showing'}
            onClick={() => {
              setHintShown(true);
              setLifelines((state) => ({ ...state, hint: true }));
            }}
          >
            Pista
          </Button>
        </section>
      </div>
    </main>
  );
}
