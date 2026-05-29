create table if not exists landing_config (
  id                    uuid primary key default gen_random_uuid(),
  app_id                uuid references apps(id) on delete cascade unique,
  primary_color         text not null default '#6366f1',
  accent_color          text not null default '#0f172a',
  font                  text not null default 'inter',
  logo_url              text,
  favicon_url           text,
  navbar_enabled        boolean not null default true,
  hero_enabled          boolean not null default true,
  trust_badges_enabled  boolean not null default false,
  features_enabled      boolean not null default true,
  stats_enabled         boolean not null default false,
  screenshots_enabled   boolean not null default false,
  steps_enabled         boolean not null default false,
  app_store_enabled     boolean not null default false,
  cta_enabled           boolean not null default true,
  navbar                jsonb not null default '{}',
  hero                  jsonb not null default '{}',
  trust_badges          jsonb not null default '[]',
  features              jsonb not null default '[]',
  stats                 jsonb not null default '[]',
  screenshots           jsonb not null default '[]',
  steps                 jsonb not null default '[]',
  app_store             jsonb not null default '{}',
  cta                   jsonb not null default '{}',
  footer                jsonb not null default '{}',
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create table if not exists delete_account_config (
  id             uuid primary key default gen_random_uuid(),
  app_id         uuid references apps(id) on delete cascade unique,
  title          text not null default 'How to Delete Your Account',
  intro          text,
  steps          jsonb not null default '[]',
  data_deleted   jsonb not null default '[]',
  contact_email  text,
  retention_text text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table landing_config        enable row level security;
alter table delete_account_config enable row level security;

create policy "landing_config_select_public"  on landing_config       for select to anon, authenticated using (true);
create policy "landing_config_insert_auth"    on landing_config       for insert to authenticated with check (true);
create policy "landing_config_update_auth"    on landing_config       for update to authenticated using (true);
create policy "landing_config_delete_auth"    on landing_config       for delete to authenticated using (true);

create policy "delete_account_select_public"  on delete_account_config for select to anon, authenticated using (true);
create policy "delete_account_insert_auth"    on delete_account_config for insert to authenticated with check (true);
create policy "delete_account_update_auth"    on delete_account_config for update to authenticated using (true);
create policy "delete_account_delete_auth"    on delete_account_config for delete to authenticated using (true);
