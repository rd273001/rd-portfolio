"use client";

import { useReducer, type FormEvent } from "react";

import { Button } from "@/components/primitives";
import type { ContactReason } from "@/content/types";
import { FIELD_LIMITS } from "@/lib/contact/limits";

import { controlClassName, Field, honeypotClassName } from "./Field";
import { FormSubmitFeedback } from "./FormSubmitFeedback";
import { useContactForm } from "./useContactForm";

type Draft = {
  name: string;
  email: string;
  reason: string;
  message: string;
  website: string;
};

type DraftAction =
  | { type: "field"; field: keyof Draft; value: string }
  | { type: "clear" };

const emptyDraft: Draft = {
  name: "",
  email: "",
  reason: "",
  message: "",
  website: "",
};

function draftReducer(state: Draft, action: DraftAction): Draft {
  if (action.type === "clear") {
    return emptyDraft;
  }

  return { ...state, [action.field]: action.value };
}

type InquiryFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  reasons: ContactReason[];
  emailHref: string | null;
};

export function InquiryForm({
  title,
  description,
  submitLabel,
  reasons,
  emailHref,
}: InquiryFormProps) {
  const [draft, updateDraft] = useReducer(draftReducer, emptyDraft);
  const form = useContactForm();
  const submitting = form.status === "submitting";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ok = await form.submit({
      kind: "inquiry",
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
          Message sent. I’ll get back to you if a reply is needed.
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

      <Field id="inquiry-name" label="Name">
        <input
          id="inquiry-name"
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

      <Field id="inquiry-email" label="Email">
        <input
          id="inquiry-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
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

      <Field id="inquiry-reason" label="Reason">
        <select
          id="inquiry-reason"
          name="reason"
          required
          value={draft.reason}
          onChange={(event) =>
            updateDraft({
              type: "field",
              field: "reason",
              value: event.target.value,
            })
          }
          className={controlClassName}
        >
          <option value="" disabled>
            Choose one
          </option>
          {reasons.map((reason) => (
            <option key={reason.id} value={reason.id}>
              {reason.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="inquiry-message" label="Message">
        <textarea
          id="inquiry-message"
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
        <label htmlFor="inquiry-website">Website</label>
        <input
          id="inquiry-website"
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
