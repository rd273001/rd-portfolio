function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST ?? "";

  return raw
    .split(/[,;\s]+/)
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isAllowlisted(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const allowlist = getAdminAllowlist();

  if (allowlist.length === 0) {
    return false;
  }

  return allowlist.includes(normalizeEmail(email));
}