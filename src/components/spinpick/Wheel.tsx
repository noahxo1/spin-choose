import { useMemo } from "react";

type Props = {
  choices: string[];
  rotation: number;
  duration: number;
  spinning: boolean;
};

const SHADES = [
  "#FADDE4",
  "#FFFFFF",
  "#F7C6D4",
  "#FFF3F6",
  "#F2B7C9",
  "#FDE9EF",
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function Wheel({ choices, rotation, duration, spinning }: Props) {
  const n = choices.length;
  const segments = useMemo(() => {
    if (n === 0) return [];
    const seg = 360 / n;
    return choices.map((label, i) => {
      const start = i * seg;
      const end = start + seg;
      const [x1, y1] = polar(200, 200, 195, start);
      const [x2, y2] = polar(200, 200, 195, end);
      const large = seg > 180 ? 1 : 0;
      const d =
        n === 1
          ? `M 5 200 A 195 195 0 1 1 395 200 A 195 195 0 1 1 5 200`
          : `M 200 200 L ${x1} ${y1} A 195 195 0 ${large} 1 ${x2} ${y2} Z`;
      return { d, label, mid: start + seg / 2, fill: SHADES[i % SHADES.length] };
    });
  }, [choices, n]);

  const fontSize = n <= 4 ? 19 : n <= 8 ? 16 : n <= 14 ? 13 : n <= 22 ? 10 : 8;
  const maxChars = n <= 6 ? 16 : n <= 12 ? 12 : 9;

  return (
    <div className="relative mx-auto w-full max-w-[min(88vw,460px)]">
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-blush/40 blur-3xl" />
      <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
        <svg width="34" height="42" viewBox="0 0 34 42" aria-hidden>
          <path
            d="M17 40 L3 12 A 15 15 0 1 1 31 12 Z"
            fill="oklch(0.79 0.105 5)"
            stroke="#fff"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="relative aspect-square rounded-full bg-card p-2 shadow-[0_28px_60px_-24px_rgba(214,120,150,0.55)]">
        <div className="h-full w-full rounded-full border-[10px] border-white bg-petal shadow-[inset_0_-14px_28px_rgba(214,120,150,0.22),inset_0_14px_28px_rgba(255,255,255,0.9)]">
          <svg
            viewBox="0 0 400 400"
            className="h-full w-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${duration}ms cubic-bezier(0.12, 0.7, 0.12, 1)`
                : "none",
            }}
          >
            <defs>
              <radialGradient id="depth" cx="50%" cy="38%" r="70%">
                <stop offset="60%" stopColor="#fff" stopOpacity="0" />
                <stop offset="100%" stopColor="#C9738F" stopOpacity="0.22" />
              </radialGradient>
            </defs>
            {segments.map((s, i) => (
              <g key={`${s.label}-${i}`}>
                <path
                  d={s.d}
                  fill={s.fill}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </g>
            ))}
            {segments.map((s, i) => (
              <text
                key={`t-${i}`}
                x="200"
                y="200"
                fill="#6C4450"
                fontSize={fontSize}
                fontWeight={600}
                textAnchor="end"
                dominantBaseline="middle"
                transform={`rotate(${s.mid - 90} 200 200) translate(178 0)`}
              >
                {s.label.length > maxChars
                  ? `${s.label.slice(0, maxChars - 1)}…`
                  : s.label}
              </text>
            ))}
            {n === 0 && (
              <circle cx="200" cy="200" r="195" fill="#FCEEF3" />
            )}
            <circle cx="200" cy="200" r="195" fill="url(#depth)" />
          </svg>
        </div>

        <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-white bg-primary shadow-soft">
          <div className="h-3 w-3 rounded-full bg-white/90" />
        </div>
      </div>
    </div>
  );
}
