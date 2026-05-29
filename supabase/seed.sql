-- =============================================================================
-- seed.sql — Schema setup
-- Run FIRST in Supabase Dashboard → SQL Editor.
-- Creates all tables, enables RLS, sets up policies and storage bucket.
-- Safe to re-run (idempotent).
-- =============================================================================


-- ── Tables ────────────────────────────────────────────────────────────────────

create table if not exists apps (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  developer      text        not null,
  contact_email  text        not null,
  website_url    text,
  setup_complete boolean     not null default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists rules (
  id             uuid        primary key default gen_random_uuid(),
  app_id         uuid        references apps(id) on delete cascade,
  data_collected text        not null,
  purpose        text        not null,
  retention      text        not null,
  third_parties  text        not null,
  legal_basis    text        not null,
  "order"        integer     not null default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists landing_config (
  id                   uuid        primary key default gen_random_uuid(),
  app_id               uuid        references apps(id) on delete cascade unique,
  -- branding
  primary_color        text        not null default '#6366f1',
  accent_color         text        not null default '#0f172a',
  font                 text        not null default 'inter',
  logo_url             text,
  favicon_url          text,
  -- section toggles
  navbar_enabled       boolean     not null default true,
  hero_enabled         boolean     not null default true,
  trust_badges_enabled boolean     not null default false,
  features_enabled     boolean     not null default true,
  stats_enabled        boolean     not null default false,
  screenshots_enabled  boolean     not null default false,
  steps_enabled        boolean     not null default false,
  app_store_enabled    boolean     not null default false,
  cta_enabled          boolean     not null default true,
  -- section content (JSONB)
  navbar               jsonb       not null default '{}',
  hero                 jsonb       not null default '{}',
  trust_badges         jsonb       not null default '[]',
  features             jsonb       not null default '[]',
  stats                jsonb       not null default '[]',
  screenshots          jsonb       not null default '[]',
  steps                jsonb       not null default '[]',
  app_store            jsonb       not null default '{}',
  cta                  jsonb       not null default '{}',
  footer               jsonb       not null default '{}',
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create table if not exists delete_account_config (
  id             uuid        primary key default gen_random_uuid(),
  app_id         uuid        references apps(id) on delete cascade unique,
  title          text        not null default 'How to Delete Your Account',
  intro          text,
  steps          jsonb       not null default '[]',
  data_deleted   jsonb       not null default '[]',
  contact_email  text,
  retention_text text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);


-- Add setup_complete if the table was created before this column existed
alter table apps add column if not exists setup_complete boolean not null default false;


-- ── Initial app row ───────────────────────────────────────────────────────────
-- Placeholder — run cms-seed.sql afterwards to overwrite with real data.

insert into apps (name, developer, contact_email)
values ('My App', 'Admin', 'admin@example.com')
on conflict do nothing;


-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table apps                  enable row level security;
alter table rules                 enable row level security;
alter table landing_config        enable row level security;
alter table delete_account_config enable row level security;

-- Drop policies first so this file is safe to re-run
do $$ begin
  drop policy if exists "apps_select_public"  on apps;
  drop policy if exists "apps_insert_auth"    on apps;
  drop policy if exists "apps_update_auth"    on apps;
  drop policy if exists "apps_delete_auth"    on apps;

  drop policy if exists "rules_select_public" on rules;
  drop policy if exists "rules_insert_auth"   on rules;
  drop policy if exists "rules_update_auth"   on rules;
  drop policy if exists "rules_delete_auth"   on rules;

  drop policy if exists "landing_config_select_public" on landing_config;
  drop policy if exists "landing_config_insert_auth"   on landing_config;
  drop policy if exists "landing_config_update_auth"   on landing_config;
  drop policy if exists "landing_config_delete_auth"   on landing_config;

  drop policy if exists "delete_account_select_public" on delete_account_config;
  drop policy if exists "delete_account_insert_auth"   on delete_account_config;
  drop policy if exists "delete_account_update_auth"   on delete_account_config;
  drop policy if exists "delete_account_delete_auth"   on delete_account_config;
end $$;

-- apps
create policy "apps_select_public" on apps for select to anon, authenticated using (true);
create policy "apps_insert_auth"   on apps for insert to authenticated with check (true);
create policy "apps_update_auth"   on apps for update to authenticated using (true);
create policy "apps_delete_auth"   on apps for delete to authenticated using (true);

-- rules
create policy "rules_select_public" on rules for select to anon, authenticated using (true);
create policy "rules_insert_auth"   on rules for insert to authenticated with check (true);
create policy "rules_update_auth"   on rules for update to authenticated using (true);
create policy "rules_delete_auth"   on rules for delete to authenticated using (true);

-- landing_config
create policy "landing_config_select_public" on landing_config for select to anon, authenticated using (true);
create policy "landing_config_insert_auth"   on landing_config for insert to authenticated with check (true);
create policy "landing_config_update_auth"   on landing_config for update to authenticated using (true);
create policy "landing_config_delete_auth"   on landing_config for delete to authenticated using (true);

-- delete_account_config
create policy "delete_account_select_public" on delete_account_config for select to anon, authenticated using (true);
create policy "delete_account_insert_auth"   on delete_account_config for insert to authenticated with check (true);
create policy "delete_account_update_auth"   on delete_account_config for update to authenticated using (true);
create policy "delete_account_delete_auth"   on delete_account_config for delete to authenticated using (true);


-- ── Storage bucket ────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('landing-assets', 'landing-assets', true)
on conflict (id) do nothing;

do $$ begin
  drop policy if exists "landing_assets_select_public" on storage.objects;
  drop policy if exists "landing_assets_insert_auth"   on storage.objects;
  drop policy if exists "landing_assets_update_auth"   on storage.objects;
  drop policy if exists "landing_assets_delete_auth"   on storage.objects;
end $$;

create policy "landing_assets_select_public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'landing-assets');

create policy "landing_assets_insert_auth"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'landing-assets');

create policy "landing_assets_update_auth"
  on storage.objects for update to authenticated
  using (bucket_id = 'landing-assets');

create policy "landing_assets_delete_auth"
  on storage.objects for delete to authenticated
  using (bucket_id = 'landing-assets');
