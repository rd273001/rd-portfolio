import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";

export default async function AdminIndexPage() {
  await requireAdmin();
  redirect("/admin/feedback");
}