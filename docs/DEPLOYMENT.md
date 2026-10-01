# Deployment — diwaindustries.tg

How to build, configure and ship the Diwa Industries website. Written for
whoever operates the deployment, which may not be whoever wrote the code.

- **Application:** `web/` (Next.js 16.3, React 19, Tailwind v4, next-intl)
- **Locales:** French at `/` (default), English at `/en`, Portuguese at `/pt`
- **Replaces:** the WordPress + Divi site currently on diwaindustries.tg

---

## 1. Before you start

You need:

| | |
| --- | --- |
| Node | 24.x — the Docker image pins `node:24-alpine` |
| npm | 10+ (ships with Node 24) |
| Docker | only for the container route |
| Repo access | <https://github.com/D4Ron/DiwaWeb> |

```bash
git clone https://github.com/D4Ron/DiwaWeb.git
cd DiwaWeb/web
npm ci
```

Use `npm ci`, not `npm install` — see the lockfile note in section 7.

---

## 2. Run it locally

```bash
npm run dev
```

<http://localhost:3000>. French is served unprefixed; `/en` and `/pt` carry
their prefix.

To check a production build locally:

```bash
npm run build && npm start
```

`prebuild` runs `scripts/generate-blur.cjs`, which regenerates the
low-quality image placeholders. It needs `sharp`, which is a devDependency,
so do not install with `--omit=dev` before building.

---

## 3. Configuration

Every value below is set in the hosting platform, never in the repo. Copy
`web/.env.example` to `web/.env.local` for local work; it is gitignored.

**Secrets belong to whoever operates the deployment.** Do not put them in
commits, tickets or chat messages.

### Email delivery

Both forms post to route handlers under `web/src/app/api/`. Delivery goes
through `web/src/lib/mailer.ts`, which picks a provider from whichever
credentials exist:

| Provider | Selected when | Use |
| --- | --- | --- |
| **Microsoft Graph** | `AZURE_TENANT_ID` + `AZURE_CLIENT_ID` | Preferred — the org runs Entra ID |
| Resend | `RESEND_API_KEY` | Only outside that tenant |
| Console | neither | Logs; returns `delivered: false` |

With no credentials the forms still accept submissions and report honestly
that nothing was sent. That is intentional, so preview deployments work.

| Variable | Required | Notes |
| --- | --- | --- |
| `AZURE_TENANT_ID` | Graph | Entra tenant GUID |
| `AZURE_CLIENT_ID` | Graph | App registration (client) ID |
| `AZURE_CLIENT_SECRET` | fallback only | Prefer federation — see below |
| `GRAPH_SENDER` | Graph | Mailbox mail is sent from |
| `RESEND_API_KEY` | Resend | Starts `re_` |
| `CONTACT_FROM` | Resend | From address on a verified domain |
| `CONTACT_TO` | no | Defaults to `info@diwaindustries.tg` |
| `CAREERS_TO` | no | Falls back to `CONTACT_TO` |

Environment variables are read **at build time**. Changing one requires a
redeploy, not just a restart.

---

## 4. Entra ID setup (Microsoft Graph)

Do this once, with tenant admin.

1. **Register an application** in Entra ID → App registrations.
2. Add the **`Mail.Send` application permission** for Microsoft Graph
   (Application, not Delegated) and **grant admin consent**.
3. **Scope it to one mailbox.** See the warning below.
4. Give it credentials, in order of preference:
   - **Workload identity federation** — on Vercel, enable OIDC for the
     project and add a federated credential in Entra trusting Vercel's
     issuer. `VERCEL_OIDC_TOKEN` is then supplied at runtime and exchanged
     for a Graph token. **No secret is stored anywhere.**
   - **Managed identity** — if hosting on Azure compute.
   - **Client secret** — `AZURE_CLIENT_SECRET`. Weakest option; it expires,
     and someone has to hold it.
5. Set `GRAPH_SENDER` to the sending mailbox (e.g. `site@diwaindustries.tg`).

> ### ⚠️ `Mail.Send` is tenant-wide by default
>
> Granted and left unscoped, the application can send email **as any mailbox
> in the organisation** — not only the one you intended. Restrict it to the
> single sending mailbox with an **Application Access Policy** in Exchange
> Online (`New-ApplicationAccessPolicy`), or with **RBAC for Applications**,
> which is replacing it.
>
> Note that an unscoped Entra permission can still permit sends outside an
> Exchange RBAC scope, so the Entra grant and the Exchange scoping have to
> agree. Verify with a test send from a mailbox the app should *not* be able
> to use — it must fail.

### Attachment size

