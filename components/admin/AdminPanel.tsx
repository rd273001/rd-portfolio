import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type AdminPanelProps = {
  children: ReactNode;
  className?: string;
  role?: "status" | "alert" | undefined;
};

export function AdminPanel({ children, className, role }: AdminPanelProps) {
  return (
    <div
      role={role}
      className={cn("max-w-2xl text-sm leading-6 text-muted", className)}
    >
      {children}
    </div>
  );
}