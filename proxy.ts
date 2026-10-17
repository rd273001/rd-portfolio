import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isAllowlisted } from "@/lib/auth/allowlist";
import { AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW_MS } from "@/lib/auth/limits";
import { consumeRateLimit, getRequestIp } from "@/lib/contact/rate-limit";

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const allowed = isAllowlisted(request.auth?.user?.email);

  if (pathname.startsWith("/api/auth")) {
    const ip = getRequestIp(request);
    const withinLimit = consumeRateLimit(`auth:${ip}`, Date.now(), {
      max: AUTH_RATE_LIMIT_MAX,
      windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
    });

    if (!withinLimit) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please try again later." },
        { status: 429 },
      );
    }
  }

  if (pathname === "/admin/login") {
    if (allowed) {
      return NextResponse.redirect(new URL("/admin/feedback", request.nextUrl));
    }

    return;
  }

  if (pathname.startsWith("/admin") && !allowed) {
    const login = new URL("/admin/login", request.nextUrl);
    login.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/auth/:path*"],
};

export default proxy;