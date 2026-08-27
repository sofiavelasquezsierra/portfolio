"use client";

import { useEffect, useState } from "react";

const COUNTED_KEY = "sofia.visitor.counted";

export type VisitorState = {
  count: number | null;
};

export function useVisitor(): VisitorState {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const counted = localStorage.getItem(COUNTED_KEY) === "1";
    const action = counted ? "GET" : "POST";

    fetch("/api/visit", { method: action, cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (typeof data?.count === "number") setCount(data.count);
        if (!counted) localStorage.setItem(COUNTED_KEY, "1");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return { count };
}
