"use client";

import { useEffect, useReducer, useRef } from "react";

import {
  isSubmittedTooFast,
  parseContactRequest,
  validateContactFields,
} from "@/lib/contact/validate";

type Status = "idle" | "submitting" | "success" | "error";

type FormState = {
  status: Status;
  error: string | null;
};

type FormAction =
  | { type: "submit" }
  | { type: "success" }
  | { type: "error"; message: string }
  | { type: "resetStatus" };

function formReducer(_state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "submit":
      return { status: "submitting", error: null };
    case "success":
      return { status: "success", error: null };
    case "error":
      return { status: "error", error: action.message };
    case "resetStatus":
      return { status: "idle", error: null };
  }
}

export function useContactForm() {
  const startedAtRef = useRef(0);
  const [state, dispatch] = useReducer(formReducer, {
    status: "idle",
    error: null,
  });

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  async function submit(payload: Record<string, unknown>) {
    const parsed = parseContactRequest({
      ...payload,
      startedAt: startedAtRef.current,
    });

    if (!parsed) {
      dispatch({ type: "error", message: "Invalid request." });
      return false;
    }

    const fieldError = validateContactFields(parsed);

    if (fieldError) {
      dispatch({ type: "error", message: fieldError });
      return false;
    }

    if (isSubmittedTooFast(parsed)) {
      dispatch({
        type: "error",
        message: "Please wait a moment and try again.",
      });
      return false;
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
        dispatch({
          type: "error",
          message:
            data?.error ?? "Could not send the message. Please try email instead.",
        });
        return false;
      }

      dispatch({ type: "success" });
      return true;
    } catch {
      dispatch({
        type: "error",
        message: "Could not send the message. Please try email instead.",
      });
      return false;
    }
  }

  return { ...state, submit };
}
