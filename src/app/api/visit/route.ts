import { NextResponse } from "next/server";

// Simple in-memory counter. Resets on serverless cold starts.
// For persistence in production, swap to Vercel KV / Upstash — see README.
declare global {
  // eslint-disable-next-line no-var
  var __sofiaVisitCount: number | undefined;
}

function read(): number {
  return globalThis.__sofiaVisitCount ?? 1;
}
function write(n: number) {
  globalThis.__sofiaVisitCount = n;
}

export async function GET() {
  return NextResponse.json({ count: read() });
}

export async function POST() {
  const next = read() + 1;
  write(next);
  return NextResponse.json({ count: next });
}
