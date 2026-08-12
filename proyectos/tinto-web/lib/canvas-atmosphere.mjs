const TONE_RGB = {
  forest: "158, 74, 92",
  petrol: "196, 138, 79",
  copper: "217, 174, 108",
  default: "217, 174, 108"
};

function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

function drawGrid(ctx, width, height, pulse, mode) {
  const dotStep = mode === "cinematic" ? 28 : mode === "balanced" ? 34 : 40;
  const dotSize = mode === "cinematic" ? 1.7 : 1.3;
  const alpha = mode === "cinematic" ? 0.24 : 0.16;

  ctx.save();
  ctx.fillStyle = `rgba(233, 221, 200, ${alpha})`;

  for (let y = dotStep / 2; y < height; y += dotStep) {
    for (let x = dotStep / 2; x < width; x += dotStep) {
      const offset = Math.sin((x + y + pulse) * 0.01) * 0.55;
      ctx.globalAlpha = alpha + offset * 0.08;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawRings(ctx, width, height, pulse, mode, toneRgb) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * (mode === "reduced" ? 0.32 : 0.38);
  const ringCount = mode === "reduced" ? 2 : 4;

  ctx.save();
  ctx.lineWidth = mode === "cinematic" ? 1.4 : 1;
  ctx.strokeStyle = `rgba(${toneRgb}, 0.2)`;

  for (let i = 0; i < ringCount; i += 1) {
    const progress = (i + 1) / (ringCount + 1);
    const radius = maxRadius * progress + Math.sin(pulse * 0.001 + i) * 4;
    ctx.globalAlpha = 0.16 + progress * 0.12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHalo(ctx, width, height, pulse, toneRgb) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * (0.22 + Math.sin(pulse * 0.0006) * 0.01);

  ctx.save();
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, `rgba(${toneRgb}, 0.14)`);
  gradient.addColorStop(1, `rgba(${toneRgb}, 0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function attachAtmosphere(canvas, { mode = "balanced", reducedMotion = false, tone = "default" } = {}) {
  if (!canvas) {
    return () => {};
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return () => {};
  }

  const toneRgb = TONE_RGB[tone] || TONE_RGB.default;
  let rafId = 0;
  let disposed = false;
  let width = 0;
  let height = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(time) {
    if (disposed) {
      return;
    }

    clearCanvas(ctx, width, height);
    drawHalo(ctx, width, height, time, toneRgb);
    drawGrid(ctx, width, height, time, mode);
    drawRings(ctx, width, height, time, mode, toneRgb);

    if (!reducedMotion && mode !== "reduced") {
      rafId = window.requestAnimationFrame(frame);
    }
  }

  function refresh() {
    resize();
    frame(performance.now());
  }

  window.addEventListener("resize", refresh);
  refresh();

  if (!reducedMotion && mode !== "reduced") {
    rafId = window.requestAnimationFrame(frame);
  }

  return () => {
    disposed = true;
    window.removeEventListener("resize", refresh);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
  };
}
