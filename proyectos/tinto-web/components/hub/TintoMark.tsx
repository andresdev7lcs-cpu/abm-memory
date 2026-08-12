/**
 * Marca TINTO: dos circulos concentricos y una "T" trazada.
 * SVG inline hecho a mano — el prototipo no usa libreria de iconos.
 *
 * `traced` anima los trazos con stroke-dashoffset (solo el loader).
 */
export const TintoMark = ({
  traced = false,
  strokeWidth = 3,
  barWidth = 7,
}: {
  traced?: boolean;
  strokeWidth?: number;
  barWidth?: number;
}) => (
  <svg
    viewBox="0 0 120 120"
    className="relative h-full w-full"
    style={traced ? { overflow: 'visible' } : undefined}
    aria-hidden="true"
  >
    <circle
      cx="60"
      cy="60"
      r="50"
      fill="none"
      stroke="#d79a55"
      strokeWidth={traced ? 1.25 : strokeWidth}
      strokeLinecap="round"
      strokeDasharray={traced ? 320 : undefined}
      style={
        traced
          ? { animation: 'tTrace 1.5s cubic-bezier(.4,0,.2,1) both' }
          : undefined
      }
    />
    {traced && (
      <circle
        cx="60"
        cy="60"
        r="41"
        fill="none"
        stroke="rgba(221,185,129,.28)"
        strokeWidth=".75"
      />
    )}
    <path
      d="M40 48 H80 M60 48 V82"
      fill="none"
      stroke="#f4eee7"
      strokeWidth={traced ? 3 : barWidth}
      strokeLinecap="round"
      strokeDasharray={traced ? 320 : undefined}
      style={
        traced
          ? { animation: 'tTrace 1.4s cubic-bezier(.4,0,.2,1) .35s both' }
          : undefined
      }
    />
  </svg>
);
