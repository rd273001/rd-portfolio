type AdminPageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function AdminPageIntro({
  eyebrow = "Private",
  title,
  description,
}: AdminPageIntroProps) {
  return (
    <header className="max-w-2xl">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted">{description}</p>
      ) : null}
    </header>
  );
}