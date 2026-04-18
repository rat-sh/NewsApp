-- ============================================================
-- NewsApp — Supabase Schema
-- Run this entire file in your Supabase SQL Editor (once)
-- ============================================================

-- ── Enable UUID extension (already on by default in Supabase) ──
-- create extension if not exists "pgcrypto";


-- ════════════════════════════════════════════════════════════
-- 1. PROFILES  (one row per auth user)
-- ════════════════════════════════════════════════════════════
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text        not null,
  name        text        not null default '',
  created_at  timestamptz not null default now()
);

-- RLS on profiles
alter table profiles enable row level security;

-- Users can read their own profile
create policy "profiles: select own"
  on profiles for select
  using ( auth.uid() = id );

-- Users can insert their own profile (called during sign-up)
create policy "profiles: insert own"
  on profiles for insert
  with check ( auth.uid() = id );

-- Users can update their own profile
create policy "profiles: update own"
  on profiles for update
  using ( auth.uid() = id );


-- ════════════════════════════════════════════════════════════
-- 2. BOOKMARKS  (saved articles, synced from the app)
-- ════════════════════════════════════════════════════════════
create table if not exists bookmarks (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references profiles(id) on delete cascade,
  article_url text        not null,
  article_data jsonb      not null,
  created_at  timestamptz not null default now(),

  -- Prevent duplicate bookmarks per user
  unique (user_id, article_url)
);

-- Index for fast per-user lookups
create index if not exists bookmarks_user_id_idx
  on bookmarks (user_id, created_at desc);

-- RLS on bookmarks
alter table bookmarks enable row level security;

-- SELECT: users can only read their own bookmarks
create policy "bookmarks: select own"
  on bookmarks for select
  using ( auth.uid() = user_id );

-- INSERT: users can only add bookmarks for themselves
create policy "bookmarks: insert own"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

-- DELETE: users can only delete their own bookmarks
create policy "bookmarks: delete own"
  on bookmarks for delete
  using ( auth.uid() = user_id );


-- ════════════════════════════════════════════════════════════
-- 3. AUTO-CREATE PROFILE ON SIGN-UP  (Supabase trigger)
--    Fires after a new user is confirmed in auth.users so you
--    never have to create the profile row manually from the app.
-- ════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Attach the trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
