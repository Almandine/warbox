# Warbox.org — Implementation Blueprint

Execution plan written 2026-07-19 by Fable so a lower-tier model (Sonnet/Opus) can build the site without making architectural decisions. Read [SPEC.md](SPEC.md) first for the "what/why"; this file is the "how". If reality contradicts this file (e.g. Astro API changed), follow reality, keep the intent, and update this file.

## Architectural decisions

1. **Astro, latest stable, TypeScript strict, no UI framework.** Static output only (`output: 'static'`, the default). No React/Vue/Tailwind — plain `.astro` components + one global CSS file with custom properties. Rationale: minimal dependency surface, nothing to break on upgrades, any AI model can maintain it.
2. **One YAML file per game** in `src/data/games/`, loaded as an Astro content collection (glob loader). This satisfies the spec's "data file, not hardcoded HTML" requirement and beats a single `games.yaml`: adding a game = adding one self-contained file, no risk of corrupting a 1000-line monolith, clean git diffs. A separate single `src/data/series.yaml` defines series metadata and ordering.
3. **Downloads are plain static files** under `public/downloads/`, served as-is at `warbox.org/downloads/...`. Screenshots live in `src/assets/screenshots/<game-id>/` so Astro's `<Image>` optimizes them (WebP, responsive widths); the YAML references them by filename only.
4. **Slugs = file names.** `src/data/games/pc-normandy-44.yaml` → route `/series/panzer-campaigns/pc-normandy-44/` (the game hangs off the series named in its own `series:` field). Slug convention: `<series-abbrev>-<game-short-name>`, kebab-case.
5. **Lightbox with zero dependencies**: screenshots open in a native `<dialog>` element with a few lines of vanilla JS in the gallery component. No lightbox library.
6. **Contact form posts directly to Formspree** (`https://formspree.io/f/<ID>`), plus a honeypot field. Form ID goes in `src/consts.ts` (it is public by nature; no env machinery needed). Until Norbi supplies the ID, render the form disabled with a "coming soon" note.
7. **Sitemap via `@astrojs/sitemap`** and **RSS via `@astrojs/rss`** (the only two integrations/helpers).
8. **Articles are a markdown content collection**: `src/content/articles/<slug>.md`, glob loader. Frontmatter schema:
   ```ts
   {
     title: z.string(),
     date: z.coerce.date(),
     description: z.string(),               // used for meta + article cards
     category: z.enum(['aar','ai','tips','misc']),  // extend enum as needed
     game: z.string().optional(),           // optional game-id ref → link to game page
     draft: z.boolean().default(false),     // drafts excluded from build output
     cover: z.string().optional(),          // filename in src/assets/articles/<slug>/
   }
   ```
   Article images live in `src/assets/articles/<slug>/` and are embedded with standard markdown syntax (Astro optimizes them). Routes: `/articles/` (list, newest first, category filter chips) and `/articles/[slug]/` (prose layout, `65ch`). The "Articles" nav item renders only when ≥1 non-draft article exists. `rss.xml` at site root covers articles (title/description/date/link). AARs will be screenshot-heavy — the prose layout must handle many inline images gracefully (max-width 100%, captioned via standard `![caption](img)` alt-to-figcaption treatment).
9. **Reorganised around series (2026-07-29).** The flat `/games/` catalog plus a one-off `/artwork/`
   page for the manual cover did not scale: the manual cover is not the only thing that will ever
   attach to a series, or to one game within it (timelines, maps, scenario lists, link collections
   were all coming). Rather than grow more one-off pages, the site became a two-level hierarchy — a
   series owns its games and its own material — and a new `resources` content collection
   (`src/content/resources/`) replaced both the `artwork` collection and any future one-off
   collection of the same shape. One route (`src/pages/series/[series]/[...rest].astro`) serves both
   game hubs and resource pages, because `/series/<series>/<game>/` and `/series/<series>/<slug>/`
   are the same shape and two sibling dynamic routes would be ambiguous. `src/lib/urls.ts` is the one
   place that builds these paths, so the shape can change again without hunting for hand-written
   links. Old live URLs (`/games/`, `/artwork/`, the two companion pages) redirect via
   `astro.config.mjs`.

## Prerequisites

