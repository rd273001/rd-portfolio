"use client";

import { AdminRouteError } from "@/components/admin/AdminRouteError";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminRouteError reset={reset} />;
}