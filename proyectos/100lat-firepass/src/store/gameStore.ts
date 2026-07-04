'use client';

import { create } from 'zustand';
import { Avatar, Segment, getSegment } from '@/types';

interface GameStore {
  // Game state
  avatar: Avatar | null;
  currentQuestion: number;
  answers: (number | null)[];
  correctness: (boolean | null)[];
  score: number;
  isGameOver: boolean;

  // Lead data
  userName: string;
  email: string;
  phone: string;
  leadSubmitted: boolean;

  // Computed
  segment: Segment | null;

  // Actions
  setAvatar: (avatar: Avatar) => void;
  submitAnswer: (questionIndex: number, answerIndex: number, isCorrect: boolean) => void;
  nextQuestion: () => void;
  finishGame: (finalScore: number) => void;
  setLeadData: (name: string, email: string, phone: string) => void;
  setLeadSubmitted: () => void;
  resetGame: () => void;
}

const initialState = {
  avatar: null,
  currentQuestion: 0,
  answers: Array(10).fill(null),
  correctness: Array(10).fill(null),
  score: 0,
  isGameOver: false,
  userName: '',
  email: '',
  phone: '',
  leadSubmitted: false,
  segment: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setAvatar: (avatar) => set({ avatar }),

  submitAnswer: (questionIndex, answerIndex, isCorrect) => {
    const answers = [...get().answers];
    const correctness = [...get().correctness];
    answers[questionIndex] = answerIndex;
    correctness[questionIndex] = isCorrect;
    set({
      answers,
      correctness,
      score: isCorrect ? get().score + 1 : get().score,
    });
  },

  nextQuestion: () => {
    set((state) => ({ currentQuestion: state.currentQuestion + 1 }));
  },

  finishGame: (finalScore) => {
    set({
      isGameOver: true,
      score: finalScore,
      segment: getSegment(finalScore),
    });
  },

  setLeadData: (userName, email, phone) => set({ userName, email, phone }),

  setLeadSubmitted: () => set({ leadSubmitted: true }),

  resetGame: () => set(initialState),
}));
