# Technical Considerations

Not every social media platform allows third-party apps to display a user's personal feed. Flow must use official APIs where available and respect each platform's terms of service.

## Integration strategy by platform

| Platform | Approach |
|---|---|
| YouTube | Official Data API — creator uploads, channel subscriptions |
| Reddit | Official API — subreddit and user post feeds |
| X | Official API, subject to access tier and rate limits |
| RSS | Open standard — no restrictions |
| Twitch | Official API — stream/channel status |
| Podcasts | RSS-based podcast feeds |
| Instagram | Limited third-party feed access; start with notifications, creator tracking, and links rather than full feed reproduction |
| Facebook | Same constraint as Instagram — compliant, non-feed experiences first |
| TikTok | Same constraint — compliant, non-feed experiences first |

## Compliant alternatives for restricted platforms

Where a platform's API does not permit full feed reproduction, Flow should still provide value without violating terms of service:

- Push notifications when a followed creator posts
- Creator/channel tracking and metadata
- Deep links back to the native app or web experience
- AI-generated summaries of publicly available content
- Manual "mark as seen" / watch-later bridging

## Guiding principle

Flow's own philosophy — respecting user attention and avoiding manipulative design — should also apply to how it treats platform partners: build against official APIs, respect rate limits and terms of service, and never scrape or spoof access to restricted feeds.
