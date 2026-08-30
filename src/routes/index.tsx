import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Plus, Volume2, VolumeX, X } from "lucide-react";
import { Wheel } from "@/components/spinpick/Wheel";
import { WinnerModal } from "@/components/spinpick/WinnerModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpinPick — Random Choice Wheel" },
      {
        name: "description",
        content:
          "Enter your choices, spin the wheel, and let SpinPick make the decision for you. A calm, premium random picker wheel.",
      },
      { property: "og:title", content: "SpinPick — Random Choice Wheel" },
      {
        property: "og:description",
        content:
          "Add your options, hit spin, and get a fair random pick in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpinPick,
});

type HistoryItem = { value: string; time: string };

const STORE_KEY = "spinpick:v1";

function useAudio(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(
    (freq: number, dur = 0.06, gain = 0.05) => {
      if (muted || typeof window === "undefined") return;
      try {
        ctxRef.current ??= new AudioContext();
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        /* audio unavailable */
      }
    },
    [muted],
  );
}

function SpinPick() {
  const [choices, setChoices] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [duration, setDuration] = useState(5000);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [muted, setMuted] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const timers = useRef<number[]>([]);
  const beep = useAudio(muted);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setChoices(Array.isArray(data.choices) ? data.choices : []);
        setHistory(Array.isArray(data.history) ? data.history : []);
        setRemoveWinner(Boolean(data.removeWinner));
        setMuted(Boolean(data.muted));
      } else {
        setChoices(["Pizza", "Burger", "Biryani", "Sushi"]);
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ choices, history, removeWinner, muted }),
    );
  }, [choices, history, removeWinner, muted, loaded]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const addChoice = () => {
    const value = input.trim();
    if (!value) return;
    setChoices((c) => [...c, value].slice(0, 40));
    setInput("");
    beep(660, 0.05, 0.04);
  };

  const spin = useCallback(() => {
    if (spinning || choices.length < 2) return;
    const index = Math.floor(Math.random() * choices.length);
    const seg = 360 / choices.length;
    const jitter = (Math.random() - 0.5) * seg * 0.7;
    const turns = 6 + Math.floor(Math.random() * 3);
    const current = ((rotation % 360) + 360) % 360;
    const target = 360 - (index * seg + seg / 2) - jitter;
    const delta = ((target - current) % 360 + 360) % 360;
    const dur = 4400 + Math.floor(Math.random() * 1400);

    setSpinning(true);
    setDuration(dur);
    setRotation((r) => r - 8);
    beep(320, 0.12, 0.05);

    timers.current.push(
      window.setTimeout(() => {
        setRotation(rotation + turns * 360 + delta);
      }, 220),
    );

    const ticks = 26;
    for (let i = 0; i < ticks; i++) {
      const t = Math.pow(i / ticks, 2.1) * dur;
      timers.current.push(
        window.setTimeout(() => beep(880, 0.03, 0.025), 260 + t),
      );
    }

    timers.current.push(
      window.setTimeout(() => {
        setSpinning(false);
        const value = choices[index];
        setWinner(value);
        setHistory((h) =>
          [
            {
              value,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            ...h,
          ].slice(0, 30),
        );
        if (removeWinner) setChoices((c) => c.filter((_, i) => i !== index));
        beep(520, 0.18, 0.06);
        timers.current.push(window.setTimeout(() => beep(780, 0.22, 0.05), 130));
      }, dur + 260),
    );
  }, [beep, choices, removeWinner, rotation, spinning]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && ["INPUT", "TEXTAREA"].includes(el.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (winner) setWinner(null);
        spin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spin, winner]);

  const canSpin = choices.length >= 2 && !spinning;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* soft background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="float-slow absolute -left-24 top-10 h-80 w-80 rounded-full bg-petal blur-3xl" />
        <div
          className="float-slow absolute -right-20 top-64 h-96 w-96 rounded-full bg-blush/50 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
        <div
          className="float-slow absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-mist blur-3xl"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-primary shadow-soft">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            SpinPick
          </span>
        </a>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a className="transition-colors hover:text-foreground" href="#how">
            How It Works
          </a>
          <a className="transition-colors hover:text-foreground" href="#about">
            About
          </a>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="rise-in pt-8 text-center sm:pt-14">
          <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl">
            Spin. Pick. Done.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Enter your choices, spin the wheel, and let SpinPick make the
            decision for you.
          </p>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div
            className="rise-in flex flex-col items-center"
            style={{ animationDelay: "0.1s" }}
          >
            <Wheel
              choices={choices}
              rotation={rotation}
              duration={duration}
              spinning={spinning}
            />

            {choices.length === 0 && (
              <p className="mt-6 text-sm text-muted-foreground">
                Add some choices to get started
              </p>
            )}

            <button
              onClick={spin}
              disabled={!canSpin}
              className="mt-8 w-full max-w-xs rounded-full bg-primary px-10 py-4 text-lg font-bold tracking-wide text-primary-foreground shadow-lift transition-all duration-200 hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:bg-blush disabled:shadow-none disabled:hover:scale-100"
            >
              {spinning ? "Spinning…" : "SPIN"}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              {choices.length < 2
                ? "Add at least 2 choices to spin"
                : "Tip: press Spacebar to spin"}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div
              className="glass-card rise-in rounded-4xl p-6 sm:p-7"
              style={{ animationDelay: "0.18s" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Choices</h2>
                <button
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute sounds" : "Mute sounds"}
                  className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              <div className="mt-5 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addChoice()}
                  placeholder="Enter a word or choice..."
                  className="min-w-0 flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/60"
                />
                <button
                  onClick={addChoice}
                  className="flex items-center gap-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.04] active:scale-95"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {choices.map((c, i) => (
                  <span
                    key={`${c}-${i}`}
                    className="pop-in group flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground"
                  >
                    {c}
                    <button
                      aria-label={`Remove ${c}`}
                      onClick={() =>
                        setChoices((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {choices.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No choices yet — add your first one above.
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-secondary-foreground">
                  <button
                    role="switch"
                    aria-checked={removeWinner}
                    onClick={() => setRemoveWinner((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                      removeWinner ? "bg-primary" : "bg-blush"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                        removeWinner ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  Remove winner after spin
                </label>
                <button
                  onClick={() => setChoices([])}
                  className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div
              className="glass-card rise-in rounded-4xl p-6 sm:p-7"
              style={{ animationDelay: "0.26s" }}
            >
              <button
                onClick={() => setHistoryOpen((o) => !o)}
                className="flex w-full items-center justify-between"
              >
                <h2 className="text-xl font-bold">Spin History</h2>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform duration-300 ${
                    historyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {historyOpen && (
                <div className="mt-4">
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Your past picks will show up here.
                    </p>
                  ) : (
                    <>
                      <ol className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                        {history.map((h, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between rounded-2xl bg-mist px-4 py-2.5 text-sm"
                          >
                            <span>
                              <span className="mr-2 text-muted-foreground">
                                {history.length - i}.
                              </span>
                              {h.value}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {h.time}
                            </span>
                          </li>
                        ))}
                      </ol>
                      <button
                        onClick={() => setHistory([])}
                        className="mt-4 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
                      >
                        Clear history
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="how" className="mt-24 grid gap-5 sm:grid-cols-3">
          {[
            ["Add your choices", "Type anything — dinner spots, names, tasks."],
            ["Spin the wheel", "One tap, or just hit the spacebar."],
            ["Get your pick", "Fair, random, and instantly decided."],
          ].map(([title, body], i) => (
            <div key={title} className="glass-card rounded-4xl p-6">
              <span className="text-sm font-semibold text-primary">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        <section id="about" className="mx-auto mt-20 max-w-2xl text-center">
          <h2 className="text-2xl font-bold">About SpinPick</h2>
          <p className="mt-3 text-muted-foreground">
            SpinPick is a calm little decision-maker. Everything runs in your
            browser and your wheel is saved locally, so your choices are right
            where you left them.
          </p>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Made by <span className="font-semibold text-foreground">noahxd</span>
      </footer>

      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onSpinAgain={() => {
          setWinner(null);
          window.setTimeout(spin, 220);
        }}
      />
    </div>
  );
}
