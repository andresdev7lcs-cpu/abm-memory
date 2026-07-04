'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  seconds: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

export default function Timer({ seconds, onTimeUp, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const isWarning = timeLeft <= 10;
  const isDanger  = timeLeft <= 5;

  useEffect(() => { setTimeLeft(seconds); }, [seconds]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) { onTimeUp(); return; }
    const id = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft, onTimeUp]);

  const size   = 58;
  const stroke = 5;
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const dash   = circ * (timeLeft / seconds);
  const ringColor = isDanger ? '#EF4444' : isWarning ? '#F1C40F' : '#2ECC71';
  const textColor = isDanger ? '#EF4444' : isWarning ? '#F1C40F' : '#ffffff';
  const ss = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`relative flex items-center justify-center ${isWarning ? 'timer-warning' : ''}`}
         style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={ringColor} strokeWidth={stroke} fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }} />
      </svg>
      <span className="relative z-10 font-extrabold tabular-nums" style={{ color: textColor, fontSize: '0.72rem' }}>
        00:{ss}
      </span>
    </div>
  );
}