Verify `node --version` (need ≥ 20) and `git --version`. GitHub CLI (`gh`) needed only at deploy step. Scaffold **inside this folder** (`D:\AI_Projects\Personal\Website - warbox.org`) in a subfolder `site/` — keeps SPEC/BLUEPRINT/CLAUDE.md outside the repo? **No** — decision: the repo root IS this folder; SPEC.md, BLUEPRINT.md, CLAUDE.md get committed (they are the project's memory). Run `git init` here; scaffold Astro directly here (`npm create astro@latest .` refuses non-empty dirs → scaffold into `tmp/`, move contents up, delete `tmp/`).

## File tree (current)

```
/ (repo root = this folder)
├── CLAUDE.md, SPEC.md, BLUEPRINT.md, README.md
├── astro.config.mjs          # site: 'https://warbox.org', sitemap integration, redirects for pre-reorg URLs
├── package.json, tsconfig.json
├── public/
│   ├── CNAME                 # contains: warbox.org  (required for Pages custom domain)
│   ├── favicon.svg           # simple "W" mark, generate inline SVG
│   └── downloads/
│       ├── companions/<game-id>.xlsx
│       └── resources/<series>/[<game>/]<slug>/<files>   # mirrors the resource's own content path
└── src/
    ├── consts.ts             # SITE_TITLE, SITE_DESCRIPTION, NAV, FORMSPREE_ID / CF_ANALYTICS_TOKEN (nullable)
    ├── content.config.ts     # games, series, resources, articles collections
    ├── icons.ts
    ├── styles/global.css
    ├── data/
    │   ├── series.yaml               # panzer-campaigns, modern-campaigns, sword-siege, squad-battles
    │   └── games/<game-id>.yaml      # one file per title; `series:` names its series.yaml id
    ├── content/
    │   ├── resources/<series>/<slug>.md              # series-level material
    │   ├── resources/<series>/<game-id>/<slug>.md    # game-level material
    │   └── articles/<slug>.md, articles/_template.md
    ├── assets/
    │   ├── cover/*                          # home page cover image, if any (Cover.astro picks it up)
    │   ├── series/<series-id>/*             # series card images
    │   ├── screenshots/<game-id>/*
    │   ├── resources/<series>/[<game>/]<slug>/*   # resource preview images, same path as the .md
    │   └── articles/<slug>/*
    ├── lib/
    │   ├── urls.ts            # every internal /series/... link is built here
    │   ├── games.ts           # series/game queries, hrefOf, date helpers
    │   ├── resources.ts       # resource queries, preview image lookup, cross-reference validation
    │   ├── articles.ts, screenshots.ts
    ├── components/
    │   ├── Header, Footer, Cover, PageHeader, Icon, Note
    │   ├── SeriesCard, GameCard, GameHub               # series overview card, game card, game hub body
    │   ├── ResourceCard, ResourceView                  # resource link card, resource page body
    │   ├── ScreenshotGallery, ScreenshotStrip, DownloadButton, LatestUpdates, ArticleCard
    ├── layouts/Base.astro    # <head> w/ SEO meta, header, footer, Cloudflare analytics snippet
    └── pages/
        ├── index.astro                      # cover band + intro + series cards + Latest updates + screenshot strip
        ├── series/index.astro               # every series as a card, plus the full catalog by series
        ├── series/[series]/index.astro      # series hub: series-wide resources + its titles
        ├── series/[series]/[...rest].astro  # game hubs (/<game>/) and resource pages (/<slug>/, /<game>/<slug>/) — one route for both, see Architectural decision 9
        ├── how-to-use.astro      # the shared Excel guide (draft copy until Norbi supplies it)
        ├── about.astro           # draft copy until Norbi supplies it
        ├── contact.astro         # Formspree form
        ├── articles/index.astro  # article list (hidden from nav while empty)
        ├── articles/[slug].astro # prose layout
        ├── rss.xml.js            # articles feed
        └── 404.astro
```

## Data schemas (content.config.ts, zod)

```ts
// games collection — glob loader over src/data/games/*.yaml
{
  title: z.string(),                      // "Panzer Campaigns: Normandy '44"
  series: z.string(),                     // must match an id in series.yaml
  status: z.enum(['available','planned']).default('available'),
  excel: z.string().optional(),           // filename in public/downloads/companions/
  version: z.string().optional(),         // companion version, e.g. "1.2"
  date_added: z.coerce.date(),
  date_updated: z.coerce.date().optional(),
  wds_url: z.string().url().optional(),   // official product page
  description: z.string().optional(),     // 1–3 sentences, shown on the game hub
  screenshots: z.array(z.object({
    file: z.string(),                     // filename under src/assets/screenshots/<id>/
    caption: z.string().optional(),
  })).default([]),
}

// series collection — file loader over src/data/series.yaml
{
  id: z.string(),
  name: z.string(),
  order: z.number(),
  accent: z.string(),                     // hex — card rule, badge, series page accent
  blurb: z.string().optional(),
  wds_url: z.string().url().optional(),
  image: z.string().optional(),           // card picture, filename under src/assets/series/<id>/
  monogram: z.string().optional(),        // stand-in for the card while there's no image
}

// resources collection — glob loader over src/content/resources/**/*.md
{
  title: z.string(),
  series: z.string(),                     // must match an id in series.yaml
  game: z.string().optional(),            // must match a games/ file name; omit for series-level material
  slug: z.string().optional(),            // URL segment; defaults to the file's own name
  kind: z.enum(['page','artwork','scenarios','references','map']).default('page'),
  summary: z.string(),                    // one sentence, shown on the card that links here
  order: z.number().default(50),          // sort order on the hub page, lower first
  date_added: z.coerce.date().optional(),
  preview: z.string().optional(),         // filename under src/assets/resources/<same path>/
  files: z.array(z.object({
    file: z.string(),                     // filename under public/downloads/resources/<same path>/
    label: z.string(),
    note: z.string().optional(),
  })).default([]),
  draft: z.boolean().default(false),      // page still builds; a Note renders on it
}
// The markdown body is the page. src/lib/resources.ts fails the build if `series` or `game` don't
// resolve, or if a game's own `series` disagrees with the resource's.

// articles collection — glob loader over src/content/articles/**/*.md
{
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  category: z.enum(['aar','ai','tips','misc']),
  game: z.string().optional(),            // optional games/ id, linking the article back to it
  draft: z.boolean().default(false),
  cover: image().optional(),
}
```

`status: planned` lets all 30 owned games be listed as "companion coming soon" — build supports it from day one; whether to list planned games is Norbi's call per entry.

## Page/component specs

- **Base.astro**: `<title>` = `{page} · Warbox` (site title alone on the home page), meta description prop (falls back to `SITE_DESCRIPTION`), canonical URL, og:title/description. Cloudflare Web Analytics beacon rendered when `CF_ANALYTICS_TOKEN` is set. Nav (`src/consts.ts`): Home / Series / How to use / About / Contact, with Articles inserted after Series once a non-draft article exists. Footer: "Fan-made companions for Wargame Design Studio games. Not affiliated with WDS." + link to wargameds.com.
- **series/index.astro**: a `SeriesCard` per series (every series, even an empty one — a series is a place on the site, not a by-product of its games), then every series' games grouped and in `series.yaml` order underneath.
- **series/[series]/index.astro**: series head (blurb, image or monogram stand-in, WDS link) + series-wide resources (`ResourceCard` grid) + the series' titles (`GameCard` grid).
- **series/[series]/[...rest].astro**: resolves to a game hub (`GameHub`) or a resource page (`ResourceView`) depending on which collection the path matches — see Architectural decision 9 for why it's one route.
- **GameHub**: breadcrumb (Series → series name), h1, status badge if planned, description, resources attached to the game, DownloadButton or an "in progress" note, a facts list (series/version/dates/screenshot count), ScreenshotGallery, links to the how-to guide and back to the series.
- **ResourceView**: breadcrumb (Series → series → game if any), kind label + icon, h1, summary, draft note if `draft: true`, preview image, rendered markdown body, download list in a sticky side rail if `files` is non-empty.
- **LatestUpdates**: merged feed of games (by `date_updated ?? date_added`, label "Added"/"Updated") and non-draft articles (by `date`, label "Article"), newest 6 overall.
- **ScreenshotGallery**: thumbnails via `<Image>` (~400px wide, lazy); click opens `<dialog>` with full-size `<Image>` (1600px max) + caption + close on Esc/backdrop.
- **Cover**: the home page's top band. Renders the first image found in `src/assets/cover/`; while that folder is empty, draws the wordmark on paper instead. Sits in Base's `cover` slot, above the (sticky) header, so it scrolls away on its own.
- **contact.astro**: name (optional), email (optional but encouraged), message (required), hidden honeypot `_gotcha`; POST to Formspree; note that replies go via email. GDPR-light privacy sentence.

## Design spec (light, tactical / field-manual)

Direction (**decided 2026-07-21** — light/paper, after a dark tactical build was reviewed and set aside): **cool, understated military aesthetic** — a printed staff manual or operations map, not a gaming brand. Warm paper, muted, confident. **No neon, no RGB-gamer glow, no marketing gloss.** Readability comes first; the tactical styling is a whisper, never a theme park. The screenshots remain the main visuals.

Decision history, so nobody flips it back by accident:

1. Original spec: light / documentation look.
2. 2026-07-19: revised to dark tactical.
3. 2026-07-21: built dark from `samples/sample_website.html`, then Norbi chose the palette of `samples/ChatGPT_prototype/` (white + muted forest green) — softened to a warm paper background. **Structure and detailing stay from the dark sample**: card grid, monospace metadata labels, grid textures, greyscale→colour image hover, horizontal snap gallery.

**The live palette is `src/styles/global.css` `:root`, not this list.** That file is the source of truth; the values below record the intent.

- Layout: single column, `max-width: 80rem` list pages / `65ch` text pages, generous whitespace.
- Type: Inter (body) + Rajdhani (display headings), both self-hosted via `@fontsource`; a monospace stack for metadata labels (dates, tags, file sizes, version) to give the field-manual feel.
- Colours: background `#faf8f4` (warm paper), surface/card `#f2eee5`, borders `#ddd6c7`, headings `#1c2228`, body `#2b3138`, muted `#5b6670`, accent `#2f6f4f` (muted forest green) with `#9a6b12` (dark ochre) for small highlights and `#8b2f22` (muted red) for rules and warnings. Accents used sparingly; no bright saturated fills, no glow.
- Every colour derives from those tokens — translucent variants use `rgb(from var(--token) r g b / <alpha>)`, never literal `rgb()`. Recolouring the site must stay a one-file edit. Exceptions, documented in the file: `public/favicon.svg` and the per-series `accent:` values in `src/data/series.yaml`.
- Understated texture: a faint hex/map grid behind the hero and page headers. Must not reduce text contrast; skip if it reads busy.
- Buttons: accent fill with `--wg-on-accent` text, subtle radius. Cards/panels: 1px border, small radius, minimal shadow (a heavy dark shadow reads wrong on paper).
- Contrast: verify body text meets WCAG AA on the paper background. Light-only theme in v1 (no dark-mode toggle needed).
- No large hero photos or decorative illustrations; a restrained, calm hero block only.

## Deployment (do in this order, each step verifiable)

**Done on 2026-07-22 — the site is live at <https://warbox.org>.** Kept as a record of what actually happened, including where this plan was wrong.

1. `git init` + first commit. ✔
2. Repo `Almandine/warbox` created on github.com, then `git remote add` + `git push -u origin main`. ✔
   - `gh repo create` was not used: `gh` was installed but unauthenticated, and Git Credential Manager held a token for **`alm-vops`** (Norbi's AI-facing GitHub account) rather than `Almandine`. Rather than swap credentials, `alm-vops` was given **Write** on this repo only — and the invitation has to be *accepted* as `alm-vops` or the push keeps failing with 403.
3. `.github/workflows/deploy.yml`. ✔ — **the versions in the old plan were stale.** Current canonical set from Astro's deploy guide: `actions/checkout@v7`, `withastro/action@v6`, `actions/deploy-pages@v5`. Check the docs rather than trusting this file.
4. Settings → Pages → Source: **GitHub Actions**. ✔ — **do this before the first deploy.** Until it is set, `build` succeeds and `deploy` fails with `Failed to create deployment (status: 404) … Ensure GitHub Pages has been enabled`. Re-running the old run is not enough if the setting changed after it started; start a fresh run.
5. Custom domain cut-over: cleared the custom domain on the **old** `Almandine.github.io` repo first, then let `public/CNAME` claim it on `warbox`, then enabled Enforce HTTPS. ✔ DNS at Cloudflare untouched.
   - Do the release **first**. While the old repo holds the domain, `almandine.github.io/<anything>` 301s to `warbox.org`, which makes it look as if the new repo is already serving when it is not.
6. Verified `https://warbox.org`. ✔ The old repo is now free to archive (Norbi's call).
7. Cloudflare Web Analytics: still pending. Norbi enables it in the CF dashboard, then `CF_ANALYTICS_TOKEN` in `src/consts.ts` — `Base.astro` already renders the beacon when it is non-null.

**Verify the built output, not the dev server.** The first live deploy shipped a bug the dev server could not show: `DownloadButton` resolved the file with `import.meta.url`, which points into a bundled chunk in a build, so every download rendered as "Not uploaded yet". Anything that touches the filesystem at build time must be checked in `dist/`.

## Runbooks

Now in README.md: adding a game companion, adding a resource page, adding a series, publishing an
article. Keep that copy in sync with this file rather than duplicating it here.

## Build-time content

The two real companions (Modern Campaigns: Danube Front '85, Middle East '67) sit alongside seed
placeholder content so every route renders and the series-first structure is reviewable end to end:
seven more games (`status: planned`, no download) across the other three series, and six
placeholder resource pages under Panzer Campaigns. Placeholder game and resource pages carry a
visible draft note (`GameHub`'s "in progress" note; `ResourceView`'s draft `Note` when
`draft: true`). Replace or add to either as Norbi supplies real material — see the runbooks in
README.md.

## Acceptance checklist for the executing model

- `npm run build` clean; `npm run dev` renders all 8 routes
- Adding a test YAML + files and rebuilding produces a new game page with zero code edits
- Lighthouse (or judgment): images lazy-loaded and optimized, no layout shift on gallery
- All external links `rel="noopener"`, target site works with JS disabled except lightbox/form nicety
- Verify in browser via the preview tools before declaring done
