"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { favorites, Favorite } from "@/data/favorites";

const ROTATIONS = [-4, 3, -2, 5, -3, 2, -5, 4];
const TAPE_COLORS = ["bg-honey/45", "bg-rose/35", "bg-sage/40", "bg-blush/45"];

/**
 * Polaroid scrapbook wall — replaces the security tray with something more
 * playful. Each item is a tilted Polaroid; some have a strip of washi tape
 * across the top corner. Hover lifts the Polaroid and straightens it.
 */
export default function FavoritesBoard() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 px-2">
      {favorites.map((f, i) => (
        <Polaroid key={f.id} item={f} index={i} />
      ))}
    </div>
  );
}

function Polaroid({ item, index }: { item: Favorite; index: number }) {
  const [errored, setErrored] = useState(false);
  const rotate = ROTATIONS[index % ROTATIONS.length];
  // Wash tape on every other item, alternating colors.
  const tape = index % 2 === 0 ? TAPE_COLORS[index % TAPE_COLORS.length] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ rotate: 0, y: -6, scale: 1.04, zIndex: 20 }}
      className="cursor-target relative bg-white p-3 pb-12 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.32)]"
    >
      {/* Washi tape on a corner */}
      {tape && (
        <span
          aria-hidden
          className={`absolute -top-1.5 ${
            index % 4 < 2 ? "left-3" : "right-3"
          } w-12 h-3.5 ${tape} rounded-sm shadow-sm`}
          style={{
            transform: `rotate(${index % 4 < 2 ? -12 : 12}deg)`,
          }}
        />
      )}

      {/* Wearables badge */}
      {item.wearables && (
        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[8px] tracking-[0.18em] uppercase rounded-full bg-ink text-cream z-10">
          ⌚
        </span>
      )}

      {/* Photo */}
      <div className="relative aspect-square bg-cream/80 flex items-center justify-center overflow-hidden">
        {item.src && !errored ? (
          <Image
            src={item.src}
            alt={item.label}
            fill
            sizes="220px"
            className="object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <span className="text-5xl leading-none">{item.emoji}</span>
        )}
      </div>

      {/* Caption */}
      <p className="absolute bottom-2.5 left-3 right-3 text-center handwritten text-lg leading-tight text-ink">
        {item.label}
      </p>
    </motion.div>
  );
}
