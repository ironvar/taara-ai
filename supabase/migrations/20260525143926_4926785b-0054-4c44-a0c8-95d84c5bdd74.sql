create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  rating int not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 4 and 600),
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Users insert own review"
  on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users update own review"
  on public.reviews for update using (auth.uid() = user_id);

create policy "Users delete own review"
  on public.reviews for delete using (auth.uid() = user_id);

create index reviews_created_at_idx on public.reviews (created_at desc);