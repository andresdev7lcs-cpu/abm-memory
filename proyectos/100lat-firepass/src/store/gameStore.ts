'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Segment = 'Conservative' | 'Moderate' | 'Aggressive' | null;

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
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setUTMs: (utms: { source?: string; medium?: string; campaign?: string; content?: string }) => void;
  setScore: (score: number) => void;
  addAnswer: (questionId: string, selected: string) => void;
  calculateSegment: (score: number) => Segment;
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
        set((state) => ({ answers: [...state.answers, { questionId, selected }], score: state.score + 1, segment: get().calculateSegment(state.score + 1) })),
      calculateSegment: (score) => {
        if (score <= 2) return 'Conservative';
        if (score <= 5) return 'Moderate';
        return 'Aggressive';
      },
      unlockGuide: () => set({ guideUnlockedAt: new Date().toISOString() }),
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
