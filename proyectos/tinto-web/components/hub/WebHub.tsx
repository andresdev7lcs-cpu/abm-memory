'use client';

import { useEffect } from 'react';
import { useHubMachine } from '@/hooks/useHubMachine';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Bridge } from './Bridge';
import { Chrome } from './Chrome';
import { Diagnostic } from './Diagnostic';
import { Hero } from './Hero';
import { Loader } from './Loader';
import { Service } from './Service';

interface WebHubProps {
  /** Numero de WhatsApp del negocio. Pendiente: Andres confirma el real. */
  whatsappNumber?: string;
  introDurationMs?: number;
}

export const WebHub = ({
  whatsappNumber = '000000000',
  introDurationMs,
}: WebHubProps) => {
  const reducedMotion = useReducedMotion();
  const { state, service, pending, actions } = useHubMachine(introDurationMs);

  // Los videos son decorativos y nunca deben sonar: el atributo `muted` del
  // markup se refuerza por JS en cada cambio de escena.
  useEffect(() => {
    document.querySelectorAll('video').forEach((v) => {
      v.muted = true;
      v.volume = 0;
    });
  }, [state.scene]);

  const chromeVisible =
    state.scene === 'service' || state.scene === 'diagnostic';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink-deep font-sans">
      {state.scene === 'loader' && <Loader onSkip={actions.skipIntro} />}

      {state.scene === 'hero' && (
        <Hero
          touching={state.touching}
          pendingId={state.pendingId}
          reducedMotion={reducedMotion}
          onSelectService={actions.selectService}
          onGestureComplete={actions.gestureComplete}
          onOpenDiagnostic={actions.openDiagnostic}
        />
      )}

      {state.scene === 'bridge' && (
        <Bridge
          serviceName={pending?.name ?? ''}
          fading={state.bridgeFading}
          onEnded={actions.finishBridge}
        />
      )}

      {state.scene === 'service' && (
        <Service
          service={service}
          openMenu={state.openMenu}
          reducedMotion={reducedMotion}
          onToggleMenu={actions.toggleMenu}
          onOpenDiagnostic={actions.openDiagnostic}
          onBackToHero={actions.backToHero}
        />
      )}

      {state.scene === 'diagnostic' && (
        <Diagnostic
          step={state.step}
          answers={state.answers}
          consent={state.consent}
          done={state.diagDone}
          onPick={actions.pick}
          onToggleConsent={actions.toggleConsent}
          onNext={actions.nextStep}
          onPrev={actions.prevStep}
          onClose={actions.backToService}
        />
      )}

      {chromeVisible && (
        <Chrome
          whatsappNumber={whatsappNumber}
          onBackToHero={actions.backToHero}
        />
      )}
    </div>
  );
};
