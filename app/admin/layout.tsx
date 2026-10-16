import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAdminSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Feedback admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function AdminHeaderSlot() {
  const session = await getAdminSession();
  return <AdminHeader email={session?.user?.email ?? null} />;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<AdminHeader email={null} />}>
        <AdminHeaderSlot />
      </Suspense>
      <main
        id="content"
        tabIndex={-1}
        className="flex flex-1 flex-col scroll-mt-20 outline-none"
      >
        <Suspense fallback={null}>{children}</Suspense>
      </main>
    </div>
  );
}