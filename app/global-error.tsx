"use client";

import Link from "next/link";

const stroke = {
  fill: "none",
  stroke: "#5c5c5c",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          background: "#fafafa",
          color: "#111111",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main
          style={{
            boxSizing: "border-box",
            display: "flex",
            minHeight: "100dvh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            maxWidth: "36rem",
            padding: "4rem 1rem",
            textAlign: "center",
          }}
        >
          <div
            aria-hidden
            style={{
              display: "inline-flex",
              width: "3.25rem",
              height: "3.25rem",
              marginBottom: "1.5rem",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e6e6e6",
              borderRadius: "1rem",
              background: "#ffffff",
              color: "#5c5c5c",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={24}
              height={24}
              aria-hidden
            >
              <path
                d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                {...stroke}
              />
              <path d="M21 3v5h-5" {...stroke} />
              <path
                d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                {...stroke}
              />
              <path d="M8 16H3v5" {...stroke} />
            </svg>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "2.25rem",
              fontWeight: 600,
              letterSpacing: "-0.045em",
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              margin: "1rem 0 0",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#5c5c5c",
            }}
          >
            The site failed to load. Try again, or return to the home page in a
            moment.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.75rem",
              marginTop: "2rem",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: "2.75rem",
                padding: "0 1.5rem",
                border: 0,
                borderRadius: "9999px",
                background: "#111111",
                color: "#fafafa",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                minHeight: "2.75rem",
                alignItems: "center",
                padding: "0 1.5rem",
                border: "1px solid #e6e6e6",
                borderRadius: "9999px",
                color: "#111111",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Back home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
