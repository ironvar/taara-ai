
-- profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles viewable by all" on public.profiles for select using (true);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = user_id);

-- chats
create table public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  model text not null default 'google/gemini-2.5-flash',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.chats enable row level security;
create policy "Users view own chats" on public.chats for select using (auth.uid() = user_id);
create policy "Users insert own chats" on public.chats for insert with check (auth.uid() = user_id);
create policy "Users update own chats" on public.chats for update using (auth.uid() = user_id);
create policy "Users delete own chats" on public.chats for delete using (auth.uid() = user_id);
create index chats_user_updated_idx on public.chats(user_id, updated_at desc);

-- messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "Users view own messages" on public.messages for select using (auth.uid() = user_id);
create policy "Users insert own messages" on public.messages for insert with check (auth.uid() = user_id);
create policy "Users delete own messages" on public.messages for delete using (auth.uid() = user_id);
create index messages_chat_idx on public.messages(chat_id, created_at);

-- bookmarks (tools)
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, tool_id)
);
alter table public.bookmarks enable row level security;
create policy "Users view own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users insert own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- saved images
create table public.saved_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  image_url text not null,
  model text,
  created_at timestamptz not null default now()
);
alter table public.saved_images enable row level security;
create policy "Users view own images" on public.saved_images for select using (auth.uid() = user_id);
create policy "Users insert own images" on public.saved_images for insert with check (auth.uid() = user_id);
create policy "Users delete own images" on public.saved_images for delete using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_set_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger chats_set_updated before update on public.chats
  for each row execute function public.set_updated_at();

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
