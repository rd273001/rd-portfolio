import type { ReactNode } from "react";

import { SiteFooter } from "./SiteFooter";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen">
      <main id="content" tabIndex={-1} className="scroll-mt-20 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}