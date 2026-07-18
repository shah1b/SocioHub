-- Supported platforms narrow to: facebook, instagram, youtube, threads,
-- x, twitch, kick. Existing rows are remapped, and feed items gain a
-- reactions count that powers the Trending section.

-- Drop the old constraints first so rows can move to the new platforms.
alter table public.creators drop constraint creators_platform_check;
alter table public.feed_items drop constraint feed_items_platform_check;
alter table public.platform_connections drop constraint platform_connections_platform_check;

update public.creators set
  name = 'Formula 1', handle = '@f1', platform = 'instagram',
  avatar_url = 'https://unavatar.io/instagram/f1?fallback=false'
  where handle = 'r/formula1' and platform = 'reddit';

update public.creators set
  handle = '@TheAthletic', platform = 'x',
  avatar_url = 'https://unavatar.io/x/TheAthletic?fallback=false'
  where handle = 'theathletic.com' and platform = 'rss';

update public.creators set
  handle = 'ESPN FC', platform = 'facebook',
  avatar_url = 'https://unavatar.io/facebook/ESPNFC?fallback=false'
  where handle = '@ESPNFC' and platform = 'youtube';

update public.creators set handle = '@Waveform', platform = 'youtube'
  where handle = 'Waveform Podcast' and platform = 'podcast';

update public.creators set handle = '@syntaxfm', platform = 'youtube'
  where handle = 'Syntax Podcast' and platform = 'podcast';

update public.feed_items f set platform = c.platform
  from public.creators c where f.creator_id = c.id;

insert into public.creators (name, handle, platform, category, avatar_url) values
  ('Adam Mosseri', '@mosseri', 'threads', 'Technology',
   'https://unavatar.io/instagram/mosseri?fallback=false'),
  ('xQc', '@xqc', 'kick', 'Gaming',
   'https://unavatar.io/twitch/xqc?fallback=false')
on conflict (handle, platform) do nothing;

-- Re-add the tightened constraints.
alter table public.creators add constraint creators_platform_check
  check (platform in ('facebook', 'instagram', 'youtube', 'threads', 'x', 'twitch', 'kick'));

alter table public.feed_items add constraint feed_items_platform_check
  check (platform in ('facebook', 'instagram', 'youtube', 'threads', 'x', 'twitch', 'kick'));

alter table public.platform_connections add constraint platform_connections_platform_check
  check (platform in ('facebook', 'instagram', 'youtube', 'threads', 'x', 'twitch', 'kick'));

alter table public.feed_items add column reactions integer not null default 0;

update public.feed_items f set reactions = v.reactions
from (values
  ('Here we go! Midfield transfer saga finally complete — medical booked for tomorrow morning, five-year deal agreed.', 48200),
  ('TypeScript 6.0 in 100 seconds… and why your build just broke', 21400),
  ('Post-race debrief: how the undercut decided the British GP', 96500),
  ('The Truth About Foldables in 2026: 3 Years Later', 33800),
  ('New research: tracing how large models plan ahead when writing, and what that means for interpretability.', 15200),
  ('Tactical breakdown: why the high press stopped working after 60 minutes', 7400),
  ('Building a real-time multiplayer game in Rust — day 3', 3900),
  ('Ep. 312 — The smartphone camera wars are over. Software won.', 5600),
  ('New open weights release: a 3B model that matches last year''s 70B on reasoning benchmarks. Runs on a phone.', 28700),
  ('Extended highlights: the 4-3 thriller everyone will talk about', 61200),
  ('We built a PC entirely from parts found in e-waste', 44100),
  ('POV: you deployed on Friday', 18900)
) as v(title, reactions)
where f.title = v.title;

update public.feed_items
  set title = 'Race weekend in photos: the undercut that decided the British GP',
      ai_summary = 'Gallery from the pit wall: the lap-18 stop that won the race, plus the turn-4 clash the stewards are reviewing.'
  where title = 'Post-race debrief: how the undercut decided the British GP';
