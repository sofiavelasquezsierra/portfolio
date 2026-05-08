"use client";

import Image from "next/image";
import { motion, useDragControls } from "framer-motion";
import { useRef, useState } from "react";
import { countryStamps, CountryStamp } from "@/data/stamps";

type Placed = {
  id: string;
  src: string;
  alt: string;
  rotate: number;
  size: number;
};

const TRAY = 160;
const PLACED = 108;

const SLOT_TOP = 22;
const SLOT_RIGHT = 22;

// First N stamps live in the left column next to the postcard; the rest sit
// in a wrapping row underneath. One unified group, just split visually so
// the postcard is hugged on two sides.
const LEFT_LIMIT = 3;

export default function Postcard() {
  const dropRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const leftStamps = countryStamps.slice(0, LEFT_LIMIT);
  const bottomStamps = countryStamps.slice(LEFT_LIMIT);

  function handleDragEnd(
    stamp: CountryStamp,
    info: { point: { x: number; y: number } }
  ) {
    const drop = dropRef.current;
    if (!drop) return;
    const rect = drop.getBoundingClientRect();

    // Drop must land inside the postcard. Position is otherwise ignored —
    // every stamp lands in the same fixed slot at the same fixed size.
    if (
      info.point.x < rect.left ||
      info.point.y < rect.top ||
      info.point.x > rect.right ||
      info.point.y > rect.bottom
    ) {
      return;
    }

    setPlaced({
      id: `${stamp.id}-${Date.now()}`,
      src: stamp.src,
      alt: stamp.alt,
      rotate: stamp.rotate ?? 0,
      size: stamp.size ?? 1,
    });
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(`hi from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );
    window.location.href = `mailto:svelasqu@andrew.cmu.edu?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="space-y-8">
      {/* Top: left column of stamps + postcard. On mobile the left column
          collapses above the postcard as a wrapping row. */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6 lg:gap-8 items-start">
        {/* Left stamp column */}
        <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-5 lg:gap-6 items-center lg:items-center justify-center lg:justify-start">
          {leftStamps.map((s) => (
            <DraggableStamp key={s.id} stamp={s} onEnd={handleDragEnd} />
          ))}
        </div>

        {/* Postcard */}
        <div
          ref={dropRef}
          data-pet-perch
          className="relative rounded-3xl overflow-hidden bg-[#FBF1DD] border-2 border-ink/10 min-h-[440px]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(126,145,192,0.08), transparent 40%), radial-gradient(circle at 80% 20%, rgba(168,210,234,0.10), transparent 40%)",
          }}
        >
          <div className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 relative">
              <div>
                <p className="handwritten text-3xl text-rose leading-tight">
                  want to work together? <br /> drop me a note ✉
                </p>
                <p className="mt-4 text-sm text-ink/70 leading-relaxed">
                  i&apos;m looking for full-time roles starting <br />
                  <strong>august 2026</strong> — product &amp; ml in wearables
                  and health ai.
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ink/60">
                  from
                </p>
                <p className="text-sm">pittsburgh, pa</p>
                <p className="text-sm">currently @ cmu weber lab</p>
              </div>

              <form onSubmit={send} className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-ink/60">
                    name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-ink/20 focus:border-rose focus:outline-none py-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-ink/60">
                    email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-ink/20 focus:border-rose focus:outline-none py-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-ink/60">
                    message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-ink/20 focus:border-rose focus:outline-none py-1.5 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full justify-center"
                >
                  {sent ? "✓ opened your mail app" : "send postcard →"}
                </button>
              </form>
            </div>
          </div>

          {/* Drop hint — same slot the stamp will occupy */}
          {!placed && (
            <div
              className="absolute border-2 border-dashed border-ink/30 rounded-md flex items-center justify-center text-[10px] uppercase tracking-[0.18em] text-ink/40 text-center px-2 pointer-events-none"
              style={{
                top: SLOT_TOP,
                right: SLOT_RIGHT,
                width: PLACED,
                height: PLACED,
              }}
            >
              drag a<br />
              stamp
              <br />
              here
            </div>
          )}

          {/* Placed stamp — always at the same slot, at the same size */}
          {placed && (
            <motion.div
              key={placed.id}
              initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: placed.rotate }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="absolute pointer-events-auto"
              style={{
                top: SLOT_TOP,
                right: SLOT_RIGHT,
                width: PLACED,
                height: PLACED,
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.18))",
              }}
            >
              <StampImage src={placed.src} alt={placed.alt} size={placed.size} />
              <button
                onClick={() => setPlaced(null)}
                aria-label="remove stamp"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white text-xs flex items-center justify-center shadow-md hover:bg-rose transition-colors"
              >
                ×
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom row of stamps */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
          <p className="handwritten text-xl text-ink">
            choose a stamp & drag it onto the postcard ↑
          </p>
          {placed && (
            <span className="inline-flex items-center gap-1.5 text-xs text-rose">
              <span className="w-1.5 h-1.5 rounded-full bg-rose" />
              stamp placed · drag a different one to swap
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-6 md:gap-8 items-center">
          {bottomStamps.map((s) => (
            <DraggableStamp key={s.id} stamp={s} onEnd={handleDragEnd} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DraggableStamp({
  stamp,
  onEnd,
}: {
  stamp: CountryStamp;
  onEnd: (s: CountryStamp, info: { point: { x: number; y: number } }) => void;
}) {
  const controls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={controls}
      dragSnapToOrigin
      onDragEnd={(_, info) => onEnd(stamp, { point: info.point })}
      whileDrag={{ scale: 1.08, rotate: -4, zIndex: 50 }}
      whileHover={{ scale: 1.05 }}
      style={{
        rotate: stamp.rotate ?? 0,
        width: TRAY,
        height: TRAY,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.14))",
      }}
      className="cursor-target relative select-none flex-shrink-0"
    >
      <StampImage
        src={stamp.src}
        alt={stamp.alt}
        country={stamp.country}
        flag={stamp.flag}
        size={stamp.size}
      />
    </motion.div>
  );
}

function StampImage({
  src,
  alt,
  country,
  flag,
  size,
}: {
  src: string;
  alt: string;
  country?: string;
  flag?: string;
  /**
   * Multiplier on the rendered image (1 = container fit, 1.5 = 50% bigger).
   * Use to compensate for source PNGs that have lots of empty padding around
   * the actual stamp art so they appear smaller than tighter-cropped ones.
   */
  size?: number;
}) {
  const [errored, setErrored] = useState(false);
  const scale = size && size > 0 ? size : 1;

  if (errored) {
    return <PlaceholderStamp country={country} flag={flag} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="240px"
      className="object-contain pointer-events-none"
      style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      onError={() => setErrored(true)}
    />
  );
}

function PlaceholderStamp({
  country,
  flag,
}: {
  country?: string;
  flag?: string;
}) {
  return (
    <div
      className="absolute inset-2 flex flex-col items-center justify-center bg-white text-center"
      style={{
        outline: "1px dashed rgba(44,62,80,0.18)",
        outlineOffset: "-3px",
      }}
    >
      <span className="text-3xl leading-none">{flag ?? "✉"}</span>
      <span className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-ink/55 leading-tight">
        {country ?? "stamp"}
      </span>
      <span className="mt-1 text-[8px] tracking-wider text-ink/30">
        add img
      </span>
    </div>
  );
}
