-- ── Tables ───────────────────────────────────────────────────────────────────

create table if not exists apps (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  developer      text not null,
  contact_email  text not null,
  website_url    text,
  setup_complete boolean not null default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists rules (
  id             uuid primary key default gen_random_uuid(),
  app_id         uuid references apps(id) on delete cascade,
  data_collected text not null,
  purpose        text not null,
  retention      text not null,
  third_parties  text not null,
  legal_basis    text not null,
  "order"        integer not null default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── Seed ─────────────────────────────────────────────────────────────────────

insert into apps (name, developer, contact_email)
values ('My App', 'Admin', 'admin@example.com')
on conflict do nothing;

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table apps  enable row level security;
alter table rules enable row level security;

-- apps: anyone can read (public /privacy-policy page), only authenticated can write
create policy "apps_select_public"  on apps for select to anon, authenticated using (true);
create policy "apps_insert_auth"    on apps for insert to authenticated with check (true);
create policy "apps_update_auth"    on apps for update to authenticated using (true);
create policy "apps_delete_auth"    on apps for delete to authenticated using (true);

-- rules: anyone can read, only authenticated can write
create policy "rules_select_public" on rules for select to anon, authenticated using (true);
create policy "rules_insert_auth"   on rules for insert to authenticated with check (true);
create policy "rules_update_auth"   on rules for update to authenticated using (true);
create policy "rules_delete_auth"   on rules for delete to authenticated using (true);
