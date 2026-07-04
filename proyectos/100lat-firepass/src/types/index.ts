export type Segment = 'low' | 'medium' | 'high';

export type Avatar = 'male' | 'female';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface GameState {
  avatar: Avatar | null;
  currentQuestion: number;
  answers: (number | null)[];
  score: number;
  isGameOver: boolean;
}

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  score: number;
  segment: Segment;
  avatar: Avatar | null;
}

export function getSegment(score: number): Segment {
  if (score <= 3) return 'low';
  if (score <= 9) return 'medium';
  return 'high';
}

export function getResultMessage(segment: Segment): string {
  switch (segment) {
    case 'high':
      return '¡Eres del 1%! Has desbloqueado la Fórmula FIRE PASS™';
    case 'medium':
      return 'Buen intento. Podrías estar dejando dinero sobre la mesa — aquí tienes tu guía.';
    case 'low':
      return '¡No te rindas! Cada intento te acerca más al 1%.';
  }
}

export function getCtaLabel(segment: Segment): string {
  switch (segment) {
    case 'high':
      return 'Agendar llamada con un especialista';
    case 'medium':
      return 'Descargar guía gratuita (PDF)';
    case 'low':
      return 'Volver a intentarlo';
  }
}
