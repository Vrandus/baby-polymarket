-- Run this in the Supabase SQL editor to set up the database.

create table public.bets (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  choice text not null check (choice in ('boy', 'girl')),
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamptz default now() not null
);

-- If you previously created the unique name index, drop it:
-- drop index if exists bets_name_lower_idx;

-- Enable realtime for live updates
alter publication supabase_realtime add table public.bets;

-- Row-level security
alter table public.bets enable row level security;

create policy "Anyone can read bets"
  on public.bets for select to anon using (true);

create policy "Anyone can insert bets"
  on public.bets for insert to anon with check (true);

create policy "Anyone can delete bets"
  on public.bets for delete to anon using (true);
