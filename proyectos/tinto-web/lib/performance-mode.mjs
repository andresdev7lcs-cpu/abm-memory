export const PERFORMANCE_MODES = {
  cinematic: {
    label: "Cinematic",
    description: "Motion completo, canvas y capas atmosféricas."
  },
  balanced: {
    label: "Balanced",
    description: "Menos densidad visual, menos loops y media más ligera."
  },
  reduced: {
    label: "Reduced",
    description: "Sin movimiento continuo y con contenido completo."
  }
};

export function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function prefersReducedData() {
  return window.matchMedia("(prefers-reduced-data: reduce)").matches;
}

export function hasLowDeviceBudget() {
  const memory = navigator.deviceMemory || 0;
  const cores = navigator.hardwareConcurrency || 0;

  return (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4);
}

export function detectPerformanceMode() {
  if (isReducedMotion()) {
    return "reduced";
  }

  if (prefersReducedData() || navigator.connection?.saveData) {
    return "balanced";
  }

  if (hasLowDeviceBudget()) {
    return "balanced";
  }

  return "cinematic";
}

export function normalizePerformanceMode(mode) {
  if (mode === "cinematic" || mode === "balanced" || mode === "reduced") {
    return mode;
  }

  return detectPerformanceMode();
}

export function getPerformanceBudget(mode) {
  switch (normalizePerformanceMode(mode)) {
    case "reduced":
      return { enterMs: 120, exitMs: 120, autoMs: 0, waveMs: 0 };
    case "balanced":
      return { enterMs: 220, exitMs: 220, autoMs: 800, waveMs: 1800 };
    default:
      return { enterMs: 360, exitMs: 360, autoMs: 1200, waveMs: 2400 };
  }
}
