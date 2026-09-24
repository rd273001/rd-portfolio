import { Container } from "@/components/primitives";
import { certifications } from "@/content/certifications";
import { education } from "@/content/education";

function getPublicCredentialUrl(url?: string) {
  if (!url || url.startsWith("TODO_")) {
    return undefined;
  }

  return url;
}

export function EducationSection() {
  const verifiedEducation = education.filter(
    (item) =>
      item.status === "verified" &&
      item.institution &&
      item.credential &&
      item.start &&
      item.end &&
      !item.start.startsWith("TODO_") &&
      !item.end.startsWith("TODO_"),
  );
  const verifiedCertifications = certifications.filter(
    (item) => item.status === "verified" && item.name && item.issuer,
  );

  if (verifiedEducation.length === 0 && verifiedCertifications.length === 0) {
    return null;
  }

  return (
    <section id="education" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        {verifiedEducation.length > 0 ? (
          <>
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Education
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
                Academic background.
              </h2>
            </div>

            <div className="mt-10 grid gap-4">
              {verifiedEducation.map((item) => {
                const credentialUrl = getPublicCredentialUrl(item.credentialUrl);

                return (
                  <article
                    key={item.id}
                    className="rounded-3xl border border-border bg-surface p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold tracking-tight">
                          {item.credential}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-muted sm:text-base">
                          {item.institution}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted">
                        {item.start} – {item.end}
                      </p>
                    </div>
                    {credentialUrl ? (
                      <a
                        href={credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex rounded-md text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                      >
                        View credential
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </>
        ) : null}

        {verifiedCertifications.length > 0 ? (
          <div className={verifiedEducation.length > 0 ? "mt-16" : undefined}>
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Certifications
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
                Credentials.
              </h2>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {verifiedCertifications.map((item) => (
                <article
                  key={item.id}
                  className="flex min-h-full flex-col rounded-2xl border border-border bg-surface p-4 sm:p-5"
                >
                  <h3 className="text-base font-semibold leading-snug tracking-tight">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">{item.issuer}</p>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    >
                      View credential
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
