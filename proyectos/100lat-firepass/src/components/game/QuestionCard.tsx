'use client';

import { motion } from 'framer-motion';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        bg-brand-blue rounded-3xl p-6
        text-white shadow-lg
      "
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold mb-3">
        100 Latinos dijeron…
      </p>
      <p className="text-lg font-semibold leading-snug">
        {question.text}
      </p>
    </motion.div>
  );
}
