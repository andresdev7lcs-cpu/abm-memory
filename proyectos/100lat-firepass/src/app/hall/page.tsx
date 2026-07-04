'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Avatar } from '@/types';
import type { ChangeEvent } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// FACEBOOK LOGIN — cómo activar cuando tengas el App ID:
//
// 1. Crea tu app en https://developers.facebook.com
// 2. Agrega a .env.local:   NEXT_PUBLIC_FACEBOOK_APP_ID=TU_APP_ID
// 3. Instala el SDK:         npm install @greatsumini/react-facebook-login
// 4. Descomenta las líneas marcadas con // FB_LOGIN
// ─────────────────────────────────────────────────────────────────────────────
// import FacebookLogin from '@greatsumini/react-facebook-login'; // FB_LOGIN

const characters: { id: Avatar; img: string; cardImg: string; label: string; color: string; shadow: string }[] = [
  {
    id: 'male',
    img: '/images/man.png',
    cardImg: '/images/card-hombre.png',
    label: 'CHICO',
    color: '#00BCD4',
    shadow: 'rgba(0, 188, 212, 0.5)',
  },
  {
    id: 'female',
    img: '/images/woman.png',
    cardImg: '/images/card-mujer.png',
    label: 'CHICA',
    color: '#E91E8C',
    shadow: 'rgba(233, 30, 140, 0.5)',
  },
];

export default function HallPage() {
  const router = useRouter();
  const { setAvatar, setLeadData } = useGameStore();
  const [selected, setSelected] = useState<Avatar | null>(null);
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    if (!selected) return;
    setAvatar(selected);
    if (playerName.trim()) setLeadData(playerName.trim(), '', '');
    router.push('/game');
  };

  // ── FB_LOGIN: reemplazar esta función con la respuesta real de Facebook ──
  const handleFacebookLogin = () => {
    // Placeholder — activa esto cuando tengas el App ID
    alert('Facebook login próximamente. Por ahora juega sin cuenta 🎮');
  };

  return (
    <main className="stage-bg min-h-dvh flex flex-col px-5 py-7 screen-enter">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-brand-gold/70">
          FIRE PASS™
        </span>
        <h1 className="text-2xl font-extrabold text-white mt-1 leading-tight">
          Elige tu Coach
        </h1>
        <p className="text-white/40 text-sm mt-1">Tu compañero de juego</p>
      </motion.div>

      {/* Character cards */}
      <div className="flex gap-4 flex-1 items-center justify-center max-h-[340px]">
        {characters.map((char, i) => {
          const isSelected = selected === char.id;
          return (
            <motion.button
              key={char.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: 'backOut' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelected(char.id)}
              className="relative flex-1 flex flex-col items-center rounded-3xl overflow-hidden card-shine"
              style={{
                minHeight: 220,
                background: isSelected
                  ? `linear-gradient(160deg, ${char.color}33 0%, ${char.color}11 100%)`
                  : 'rgba(255,255,255,0.06)',
                border: isSelected
                  ? `2.5px solid ${char.color}`
                  : '2px solid rgba(255,255,255,0.14)',
                boxShadow: isSelected
                  ? `0 0 28px ${char.shadow}, 0 8px 32px rgba(0,0,0,0.4)`
                  : '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Top label */}
              <div
                className="w-full py-1.5 text-center font-extrabold text-xs tracking-widest"
                style={{
                  background: isSelected ? char.color : 'rgba(255,255,255,0.08)',
                  color: isSelected ? '#0d0228' : 'rgba(255,255,255,0.7)',
                }}
              >
                {char.label}
              </div>

              {/* Character image */}
              <div className="flex-1 flex items-end justify-center w-full px-3 pt-3">
                <img
                  src={char.img}
                  alt={char.label}
                  className={`object-contain object-bottom w-full ${isSelected ? 'animate-float' : ''}`}
                  style={{ height: 155 }}
                />
              </div>

              {/* Bottom badge */}
              <AnimatePresence mode="wait">
                {isSelected ? (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="w-full py-1.5 text-center font-extrabold text-xs tracking-wide"
                    style={{ background: char.color, color: '#0d0228' }}
                  >
                    ✓ SELECCIONADO
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full py-1.5 text-center font-bold text-xs text-white/40"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    TOCA PARA ELEGIR
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="mt-5 flex flex-col gap-3">

        {/* Name input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <input
            type="text"
            value={playerName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
            placeholder="¿Cómo te llamas? (opcional)"
            maxLength={24}
            className="w-full rounded-2xl px-4 py-3 font-semibold text-sm outline-none placeholder:text-white/25"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.16)',
              color: '#fff',
            }}
          />
        </motion.div>

        {/* Play button */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          onClick={handleStart}
          disabled={!selected}
          className="btn-glow-green w-full rounded-2xl py-3.5 font-extrabold text-white text-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selected ? '¡Empezar! →' : 'Elige un personaje primero'}
        </motion.button>

        {/* Facebook login */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          onClick={handleFacebookLogin}
          disabled={!selected}
          className="btn-facebook w-full rounded-2xl py-3 font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continuar con Facebook
        </motion.button>

        <p className="text-white/20 text-xs text-center">Privacidad · Términos · Soporte</p>
      </div>
    </main>
  );
}
