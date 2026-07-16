# Flow — Your Feed. Your Rules.

> **The AI-powered social media hub that gives Gen Z complete control over what they consume.**

Flow is an AI-powered personalized content dashboard. Instead of opening five different apps and letting five different algorithms decide what you see, users connect the platforms and creators they already follow, and Flow builds **one clean, intentional feed** — no engagement-optimized recommendations, no infinite scroll, no random reels.

```
Instagram · Facebook · YouTube · TikTok · X · Reddit  →  Flow
```

One app. One feed. Complete control.

---

## Why Flow exists

Modern social platforms optimize for **time-on-app**, not user satisfaction. A user opens Instagram to check one creator and, 45 minutes later, is watching unrelated videos they never chose to see. Flow inverts that relationship: the user — not the algorithm — decides what deserves their attention.

Read the full problem statement and philosophy in [`docs/vision.md`](docs/vision.md).

## Documentation

| Document | Contents |
|---|---|
| [`docs/vision.md`](docs/vision.md) | Vision, problem, solution, core philosophy, mission statement |
| [`docs/product-overview.md`](docs/product-overview.md) | User onboarding journey, main screens, attention modes |
| [`docs/ai-features.md`](docs/ai-features.md) | Smart categorization, AI summaries, recommendations, digest, filtering |
| [`docs/technical-considerations.md`](docs/technical-considerations.md) | Platform API constraints, ToS compliance, integration strategy |
| [`docs/business-model.md`](docs/business-model.md) | Free vs. Premium tiers |
| [`docs/privacy.md`](docs/privacy.md) | Privacy principles and data-handling commitments |
| [`docs/roadmap.md`](docs/roadmap.md) | Future features and success metrics |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | How to contribute to this repository |

## Core philosophy

> The user — not the algorithm — decides what deserves attention.

## Tech stack

- **Next.js 16** (App Router, TypeScript) — mobile-first web app
- **Tailwind CSS 4** — dark-mode-first, glassmorphism design system
- **Supabase** — auth, Postgres with row-level security (`supabase/migrations/`)

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs in **demo mode** with mock feed data out of the box — no configuration needed. To enable real auth and data, copy `.env.example` to `.env.local`, fill in your Supabase project credentials, and apply the migration in `supabase/migrations/`.

```bash
pnpm build   # production build
pnpm lint    # eslint
```

## Admin console

A desktop-first admin dashboard lives at [`/admin`](src/app/admin): overview analytics (DAU trend, ingestion by platform, KPI tiles with a date-range filter), user management, creator catalog, content/ingestion monitoring, a moderation queue, and feature-flag settings. It runs on demo data; the `admin` role and its RLS policies are in `supabase/migrations/00000000000002_admin_roles.sql`.

## Status

Product documentation plus a working mobile-first UI scaffold: home feed with daily digest and attention modes, explore, categories, creator hub, AI assistant (canned demo replies), watch later, onboarding flow, Supabase-backed auth wiring, and the admin console above. Platform ingestion and the real AI backend are not built yet — see [`docs/roadmap.md`](docs/roadmap.md).

## Mission

> **Flow exists to return control of attention to people.**
>
> Technology should serve users — not manipulate them. Every scroll should have purpose. Every minute should matter.
>
> Your feed. Your rules. Your Flow.
