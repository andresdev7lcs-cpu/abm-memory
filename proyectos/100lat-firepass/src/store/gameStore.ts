'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Segment = 'low' | 'medium' | 'high' | null;

export interface GameStore {
  email: string;
  name: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  currentScreen: number;
  score: number;
  answers: { questionId: string; selected: string }[];
  segment: Segment;
  guideUnlockedAt: string | null;
  currentChapter: number | null;
  bpaCity?: string;
  bpaDailyCheckIns: boolean;
  quizQuestionIds: string[];
  quizVariant: 'A' | 'B' | 'C' | null;
  quizStartedAt: string | null;
  quizCompletedAt: string | null;
  guideUnlocked: boolean;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setUTMs: (utms: { source?: string; medium?: string; campaign?: string; content?: string }) => void;
  setScore: (score: number) => void;
  addAnswer: (questionId: string, selected: string) => void;
  calculateSegment: (score: number) => Segment;
  setQuizSession: (payload: { questionIds: string[]; variant: 'A' | 'B' | 'C'; startedAt?: string }) => void;
  completeQuiz: (payload: { score: number; completedAt?: string }) => void;
  unlockGuide: () => void;
  setCurrentScreen: (screen: number) => void;
  setCurrentChapter: (chapter: number | null) => void;
  setBPACity: (city: string) => void;
  setBPACheckIns: (enabled: boolean) => void;
  getSessionData: () => Record<string, unknown>;
  resetGame: () => void;
}

const initialState = {
  email: '',
  name: '',
  utmSource: undefined,
  utmMedium: undefined,
  utmCampaign: undefined,
  utmContent: undefined,
  currentScreen: 1,
  score: 0,
  answers: [],
  segment: null,
  guideUnlockedAt: null,
  currentChapter: null,
  bpaCity: undefined,
  bpaDailyCheckIns: true,
  quizQuestionIds: [],
  quizVariant: null,
  quizStartedAt: null,
  quizCompletedAt: null,
  guideUnlocked: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setEmail: (email) => set({ email }),
      setName: (name) => set({ name }),
      setUTMs: (utms) =>
        set((state) => ({
          utmSource: state.utmSource ?? utms.source,
          utmMedium: state.utmMedium ?? utms.medium,
          utmCampaign: state.utmCampaign ?? utms.campaign,
          utmContent: state.utmContent ?? utms.content,
        })),
      setScore: (score) => set({ score, segment: get().calculateSegment(score) }),
      addAnswer: (questionId, selected) =>
        set((state) => ({ answers: [...state.answers, { questionId, selected }] })),
      calculateSegment: (score) => {
        if (score <= 4) return 'low';
        if (score <= 7) return 'medium';
        return 'high';
      },
      setQuizSession: ({ questionIds, variant, startedAt }) =>
        set({ quizQuestionIds: questionIds, quizVariant: variant, quizStartedAt: startedAt ?? new Date().toISOString(), quizCompletedAt: null }),
      completeQuiz: ({ score, completedAt }) =>
        set({
          score,
          segment: get().calculateSegment(score),
          quizCompletedAt: completedAt ?? new Date().toISOString(),
          guideUnlocked: true,
        }),
      unlockGuide: () => set({ guideUnlockedAt: new Date().toISOString(), guideUnlocked: true }),
      setCurrentScreen: (currentScreen) => set({ currentScreen }),
      setCurrentChapter: (currentChapter) => set({ currentChapter }),
      setBPACity: (bpaCity) => set({ bpaCity }),
      setBPACheckIns: (bpaDailyCheckIns) => set({ bpaDailyCheckIns }),
      getSessionData: () => {
        const state = get();
        return {
          email: state.email,
          name: state.name,
          utms: {
            source: state.utmSource,
            medium: state.utmMedium,
            campaign: state.utmCampaign,
            content: state.utmContent,
          },
          score: state.score,
          answers: state.answers,
          segment: state.segment,
          guideUnlockedAt: state.guideUnlockedAt,
          currentChapter: state.currentChapter,
          bpaCity: state.bpaCity,
          bpaDailyCheckIns: state.bpaDailyCheckIns,
          quizQuestionIds: state.quizQuestionIds,
          quizVariant: state.quizVariant,
          quizStartedAt: state.quizStartedAt,
          quizCompletedAt: state.quizCompletedAt,
          guideUnlocked: state.guideUnlocked,
        };
      },
      resetGame: () => set(initialState),
    }),
    {
      name: 'firepass-game-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
