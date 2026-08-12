/**
 * Contenido del hub. Extraido literal de `TINTO Web Hub.dc.html`.
 *
 * El copy marcado "pendiente de confirmacion" / "provisional" es placeholder
 * de negocio, no de maquetacion: el layout es final, el texto se reemplaza
 * cuando Andres confirme las unidades de servicio.
 */

export type ServiceId = 'finanzas' | 'inmobiliario' | 'educacion';

export interface Service {
  id: ServiceId;
  /** Titulo corto — tarjeta del panel del hero */
  short: string;
  /** Titulo largo — H1 de la pagina de servicio */
  name: string;
  hook: string;
  desc: string;
  faq: string[];
  recursos: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'finanzas',
    short: 'Finanzas y Patrimonio',
    name: 'Finanzas y patrimonio',
    hook: 'Prepara tu jubilación en Colombia desde el exterior.',
    desc: 'Un espacio para ordenar la información antes de comprometer recursos. Unidad provisional, pendiente de confirmación.',
    faq: [
      '¿Qué debo ordenar antes de tomar una decisión financiera importante?',
      '¿Cómo puedo comparar alternativas con mayor claridad?',
      '¿Qué riesgos debería revisar antes de comprometer recursos?',
      '¿Cómo preparo una conversación sobre mi futuro financiero?',
    ],
    recursos: [
      'Guía de preguntas previas a una decisión — pendiente de producción',
      'Plantilla para ordenar información financiera — pendiente de producción',
      'Glosario de términos frecuentes — pendiente de producción',
    ],
  },
  {
    id: 'inmobiliario',
    short: 'Activos inmobiliarios',
    name: 'Activos inmobiliarios',
    hook: 'Apalanca tu inversión con ventajas fiscales en Colombia.',
    desc: 'Cómo mirar un activo inmobiliario antes de decidir. Unidad provisional, pendiente de confirmación.',
    faq: [
      '¿Qué debería revisar antes de considerar un activo inmobiliario?',
      '¿Cómo comparar una oportunidad con otras alternativas?',
      '¿Qué preguntas debo hacer antes de comprometerme?',
      '¿Cómo organizar la información para tomar una decisión?',
    ],
    recursos: [
      'Lista de verificación previa a una visita — pendiente de producción',
      'Marco para comparar oportunidades — pendiente de producción',
      'Glosario inmobiliario — pendiente de producción',
    ],
  },
  {
    id: 'educacion',
    short: 'Educación financiera',
    name: 'Educación y orientación financiera',
    hook: 'Saca el mayor provecho de las oportunidades de inversión en Colombia.',
    desc: 'Para quien empieza y quiere entender antes de avanzar. Unidad provisional, pendiente de confirmación.',
    faq: [
      '¿Por dónde empiezo si siento que no tengo claridad?',
      '¿Cómo reconocer una decisión basada en presión o emoción?',
      '¿Qué conceptos debería comprender antes de avanzar?',
      '¿Cómo construir mejores preguntas financieras?',
    ],
    recursos: [
      'Ruta de conceptos base — pendiente de producción',
      'Cuaderno de preguntas propias — pendiente de producción',
      'Lecturas recomendadas — pendiente de producción',
    ],
  },
];

export interface TickerItem {
  label: string;
  value: string;
}

/** Valores estaticos del prototipo. No hay feed en vivo todavia. */
export const TICKER: TickerItem[] = [
  { label: 'USD/COP', value: '4.050' },
  { label: 'EUR/USD', value: '1.09' },
  { label: 'Tasa de referencia', value: '9.25%' },
  { label: 'Inflación 12m', value: '5.1%' },
  { label: 'Titular', value: 'Cómo leer una tasa antes de firmar' },
  { label: 'Titular', value: 'Tres preguntas antes de comprometer capital' },
];

export type StepKind = 'choice' | 'area' | 'text' | 'consent';

export interface StepField {
  key: string;
  label: string;
  placeholder: string;
}

export interface Step {
  id: string;
  kind: StepKind;
  q: string;
  options?: string[];
  fields?: StepField[];
}

export const STEPS: Step[] = [
  {
    id: 'orientation',
    kind: 'choice',
    q: '¿Qué tipo de orientación buscas?',
    options: [
      'Quiero comprender el panorama',
      'Quiero ordenar la información que tengo',
      'Quiero conversar con alguien',
    ],
  },
  { id: 'situation', kind: 'area', q: '¿Qué decisión tienes frente a ti?' },
  {
    id: 'urgency',
    kind: 'choice',
    q: '¿Cómo describirías tu momento?',
    options: [
      'Estoy explorando',
      'Quiero comprender mejor',
      'Necesito tomar una decisión',
      'Necesito conversar pronto',
    ],
  },
  {
    id: 'contact',
    kind: 'text',
    q: '¿Cómo te contactamos?',
    fields: [
      { key: 'name', label: 'NOMBRE', placeholder: 'Tu nombre' },
      { key: 'email', label: 'EMAIL', placeholder: 'tu@correo.com' },
      { key: 'country', label: 'PAÍS DE RESIDENCIA', placeholder: 'País' },
    ],
  },
  { id: 'consent', kind: 'consent', q: 'Un último paso' },
];

export interface Ghost {
  word: string;
  top: string;
  left: string;
  size: string;
  delay: string;
}

/** Palabras fantasma del hero — mix-blend-mode overlay, opacidad ~.09 */
export const GHOSTS: Ghost[] = [
  { word: 'claridad', top: '12%', left: '4%', size: '92px', delay: '0s' },
  { word: 'patrimonio', top: '70%', left: '2%', size: '72px', delay: '3s' },
  { word: 'decisión', top: '40%', left: '30%', size: '104px', delay: '6s' },
  { word: 'conversación', top: '84%', left: '26%', size: '60px', delay: '2s' },
  { word: 'criterio', top: '6%', left: '34%', size: '66px', delay: '8s' },
  { word: 'futuro', top: '56%', left: '12%', size: '80px', delay: '5s' },
];

export const ENDINGS = ['una buena conversación.', 'un buen tinto.'];

export const ASSETS = {
  founderIdle: '/assets/founder-idle.mp4',
  founderClick: '/assets/woman-click.mp4',
  ambientLoop: '/assets/ambient-loop.webm',
  elevator: '/assets/elevator-transition.mp4',
  serviceBg: '/assets/service-bg.mp4',
} as const;

/** Altura de fila del panel de oportunidades — mueve `top` al reordenar. */
export const ROW_H = 132;

export const INTRO_DURATION_MS = 5000;
/** Respaldo: si el video no reporta progreso (autoplay bloqueado, decode
 *  fallido) el puente entra igual. El corte normal lo marca GESTURE_END_S
 *  sobre el tiempo del propio video. */
export const TOUCH_DURATION_MS = 6000;

/** Segundo del clip en que la fundadora ya toco la pantalla. El clip dura
 *  4.01s y no corre a tiempo de pared, por eso se mide sobre `currentTime`
 *  y no con un setTimeout. */
export const GESTURE_END_S = 3.7;
/** Tope de seguridad si el video del ascensor no dispara `ended`. */
export const BRIDGE_TIMEOUT_MS = 6000;
export const BRIDGE_FADE_MS = 480;
