# Warbox.org — Implementation Blueprint

Execution plan written 2026-07-19 by Fable so a lower-tier model (Sonnet/Opus) can build the site without making architectural decisions. Read [SPEC.md](SPEC.md) first for the "what/why"; this file is the "how". If reality contradicts this file (e.g. Astro API changed), follow reality, keep the intent, and update this file.

## Architectural decisions

1. **Astro, latest stable, TypeScript strict, no UI framework.** Static output only (`output: 'static'`, the default). No React/Vue/Tailwind — plain `.astro` components + one global CSS file with custom properties. Rationale: minimal dependency surface, nothing to break on upgrades, any AI model can maintain it.
2. **One YAML file per game** in `src/data/games/`, loaded as an Astro content collection (glob loader). This satisfies the spec's "data file, not hardcoded HTML" requirement and beats a single `games.yaml`: adding a game = adding one self-contained file, no risk of corrupting a 1000-line monolith, clean git diffs. A separate single `src/data/series.yaml` defines series metadata and ordering.
3. **Downloads are plain static files** under `public/downloads/`, served as-is at `warbox.org/downloads/...`. Screenshots live in `src/assets/screenshots/<game-id>/` so Astro's `<Image>` optimizes them (WebP, responsive widths); the YAML references them by filename only.
4. **Slugs = file names.** `src/data/games/pc-normandy-44.yaml` → route `/games/pc-normandy-44/`. Slug convention: `<series-abbrev>-<game-short-name>`, kebab-case.
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

## Prerequisites

Verify `node --version` (need ≥ 20) and `git --version`. GitHub CLI (`gh`) needed only at deploy step. Scaffold **inside this folder** (`D:\AI_Projects\Personal\Website - warbox.org`) in a subfolder `site/` — keeps SPEC/BLUEPRINT/CLAUDE.md outside the repo? **No** — decision: the repo root IS this folder; SPEC.md, BLUEPRINT.md, CLAUDE.md get committed (they are the project's memory). Run `git init` here; scaffold Astro directly here (`npm create astro@latest .` refuses non-empty dirs → scaffold into `tmp/`, move contents up, delete `tmp/`).

## File tree (target)

```
/ (repo root = this folder)
├── CLAUDE.md, SPEC.md, BLUEPRINT.md
├── astro.config.mjs          # site: 'https://warbox.org', sitemap integration
├── package.json, tsconfig.json
├── public/
│   ├── CNAME                 # contains: warbox.org  (required for Pages custom domain)
│   ├── favicon.svg           # simple "W" mark, generate inline SVG
│   └── downloads/
│       ├── companions/<game-id>.xlsx
│       └── pc-manual-cover/<files>
└── src/
    ├── consts.ts             # SITE_TITLE, SITE_DESCRIPTION, FORMSPREE_ID (nullable)
    ├── content.config.ts
    ├── styles/global.css
    ├── data/
    │   ├── series.yaml
    │   └── games/<game-id>.yaml
    ├── content/articles/<slug>.md
    ├── assets/screenshots/<game-id>/*.png
    ├── assets/articles/<slug>/*.png
    ├── components/  Header, Footer, GameCard, ScreenshotGallery, LatestUpdates, DownloadButton
    ├── layouts/Base.astro    # <head> w/ SEO meta, header, footer, Cloudflare analytics snippet placeholder
    └── pages/
        ├── index.astro           # hero intro + LatestUpdates (6 newest by date_updated||date_added)
        ├── games/index.astro     # all games grouped by series (series.yaml order)
        ├── games/[id].astro      # getStaticPaths over games collection
        ├── how-to-use.astro      # the shared Excel guide (placeholder until copy exists)
        ├── manual-cover.astro    # PC cover: preview image + format download table
        ├── about.astro           # placeholder until copy exists
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
  series: z.string(),                     // must match a key in series.yaml
  status: z.enum(['available','planned']).default('available'),
  excel: z.string().optional(),           // filename in public/downloads/companions/
  version: z.string().optional(),         // companion version, e.g. "1.2"
  date_added: z.coerce.date(),
  date_updated: z.coerce.date().optional(),
  wds_url: z.string().url().optional(),   // official product page
  description: z.string().optional(),     // 1–3 sentences, shown on game page
  screenshots: z.array(z.object({
    file: z.string(),                     // filename under src/assets/screenshots/<id>/
    caption: z.string().optional(),
  })).default([]),
}
// series.yaml — file loader: array of { id, name, blurb?, wds_url?, order }
```

`status: planned` lets all 30 owned games be listed as "companion coming soon" — build supports it from day one; whether to list planned games is Norbi's call per entry.

## Page/component specs

- **Base.astro**: `<title>` = `{page} · Warbox`, meta description prop required, canonical URL, og:title/description/image (og fallback: site-wide default image — skip until one exists). Nav: Games / How to use / Manual cover / About / Contact. Footer: "Fan-made companions for Wargame Design Studio games. Not affiliated with WDS." + link to wargameds.com.
- **games/index.astro**: series in `series.yaml` order; within a series, games alphabetically. Card: title, screenshot thumb (first screenshot), status badge if planned, updated date.
- **games/[id].astro**: h1 title, series breadcrumb link, description, DownloadButton (file size shown — compute at build with `fs.statSync`), version + dates line, ScreenshotGallery grid, link to How-to-use page ("New to the companion? Read the guide"), wds_url link.
- **LatestUpdates**: merged feed of games (by `date_updated ?? date_added`, label "Added"/"Updated") and non-draft articles (by `date`, label "Article"), newest 6 overall.
- **ScreenshotGallery**: thumbnails via `<Image>` (~400px wide, lazy); click opens `<dialog>` with full-size `<Image>` (1600px max) + caption + close on Esc/backdrop.
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

## Runbook: adding a new game companion (put this in README.md too)

1. Copy `MyGame.xlsx` → `public/downloads/companions/<game-id>.xlsx`
2. Copy screenshots → `src/assets/screenshots/<game-id>/`
3. Create `src/data/games/<game-id>.yaml` (copy an existing one as template)
4. `git add -A && git commit -m "Add <game> companion" && git push` → live in ~2 min

Publishing an article is analogous: one `.md` in `src/content/articles/`, images next to it in `src/assets/articles/<slug>/`, push. Include both workflows in README.md.

## Build-time content (until real content arrives)

Seed with 3 example games across 2 series (clearly fake data, `status: available`, placeholder screenshots as generated neutral PNGs) so every page renders and is reviewable. Replace with real content as Norbi supplies it. Placeholder copy pages must carry a visible "draft" note.

## Acceptance checklist for the executing model

- `npm run build` clean; `npm run dev` renders all 8 routes
- Adding a test YAML + files and rebuilding produces a new game page with zero code edits
- Lighthouse (or judgment): images lazy-loaded and optimized, no layout shift on gallery
- All external links `rel="noopener"`, target site works with JS disabled except lightbox/form nicety
- Verify in browser via the preview tools before declaring done
