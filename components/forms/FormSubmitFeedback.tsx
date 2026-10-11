import { cn } from "@/lib/cn";

import type { ContactFormTone } from "./contactFormTone";

type FormSubmitFeedbackProps = {
  error: string | null;
  emailHref: string | null;
  showEmailLink?: boolean;
  tone?: ContactFormTone;
};

/** Form-level errors only (send failed, rate limit, not configured). */
export function FormSubmitFeedback({
  error,
  emailHref,
  showEmailLink = false,
  tone = "light",
}: FormSubmitFeedbackProps) {
  if (!error) {
    return null;
  }

  const onDark = tone === "on-dark";

  return (
    <div aria-live="polite">
      <p
        className={cn(
          "text-sm leading-6",
          onDark ? "text-background" : "text-foreground",
        )}
        role="alert"
      >
        {error}
        {showEmailLink && emailHref ? (
          <>
            {" "}
            <a
              href={emailHref}
              className={cn(
                "font-medium underline underline-offset-4",
                onDark
                  ? "text-background decoration-background/40"
                  : "text-foreground decoration-foreground/35",
              )}
            >
              Email me instead
            </a>
            .
          </>
        ) : null}
      </p>
    </div>
  );
}