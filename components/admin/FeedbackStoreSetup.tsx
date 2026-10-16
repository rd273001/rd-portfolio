import { AdminPanel } from "./AdminPanel";

function EnvLine({ name }: { name: string }) {
  return (
    <code className="font-mono text-[13px] text-foreground">{name}</code>
  );
}

export function FeedbackStoreSetup() {
  return (
    <AdminPanel role="status" className="mt-8">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        Storage
      </p>
      <p className="mt-3 text-base font-medium text-foreground">
        Connect Supabase to load submissions
      </p>
      <p className="mt-2">
        Google sign-in is working. The feedback table migration is already on
        your Supabase project — add server env vars locally (and on Vercel for
        production), then restart the dev server.
      </p>
      <ol className="mt-5 list-decimal space-y-2 pl-5">
        <li>
          Supabase →{" "}
          <strong className="font-medium text-foreground">
            Project Settings → API
          </strong>
        </li>
        <li>
          Copy{" "}
          <strong className="font-medium text-foreground">Project URL</strong> →{" "}
          <EnvLine name="SUPABASE_URL" />
        </li>
        <li>
          Copy{" "}
          <strong className="font-medium text-foreground">service_role</strong>{" "}
          secret → <EnvLine name="SUPABASE_SERVICE_ROLE_KEY" /> (never{" "}
          <EnvLine name="NEXT_PUBLIC_*" />)
        </li>
        <li>
          Restart the dev server after saving <EnvLine name=".env.local" />
        </li>
      </ol>
      <p className="mt-5 text-xs leading-5 text-muted">
        Contact inquiry email (Resend) is unchanged. Public feedback saves here
        as <span className="text-foreground">pending</span> until you publish.
      </p>
    </AdminPanel>
  );
}