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

Both forms post to route handlers under `web/src/app/api/`. Delivery goes
through `web/src/lib/mailer.ts`, which picks a provider from whichever
credentials the deployment has:

| Provider | Selected when | Notes |
| --- | --- | --- |
| **Microsoft Graph** | `AZURE_TENANT_ID` + `AZURE_CLIENT_ID` | Preferred — the org runs Entra ID |
| Resend | `RESEND_API_KEY` | For deployments outside the tenant |
| Console | neither | Logs, returns `delivered: false` |

No secret is read from the repo, and none should be handed to anyone who
is not operating the deployment. Values live only in the hosting platform.

### Microsoft Graph (recommended)

Because the deploying organisation already runs **Microsoft Entra ID**, mail
should leave from a mailbox in its own tenant. That removes the third party,
removes the domain-verification step, and — with a federated credential —
removes the stored secret entirely.

1. **Register an application** in Entra ID.
2. Grant the **`Mail.Send` *application* permission** for Microsoft Graph and
   give it admin consent.
3. **Scope it to one mailbox.** See the warning below — do not skip this.
4. Prefer a **federated credential** over a client secret:
   - On Vercel, enable OIDC for the project and add a federated credential in
     Entra trusting Vercel's issuer. `VERCEL_OIDC_TOKEN` is then supplied at
     runtime and exchanged for a Graph token — nothing secret is stored.
   - On Azure compute (Container Apps, App Service), use a **managed
     identity** instead.
   - `AZURE_CLIENT_SECRET` remains supported as a fallback where neither is
     available. It is the weakest of the three.
5. Set `GRAPH_SENDER` to the sending mailbox and `CONTACT_TO` / `CAREERS_TO`
   to the recipients.

> **`Mail.Send` as an application permission is tenant-wide by default.**
> Granted and left unscoped, the app can send email *as any mailbox in the
> organisation* — not just the one you intended. Restrict it to the single
> sending mailbox with an **Application Access Policy** in Exchange Online
> (`New-ApplicationAccessPolicy`), or with RBAC for Applications, which is
> replacing it. Note that an unscoped Entra permission can still allow sends
> outside an Exchange RBAC scope, so the Entra grant and the Exchange scoping
> need to agree.

### Attachment size

Graph's `sendMail` carries attachments inline and caps the whole request at
4 MB, and base64 inflates bytes by about a third. `MAX_ATTACHMENT_BYTES` in
`mailer.ts` is therefore **3 MB**, and the application form advertises the
same figure. Raising it means switching to an upload session.

### Resend (fallback)

Only if deploying outside the tenant. Resend sends only from a domain
verified in the Resend account — until `diwaindustries.tg` is verified there
and `CONTACT_FROM` points at it, the built-in `onboarding@resend.dev` sender
delivers only to the Resend account owner's own address. The API returns
success either way, so this fails quietly.

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
