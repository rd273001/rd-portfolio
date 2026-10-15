"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW_MS } from "@/lib/auth/limits";
import {
  consumeRateLimit,
  getRequestIpFromHeaders,
} from "@/lib/contact/rate-limit";

export async function signInWithGoogle() {
  const ip = getRequestIpFromHeaders(await headers());
  const allowed = consumeRateLimit(`auth:${ip}`, Date.now(), {
    max: AUTH_RATE_LIMIT_MAX,
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
  });

  if (!allowed) {
    redirect("/admin/login?error=RateLimit");
  }

  await signIn("google", { redirectTo: "/admin/feedback" });
}

export async function signOutAdmin() {
  await signOut({ redirectTo: "/admin/login" });
}