"use client";

import { useVisitor } from "@/hooks/useVisitor";

export default function VisitorCounter() {
  const { count } = useVisitor();
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
      <span className="text-ink/60">visitor</span>
      <span className="font-mono font-medium text-ink">
        #{count !== null ? count.toString().padStart(4, "0") : "—"}
      </span>
    </span>
  );
}
