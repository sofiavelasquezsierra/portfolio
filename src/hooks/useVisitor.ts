"use client";

import { useEffect, useState } from "react";

const CURSOR_KEY = "sofia.visitor.cursor";
const COUNTED_KEY = "sofia.visitor.counted";
const CURSOR_EVENT = "sofia:cursor-change";

export type VisitorState = {
  cursor: string | null;
  count: number | null;
  setCursor: (id: string) => void;
  reset: () => void;
};

export function useVisitor(): VisitorState {
  const [cursor, setCursorState] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCursorState(localStorage.getItem(CURSOR_KEY));

    const handler = (e: Event) => {
      const next = (e as CustomEvent<string | null>).detail;
      setCursorState(next);
    };
    window.addEventListener(CURSOR_EVENT, handler);
    return () => window.removeEventListener(CURSOR_EVENT, handler);
  }, []);

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

  const setCursor = (id: string) => {
    localStorage.setItem(CURSOR_KEY, id);
    setCursorState(id);
    window.dispatchEvent(new CustomEvent(CURSOR_EVENT, { detail: id }));
  };

  const reset = () => {
    localStorage.removeItem(CURSOR_KEY);
    setCursorState(null);
    window.dispatchEvent(new CustomEvent(CURSOR_EVENT, { detail: null }));
  };

  return { cursor, count, setCursor, reset };
}
