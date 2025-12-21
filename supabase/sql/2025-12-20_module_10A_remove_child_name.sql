-- Module 10A: Privacy hotfix - Remove child name collection
-- Date: 2025-12-20
-- Reason: Privacy promise - never collect child's name
-- Migration: Rename name column to legacy_name and make nullable

-- Step 1: Rename column (if it exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'children' and column_name = 'name'
  ) then
    alter table public.children rename column name to legacy_name;
  end if;
end $$;

-- Step 2: Make nullable (if column exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'children' and column_name = 'legacy_name'
  ) then
    alter table public.children alter column legacy_name drop not null;
  end if;
end $$;

-- Step 3: Add comment to document deprecation
comment on column public.children.legacy_name is 'Deprecated: do not collect child name (privacy promise). This column exists only for legacy data compatibility and must not be used in new code.';

-- Note: RLS policies are unchanged - they only check user_id ownership, not name field.
