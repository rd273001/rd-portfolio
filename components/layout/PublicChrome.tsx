"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type PublicChromeProps = {
  header: ReactNode;
  children: ReactNode;
};

export function PublicChrome({ header, children }: PublicChromeProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <>
      {header}
      {children}
    </>
  );
}