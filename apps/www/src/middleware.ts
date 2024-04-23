import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { Ratelimit } from "@upstash/ratelimit";

import { env } from "./env";
import { redis } from "./lib/redis";

// https://upstash.com/blog/nextjs-ratelimiting
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(25, "10 s"),
});

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
): Promise<Response | undefined> {
  if (env.NODE_ENV !== "production") return NextResponse.next();

  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
  matcher: "/",
};
