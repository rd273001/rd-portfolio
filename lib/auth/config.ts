export function isGoogleAuthConfigured() {
  return Boolean(
    process.env.AUTH_SECRET?.trim() &&
      process.env.AUTH_GOOGLE_ID?.trim() &&
      process.env.AUTH_GOOGLE_SECRET?.trim() &&
      process.env.ADMIN_EMAIL_ALLOWLIST?.trim(),
  );
}