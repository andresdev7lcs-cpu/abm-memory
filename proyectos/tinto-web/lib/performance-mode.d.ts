import type { PerformanceMode } from './types';

export interface PerformanceModeInfo {
  label: string;
  description: string;
}

export const PERFORMANCE_MODES: Record<PerformanceMode, PerformanceModeInfo>;

export function isReducedMotion(): boolean;
export function prefersReducedData(): boolean;
export function hasLowDeviceBudget(): boolean;
export function detectPerformanceMode(): PerformanceMode;
export function normalizePerformanceMode(mode?: string): PerformanceMode;

export interface PerformanceBudget {
  enterMs: number;
  exitMs: number;
  autoMs: number;
  waveMs: number;
}

export function getPerformanceBudget(mode?: string): PerformanceBudget;
