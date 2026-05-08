"use client";

import Image from "next/image";
import { useState } from "react";
import Logo from "./Logo";

type Props = {
  /** Logo size in px when no photo is loaded. */
  size?: number;
  /** Photo container width/height in px when a photo is present. */
  imgSize?: number;
  rounded?: string;
  className?: string;
  src?: string;
  alt?: string;
};

/**
 * Shows a square photo if `src` loads, otherwise a standalone Logo
 * with no surrounding box / border / gradient 
 */
export default function PhotoOrLogo({
  size = 96,
  imgSize = 112,
  rounded = "rounded-2xl",
  className = "",
  src = "/photos/sofia.jpg",
  alt = "Sofia",
}: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
      >
        <Logo size={size} />
      </div>
    );
  }

  return (
    <div
      className={`relative ${rounded} overflow-hidden border border-ink/10 ${className}`}
      style={{ width: imgSize, height: imgSize }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${imgSize}px`}
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
