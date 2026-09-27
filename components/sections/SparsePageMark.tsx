import { cn } from "@/lib/cn";

type SparsePageMarkProps = {
  kind: "not-found" | "error";
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SparsePageMark({ kind, className }: SparsePageMarkProps) {
  return (
    <div
      className={cn(
        "mb-6 inline-flex size-13 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-muted shadow-[0_16px_40px_-34px_rgba(17,17,17,0.45)]",
        className,
      )}
      aria-hidden
    >
      {kind === "not-found" ? (
        <svg
          viewBox="0 0 24 24"
          className="block size-6 shrink-0"
          aria-hidden
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" {...stroke} />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" {...stroke} />
          <path d="m14.5 12.5-5 5" {...stroke} />
          <path d="m9.5 12.5 5 5" {...stroke} />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="block size-6 shrink-0"
          aria-hidden
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" {...stroke} />
          <path d="M21 3v5h-5" {...stroke} />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" {...stroke} />
          <path d="M8 16H3v5" {...stroke} />
        </svg>
      )}
    </div>
  );
}
