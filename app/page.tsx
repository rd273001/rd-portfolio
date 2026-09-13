import { Button, Container } from "@/components/primitives";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";

export default function Home() {
  const contact = socials.find((item) => item.id === "email");
  const github = socials.find((item) => item.id === "github");

  return (
    <Container as="main" className="flex min-h-full flex-col justify-center py-16">
      <p className="text-sm text-muted">{profile.currentTitle}</p>
      <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
        {profile.name}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg">
        {profile.headline}
      </p>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">
        {profile.summary}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {contact ? (
          <Button href={contact.href}>{contact.label}</Button>
        ) : null}
        {github ? (
          <Button href={github.href} variant="secondary">
            {github.label}
          </Button>
        ) : null}
      </div>
    </Container>
  );
}
