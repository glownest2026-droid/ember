-- Module 10: Child Profile (Stage, Not Name)
-- children table: no child name; only DOB, gender, interests + owner linkage

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  date_of_birth date not null,
  gender text not null check (
    gender in (
      'female',
      'male',
      'non_binary',
      'prefer_not_to_say',
      'other'
    )
  ),
  interests text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_children_updated_at on public.children;

create trigger set_children_updated_at
before update on public.children
for each row
execute function public.set_updated_at();
