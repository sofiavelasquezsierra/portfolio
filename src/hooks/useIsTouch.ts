"use client";

import { useEffect, useState } from "react";

/**
 * True when the device's primary pointer is coarse (touchscreen).
 * Returns `false` on the server and during the first render to avoid
 * hydration mismatches; flips to true on touch devices after mount.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isTouch;
}
