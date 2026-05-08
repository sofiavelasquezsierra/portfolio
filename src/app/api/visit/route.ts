import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
});

const KEY = "sofia:visit_count";

export async function GET() {
  const count = (await redis.get<number>(KEY)) ?? 0;
  return NextResponse.json({ count });
}

export async function POST() {
  const count = await redis.incr(KEY);
  return NextResponse.json({ count });
}
