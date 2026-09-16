"use client";

import Link from "next/link";

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
          minHeight: "100%",
          background: "#fafafa",
          color: "#111111",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main
          style={{
            boxSizing: "border-box",
            margin: "0 auto",
            maxWidth: "64rem",
            padding: "4rem 1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#5c5c5c",
            }}
          >
            Error
          </p>
          <h1
            style={{
              margin: "1.25rem 0 0",
              maxWidth: "36rem",
              fontSize: "2.25rem",
              fontWeight: 600,
              letterSpacing: "-0.045em",
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              margin: "1.25rem 0 0",
              maxWidth: "32rem",
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
              gap: "0.75rem",
              marginTop: "2rem",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: "2.75rem",
                padding: "0 1.25rem",
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
                padding: "0 1.25rem",
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