-- Core Schema for Project Ember
-- Date: 2025-11-04
create extension if not exists pgcrypto;

-- PRODUCTS (public read)
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  rating         numeric(2,1) check (rating >= 0 and rating <= 5),
  affiliate_url  text,
  image_url      text,
  why_it_matters text,
  tags           text[] not null default '{}',
  age_band       text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- CHILDREN (owner-only)
-- Privacy promise: never collect a child's name. No name column.
create table if not exists public.children (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  birthdate   date,
  gender      text,
  age_band    text,
  preferences jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists children_user_id_idx on public.children(user_id);

-- CLICKS (owner-only)
create table if not exists public.clicks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  context     text,
  referer     text,
  created_at  timestamptz not null default now()
);
create index if not exists clicks_user_created_idx on public.clicks(user_id, created_at desc);

-- Performance indexes
create index if not exists products_age_band_idx on public.products(age_band);
create index if not exists products_tags_gin on public.products using gin (tags);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_children_updated_at on public.children;
create trigger trg_children_updated_at before update on public.children
for each row execute function public.set_updated_at();

-- RLS
alter table public.products enable row level security;
alter table public.children enable row level security;
alter table public.clicks   enable row level security;

-- products: public SELECT only
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (true);

-- children: owner-only CRUD
drop policy if exists "children_select_own" on public.children;
create policy "children_select_own" on public.children for select using (auth.uid() = user_id);

drop policy if exists "children_insert_own" on public.children;
create policy "children_insert_own" on public.children for insert with check (auth.uid() = user_id);

drop policy if exists "children_update_own" on public.children;
create policy "children_update_own" on public.children
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "children_delete_own" on public.children;
create policy "children_delete_own" on public.children for delete using (auth.uid() = user_id);

-- clicks: owner-only CRUD
drop policy if exists "clicks_select_own" on public.clicks;
create policy "clicks_select_own" on public.clicks for select using (auth.uid() = user_id);

drop policy if exists "clicks_insert_own" on public.clicks;
create policy "clicks_insert_own" on public.clicks for insert with check (auth.uid() = user_id);

drop policy if exists "clicks_update_own" on public.clicks;
create policy "clicks_update_own" on public.clicks
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clicks_delete_own" on public.clicks;
create policy "clicks_delete_own" on public.clicks for delete using (auth.uid() = user_id);

-- Notes:
-- - products writes require service role server-side.
-- - tags should be lowercase slugs for best GIN matches.
