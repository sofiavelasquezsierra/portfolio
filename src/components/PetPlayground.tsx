"use client";

import { useEffect, useRef, useState } from "react";

const TREATS_KEY = "sofia.pet.treatsEaten";

const TREAT_EMOJIS = ["🍎", "🥕", "🍓", "🍪", "🥨", "🍒", "🍇", "🥚", "🍩", "🧀"];

type Treat = {
  id: string;
  x: number; // viewport-left in px
  emoji: string;
};

/**
 * Mini-game: toss treats and watch the pet chase + eat them.
 * The pet's chase logic lives in Pet.tsx — it scans for `[data-pet-treat]`
 * elements near the floor and walks to the nearest one.
 */
export default function PetPlayground() {
  const [treats, setTreats] = useState<Treat[]>([]);
  const [eaten, setEaten] = useState(0);
  const [bestRun, setBestRun] = useState(0);
  const [sessionRun, setSessionRun] = useState(0);

  // Hydrate persisted total once mounted (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TREATS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setEaten(parsed?.total ?? 0);
        setBestRun(parsed?.best ?? 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen for pet eating treats — remove that treat + bump score.
  useEffect(() => {
    const onAte = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (!id) return;
      setTreats((t) => t.filter((x) => x.id !== id));
      setEaten((n) => {
        const next = n + 1;
        try {
          const best = Math.max(bestRun, sessionRun + 1);
          localStorage.setItem(
            TREATS_KEY,
            JSON.stringify({ total: next, best })
          );
        } catch {
          // ignore
        }
        return next;
      });
      setSessionRun((s) => {
        const next = s + 1;
        if (next > bestRun) setBestRun(next);
        return next;
      });
    };
    window.addEventListener("pet:ate-treat", onAte as EventListener);
    return () => window.removeEventListener("pet:ate-treat", onAte as EventListener);
  }, [bestRun, sessionRun]);

  // Treats auto-disappear after 30s if uneaten so the floor doesn't pile up.
  useEffect(() => {
    if (treats.length === 0) return;
    const timers = treats.map((t) => {
      return setTimeout(() => {
        setTreats((curr) => curr.filter((x) => x.id !== t.id));
      }, 30000);
    });
    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [treats]);

  function tossTreat() {
    const id = `treat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const margin = 80;
    const x = margin + Math.random() * (window.innerWidth - margin * 2);
    const emoji = TREAT_EMOJIS[Math.floor(Math.random() * TREAT_EMOJIS.length)];
    setTreats((t) => [...t, { id, x, emoji }]);
  }

  return (
    <>
      {/* The playground UI panel — sits inside the gallery page flow. */}
      <section className="mt-14">
        <div className="max-w-md mx-auto rounded-3xl border-4 border-ink/85 bg-ink/95 text-cream p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
          <p className="text-[10px] tracking-[0.32em] uppercase opacity-60">
            mini-game
          </p>
          <h3 className="font-serif text-3xl mt-1">play with the pet</h3>
          <p className="mt-1 text-xs opacity-70">
            toss a treat. the pet will run for it.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3 font-mono">
            <Stat label="this run" value={sessionRun} />
            <Stat label="best run" value={bestRun} />
            <Stat label="lifetime" value={eaten} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={tossTreat}
              className="flex-1 py-3 px-4 rounded-xl bg-cream text-ink text-sm font-medium hover:bg-rose hover:text-cream transition-colors"
            >
              🍎 toss a treat
            </button>
            <button
              onClick={() => {
                setSessionRun(0);
                setTreats([]);
              }}
              className="px-4 py-3 rounded-xl border border-cream/30 text-cream/80 text-sm hover:border-cream hover:text-cream transition-colors"
            >
              reset run
            </button>
          </div>

          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] opacity-50">
            ↓ treats appear at the bottom of the screen
          </p>
        </div>
      </section>

      {/* Treat sprites — rendered as fixed elements at viewport bottom so the
          pet (which lives at viewport bottom) can chase them naturally. */}
      {treats.map((t) => (
        <TreatSprite key={t.id} treat={t} />
      ))}
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] opacity-50">
        {label}
      </p>
      <p className="font-serif text-3xl mt-0.5">
        {value.toString().padStart(3, "0")}
      </p>
    </div>
  );
}

/**
 * A single treat — drops from a small height with gravity, lands on the
 * viewport floor, and waits for the pet to come eat it. Carries a
 * `data-pet-treat` attribute so Pet.tsx can find it.
 */
function TreatSprite({ treat }: { treat: Treat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Falling animation via CSS — simpler than driving with JS.
  return (
    <div
      ref={ref}
      data-pet-treat
      data-treat-id={treat.id}
      className="pet-treat"
      style={{
        left: treat.x,
        // Without inline transform, the CSS keyframe runs from above to floor.
        animation: mounted ? "petTreatDrop 0.6s ease-in forwards" : "none",
      }}
    >
      <span className="text-3xl select-none" aria-hidden>
        {treat.emoji}
      </span>
    </div>
  );
}
