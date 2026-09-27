import type { ReactNode } from "react";

import { SiteFooter } from "./SiteFooter";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <main
        id="content"
        tabIndex={-1}
        className="flex flex-1 flex-col scroll-mt-20 outline-none"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}