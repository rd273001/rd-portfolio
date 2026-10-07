import { site } from "@/content/site";

import { FIELD_LIMITS, MIN_SUBMIT_MS } from "./limits";

export const CONTACT_KINDS = ["inquiry", "feedback"] as const;

export type ContactKind = (typeof CONTACT_KINDS)[number];

export type InquiryFields = {
  kind: "inquiry";
  name: string;
  email: string;
  reason: string;
  message: string;
};

export type FeedbackFields = {
  kind: "feedback";
  name: string;
  role: string;
  company: string;
  email: string;
  message: string;
  permissionToPublish: boolean;
};

export type ContactFields = InquiryFields | FeedbackFields;

export type ContactRequest = ContactFields & {
  website: string;
  startedAt: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown, max: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "on";
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isKind(value: unknown): value is ContactKind {
  return CONTACT_KINDS.includes(value as ContactKind);
}

export function parseContactRequest(input: unknown): ContactRequest | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const body = input as Record<string, unknown>;

  if (!isKind(body.kind)) {
    return null;
  }

  const website = asString(body.website, 200);
  const startedAt = asNumber(body.startedAt);

  if (body.kind === "inquiry") {
    return {
      kind: "inquiry",
      name: asString(body.name, FIELD_LIMITS.name),
      email: asString(body.email, FIELD_LIMITS.email).toLowerCase(),
      reason: asString(body.reason, FIELD_LIMITS.reason),
      message: asString(body.message, FIELD_LIMITS.message),
      website,
      startedAt,
    };
  }

  return {
    kind: "feedback",
    name: asString(body.name, FIELD_LIMITS.name),
    role: asString(body.role, FIELD_LIMITS.role),
    company: asString(body.company, FIELD_LIMITS.company),
    email: asString(body.email, FIELD_LIMITS.email).toLowerCase(),
    message: asString(body.message, FIELD_LIMITS.message),
    permissionToPublish: asBoolean(body.permissionToPublish),
    website,
    startedAt,
  };
}

export function isHoneypotFilled(request: ContactRequest): boolean {
  return request.website.length > 0;
}

export function isSubmittedTooFast(request: ContactRequest, now = Date.now()): boolean {
  if (!request.startedAt) {
    return true;
  }

  const elapsed = now - request.startedAt;
  return elapsed < MIN_SUBMIT_MS || elapsed > 1000 * 60 * 60 * 12;
}

const reasonIds = new Set(site.contact.inquiry.reasons.map((reason) => reason.id));

export function validateContactFields(
  request: ContactRequest,
): string | null {
  if (request.name.length < 2) {
    return "Please enter your name.";
  }

  if (request.message.length < 12) {
    return "Please write a slightly longer message.";
  }

  if (request.kind === "inquiry") {
    if (!EMAIL_PATTERN.test(request.email)) {
      return "Please enter a valid email.";
    }

    if (!reasonIds.has(request.reason)) {
      return "Please choose a reason.";
    }

    return null;
  }

  if (request.role.length < 2) {
    return "Please add your role.";
  }

  if (request.email && !EMAIL_PATTERN.test(request.email)) {
    return "Please enter a valid email, or leave it blank.";
  }

  return null;
}

export function reasonLabel(reasonId: string): string {
  return (
    site.contact.inquiry.reasons.find((reason) => reason.id === reasonId)
      ?.label ?? reasonId
  );
}
