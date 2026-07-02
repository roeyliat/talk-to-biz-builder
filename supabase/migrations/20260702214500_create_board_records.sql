create table if not exists public.board_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  business_type text not null,
  boards_data jsonb not null,
  icon text not null default '🗂️',
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists board_records_user_id_idx on public.board_records(user_id);
create index if not exists board_records_created_at_idx on public.board_records(created_at desc);

create or replace function public.set_board_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_board_records_updated_at on public.board_records;
create trigger set_board_records_updated_at
before update on public.board_records
for each row
execute function public.set_board_records_updated_at();

alter table public.board_records enable row level security;

drop policy if exists "Users can view their own board records" on public.board_records;
create policy "Users can view their own board records"
on public.board_records
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own board records" on public.board_records;
create policy "Users can insert their own board records"
on public.board_records
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own board records" on public.board_records;
create policy "Users can update their own board records"
on public.board_records
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own board records" on public.board_records;
create policy "Users can delete their own board records"
on public.board_records
for delete
using (auth.uid() = user_id);
