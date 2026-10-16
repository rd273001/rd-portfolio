export const FIELD_LIMITS = {
  name: 80,
  email: 254,
  role: 80,
  company: 120,
  message: 4000,
  reason: 40,
} as const;

export const MIN_SUBMIT_MS = 1500;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const RATE_LIMIT_MAX = 5;