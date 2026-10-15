import { Container } from "@/components/primitives";

type AdminPageSkeletonProps = {
  label: string;
};

export function AdminPageSkeleton({ label }: AdminPageSkeletonProps) {
  return (
    <section
      className="py-12 sm:py-16"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Container>
        <div className="max-w-2xl animate-pulse">
          <div className="h-3 w-20 rounded-full bg-accent" />
          <div className="mt-5 h-10 w-40 rounded-2xl bg-accent sm:h-11" />
          <div className="mt-5 h-4 max-w-xl rounded-full bg-accent" />
          <div className="mt-3 h-4 w-2/3 max-w-md rounded-full bg-accent" />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <div className="h-11 w-24 animate-pulse rounded-full bg-accent" />
          <div className="h-11 w-28 animate-pulse rounded-full bg-accent" />
          <div className="h-11 w-24 animate-pulse rounded-full bg-accent" />
          <div className="h-11 w-16 animate-pulse rounded-full bg-accent" />
        </div>
        <div className="mt-10 max-w-2xl animate-pulse space-y-3">
          <div className="h-3 w-24 rounded bg-accent" />
          <div className="h-4 w-full rounded bg-accent" />
          <div className="h-4 w-5/6 rounded bg-accent" />
          <div className="h-4 w-2/3 rounded bg-accent" />
        </div>
        <span className="sr-only">{label}</span>
      </Container>
    </section>
  );
}