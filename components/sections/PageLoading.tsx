export function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="h-3 w-24 rounded-full bg-accent" />
      <div className="mt-6 h-10 w-3/4 max-w-lg rounded-2xl bg-accent" />
      <div className="mt-5 h-4 max-w-2xl rounded-full bg-accent" />
      <div className="mt-3 h-4 w-2/3 max-w-xl rounded-full bg-accent" />
      <span className="sr-only">{label}</span>
    </div>
  );
}