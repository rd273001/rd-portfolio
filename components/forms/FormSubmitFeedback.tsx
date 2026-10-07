type FormSubmitFeedbackProps = {
  error: string | null;
  emailHref: string | null;
};

export function FormSubmitFeedback({
  error,
  emailHref,
}: FormSubmitFeedbackProps) {
  if (!error) {
    return null;
  }

  return (
    <div aria-live="polite">
      <p className="text-sm leading-6 text-foreground" role="alert">
        {error}
        {emailHref ? (
          <>
            {" "}
            <a
              href={emailHref}
              className="font-medium text-foreground underline decoration-foreground/35 underline-offset-4"
            >
              Email me instead
            </a>
            .
          </>
        ) : null}
      </p>
    </div>
  );
}