Graph's `sendMail` carries attachments inline and caps the whole request at
4 MB; base64 inflates bytes by about a third. `MAX_ATTACHMENT_BYTES` in
`mailer.ts` is therefore **3 MB**, and the application form advertises the
same figure. Raising it means moving to an upload session.

---

## 5. Deploy

### Vercel

Current preview: <https://diwatest.vercel.app> (project `diwatest`).

The app lives in `web/`, so either set **Root Directory = `web`** in project
settings, or deploy from inside that folder:

```bash
cd web && vercel --prod
```

Accept the auto-detected Next.js settings — do not override the build
command or output directory.

Use `--prod`. Preview deployments sit behind Vercel Authentication, so a
reviewer without an account hits a login wall; production deployments are
public.

> Vercel's free Hobby plan is licensed for **non-commercial use**. This is a
> client site, so a paid plan or different host is required for production.

### Docker

The repo builds a self-contained image. `output: "standalone"` is gated on
`DOCKER_BUILD=1`, which the Dockerfile sets, so Vercel is unaffected.

```bash
docker compose up web --build
```

<http://localhost:3000>. If that port is taken — on Windows, Hyper-V reserves
blocks of ports — override it:

```bash
WEB_PORT=8099 docker compose up web --build
```

The image is ~328 MB, runs as a non-root user, and has a healthcheck. For
hot reload during development: `docker compose --profile dev up` on :3001.

### Any Node host

```bash
cd web && npm ci && npm run build && npm start
```

Serves on `PORT` (default 3000). Put TLS and a reverse proxy in front.

---

## 6. Cutover to diwaindustries.tg

The current site is WordPress. Order matters.

1. **Deploy and test on a preview URL first.** Check all three locales.
2. **Confirm the redirects.** `web/next.config.ts` 301s the three old
   root-level article URLs to `/actualites/<slug>`, plus `/en/contact-us`
   → `/en/contact`. French page slugs (`/produits-services`, `/durabilite`,
   `/carrieres`, `/actualites`) are unchanged by design.
3. **Check `hreflang`.** The root must serve French with
   `hreflang="x-default"` pointing at it. This matches the live WordPress
   site and preserves rankings for both existing locales.
4. **Move analytics.** The old site runs Google Analytics `G-DDKBVSSDEQ` and
   GTM `GTM-N282LHXL`. Neither is in the new build yet — add them before
   cutover if they are still wanted.
5. **Point DNS** at the new host.
6. **Keep the WordPress install intact** until the new site has run clean for
   a couple of weeks. It is the rollback.

### Post-cutover checks

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://diwaindustries.tg/
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" \
  https://diwaindustries.tg/kodjo-adedze-visite-diwa-industries
```

Then submit the contact form and confirm it arrives at
`info@diwaindustries.tg`. A `delivered: false` in the response means no mail
provider is configured.

---

## 7. Gotchas

**The lockfile is platform-sensitive.** Running `npm install` on Windows
produces a lockfile missing Linux-only optional dependencies (`@emnapi/*`),
and `npm ci` then fails inside Docker. If that happens, regenerate the
lockfile on Linux:

```bash
docker run --rm -v "$PWD/web:/app" -w /app node:24-alpine \
  npm install --package-lock-only --ignore-scripts
```

**Scroll reveals are gated on `html.js`.** An inline script adds that class
before first paint. Without JavaScript the reveal rules never apply and every
section renders visible — content is never stranded. Do not "fix" this by
moving the reveals into a JS library that sets `opacity: 0` inline.

**Image placeholders are generated, not committed by hand.** Adding images to
`web/public/images/` means re-running `npm run blur` (or any build).

**Node 24.** No `engines` field is declared; the Docker image pins
`node:24-alpine`. Match it on other hosts.

---

## 8. Not done yet

- **Hero video.** The homepage hero crossfades four real plant photographs
  with a slow drift, standing in for a video loop. `HeroRotator` in
  `web/src/components/Motion.tsx` is the swap point.
- **Analytics** not carried over — see cutover step 4.
- **Production capacity figure.** The site states 2,000,000 cylinders/year,
  taken from the 2026 commercial brochure and company presentation. The old
  WordPress site said 500,000. Both client documents agree on the new figure,
  but it is a large public claim and is worth a final confirmation.
- **The reach graphic** on the À propos page has French lettering baked into
  the image, so it shows French on the English and Portuguese pages. A
  localised export would fix it.
- **Job listings.** `web/src/content/offers.ts` ships empty and the page
  renders an empty state pointing at the spontaneous application form. Add
  entries there to list openings.
