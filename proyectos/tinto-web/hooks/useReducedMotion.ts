'use client';

import { useEffect, useState } from 'react';

/**
 * `prefers-reduced-motion: reduce`. Arranca en `false` para que servidor y
 * cliente rindan igual en la primera pasada; el valor real entra tras montar.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
