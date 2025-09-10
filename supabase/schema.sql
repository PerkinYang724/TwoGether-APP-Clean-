-- Enable Row Level Security and basic tables
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  phase text check (phase in ('focus','short_break','long_break')) not null,
  minutes integer not null default 0
);

-- Forum tables
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table sessions enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own sessions" on sessions for all using (auth.uid() = user_id);
create policy "own posts" on posts for all using (auth.uid() = user_id);
create policy "own comments" on comments for all using (auth.uid() = user_id);

-- Allow all users to read posts and comments
create policy "read posts" on posts for select using (true);
create policy "read comments" on comments for select using (true);
