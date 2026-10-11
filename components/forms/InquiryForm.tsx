"use client";

import { useReducer, type FormEvent } from "react";

import { Button } from "@/components/primitives";
import type { ContactReason } from "@/content/types";
import { FIELD_LIMITS } from "@/lib/contact/limits";
import { cn } from "@/lib/cn";
import type { InquiryFieldKey } from "@/lib/contact/validate";

import type { ContactFormTone } from "./contactFormTone";
import { CustomSelect } from "./CustomSelect";
import {
  controlClassName,
  Field,
  fieldDescribedBy,
  honeypotClassName,
  messageTextareaClassName,
} from "./Field";
import {
  ContactFormShell,
  ContactFormSuccess,
} from "./ContactFormShell";
import { ContactFormHeightSwap } from "./ContactFormHeightSwap";
import { focusFirstFieldError } from "./focusFirstFieldError";
import { FormSubmitButtonLabel } from "./FormSubmitButtonLabel";
import { FormSubmitFeedback } from "./FormSubmitFeedback";
import { useContactForm } from "./useContactForm";

const INQUIRY_FIELD_ORDER: InquiryFieldKey[] = [
  "name",
  "email",
  "reason",
  "message",
];

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
  titleId?: string;
  className?: string;
  tone?: ContactFormTone;
};

export function InquiryForm({
  title,
  description,
  submitLabel,
  reasons,
  emailHref,
  titleId,
  className,
  tone = "light",
}: InquiryFormProps) {
  const [draft, updateDraft] = useReducer(draftReducer, emptyDraft);
  const form = useContactForm();
  const submitting = form.status === "submitting";
  const fieldErrors = form.fieldErrors as Partial<Record<InquiryFieldKey, string>>;
  const onDark = tone === "on-dark";

  function updateField(field: keyof Draft, value: string) {
    if (field !== "website" && fieldErrors[field as InquiryFieldKey]) {
      form.clearFieldError(field);
    }

    updateDraft({ type: "field", field, value });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await form.submit({
      kind: "inquiry",
      ...draft,
    });

    if (result.ok) {
      updateDraft({ type: "clear" });
      return;
    }

    if (result.fieldErrors) {
      focusFirstFieldError(result.fieldErrors, INQUIRY_FIELD_ORDER, "inquiry");
    }
  }

  const isSuccess = form.status === "success";

  return (
    <div
      className={cn(
        isSuccess &&
          "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-center",
      )}
    >
    <ContactFormHeightSwap viewKey={isSuccess ? "success" : "form"}>
      {isSuccess ? (
        <ContactFormSuccess
          title="Message sent"
          titleId={titleId}
          message="I’ll get back to you if a reply is needed."
          resetLabel="Send another message"
          onReset={form.reset}
          className={className}
          tone={tone}
        />
      ) : (
    <ContactFormShell className={className} tone={tone}>
    <form
      onSubmit={onSubmit}
      className="flex flex-1 flex-col gap-5"
      noValidate
    >
      <div>
        <h3
          id={titleId}
          className={cn(
            "text-lg font-semibold tracking-[-0.03em]",
            onDark ? "text-background" : "text-foreground",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm leading-6",
            onDark ? "text-background/70" : "text-muted",
          )}
        >
          {description}
        </p>
      </div>

      <Field
        id="inquiry-name"
        label="Name"
        error={fieldErrors.name}
        tone={tone}
      >
        <input
          id="inquiry-name"
          name="name"
          autoComplete="name"
          required
          maxLength={FIELD_LIMITS.name}
          value={draft.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldDescribedBy(
            "inquiry-name",
            undefined,
            fieldErrors.name,
          )}
          className={controlClassName(Boolean(fieldErrors.name), tone)}
        />
      </Field>

      <Field
        id="inquiry-email"
        label="Email"
        error={fieldErrors.email}
        tone={tone}
      >
        <input
          id="inquiry-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={FIELD_LIMITS.email}
          value={draft.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldDescribedBy(
            "inquiry-email",
            undefined,
            fieldErrors.email,
          )}
          className={controlClassName(Boolean(fieldErrors.email), tone)}
        />
      </Field>

      <Field
        id="inquiry-reason"
        label="Reason"
        error={fieldErrors.reason}
        tone={tone}
      >
        <CustomSelect
          id="inquiry-reason"
          tone={tone}
          invalid={Boolean(fieldErrors.reason)}
          value={draft.reason}
          onChange={(next) => updateField("reason", next)}
          options={reasons}
          placeholder="Choose one"
          aria-describedby={fieldDescribedBy(
            "inquiry-reason",
            undefined,
            fieldErrors.reason,
          )}
        />
      </Field>

      <Field
        id="inquiry-message"
        label="Message"
        error={fieldErrors.message}
        tone={tone}
      >
        <textarea
          id="inquiry-message"
          name="message"
          required
          rows={5}
          maxLength={FIELD_LIMITS.message}
          value={draft.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldDescribedBy(
            "inquiry-message",
            undefined,
            fieldErrors.message,
          )}
          className={cn(
            controlClassName(Boolean(fieldErrors.message), tone),
            messageTextareaClassName,
          )}
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
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <FormSubmitFeedback
        error={form.formError}
        emailHref={emailHref}
        showEmailLink={form.emailFallback}
        tone={tone}
      />

      <Button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className={cn(
          "w-full sm:w-auto sm:min-w-36",
          onDark &&
            "bg-background text-foreground [@media(hover:hover)]:hover:opacity-90 active:opacity-90 focus-visible:outline-background",
        )}
      >
        <FormSubmitButtonLabel busy={submitting} idleLabel={submitLabel} />
      </Button>
    </form>
    </ContactFormShell>
      )}
    </ContactFormHeightSwap>
    </div>
  );
}