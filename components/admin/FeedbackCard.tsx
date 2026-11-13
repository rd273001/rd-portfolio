"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  deleteFeedbackAction,
  updateFeedbackAction,
} from "@/app/admin/feedback/actions";
import { Button, LoadingSpinner } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { FIELD_LIMITS } from "@/lib/contact/limits";
import type { FeedbackSubmission } from "@/lib/feedback/types";

import { ActionSubmitButton } from "./ActionSubmitButton";
import { FeedbackRowActions } from "./FeedbackRowActions";

const EXIT_MS = 180;

type FeedbackCardProps = {
  submission: FeedbackSubmission;
};

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type EditFeedbackModalProps = {
  submission: FeedbackSubmission;
  onClose: () => void;
  onUpdated: (fields: {
    name: string;
    role: string;
    company: string;
    quote: string;
  }) => void;
};

function EditFeedbackModal({
  submission,
  onClose,
  onUpdated,
}: EditFeedbackModalProps) {
  const [name, setName] = useState(submission.name);
  const [role, setRole] = useState(submission.role);
  const [company, setCompany] = useState(submission.company);
  const [quote, setQuote] = useState(submission.quote);

  const [errors, setErrors] = useState<{
    name?: string;
    role?: string;
    company?: string;
    quote?: string;
    general?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  const closingRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const requestClose = useCallback(() => {
    if (closingRef.current || isSaving) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(onClose, EXIT_MS);
  }, [isSaving, onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameInputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !closingRef.current && !isSaving) {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          "input:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isSaving, requestClose]);

  function validate() {
    const nextErrors: {
      name?: string;
      role?: string;
      company?: string;
      quote?: string;
    } = {};

    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const trimmedCompany = company.trim();
    const trimmedQuote = quote.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = "Please enter a name (at least 2 characters).";
    } else if (trimmedName.length > FIELD_LIMITS.name) {
      nextErrors.name = `Name must be ${FIELD_LIMITS.name} characters or fewer.`;
    }

    if (trimmedRole.length < 2) {
      nextErrors.role = "Please add a role (at least 2 characters).";
    } else if (trimmedRole.length > FIELD_LIMITS.role) {
      nextErrors.role = `Role must be ${FIELD_LIMITS.role} characters or fewer.`;
    }

    if (trimmedCompany.length > FIELD_LIMITS.company) {
      nextErrors.company = `Company must be ${FIELD_LIMITS.company} characters or fewer.`;
    }

    if (trimmedQuote.length < 12) {
      nextErrors.quote = "Please write a quote (at least 12 characters).";
    } else if (trimmedQuote.length > FIELD_LIMITS.message) {
      nextErrors.quote = `Quote must be ${FIELD_LIMITS.message} characters or fewer.`;
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    const formData = new FormData();
    formData.append("id", submission.id);
    formData.append("name", name.trim());
    formData.append("role", role.trim());
    formData.append("company", company.trim());
    formData.append("quote", quote.trim());

    try {
      const result = await updateFeedbackAction(formData);

      if (!result.ok) {
        setErrors({
          general: result.error ?? "Failed to update feedback.",
          ...result.fieldErrors,
        });
        setIsSaving(false);
        return;
      }

      onUpdated({
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        quote: quote.trim(),
      });
      requestClose();
    } catch (err) {
      setErrors({
        general:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while saving.",
      });
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <div
        className={cn(
          "absolute inset-0 bg-foreground/40 backdrop-blur-sm",
          closing
            ? "animate-[testimonial-backdrop-out_180ms_ease-in_forwards]"
            : "animate-[testimonial-backdrop-in_220ms_ease-out_both]",
        )}
        onClick={() => {
          if (!isSaving) requestClose();
        }}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-feedback-title"
        className={cn(
          "relative flex max-h-[88vh] max-h-[88dvh] w-full max-w-xl flex-col rounded-2xl border border-border bg-surface shadow-2xl",
          closing
            ? "animate-[testimonial-dialog-out_180ms_ease-in_forwards]"
            : "animate-[testimonial-dialog-in_260ms_cubic-bezier(0.16,1,0.3,1)_both]",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
          <div>
            <h2
              id="edit-feedback-title"
              className="text-base font-semibold text-foreground sm:text-lg"
            >
              Edit feedback
            </h2>
            <p className="mt-1 text-xs text-muted">
              Update collaborator details or quote. Changes update live testimonials when published.
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={isSaving}
            aria-label="Close dialog"
            className="-mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-40"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
            {errors.general ? (
              <div
                role="alert"
                className="rounded-xl border border-amber-600/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-400"
              >
                {errors.general}
              </div>
            ) : null}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="edit-feedback-name"
                  className="font-medium text-foreground"
                >
                  Name
                </label>
                <span className="font-mono text-muted">
                  {name.length}/{FIELD_LIMITS.name}
                </span>
              </div>
              <input
                ref={nameInputRef}
                id="edit-feedback-name"
                type="text"
                value={name}
                disabled={isSaving}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                maxLength={FIELD_LIMITS.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "edit-feedback-name-error" : undefined}
                className={cn(
                  "min-h-10 w-full appearance-none rounded-xl border px-3.5 text-sm",
                  "bg-background/50 text-foreground outline-none transition-[border-color,background-color] duration-150",
                  "focus:border-foreground focus:bg-surface disabled:opacity-50",
                  errors.name
                    ? "border-amber-600/60 focus:border-amber-600"
                    : "border-border hover:border-foreground/25",
                )}
              />
              {errors.name ? (
                <p
                  id="edit-feedback-name-error"
                  role="alert"
                  className="text-xs font-medium text-amber-700 dark:text-amber-400"
                >
                  {errors.name}
                </p>
              ) : null}
            </div>

            {/* Role & Company grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="edit-feedback-role"
                    className="font-medium text-foreground"
                  >
                    Role / Title
                  </label>
                  <span className="font-mono text-muted">
                    {role.length}/{FIELD_LIMITS.role}
                  </span>
                </div>
                <input
                  id="edit-feedback-role"
                  type="text"
                  value={role}
                  disabled={isSaving}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (errors.role) {
                      setErrors((prev) => ({ ...prev, role: undefined }));
                    }
                  }}
                  maxLength={FIELD_LIMITS.role}
                  aria-invalid={Boolean(errors.role)}
                  aria-describedby={
                    errors.role ? "edit-feedback-role-error" : undefined
                  }
                  className={cn(
                    "min-h-10 w-full appearance-none rounded-xl border px-3.5 text-sm",
                    "bg-background/50 text-foreground outline-none transition-[border-color,background-color] duration-150",
                    "focus:border-foreground focus:bg-surface disabled:opacity-50",
                    errors.role
                      ? "border-amber-600/60 focus:border-amber-600"
                      : "border-border hover:border-foreground/25",
                  )}
                />
                {errors.role ? (
                  <p
                    id="edit-feedback-role-error"
                    role="alert"
                    className="text-xs font-medium text-amber-700 dark:text-amber-400"
                  >
                    {errors.role}
                  </p>
                ) : null}
              </div>

              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="edit-feedback-company"
                    className="font-medium text-foreground"
                  >
                    Company{" "}
                    <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <span className="font-mono text-muted">
                    {company.length}/{FIELD_LIMITS.company}
                  </span>
                </div>
                <input
                  id="edit-feedback-company"
                  type="text"
                  value={company}
                  disabled={isSaving}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (errors.company) {
                      setErrors((prev) => ({ ...prev, company: undefined }));
                    }
                  }}
                  maxLength={FIELD_LIMITS.company}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={
                    errors.company ? "edit-feedback-company-error" : undefined
                  }
                  className={cn(
                    "min-h-10 w-full appearance-none rounded-xl border px-3.5 text-sm",
                    "bg-background/50 text-foreground outline-none transition-[border-color,background-color] duration-150",
                    "focus:border-foreground focus:bg-surface disabled:opacity-50",
                    errors.company
                      ? "border-amber-600/60 focus:border-amber-600"
                      : "border-border hover:border-foreground/25",
                  )}
                />
                {errors.company ? (
                  <p
                    id="edit-feedback-company-error"
                    role="alert"
                    className="text-xs font-medium text-amber-700 dark:text-amber-400"
                  >
                    {errors.company}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Quote */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="edit-feedback-quote"
                  className="font-medium text-foreground"
                >
                  Quote / Testimonial
                </label>
                <span className="font-mono text-muted">
                  {quote.length}/{FIELD_LIMITS.message}
                </span>
              </div>
              <textarea
                id="edit-feedback-quote"
                rows={5}
                value={quote}
                disabled={isSaving}
                onChange={(e) => {
                  setQuote(e.target.value);
                  if (errors.quote) {
                    setErrors((prev) => ({ ...prev, quote: undefined }));
                  }
                }}
                maxLength={FIELD_LIMITS.message}
                aria-invalid={Boolean(errors.quote)}
                aria-describedby={
                  errors.quote ? "edit-feedback-quote-error" : undefined
                }
                className={cn(
                  "min-h-28 max-h-56 w-full resize-y appearance-none rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed",
                  "bg-background/50 text-foreground outline-none transition-[border-color,background-color] duration-150",
                  "focus:border-foreground focus:bg-surface disabled:opacity-50",
                  errors.quote
                    ? "border-amber-600/60 focus:border-amber-600"
                    : "border-border hover:border-foreground/25",
                )}
              />
              {errors.quote ? (
                <p
                  id="edit-feedback-quote-error"
                  role="alert"
                  className="text-xs font-medium text-amber-700 dark:text-amber-400"
                >
                  {errors.quote}
                </p>
              ) : null}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border/70 px-5 py-4 sm:px-7">
            <Button
              type="button"
              variant="secondary"
              disabled={isSaving}
              onClick={requestClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner className="size-3.5" />
                  <span>Saving…</span>
                </span>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FeedbackCard({ submission }: FeedbackCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [override, setOverride] = useState<{
    name: string;
    role: string;
    company: string;
    quote: string;
  } | null>(null);

  const name = override?.name ?? submission.name;
  const role = override?.role ?? submission.role;
  const company = override?.company ?? submission.company;
  const quote = override?.quote ?? submission.quote;

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-foreground/20 sm:p-7">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {submission.status === "published" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Published
            </span>
          ) : submission.status === "archived" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/60 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase text-muted">
              <span className="size-1.5 rounded-full bg-muted/60" aria-hidden="true" />
              Archived
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase text-amber-800 dark:text-amber-400">
              <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              Pending Review
            </span>
          )}

          {submission.permissionToPublish ? (
            <span className="inline-flex items-center rounded-full border border-border bg-accent/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
              Publish consent: Granted
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-amber-600/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-400">
              Publish consent: None (Private)
            </span>
          )}
        </div>

        <time className="font-mono text-xs text-muted">
          {formatTimestamp(submission.createdAt)}
        </time>
      </div>

      {/* Quote / Testimonial */}
      <blockquote className="mt-5 text-base leading-relaxed text-foreground sm:text-[17px] sm:leading-7">
        “{quote}”
      </blockquote>

      {/* Author Profile */}
      <div className="mt-5 inline-flex max-w-full items-center gap-3 rounded-xl border border-border/80 bg-accent/30 p-2.5 sm:px-3.5 sm:py-2.5">
        <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-full border border-border bg-accent text-[11px] font-semibold text-foreground">
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="text-sm font-semibold text-foreground">
              {name}
            </p>
            {role || company ? (
              <span className="text-xs text-muted">
                {role}
                {company ? ` · ${company}` : ""}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate font-mono text-xs text-muted">
            {submission.email ? submission.email : "No follow-up email provided"}
          </p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {confirmingDelete ? (
          <form
            action={deleteFeedbackAction}
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <input type="hidden" name="id" value={submission.id} />
            <p className="text-sm text-muted">
              Delete {name}’s note permanently?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <ActionSubmitButton
                busyLabel="Deleting…"
                className="border-foreground/30"
              >
                Delete permanently
              </ActionSubmitButton>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-xs text-muted">
              {submission.status === "published"
                ? "Live — displayed in testimonials on the homepage."
                : submission.status === "archived"
                  ? "Archived — hidden from the public site."
                  : "Pending — review quote before publishing live."}
            </p>
            <FeedbackRowActions
              submission={submission}
              onEdit={() => setIsEditing(true)}
              onDelete={() => setConfirmingDelete(true)}
            />
          </>
        )}
      </div>

      {isEditing ? (
        <EditFeedbackModal
          submission={{
            ...submission,
            name,
            role,
            company,
            quote,
          }}
          onClose={() => setIsEditing(false)}
          onUpdated={(updated) => setOverride(updated)}
        />
      ) : null}
    </article>
  );
}
