import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAllowlisted } from "@/lib/auth/allowlist";

export async function getAdminSession() {
  const session = await auth();
  const email = session?.user?.email;

  if (!isAllowlisted(email)) {
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return session;
}