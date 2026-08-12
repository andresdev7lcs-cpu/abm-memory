'use client';

import { useEffect, useRef } from 'react';
import { ASSETS } from '@/lib/hub-content';

interface BridgeProps {
  serviceName: string;
  fading: boolean;
  onEnded: () => void;
}

/**
 * Escena 1.1 — puertas de ascensor. Avanza al terminar el video; el tope de
 * seguridad vive en la maquina de estados, porque si el navegador bloquea el
 * autoplay `ended` no llega nunca.
 */
export const Bridge = ({ serviceName, fading, onEnded }: BridgeProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    void el.play().catch(() => {});
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hub-scene fixed inset-0 z-[80] overflow-hidden bg-ink-deep"
      style={{ animation: 'tSoftFade .6s ease both' }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          src={ASSETS.elevator}
          onEnded={onEnded}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg,rgba(11,10,9,.15),rgba(11,10,9,.35) 70%,rgba(11,10,9,.6))',
          }}
        />
        <div
          className="absolute bottom-[16%] left-0 right-0 flex flex-col items-center gap-2 text-center"
          style={{ animation: 'tSoftFade 1.4s ease .3s both' }}
        >
          <span
            className="font-serif text-cream"
            style={{ fontSize: 'clamp(17px,1.8vw,24px)' }}
          >
            Pasa, te estaba esperando.
          </span>
          <span
            className="text-[11px] uppercase text-amber"
            style={{ letterSpacing: '.2em' }}
          >
            {serviceName}
          </span>
        </div>
      </div>
    </div>
  );
};
