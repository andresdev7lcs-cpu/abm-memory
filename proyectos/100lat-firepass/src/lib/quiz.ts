import questionsPool from '@/data/questions_pool.json';
import caState from '@/data/states/CA.json';

export type QuizVariant = 'A' | 'B' | 'C';
export type QuizLevel = 1 | 2 | 3;

export interface QuizQuestion {
  id: string;
  level: QuizLevel;
  text: string;
  text_tokens: string[];
  options: string[];
  correctIndex: number;
  hint: string;
  variant: QuizVariant;
}

export interface SessionQuestion extends QuizQuestion {
  resolvedText: string;
  resolvedOptions: string[];
}

const pool = questionsPool as QuizQuestion[];
const variantOrder: QuizVariant[] = ['A', 'B', 'C'];

function seededNumber(seed: string) {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return value;
}

function shuffle<T>(items: T[], seed: string) {
  const result = [...items];
  let current = seededNumber(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    current = (current * 1664525 + 1013904223) >>> 0;
    const swapIndex = current % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function resolveTokens(text: string) {
  return text.replace(/\{\{STATE\.([A-Z0-9_]+)\}\}/g, (_, key: keyof typeof caState) => String(caState[key] ?? ''));
}

export function buildQuizSession(seed = 'fire-pass') {
  const variant = variantOrder[seededNumber(seed) % variantOrder.length];
  const byLevel = [1, 2, 3].flatMap((level) =>
    shuffle(
      pool.filter((question) => question.level === level && question.variant === variant),
      `${seed}:${variant}:${level}`
    )
      .slice(0, level === 1 ? 3 : level === 2 ? 4 : 3)
      .map((question) => ({
        ...question,
        resolvedText: resolveTokens(question.text),
        resolvedOptions: question.options.map((option) => resolveTokens(option)),
      }))
  );

  return {
    variant,
    questions: byLevel,
  };
}

export function getSegment(score: number) {
  if (score <= 4) return 'low' as const;
  if (score <= 7) return 'medium' as const;
  return 'high' as const;
}

export function isWin(score: number) {
  return score >= 9;
}
