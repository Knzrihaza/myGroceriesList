-- =============================================================================
-- cms-seed.sql — My GroceriesList app data
-- Run SECOND, after seed.sql.
-- Overwrites the placeholder app row and populates all content tables.
-- Safe to re-run (deletes existing rows for this app before re-inserting).
-- =============================================================================

do $$
declare
  v_app_id uuid;
begin

-- ── 1. App ────────────────────────────────────────────────────────────────────

-- Remove duplicate rows if seed.sql was run more than once, keeping the oldest
delete from apps
where id not in (
  select id from apps order by created_at asc limit 1
);

-- Grab the surviving row id
select id into v_app_id from apps limit 1;

if v_app_id is null then
  -- Table is empty — insert fresh
  insert into apps (name, developer, contact_email, website_url)
  values ('My GroceriesList', 'Hamza Kanzari', 'kanzari.hamza@gmail.com', null)
  returning id into v_app_id;
end if;

-- Update the single row with real data
update apps
set
  name          = 'My GroceriesList',
  developer     = 'Hamza Kanzari',
  contact_email = 'kanzari.hamza@gmail.com',
  website_url   = null
where id = v_app_id;


-- ── 2. Privacy rules ──────────────────────────────────────────────────────────

delete from rules where app_id = v_app_id;

insert into rules
  (app_id, data_collected, purpose, retention, third_parties, legal_basis, "order")
values
  (v_app_id,
   'Email address',
   'Account creation, authentication, and transactional emails (e.g. password reset)',
   'Retained for the lifetime of the account. Deleted within 30 days of account deletion.',
   'Supabase (authentication and database infrastructure)',
   'Contractual necessity', 0),

  (v_app_id,
   'Display name and avatar',
   'Personalising the user profile shown to household members',
   'Retained for the lifetime of the account. Deleted within 30 days of account deletion.',
   'Supabase (database infrastructure)',
   'Contractual necessity', 1),

  (v_app_id,
   'Grocery lists and items',
   'Core app functionality — storing, syncing, and sharing grocery lists across devices and household members',
   'Retained for the lifetime of the account. Deleted within 30 days of account deletion.',
   'Supabase (database infrastructure)',
   'Contractual necessity', 2),

  (v_app_id,
   'Household and group membership',
   'Enabling shared grocery lists between users who belong to the same household group',
   'Retained for the lifetime of the account. Deleted within 30 days of account deletion.',
   'Supabase (database infrastructure)',
   'Contractual necessity', 3),

  (v_app_id,
   'Subscription and purchase status',
   'Determining whether a user has an active Pro subscription to unlock premium features',
   'Retained for the lifetime of the account. Deleted within 30 days of account deletion.',
   'RevenueCat (subscription management)',
   'Contractual necessity', 4),

  (v_app_id,
   'Device locale and currency preference',
   'Displaying prices and dates in the user''s preferred format',
   'Retained in the user profile for the lifetime of the account.',
   'None',
   'Legitimate interest', 5),

  (v_app_id,
   'Usage analytics (anonymous)',
   'Understanding how the app is used in order to improve features and fix issues',
   'Aggregated and anonymised — not linked to individual accounts.',
   'None',
   'Legitimate interest', 6);


-- ── 3. Landing page config ────────────────────────────────────────────────────

delete from landing_config where app_id = v_app_id;

