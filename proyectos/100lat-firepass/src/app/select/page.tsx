'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Avatar } from '@/types';
import type { ChangeEvent } from 'react';

const characters: { id: Avatar; img: string; label: string; emoji: string }[] = [
  { id: 'male',   img: '/images/man-stage.png', label: 'HOMBRE', emoji: '🧔' },
  { id: 'female', img: '/images/woman.png',     label: 'MUJER',  emoji: '👩' },
];

export default function SelectPage() {
  const router = useRouter();
  const { setAvatar, setLeadData } = useGameStore();
  const [selected, setSelected] = useState<Avatar | null>(null);
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    if (!selected) return;
    setAvatar(selected);
    if (playerName.trim()) setLeadData(playerName.trim(), '', '');
    router.push('/instructions');
  };

  return (
    <main className="stage-bg min-h-dvh flex flex-col px-5 py-8 screen-enter">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-5">
        <span className="text-xs font-bold text-brand-gold tracking-widest uppercase">FIRE PASS™</span>
        <h1 className="text-2xl font-extrabold text-white mt-1 leading-tight">
          ¿Quién sabe más de dinero?
        </h1>
        <p className="text-white/50 text-sm mt-1">Elige tu personaje</p>
      </motion.div>

      {/* Character cards */}
      <div className="flex gap-4 flex-1 items-center justify-center">
        {characters.map((char, i) => (
          <motion.button
            key={char.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(char.id)}
            className={`relative flex-1 flex flex-col items-center rounded-3xl overflow-hidden transition-all duration-200 ${
              selected === char.id
                ? 'ring-4 ring-brand-gold scale-[1.03] shadow-[0_0_30px_rgba(241,196,15,0.5)]'
                : 'ring-2 ring-white/20'
            }`}
            style={{
              minHeight: 210,
              background: selected === char.id
                ? 'linear-gradient(160deg, rgba(241,196,15,0.2) 0%, rgba(241,196,15,0.05) 100%)'
                : 'rgba(255,255,255,0.06)',
            }}
          >
            {/* Top badge */}
            <div className={`w-full py-2 text-center font-extrabold text-xs tracking-widest ${
              selected === char.id ? 'bg-brand-gold text-brand-blue' : 'bg-white/10 text-white/80'
            }`}>
              {char.label}
            </div>

            {/* Character image */}
            <div className="flex-1 flex items-end justify-center w-full px-2 pt-2">
              <img src={char.img} alt={char.label}
                   className={`object-contain object-bottom w-full ${selected === char.id ? 'animate-float' : ''}`}
                   style={{ height: 150 }} />
            </div>

            {/* Bottom status */}
            <div className={`w-full py-2 text-center font-bold text-xs ${
              selected === char.id ? 'bg-brand-gold text-brand-blue' : 'bg-white/10 text-white/60'
            }`}>
              {selected === char.id ? '✓ SELECCIONADO' : 'TOCA PARA ELEGIR'}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="mt-5 flex flex-col gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <input
            type="text"
            value={playerName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
            placeholder="¿Cómo te llamas? (opcional)"
            className="w-full rounded-2xl px-4 py-3 font-semibold text-sm outline-none placeholder:text-white/30"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={handleStart} disabled={!selected}
          className="btn-glow-green w-full rounded-2xl py-3.5 font-extrabold text-white text-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selected ? '¡Jugar ahora! →' : 'Elige un personaje'}
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          disabled
          className="btn-facebook w-full rounded-2xl py-3 font-bold text-white text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continuar con Facebook
        </motion.button>

        <p className="text-white/20 text-xs text-center">Privacidad · Términos · Soporte</p>
      </div>
    </main>
  );
}
