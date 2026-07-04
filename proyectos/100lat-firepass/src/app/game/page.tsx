'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { questions } from '@/lib/questions';
import Timer from '@/components/ui/Timer';
import AnswerOption from '@/components/game/AnswerOption';
import HostReaction from '@/components/game/HostReaction';

const LABELS = ['A', 'B', 'C', 'D'];
const QUESTION_TIME = 20;

export default function GamePage() {
  const router = useRouter();
  const { avatar, currentQuestion, score, submitAnswer, nextQuestion, finishGame } = useGameStore();

  const [answered,     setAnswered]     = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const timerKeyRef = useRef(0);

  const question    = questions[currentQuestion];
  const isLastQ     = currentQuestion === questions.length - 1;
  const questionNum = currentQuestion + 1;

  const advance = useCallback(() => {
    if (isLastQ) { finishGame(score); router.push('/results'); }
    else {
      nextQuestion();
      setAnswered(false);
      setTimerRunning(true);
      timerKeyRef.current += 1;
    }
  }, [isLastQ, finishGame, score, nextQuestion, router]);

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setAnswered(true);
    setTimerRunning(false);
    const correct = idx === question.correctIndex;
    submitAnswer(currentQuestion, idx, correct);
    // Sin feedback de correcto/incorrecto — solo avanza
    setTimeout(advance, 900);
  }, [answered, question, currentQuestion, submitAnswer, advance]);

  const handleTimeUp = useCallback(() => {
    if (answered) return;
    handleAnswer(-1);
  }, [answered, handleAnswer]);

  useEffect(() => { if (!avatar) router.replace('/'); }, [avatar, router]);
  if (!question) return null;

  return (
    <main className="stage-bg min-h-dvh flex flex-col px-4 pt-4 pb-5 screen-enter">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Pregunta</span>
          <div className="flex items-baseline gap-1">
            <span className="text-brand-gold font-extrabold text-2xl leading-none">{questionNum}</span>
            <span className="text-white/30 text-sm">/ {questions.length}</span>
          </div>
        </div>
        <Timer key={timerKeyRef.current} seconds={QUESTION_TIME} onTimeUp={handleTimeUp} isRunning={timerRunning} />
      </div>

      {/* Host ambient + player character */}
      <div className="flex items-end gap-3 mb-4">
        <HostReaction avatar={avatar} size="sm" showBubble />
        <motion.img
          key={avatar}
          src={avatar === 'female' ? '/images/woman.png' : '/images/man.png'}
          alt="Tu personaje"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="object-contain self-end"
          style={{ width: 58, height: 58 }}
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}
          className="rounded-2xl px-4 py-4 mb-4"
          style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          <p className="text-white font-bold text-base text-center leading-snug">{question.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* 2×2 answer grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {question.options.map((opt, i) => (
          <AnswerOption key={i} label={LABELS[i]} text={opt} index={i}
            onClick={() => handleAnswer(i)} disabled={answered} />
        ))}
      </div>

    </main>
  );
}
