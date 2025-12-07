-- Module 10: Child Profile (Stage, Not Name)
-- RLS + policies for children, owner-only access

alter table public.children
  enable row level security;

alter table public.children
  force row level security;

-- Reset any prior policies for a clean baseline
drop policy if exists "children_select_own" on public.children;
drop policy if exists "children_insert_own" on public.children;
drop policy if exists "children_update_own" on public.children;
drop policy if exists "children_delete_own" on public.children;
drop policy if exists "Users can manage their own children" on public.children;

-- Users can SELECT only their own children
create policy "children_select_own"
on public.children
for select
using ( auth.uid() = user_id );

-- Users can INSERT only rows where user_id = auth.uid()
create policy "children_insert_own"
on public.children
for insert
with check ( auth.uid() = user_id );

-- Users can UPDATE only their own children and keep user_id aligned
create policy "children_update_own"
on public.children
for update
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id );

-- Users can DELETE only their own children
create policy "children_delete_own"
on public.children
for delete
using ( auth.uid() = user_id );
