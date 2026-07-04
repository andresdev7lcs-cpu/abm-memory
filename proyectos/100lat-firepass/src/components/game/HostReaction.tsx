'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Easing } from 'framer-motion';
import { Avatar } from '@/types';

interface HostReactionProps {
  avatar: Avatar | null;
  size?: 'sm' | 'md' | 'lg';
  showBubble?: boolean;
}

// Frases ambientales — rotan solas, sin indicar correcto/incorrecto
const AMBIENT_PHRASES = [
  '¡Vamos allá! 🎯',
  '¿Qué dice la mayoría?',
  '¡Piénsalo bien!',
  '¡Tú puedes! 💪',
  '¡Interesante pregunta!',
  '¿Adivinas? 🤔',
  '¡Confía en ti!',
  '¡La mayoría se equivoca aquí!',
  '¡100 latinos respondieron esto!',
  '¡Siguiente! 🔥',
];

const sizeMap = { sm: 80, md: 100, lg: 120 };

// CSS classes para las 3 variantes de microanimación del presentador
const hostAnimClasses = [
  'animate-host-sway',
  'animate-host-tilt',
  'animate-float',
];

// Ease tipado correctamente para Framer Motion
const EASE: Easing = 'easeInOut';
void EASE; // evita warning de variable no usada

export default function HostReaction({
  avatar,
  size = 'sm',
  showBubble = true,
}: HostReactionProps) {
  const imgSize = sizeMap[size];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [animClass]  = useState(
    () => hostAnimClasses[Math.floor(Math.random() * hostAnimClasses.length)]
  );

  // Rota frases cada 4s para crear ambiente sin revelar nada
  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % AMBIENT_PHRASES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const phrase = AMBIENT_PHRASES[phraseIdx];

  return (
    <div className="flex flex-col items-start gap-1 select-none">
      {showBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={phraseIdx}
            initial={{ opacity: 0, y: -6, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3 }}
            className="speech-bubble ml-3"
          >
            {phrase}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Placeholder del presentador con microanimación CSS */}
      {/* Cuando tengas el asset Lottie/WebM, reemplaza esta img con el componente animado */}
      <img
        src="/images/presenter.png"
        alt="Presentador"
        className={animClass}
        style={{ objectFit: 'contain', width: imgSize, height: imgSize }}
      />
    </div>
  );
}
