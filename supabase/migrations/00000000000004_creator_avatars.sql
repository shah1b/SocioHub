-- Public profile images for seeded creators, served via the unavatar
-- avatar proxy. The app falls back to gradient initials when unset or
-- the image fails to load.
update public.creators set avatar_url = v.url
from (values
  ('@fireship',        'youtube', 'https://unavatar.io/youtube/@fireship?fallback=false'),
  ('@mkbhd',           'youtube', 'https://unavatar.io/youtube/@mkbhd?fallback=false'),
  ('@LinusTechTips',   'youtube', 'https://unavatar.io/youtube/@LinusTechTips?fallback=false'),
  ('@ESPNFC',          'youtube', 'https://unavatar.io/youtube/@ESPNFC?fallback=false'),
  ('@FabrizioRomano',  'x',       'https://unavatar.io/x/FabrizioRomano?fallback=false'),
  ('theathletic.com',  'rss',     'https://unavatar.io/theathletic.com?fallback=false'),
  ('@AnthropicAI',     'x',       'https://unavatar.io/x/AnthropicAI?fallback=false'),
  ('@huggingface',     'x',       'https://unavatar.io/x/huggingface?fallback=false'),
  ('r/formula1',       'reddit',  'https://unavatar.io/reddit.com?fallback=false'),
  ('Waveform Podcast', 'podcast', 'https://unavatar.io/youtube/@Waveform?fallback=false'),
  ('@3blue1brown',     'youtube', 'https://unavatar.io/youtube/@3blue1brown?fallback=false'),
  ('@OpenAI',          'x',       'https://unavatar.io/x/OpenAI?fallback=false'),
  ('@veritasium',      'youtube', 'https://unavatar.io/youtube/@veritasium?fallback=false'),
  ('@TifoFootball',    'youtube', 'https://unavatar.io/youtube/@TifoFootball?fallback=false'),
  ('Syntax Podcast',   'podcast', 'https://unavatar.io/youtube/@syntaxfm?fallback=false')
) as v(handle, platform, url)
where creators.handle = v.handle and creators.platform = v.platform;
