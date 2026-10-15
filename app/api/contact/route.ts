import { site } from "@/content/site";
import { consumeRateLimit, getRequestIp } from "@/lib/contact/rate-limit";
import { sendContactMail } from "@/lib/contact/mail";
import { insertPendingFeedback } from "@/lib/feedback/queries";
import {
  isHoneypotFilled,
  isSubmittedTooFast,
  parseContactRequest,
  validateContactFields,
} from "@/lib/contact/validate";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function isAllowedOrigin(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  return origin === site.canonicalUrl;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return json({ error: "Request origin is not allowed." }, 403);
  }

  const ip = getRequestIp(request);

  if (!consumeRateLimit(ip)) {
    return json({ error: "Too many messages. Please try again later." }, 429);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const parsed = parseContactRequest(payload);

  if (!parsed) {
    return json({ error: "Invalid request." }, 400);
  }

  if (isHoneypotFilled(parsed)) {
    return json({ ok: true });
  }

  if (isSubmittedTooFast(parsed)) {
    return json({ error: "Please wait a moment and try again." }, 400);
  }

  const fieldError = validateContactFields(parsed);

  if (fieldError) {
    return json({ error: fieldError }, 400);
  }

  if (parsed.kind === "inquiry") {
    const result = await sendContactMail(parsed);

    if (!result.ok && result.code === "not_configured") {
      return json(
        {
          error:
            "The form is not configured on this environment yet. Please use email instead.",
          code: "not_configured",
        },
        503,
      );
    }

    if (!result.ok) {
      return json(
        { error: "Could not send the message. Please try email instead." },
        502,
      );
    }

    return json({ ok: true });
  }

  const persistResult = await insertPendingFeedback(parsed);
  const mailResult = await sendContactMail(parsed);

  if (persistResult.ok || mailResult.ok) {
    return json({ ok: true });
  }

  if (
    persistResult.code === "not_configured" &&
    mailResult.code === "not_configured"
  ) {
    return json(
      {
        error:
          "The form is not configured on this environment yet. Please use email instead.",
        code: "not_configured",
      },
      503,
    );
  }

  return json(
    { error: "Could not send the message. Please try email instead." },
    502,
  );
}