import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./lib/redis";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(25, "10 s"),
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
  matcher: "/",
};
