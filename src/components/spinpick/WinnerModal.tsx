type Props = {
  winner: string | null;
  onClose: () => void;
  onSpinAgain: () => void;
};

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 8) * 0.12}s`,
  dx: `${((i * 53) % 120) - 60}px`,
  color: ["#F7C6D4", "#FADDE4", "#F2B7C9", "#FFFFFF"][i % 4],
  size: 6 + (i % 4) * 2,
}));

export function WinnerModal({ winner, onClose, onSpinAgain }: Props) {
  if (!winner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/15 backdrop-blur-sm animate-in fade-in duration-300"
      />
      <div className="glass-card pop-in relative w-full max-w-sm overflow-hidden rounded-4xl p-8 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="absolute top-0 rounded-[2px]"
              style={{
                left: c.left,
                width: c.size,
                height: c.size * 1.6,
                background: c.color,
                ["--dx" as string]: c.dx,
                animation: `confetti-fall 2.4s ease-in ${c.delay} forwards`,
              }}
            />
          ))}
        </div>
        <p className="relative text-sm font-medium tracking-wide text-muted-foreground">
          ✨ Your Pick
        </p>
        <h2 className="relative mt-3 text-4xl font-bold break-words text-foreground">
          {winner}
        </h2>
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onSpinAgain}
            className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-transform duration-200 hover:scale-[1.03] active:scale-95"
          >
            Spin Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-border bg-card px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
