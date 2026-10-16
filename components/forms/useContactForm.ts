"use client";

import { useEffect, useReducer, useRef } from "react";

import {
  getContactFieldErrors,
  isSubmittedTooFast,
  parseContactRequest,
} from "@/lib/contact/validate";

type Status = "idle" | "submitting" | "success" | "error";

type FormState = {
  status: Status;
  formError: string | null;
  emailFallback: boolean;
  fieldErrors: Record<string, string>;
};

type FormAction =
  | { type: "submit" }
  | { type: "success" }
  | { type: "field_errors"; errors: Record<string, string> }
  | { type: "form_error"; message: string; emailFallback?: boolean }
  | { type: "clear_field"; field: string }
  | { type: "resetStatus" };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "submit":
      return {
        ...state,
        status: "submitting",
        formError: null,
        emailFallback: false,
        fieldErrors: {},
      };
    case "success":
      return {
        status: "success",
        formError: null,
        emailFallback: false,
        fieldErrors: {},
      };
    case "field_errors":
      return {
        status: "idle",
        formError: null,
        emailFallback: false,
        fieldErrors: action.errors,
      };
    case "form_error":
      return {
        status: "error",
        formError: action.message,
        emailFallback: action.emailFallback ?? false,
        fieldErrors: {},
      };
    case "clear_field": {
      if (!state.fieldErrors[action.field]) {
        return state;
      }

      const fieldErrors = { ...state.fieldErrors };
      delete fieldErrors[action.field];
      return { ...state, fieldErrors };
    }
    case "resetStatus":
      return {
        status: "idle",
        formError: null,
        emailFallback: false,
        fieldErrors: {},
      };
  }
}

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string> };

export function useContactForm() {
  const startedAtRef = useRef(0);
  const [state, dispatch] = useReducer(formReducer, {
    status: "idle",
    formError: null,
    emailFallback: false,
    fieldErrors: {},
  });

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  function clearFieldError(field: string) {
    dispatch({ type: "clear_field", field });
  }

  async function submit(
    payload: Record<string, unknown>,
  ): Promise<ContactSubmitResult> {
    const parsed = parseContactRequest({
      ...payload,
      startedAt: startedAtRef.current,
    });

    if (!parsed) {
      dispatch({
        type: "form_error",
        message: "Invalid request.",
      });
      return { ok: false };
    }

    const fieldErrors = getContactFieldErrors(parsed);

    if (Object.keys(fieldErrors).length > 0) {
      dispatch({ type: "field_errors", errors: fieldErrors });
      return { ok: false, fieldErrors };
    }

    if (isSubmittedTooFast(parsed)) {
      dispatch({
        type: "form_error",
        message: "Please wait a moment and try again.",
      });
      return { ok: false };
    }

    dispatch({ type: "submit" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          startedAt: startedAtRef.current,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        ok?: boolean;
      } | null;

      if (!response.ok) {
        const message =
          data?.error ??
          "Could not send the message. Please try email instead.";
        const emailFallback =
          response.status === 502 ||
          response.status === 503 ||
          message.toLowerCase().includes("email");

        dispatch({
          type: "form_error",
          message,
          emailFallback,
        });
        return { ok: false };
      }

      dispatch({ type: "success" });
      return { ok: true };
    } catch {
      dispatch({
        type: "form_error",
        message: "Could not send the message. Please try email instead.",
        emailFallback: true,
      });
      return { ok: false };
    }
  }

  function reset() {
    dispatch({ type: "resetStatus" });
  }

  return {
    status: state.status,
    formError: state.formError,
    emailFallback: state.emailFallback,
    fieldErrors: state.fieldErrors,
    clearFieldError,
    reset,
    submit,
  };
}
