'use client';

import { useEffect, useState } from 'react';

const TYPE_MS = 58;
const DELETE_MS = 38;
const HOLD_MS = 3400;

/**
 * Efecto maquina de escribir en loop: escribe una frase, la sostiene, la
 * borra y pasa a la siguiente. Los tiempos vienen del prototipo.
 *
 * Con `enabled` en false (reduced motion, o la escena aun no es el hero)
 * devuelve la primera frase completa y fija.
 */
export function useTypewriter(phrases: string[], enabled: boolean): string {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!enabled) {
      setText(phrases[0] ?? '');
      return;
    }

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const phrase = phrases[phraseIdx];

      if (!deleting) {
        charIdx += 1;
        setText(phrase.slice(0, charIdx));
        // Frase completa: sostener antes de empezar a borrar.
        if (charIdx >= phrase.length) {
          timer = setTimeout(() => {
            deleting = true;
            step();
          }, HOLD_MS);
          return;
        }
      } else {
        charIdx -= 1;
        setText(phrase.slice(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }

      timer = setTimeout(step, deleting ? DELETE_MS : TYPE_MS);
    };

    step();
    return () => clearTimeout(timer);
  }, [phrases, enabled]);

  return text;
}
