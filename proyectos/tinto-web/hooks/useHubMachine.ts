'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BRIDGE_FADE_MS,
  BRIDGE_TIMEOUT_MS,
  INTRO_DURATION_MS,
  SERVICES,
  STEPS,
  TOUCH_DURATION_MS,
  type ServiceId,
} from '@/lib/hub-content';

export type Scene = 'loader' | 'hero' | 'bridge' | 'service' | 'diagnostic';
export type MenuId = 'faq' | 'rec' | null;

export interface HubState {
  scene: Scene;
  serviceId: ServiceId | null;
  pendingId: ServiceId | null;
  /** Cross-fade de los videos del hero + reordenamiento del panel */
  touching: boolean;
  bridgeFading: boolean;
  openMenu: MenuId;
  step: number;
  answers: Record<string, string>;
  consent: boolean;
  diagDone: boolean;
}

const INITIAL: HubState = {
  scene: 'loader',
  serviceId: null,
  pendingId: null,
  touching: false,
  bridgeFading: false,
  openMenu: 'faq',
  step: 0,
  answers: {},
  consent: false,
  diagDone: false,
};

export function useHubMachine(introDurationMs = INTRO_DURATION_MS) {
  const [state, setState] = useState<HubState>(INITIAL);

  // Timers de escena. Se limpian al desmontar y antes de reprogramar.
  const introTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bridgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAll = useCallback(() => {
    [introTimer, touchTimer, bridgeTimer, fadeTimer].forEach((t) => {
      if (t.current) clearTimeout(t.current);
      t.current = null;
    });
  }, []);

  // Loader -> hero, automatico.
  useEffect(() => {
    introTimer.current = setTimeout(() => {
      setState((s) => (s.scene === 'loader' ? { ...s, scene: 'hero' } : s));
    }, introDurationMs);

    return () => {
      if (introTimer.current) clearTimeout(introTimer.current);
    };
  }, [introDurationMs]);

  useEffect(() => clearAll, [clearAll]);

  const skipIntro = useCallback(() => {
    if (introTimer.current) clearTimeout(introTimer.current);
    setState((s) => ({ ...s, scene: 'hero' }));
  }, []);

  /**
   * Clic en una oportunidad: dispara el gesto de la fundadora, sube la
   * tarjeta al tope del panel y, pasado el gesto, entra al puente.
   */
  const selectService = useCallback((id: ServiceId) => {
    setState((s) => ({ ...s, touching: true, pendingId: id }));

    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => {
      setState((s) => (s.pendingId ? { ...s, scene: 'bridge' } : s));
    }, TOUCH_DURATION_MS);
  }, []);

  /** Corta la espera en cuanto el gesto termina de verse (lo llama Hero al
   *  detectar el progreso real del video). */
  const gestureComplete = useCallback(() => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
    setState((s) =>
      s.scene === 'hero' && s.pendingId ? { ...s, scene: 'bridge' } : s,
    );
  }, []);

  /** Puente -> servicio. La dispara el `ended` del video o el tope de 6s. */
  const finishBridge = useCallback(() => {
    if (bridgeTimer.current) {
      clearTimeout(bridgeTimer.current);
      bridgeTimer.current = null;
    }

    setState((s) => (s.scene === 'bridge' ? { ...s, bridgeFading: true } : s));

    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setState((s) =>
        s.scene === 'bridge'
          ? {
              ...s,
              scene: 'service',
              serviceId: s.pendingId,
              openMenu: null,
              bridgeFading: false,
              touching: false,
            }
          : s,
      );
    }, BRIDGE_FADE_MS);
  }, []);

  /**
   * Tope de seguridad del puente. Se arma al entrar en la escena, no desde el
   * componente: si el navegador bloquea el autoplay el video nunca emite
   * `ended` y sin esto la transicion se queda colgada.
   */
  useEffect(() => {
    if (state.scene !== 'bridge') return;

    bridgeTimer.current = setTimeout(finishBridge, BRIDGE_TIMEOUT_MS);
    return () => {
      if (bridgeTimer.current) clearTimeout(bridgeTimer.current);
      bridgeTimer.current = null;
    };
  }, [state.scene, finishBridge]);

  const backToHero = useCallback(() => {
    clearAll();
    setState((s) => ({
      ...s,
      scene: 'hero',
      diagDone: false,
      step: 0,
      pendingId: null,
      touching: false,
      bridgeFading: false,
    }));
  }, [clearAll]);

  const backToService = useCallback(() => {
    // Sin servicio elegido (se entro al diagnostico desde el hero) se vuelve
    // al hero: no hay pagina de servicio a la que regresar.
    setState((s) =>
      s.serviceId
        ? { ...s, scene: 'service', diagDone: false, step: 0 }
        : { ...s, scene: 'hero', diagDone: false, step: 0 },
    );
  }, []);

  const openDiagnostic = useCallback(() => {
    clearAll();
    setState((s) => ({
      ...s,
      scene: 'diagnostic',
      step: 0,
      diagDone: false,
      touching: false,
    }));
  }, [clearAll]);

  const toggleMenu = useCallback((id: Exclude<MenuId, null>) => {
    setState((s) => ({ ...s, openMenu: s.openMenu === id ? null : id }));
  }, []);

  const pick = useCallback((key: string, value: string) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [key]: value } }));
  }, []);

  const toggleConsent = useCallback(() => {
    setState((s) => ({ ...s, consent: !s.consent }));
  }, []);

  const nextStep = useCallback(() => {
    setState((s) =>
      s.step >= STEPS.length - 1
        ? { ...s, diagDone: true }
        : { ...s, step: s.step + 1 },
    );
  }, []);

  const prevStep = useCallback(() => {
    setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));
  }, []);

  const service = SERVICES.find((x) => x.id === state.serviceId) ?? SERVICES[0];
  const pending = SERVICES.find((x) => x.id === state.pendingId) ?? null;

  return {
    state,
    service,
    pending,
    actions: {
      skipIntro,
      selectService,
      gestureComplete,
      finishBridge,
      backToHero,
      backToService,
      openDiagnostic,
      toggleMenu,
      pick,
      toggleConsent,
      nextStep,
      prevStep,
    },
  };
}
