import { Resend } from "resend";

import { site } from "@/content/site";
import { getInboxEmail } from "@/content/socials";

import { reasonLabel, type ContactRequest } from "./validate";

function escapeText(value: string): string {
  return value.replaceAll("\r", "");
}

export function getMailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || getInboxEmail();

  if (!apiKey || !from || !to) {
    return null;
  }

  return { apiKey, from, to };
}

function buildInquiryBody(request: Extract<ContactRequest, { kind: "inquiry" }>) {
  return [
    `New message from ${site.canonicalUrl}`,
    "",
    `Name: ${escapeText(request.name)}`,
    `Email: ${escapeText(request.email)}`,
    `Reason: ${reasonLabel(request.reason)}`,
    "",
    escapeText(request.message),
  ].join("\n");
}

function buildFeedbackBody(
  request: Extract<ContactRequest, { kind: "feedback" }>,
) {
  return [
    `Private feedback from ${site.canonicalUrl}`,
    "",
    `Name: ${escapeText(request.name)}`,
    `Role: ${escapeText(request.role)}`,
    `Company: ${escapeText(request.company) || "(not given)"}`,
    `Email: ${escapeText(request.email) || "(not given)"}`,
    `Permission to publish: ${request.permissionToPublish ? "yes" : "no"}`,
    "",
    escapeText(request.message),
  ].join("\n");
}

export async function sendContactMail(request: ContactRequest) {
  const config = getMailConfig();

  if (!config) {
    return { ok: false as const, code: "not_configured" as const };
  }

  const resend = new Resend(config.apiKey);
  const isInquiry = request.kind === "inquiry";
  const subject = isInquiry
    ? `Portfolio inquiry: ${reasonLabel(request.reason)}`
    : "Portfolio feedback";
  const text = isInquiry ? buildInquiryBody(request) : buildFeedbackBody(request);
  const replyTo = request.email || undefined;

  const { data, error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    replyTo,
    subject,
    text,
    tags: [{ name: "kind", value: request.kind }],
  });

  if (error || !data) {
    return { ok: false as const, code: "send_failed" as const };
  }

  return { ok: true as const, id: data.id };
}