insert into landing_config (
  app_id,
  primary_color, accent_color, font,
  logo_url, favicon_url,
  navbar_enabled, hero_enabled, trust_badges_enabled, features_enabled,
  stats_enabled, screenshots_enabled, steps_enabled, app_store_enabled, cta_enabled,
  navbar, hero, trust_badges, features, stats, screenshots, steps, app_store, cta, footer
) values (
  v_app_id,

  '#F46A05',   -- brand orange
  '#1E1E2D',   -- dark navy
  'inter',
  null, null,

  -- section toggles: on/off
  true,   -- navbar
  true,   -- hero
  false,  -- trust_badges
  true,   -- features
  false,  -- stats
  false,  -- screenshots
  true,   -- steps
  true,   -- app_store
  true,   -- cta

  -- navbar
  '{"links": [{"label": "Features", "url": "#features"}, {"label": "How it works", "url": "#steps"}], "cta_text": "Download free", "cta_url": "#app-store"}'::jsonb,

  -- hero
  '{"headline": "Your grocery lists, always in sync", "subheadline": "Shop smarter with shared lists, recurring purchases, and AI-powered suggestions — on any device.", "cta_text": "Download free", "cta_url": "#app-store", "secondary_cta_text": "See features", "secondary_cta_url": "#features", "image_url": null, "bg_style": "gradient"}'::jsonb,

  -- trust_badges (disabled)
  '[]'::jsonb,

  -- features
  '[{"icon": "ShoppingCart", "title": "Organised lists", "description": "Create as many grocery lists as you need. Sort by category, mark items as checked, and keep everything tidy."}, {"icon": "Users", "title": "Household sharing", "description": "Invite your household or family to the same list. Changes sync in real time — no more double buying."}, {"icon": "RotateCcw", "title": "Recurring lists", "description": "Set any list to repeat daily, weekly, or monthly. Your regulars are always ready to go."}, {"icon": "Sparkles", "title": "AI suggestions", "description": "Get smart item suggestions based on what you usually buy, so your list builds itself."}, {"icon": "Tag", "title": "Categories & priorities", "description": "Tag items by aisle and priority so you can fly through the store without backtracking."}, {"icon": "Moon", "title": "Dark mode", "description": "Easy on the eyes in any lighting. Follows your system preference automatically."}]'::jsonb,

  -- stats (disabled)
  '[]'::jsonb,

  -- screenshots (disabled)
  '[]'::jsonb,

  -- how it works steps
  '[{"title": "Create your list", "description": "Add items, pick categories, and set priorities. Takes seconds."}, {"title": "Invite your household", "description": "Share a list with family or housemates. Everyone stays on the same page."}, {"title": "Shop and check off", "description": "Mark items as you go. The list updates live for everyone."}]'::jsonb,

  -- app store badges
  '{"label": "Download My GroceriesList", "apple_url": null, "google_url": null}'::jsonb,

  -- cta band
  '{"headline": "Ready to shop smarter?", "subtext": "Free to download. Pro plan available for households that need more.", "primary_text": "Download for iOS", "primary_url": "#app-store", "secondary_text": "Download for Android", "secondary_url": "#app-store"}'::jsonb,

  -- footer
  '{"copyright": "© 2025 My GroceriesList. All rights reserved.", "social_links": [], "columns": [{"heading": "Legal", "links": [{"label": "Privacy Policy", "url": "/privacy-policy"}, {"label": "Delete Account", "url": "/delete-account"}]}, {"heading": "Contact", "links": [{"label": "kanzari.hamza@gmail.com", "url": "mailto:kanzari.hamza@gmail.com"}]}]}'::jsonb
);


-- ── 4. Delete account page config ─────────────────────────────────────────────

delete from delete_account_config where app_id = v_app_id;

insert into delete_account_config (
  app_id, title, intro, steps, data_deleted, contact_email, retention_text
) values (
  v_app_id,

  'How to Delete Your Account',

  'You can permanently delete your My GroceriesList account at any time from within the app. Deleting your account removes all your personal data from our servers.',

  '[{"title": "Open the app", "description": "Launch My GroceriesList on your device."}, {"title": "Go to Profile", "description": "Tap the Profile icon in the bottom navigation bar."}, {"title": "Open Account Settings", "description": "Scroll down and tap \"Account Settings\"."}, {"title": "Tap Delete Account", "description": "Tap the \"Delete Account\" option and confirm when prompted."}]'::jsonb,

  '["Account and profile data", "All grocery lists and items", "Household memberships", "Subscription status", "App preferences and settings"]'::jsonb,

  'kanzari.hamza@gmail.com',

  'All data is permanently removed within 30 days of account deletion.'
);

end $$;
