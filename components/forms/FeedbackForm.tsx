"use client";

import { useReducer, type FormEvent } from "react";

import { Button } from "@/components/primitives";
import { FIELD_LIMITS } from "@/lib/contact/limits";

import { controlClassName, Field, honeypotClassName } from "./Field";
import { FormSubmitFeedback } from "./FormSubmitFeedback";
import { useContactForm } from "./useContactForm";

type Draft = {
  name: string;
  role: string;
  company: string;
  email: string;
  message: string;
  permissionToPublish: boolean;
  website: string;
};

type DraftAction =
  | { type: "field"; field: Exclude<keyof Draft, "permissionToPublish">; value: string }
  | { type: "permission"; value: boolean }
  | { type: "clear" };

const emptyDraft: Draft = {
  name: "",
  role: "",
  company: "",
  email: "",
  message: "",
  permissionToPublish: false,
  website: "",
};

function draftReducer(state: Draft, action: DraftAction): Draft {
  if (action.type === "clear") {
    return emptyDraft;
  }

  if (action.type === "permission") {
    return { ...state, permissionToPublish: action.value };
  }

  return { ...state, [action.field]: action.value };
}

type FeedbackFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  emailHref: string | null;
};

export function FeedbackForm({
  title,
  description,
  submitLabel,
  emailHref,
}: FeedbackFormProps) {
  const [draft, updateDraft] = useReducer(draftReducer, emptyDraft);
  const form = useContactForm();
  const submitting = form.status === "submitting";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ok = await form.submit({
      kind: "feedback",
      ...draft,
    });

    if (ok) {
      updateDraft({ type: "clear" });
    }
  }

  if (form.status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-surface px-5 py-6 sm:px-6">
        <h3 className="text-lg font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 text-base leading-7 text-muted" role="status">
          Feedback received. It stays private unless I follow up with you.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface px-5 py-6 sm:px-6"
      noValidate
    >
      <div>
        <h3 className="text-lg font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </div>

      <Field id="feedback-name" label="Name">
        <input
          id="feedback-name"
          name="name"
          autoComplete="name"
          required
          maxLength={FIELD_LIMITS.name}
          value={draft.name}
          onChange={(event) =>
            updateDraft({
              type: "field",
              field: "name",
              value: event.target.value,
            })
          }
          className={controlClassName}
        />
      </Field>

      <Field id="feedback-role" label="Role">
        <input
          id="feedback-role"
          name="role"
          autoComplete="organization-title"
          required
          maxLength={FIELD_LIMITS.role}
          value={draft.role}
          onChange={(event) =>
            updateDraft({
              type: "field",
              field: "role",
              value: event.target.value,
            })
          }
          className={controlClassName}
        />
      </Field>

      <Field id="feedback-company" label="Company" optional>
        <input
          id="feedback-company"
          name="company"
          autoComplete="organization"
          maxLength={FIELD_LIMITS.company}
          value={draft.company}
          onChange={(event) =>
            updateDraft({
              type: "field",
              field: "company",
              value: event.target.value,
            })
          }
          className={controlClassName}
        />
      </Field>

      <Field
        id="feedback-email"
        label="Email"
        optional
        hint="Only if you want a follow-up."
      >
        <input
          id="feedback-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={FIELD_LIMITS.email}
          value={draft.email}
          onChange={(event) =>
            updateDraft({
              type: "field",
              field: "email",
              value: event.target.value,
            })
          }
          className={controlClassName}
        />
      </Field>

      <Field id="feedback-message" label="Feedback">
        <textarea
          id="feedback-message"
          name="message"
          required
          rows={5}
          maxLength={FIELD_LIMITS.message}
          value={draft.message}
          onChange={(event) =>
            updateDraft({
              type: "field",
              field: "message",
              value: event.target.value,
            })
          }
          className={`${controlClassName} min-h-32 resize-y py-3`}
        />
      </Field>

      <div className={honeypotClassName} aria-hidden="true">
        <label htmlFor="feedback-website">Website</label>
        <input
          id="feedback-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={draft.website}
          onChange={(event) =>
            updateDraft({
              type: "field",
              field: "website",
              value: event.target.value,
            })
          }
        />
      </div>

      <div className="flex items-start gap-3 text-sm leading-6 text-foreground">
        <input
          id="feedback-permission"
          name="permissionToPublish"
          type="checkbox"
          checked={draft.permissionToPublish}
          onChange={(event) =>
            updateDraft({ type: "permission", value: event.target.checked })
          }
          className="mt-1 size-4 shrink-0 rounded border-border accent-foreground"
        />
        <label
          htmlFor="feedback-permission"
          className="cursor-pointer"
        >
          I’m comfortable with this being published later if you follow up
          with me first.
        </label>
      </div>

      <FormSubmitFeedback error={form.error} emailHref={emailHref} />

      <Button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="w-full sm:w-auto sm:min-w-36"
      >
        {submitting ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
