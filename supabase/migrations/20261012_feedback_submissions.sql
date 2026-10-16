create type public.feedback_status as enum ('pending', 'published', 'archived');

create table public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text not null default '',
  email text not null default '',
  quote text not null,
  permission_to_publish boolean not null default false,
  status public.feedback_status not null default 'pending',
  created_at timestamptz not null default now(),
  published_at timestamptz,
  archived_at timestamptz,
  constraint feedback_submissions_name_check check (char_length(trim(name)) >= 2),
  constraint feedback_submissions_quote_check check (char_length(trim(quote)) >= 12)
);

create index feedback_submissions_status_created_at_idx
  on public.feedback_submissions (status, created_at desc);

alter table public.feedback_submissions enable row level security;

-- Homepage could use the anon key later. Writes stay on the Next.js server
-- with the service role, which bypasses RLS. Never auto-publish inserts.
create policy "published_select_public"
  on public.feedback_submissions
  for select
  to anon, authenticated
  using (status = 'published');