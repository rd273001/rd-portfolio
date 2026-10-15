import type { Metadata } from "next";

import { AdminPageIntro } from "@/components/admin/AdminPageIntro";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { FeedbackCard } from "@/components/admin/FeedbackCard";
import { FeedbackFilters } from "@/components/admin/FeedbackFilters";
import { FeedbackStoreSetup } from "@/components/admin/FeedbackStoreSetup";
import { Container } from "@/components/primitives";
import { requireAdmin } from "@/lib/auth/session";
import {
  countFeedbackByStatus,
  isFeedbackStoreConfigured,
  listFeedback,
} from "@/lib/feedback/queries";
import { parseFeedbackFilter } from "@/lib/feedback/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feedback",
  robots: {
    index: false,
    follow: false,
  },
};

type FeedbackPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function emptyCopy(filter: ReturnType<typeof parseFeedbackFilter>) {
  if (filter === "published") {
    return "Nothing published yet. The homepage section stays hidden until you publish a note.";
  }

  if (filter === "archived") {
    return "No archived notes.";
  }

  if (filter === "all") {
    return "No submissions yet. Public feedback lands here as pending.";
  }

  return "No pending notes.";
}

export default async function AdminFeedbackPage({
  searchParams,
}: FeedbackPageProps) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = parseFeedbackFilter(status);
  const configured = isFeedbackStoreConfigured();

  if (!configured) {
    return (
      <section className="py-12 sm:py-16">
        <Container>
          <AdminPageIntro
            title="Feedback"
            description="You are signed in. Connect Supabase to review pending notes and publish testimonials to the homepage."
          />
          <FeedbackStoreSetup />
        </Container>
      </section>
    );
  }

  let submissions: Awaited<ReturnType<typeof listFeedback>>;
  let counts: Awaited<ReturnType<typeof countFeedbackByStatus>>;

  try {
    [submissions, counts] = await Promise.all([
      listFeedback(filter),
      countFeedbackByStatus(),
    ]);
  } catch {
    return (
      <section className="py-12 sm:py-16">
        <Container>
          <AdminPageIntro
            title="Feedback"
            description="You are signed in. Submissions could not be loaded from Supabase."
          />
          <AdminPanel role="alert" className="mt-8">
            Check{" "}
            <code className="font-mono text-[13px] text-foreground">
              SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="font-mono text-[13px] text-foreground">
              SUPABASE_SERVICE_ROLE_KEY
            </code>
            , restart the server, then try again. The feedback table must exist
            in this project.
          </AdminPanel>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <AdminPageIntro
          title="Feedback"
          description="Public form notes arrive as pending. Publish is a deliberate action — the checkbox on the site is intent only."
        />

        <div className="mt-8">
          <FeedbackFilters current={filter} counts={counts} />
        </div>

        {submissions.length === 0 ? (
          <AdminPanel role="status" className="mt-8">
            {emptyCopy(filter)}
          </AdminPanel>
        ) : (
          <ul className="mt-10 divide-y divide-border">
            {submissions.map((submission) => (
              <li key={submission.id} className="py-8 first:pt-0">
                <FeedbackCard submission={submission} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}