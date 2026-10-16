import Link from "next/link";

import { BrandMark } from "@/components/primitives";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

import { signOutAdmin } from "@/app/admin/login/actions";

import { ActionSubmitButton } from "./ActionSubmitButton";
import { SignOutIcon } from "./AdminIcons";

type AdminHeaderProps = {
  email: string | null;
};

const brandFocus =
  "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex min-h-14 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className={cn(
            "inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-md",
            brandFocus,
          )}
        >
          <BrandMark className="size-8 md:size-8" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {site.name}
            </span>
            <span className="block truncate font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Feedback admin
            </span>
          </span>
        </Link>

        {email ? (
          <div className="flex min-w-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p className="max-w-44 truncate text-xs text-muted sm:max-w-none sm:text-sm">
              {email}
            </p>
            <form action={signOutAdmin}>
              <ActionSubmitButton
                busyLabel="Signing out…"
                className="gap-2 px-4"
              >
                <SignOutIcon />
                Sign out
              </ActionSubmitButton>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  );
}