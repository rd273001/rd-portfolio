import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  AlertCircleIcon,
  GoogleMark,
  ShieldIcon,
} from "@/components/admin/AdminIcons";
import { ArrowLeftIcon, Button, Container } from "@/components/primitives";
import { isGoogleAuthConfigured } from "@/lib/auth/config";
import { signInErrorMessage } from "@/lib/auth/errors";
import { cn } from "@/lib/cn";

import { signInWithGoogle } from "./actions";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const backLinkClass = cn(
  "group inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-md text-sm text-muted",
  "underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150",
  "hover:text-foreground hover:decoration-foreground active:text-foreground active:decoration-foreground",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
);

async function LoginErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = signInErrorMessage(error);

  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-accent/40 p-3 text-xs text-foreground"
    >
      <AlertCircleIcon className="size-4 shrink-0 text-muted" />
      <span>{message}</span>
    </p>
  );
}

export default function AdminLoginPage({ searchParams }: LoginPageProps) {
  const configured = isGoogleAuthConfigured();

  return (
    <section className="flex flex-1 flex-col justify-center py-12 sm:py-16">
      <Container className="flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 text-center shadow-[0_16px_40px_-24px_rgba(17,17,17,0.4)] sm:rounded-3xl sm:p-10">
          <div className="flex flex-col items-center">
            <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-border bg-accent/60 text-foreground">
              <ShieldIcon className="size-6" />
            </div>

            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-3xl">
              Sign in to review feedback.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7 text-balance">
              Google sign-in is limited to an allowlisted email. Sessions stay
              httpOnly and expire after eight hours.
            </p>
          </div>

          {configured ? (
            <form action={signInWithGoogle} className="mt-8">
              <Button type="submit" className="w-full gap-2.5 px-6">
                <GoogleMark />
                Continue with Google
              </Button>
            </form>
          ) : (
            <p
              role="status"
              className="mt-8 rounded-xl border border-border bg-accent/40 p-3 text-xs leading-5 text-muted"
            >
              Google sign-in is not configured on this environment yet.
            </p>
          )}

          <Suspense fallback={null}>
            <LoginErrorMessage searchParams={searchParams} />
          </Suspense>

          <div className="mt-6 border-t border-border pt-5">
            <Link href="/" className={backLinkClass}>
              <ArrowLeftIcon className="size-3.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:-translate-x-1 group-active:!-translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
              <span>Back to portfolio</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}