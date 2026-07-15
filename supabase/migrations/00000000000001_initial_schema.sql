-- Flow initial schema
-- User profiles, platform connections, interests, creators, feed items,
-- watch-later, and per-user feed rules — all with row-level security.

-- ============================================================ profiles

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  attention_mode text not null default 'relax'
    check (attention_mode in ('relax', 'focus', 'learning', 'weekend')),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid () = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid () = id);

-- Auto-create a profile row when a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', null));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();

-- ============================================== platform connections

create table public.platform_connections (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null
    check (platform in ('youtube', 'reddit', 'x', 'rss', 'twitch', 'podcast')),
  status text not null default 'connected'
    check (status in ('connected', 'pending', 'error', 'disconnected')),
  connected_at timestamptz not null default now(),
  unique (user_id, platform)
);

alter table public.platform_connections enable row level security;

create policy "Users manage own connections"
  on public.platform_connections for all using (auth.uid () = user_id);

-- ========================================================== interests

create table public.interests (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique,
  name text not null,
  category text not null
);

alter table public.interests enable row level security;

create policy "Interests are readable by everyone"
  on public.interests for select using (true);

create table public.user_interests (
  user_id uuid not null references public.profiles (id) on delete cascade,
  interest_id uuid not null references public.interests (id) on delete cascade,
  primary key (user_id, interest_id)
);

alter table public.user_interests enable row level security;

create policy "Users manage own interests"
  on public.user_interests for all using (auth.uid () = user_id);

-- =========================================================== creators

create table public.creators (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  handle text not null,
  platform text not null
    check (platform in ('youtube', 'reddit', 'x', 'rss', 'twitch', 'podcast')),
  avatar_url text,
  category text not null,
  unique (handle, platform)
);

alter table public.creators enable row level security;

create policy "Creators are readable by everyone"
  on public.creators for select using (true);

create table public.follows (
  user_id uuid not null references public.profiles (id) on delete cascade,
  creator_id uuid not null references public.creators (id) on delete cascade,
  notifications boolean not null default false,
  followed_at timestamptz not null default now(),
  primary key (user_id, creator_id)
);

alter table public.follows enable row level security;

create policy "Users manage own follows"
  on public.follows for all using (auth.uid () = user_id);

-- ========================================================= feed items

create table public.feed_items (
  id uuid primary key default gen_random_uuid (),
  creator_id uuid not null references public.creators (id) on delete cascade,
  platform text not null
    check (platform in ('youtube', 'reddit', 'x', 'rss', 'twitch', 'podcast')),
  type text not null
    check (type in ('video', 'short', 'post', 'article', 'podcast', 'stream')),
  title text not null,
  url text not null,
  thumbnail_url text,
  ai_summary text,
  category text not null,
  tags text[] not null default '{}',
  duration_seconds integer,
  published_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index feed_items_published_at_idx
  on public.feed_items (published_at desc);

create index feed_items_creator_idx on public.feed_items (creator_id);

alter table public.feed_items enable row level security;

create policy "Feed items are readable by authenticated users"
  on public.feed_items for select to authenticated using (true);

-- ======================================================== watch later

create table public.watch_later (
  user_id uuid not null references public.profiles (id) on delete cascade,
  feed_item_id uuid not null references public.feed_items (id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, feed_item_id)
);

alter table public.watch_later enable row level security;

create policy "Users manage own watch later"
  on public.watch_later for all using (auth.uid () = user_id);

-- ===================================================== feed rules
-- "Build your own algorithm": per-user hide/show rules.

create table public.feed_rules (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  hide_topics text[] not null default '{}',
  hide_types text[] not null default '{}',
  show_only text[] not null default '{}',
  chronological boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.feed_rules enable row level security;

create policy "Users manage own feed rules"
  on public.feed_rules for all using (auth.uid () = user_id);

-- =============================================================== seed

insert into public.interests (slug, name, category) values
  ('football',  'Football',  'Sports'),
  ('formula-1', 'Formula 1', 'Sports'),
  ('nba',       'NBA',       'Sports'),
  ('ai',        'AI',        'Technology'),
  ('apple',     'Apple',     'Technology'),
  ('startups',  'Startups',  'Technology'),
  ('coding',    'Coding',    'Technology'),
  ('movies',    'Movies',    'Entertainment'),
  ('anime',     'Anime',     'Entertainment'),
  ('music',     'Music',     'Entertainment'),
  ('gaming',    'Gaming',    'Entertainment'),
  ('finance',   'Finance',   'Business'),
  ('science',   'Science',   'Learning'),
  ('books',     'Books',     'Learning'),
  ('fitness',   'Fitness',   'Lifestyle'),
  ('travel',    'Travel',    'Lifestyle'),
  ('design',    'Design',    'Creative');
