"use client";

import { useReducer, type FormEvent } from "react";

import { Button } from "@/components/primitives";
import { FIELD_LIMITS } from "@/lib/contact/limits";
import { cn } from "@/lib/cn";
import type { FeedbackFieldKey } from "@/lib/contact/validate";

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

const FEEDBACK_FIELD_ORDER: FeedbackFieldKey[] = [
  "name",
  "role",
  "email",
  "message",
];

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
  description?: string;
  submitLabel: string;
  emailHref: string | null;
  successTitleId?: string;
  shellClassName?: string;
  unstyledShell?: boolean;
};

export function FeedbackForm({
  description = "",
  submitLabel,
  emailHref,
  successTitleId = "contact-feedback-status",
  shellClassName,
  unstyledShell = false,
}: FeedbackFormProps) {
  const [draft, updateDraft] = useReducer(draftReducer, emptyDraft);
  const form = useContactForm();
  const submitting = form.status === "submitting";
  const fieldErrors = form.fieldErrors as Partial<Record<FeedbackFieldKey, string>>;

  function updateField(
    field: Exclude<keyof Draft, "permissionToPublish">,
    value: string,
  ) {
    if (
      field !== "website" &&
      field !== "company" &&
      fieldErrors[field as FeedbackFieldKey]
    ) {
      form.clearFieldError(field);
    }

    updateDraft({ type: "field", field, value });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await form.submit({
      kind: "feedback",
      ...draft,
    });

    if (result.ok) {
      updateDraft({ type: "clear" });
      return;
    }

    if (result.fieldErrors) {
      focusFirstFieldError(result.fieldErrors, FEEDBACK_FIELD_ORDER, "feedback");
    }
  }

  const isSuccess = form.status === "success";
  const FormShell = unstyledShell ? "div" : ContactFormShell;

  return (
    <ContactFormHeightSwap viewKey={isSuccess ? "success" : "form"}>
      {isSuccess ? (
        unstyledShell ? (
          <div className={cn("flex flex-col", shellClassName)}>
            <div>
              <h3
                id={successTitleId}
                className="text-lg font-semibold tracking-[-0.03em] text-foreground"
              >
                Feedback sent
              </h3>
              <p className="mt-3 text-base leading-7 text-muted" role="status">
                It stays private unless I follow up with you.
              </p>
            </div>
            <button
              type="button"
              onClick={form.reset}
              className="-mx-1 mt-6 inline-flex w-auto max-w-full cursor-pointer self-start rounded-md px-2 py-1.5 text-sm font-medium text-foreground/85 underline decoration-foreground/35 underline-offset-4 transition-[color,background-color,text-decoration-color] duration-150 hover:bg-foreground/8 hover:text-foreground hover:decoration-foreground/70 active:bg-foreground/12 active:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Send more feedback
            </button>
          </div>
        ) : (
          <ContactFormSuccess
            className={shellClassName}
            title="Feedback sent"
            titleId={successTitleId}
            message="It stays private unless I follow up with you."
            resetLabel="Send more feedback"
            onReset={form.reset}
          />
        )
      ) : (
        <FormShell className={shellClassName}>
          <form
            onSubmit={onSubmit}
            className="flex flex-1 flex-col gap-5"
            noValidate
            aria-labelledby="contact-feedback-title"
          >
      {description ? (
        <p className="text-sm leading-6 text-muted">{description}</p>
      ) : null}

      <Field id="feedback-name" label="Name" error={fieldErrors.name}>
        <input
          id="feedback-name"
          name="name"
          autoComplete="name"
          required
          maxLength={FIELD_LIMITS.name}
          value={draft.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldDescribedBy(
            "feedback-name",
            undefined,
            fieldErrors.name,
          )}
          className={controlClassName(Boolean(fieldErrors.name))}
        />
      </Field>

      <Field id="feedback-role" label="Role" error={fieldErrors.role}>
        <input
          id="feedback-role"
          name="role"
          autoComplete="organization-title"
          required
          maxLength={FIELD_LIMITS.role}
          value={draft.role}
          onChange={(event) => updateField("role", event.target.value)}
          aria-invalid={fieldErrors.role ? true : undefined}
          aria-describedby={fieldDescribedBy(
            "feedback-role",
            undefined,
            fieldErrors.role,
          )}
          className={controlClassName(Boolean(fieldErrors.role))}
        />
      </Field>

      <Field id="feedback-company" label="Company" optional>
        <input
          id="feedback-company"
          name="company"
          autoComplete="organization"
          maxLength={FIELD_LIMITS.company}
          value={draft.company}
          onChange={(event) => updateField("company", event.target.value)}
          className={controlClassName()}
        />
      </Field>

      <Field
        id="feedback-email"
        label="Email"
        optional
        hint="Only if you want a follow-up."
        error={fieldErrors.email}
      >
        <input
          id="feedback-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={FIELD_LIMITS.email}
          value={draft.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldDescribedBy(
            "feedback-email",
            "Only if you want a follow-up.",
            fieldErrors.email,
          )}
          className={controlClassName(Boolean(fieldErrors.email))}
        />
      </Field>

      <Field id="feedback-message" label="Feedback" error={fieldErrors.message}>
        <textarea
          id="feedback-message"
          name="message"
          required
          rows={5}
          maxLength={FIELD_LIMITS.message}
          value={draft.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldDescribedBy(
            "feedback-message",
            undefined,
            fieldErrors.message,
          )}
          className={cn(
            controlClassName(Boolean(fieldErrors.message)),
            messageTextareaClassName,
          )}
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
          onChange={(event) => updateField("website", event.target.value)}
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
          className="mt-1 size-4 shrink-0 rounded border-border accent-foreground cursor-pointer"
        />
        <label htmlFor="feedback-permission" className="cursor-pointer select-none text-muted transition-colors hover:text-foreground">
          Allow this note to be featured as a testimonial.
        </label>
      </div>

      <FormSubmitFeedback
        error={form.formError}
        emailHref={emailHref}
        showEmailLink={form.emailFallback}
      />

      <Button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="w-full sm:w-auto sm:min-w-40 font-medium"
      >
        <FormSubmitButtonLabel busy={submitting} idleLabel={submitLabel} />
      </Button>
      </form>
    </FormShell>
      )}
    </ContactFormHeightSwap>
  );
}