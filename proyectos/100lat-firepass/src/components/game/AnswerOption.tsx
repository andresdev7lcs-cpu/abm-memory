'use client';

import { motion } from 'framer-motion';

interface AnswerOptionProps {
  label: string;
  text: string;
  onClick: () => void;
  disabled: boolean;
  index: number;
}

const colorMap: Record<string, string> = {
  A: 'answer-a',
  B: 'answer-b',
  C: 'answer-c',
  D: 'answer-d',
};

export default function AnswerOption({ label, text, onClick, disabled, index }: AnswerOptionProps) {
  const colorClass = colorMap[label] ?? 'answer-a';
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: 'backOut' }}
      whileTap={disabled ? {} : { scale: 0.97, y: 3 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 ${colorClass} rounded-2xl px-3 py-2.5 text-left disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center font-extrabold text-white text-sm shadow-inner">
        {label}
      </span>
      <span className="font-bold text-white text-sm leading-snug flex-1">
        {text}
      </span>
    </motion.button>
  );
}
