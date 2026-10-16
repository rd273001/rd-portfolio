export function signInErrorMessage(error: string | undefined): string | null {
  if (!error) {
    return null;
  }

  if (error === "AccessDenied") {
    return "This Google account is not authorized.";
  }

  if (error === "Configuration") {
    return "Sign-in is not configured on this environment yet.";
  }

  if (error === "RateLimit") {
    return "Too many sign-in attempts. Wait a few minutes, then try again.";
  }

  return "Could not sign in. Please try again.";
}