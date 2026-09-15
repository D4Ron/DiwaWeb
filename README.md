# Diwa Industries — website rework

A rebuild of [diwaindustries.tg](https://diwaindustries.tg), replacing the
WordPress + Divi 4.27 site with Next.js. The brand is unchanged: same indigo,
same works green, same Urbanist typeface. What changes is the delivery layer,
the typographic scale, and a small, deliberate motion system.

Rework plan and design rationale:
<https://claude.ai/code/artifact/7ceef4ed-68d9-4181-924a-c9f2319d5eca>

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.3 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, tokens in `web/src/app/globals.css` |
| Motion | `motion` (Motion for React) |
| Languages | `next-intl` — **French default at `/`**, English at `/en`|
| Runtime | Node 24 Alpine, `output: "standalone"` |

## Running it

### Docker (production build)

```bash
docker compose up web --build
```

Serves on <http://localhost:3000>. If that port is taken — on Windows,
Hyper-V reserves blocks of ports and 3000 often falls inside one — override it:

```bash
WEB_PORT=8099 docker compose up web --build
```

### Docker (hot reload)

```bash
docker compose --profile dev up
```

Serves on <http://localhost:3001> with the source bind-mounted.

### Without Docker

```bash
cd web && npm install && npm run dev
```

## Locales

French is the default and is served unprefixed at `/`; English lives at `/en`.

This mirrors the live site, which serves `fr-FR` at the root and publishes
`<link rel="alternate" hreflang="x-default" href="https://diwaindustries.tg/">`.
Keeping the arrangement preserves the existing search rankings for both
locales.

`next-intl` also negotiates from the browser's `Accept-Language` header, so a
visitor with an English browser hitting `/` is redirected to `/en`. The old
WordPress site did not do this. To turn it off, set `localeDetection: false`
in `web/src/i18n/routing.ts`.

Copy lives in `web/messages/{fr,en}.json`, lifted verbatim from the live site.

## Layout

```
assets/original/     35 media files pulled from the live WordPress library,
                     kept as an unmodified provenance archive
web/                 the Next.js application
  messages/          FR and EN copy
  public/images/     working images, renamed and grouped by role
  src/i18n/          locale routing, navigation helpers, request config
  src/components/    Header, Footer, LocaleSwitch, Motion primitives
  src/app/[locale]/  layout and pages
docker-compose.yml   production and dev services
```

## Design — Direction A ("Maison")

Chosen from three directions presented as a comparison page. It keeps the
existing identity untouched and reinstates the wave section separators from
the earlier Diwa site.

| Token | Value | Role |
| --- | --- | --- |
| Indigo | `#5D5B9D` | Primary — buttons, links, wave bands |
| Deep navy | `#1A1A3D` | Hero scrims, footer |
| Works green | `#455F53` | Sustainability and QSE only |
| Mint | `#EEF4F1` | Alternating ground behind the wave bands |

## Motion

Three tempos, and every animated element belongs to exactly one:

| Tempo | Timing | Used for |
| --- | --- | --- |
| Entrance | 1250ms, 18px travel, expo-out, staggered 140ms | Hero cascade, section reveals, card grids. Runs once. |
| Response | 250–450ms | Hover lifts, focus rings, buttons |
| Ambient | 11s / 14s waves, 34s hero drift, 46s marquee | Separators, hero, certification strip |

The entrance curve is `cubic-bezier(0.16, 1, 0.3, 1)`. An earlier pass ran at
700ms over 32px, which read as a snap; expo-out over a longer distance in time
lands softly instead of arriving.

### Separators

`src/components/Wave.tsx`. Two stacked paths per edge — a translucent back
layer on a 14s period and a solid front layer on 11s — so the two never
resynchronise and the shape never visibly repeats.

### Two rules the system enforces

- **Nothing ships hidden.** Scroll reveals are CSS transitions gated on
  `html.js`, a class an inline script sets before first paint. Without
  JavaScript the rules never apply and every section renders at full opacity.
  A JS library setting `opacity: 0` inline was tried first and rejected for
  exactly this reason. Verify with:
  `curl -s localhost:3000/ | grep -c 'style="opacity:0'` — the only hits
  should be the two inactive hero frames.
- **`prefers-reduced-motion` is honoured** in `globals.css` at the rule level,
  including an override that forces revealed content visible, so no component
  can opt out by accident.

## Hero video

The homepage hero currently crossfades three plant stills with a slow Ken
Burns drift, standing in for a video loop that has not been produced yet.
`HeroRotator` in `src/components/Motion.tsx` is the swap point. The first
frame renders at full opacity server-side, so the hero is never blank.

## Email delivery

Both the contact form and the job application form post to route handlers
under `web/src/app/api/`. Without credentials they accept the submission,
log it to the server console and return success — deliberate, so the forms
work on preview deployments. To actually send mail:

1. Create a key at [resend.com](https://resend.com) → API Keys (starts `re_`).
2. **Verify `diwaindustries.tg` in Resend** under Domains, and add the DNS
   records it gives you. This step is not optional — see below.
3. Set the variables from `web/.env.example` in Vercel under
   Settings → Environment Variables, or with `vercel env add`.
4. Redeploy. Environment variables are read at build time.

**The domain verification is the part people skip.** Resend's built-in
`onboarding@resend.dev` sender only delivers to the email address that owns
the Resend account. Until `diwaindustries.tg` is verified and
`CONTACT_FROM` points at it, form submissions will not reach `info@diwa.tg`
even with a valid key — the API returns success and the mail goes nowhere
useful.

## Known gaps

- **The hero video does not exist yet.** The stand-in is described above.
- **The imagery is the existing library**, reused as-is per the client's
  brief. It is AI-generated rather than photography of the Blitta plant —
  see `assets/README.md` for what is in it and a production brief for
  generating a non-repeating replacement set when that is wanted.
- No job listings on Careers — the page invites speculative applications
  instead, matching the live site, which lists no openings either.
- The contact form logs submissions unless `RESEND_API_KEY` is set; see
  `src/app/api/contact/route.ts`.
