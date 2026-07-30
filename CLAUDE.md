# Warbox.org

**Almandine's Warbox** — Norbi's wargaming website aimed at an international audience. The site name is "Almandine's Warbox"; the domain is warbox.org. Set once in `src/consts.ts` (`SITE_OWNER` / `SITE_NAME` / `SITE_TITLE`) — never hardcode it in a component. Working language with Norbi is Hungarian (personal project), but the site itself is in English. CLAUDE.md files are always written in English (standing rule).

## Domain

- **warbox.org** — registered 2026-07-18, 1 years, auto-renew enabled
- Registrar and DNS: **Cloudflare**, but the records are **DNS-only (grey cloud)** — the apex resolves
  straight to the GitHub Pages IPs `185.199.108-111.153`. Nothing passes through the Cloudflare proxy,
  so edge features (auto-injected analytics, caching, WAF) do not apply. Verified 2026-07-22.

## Name

**Almandine's Warbox.** Norbi's preferred name was *Almandine's War Room*; "Warbox" was chosen
because warbox.org was the domain actually available. **Do not "correct" the site name to War
Room** — the mismatch is deliberate. The hero artwork he supplied still carries the old wording;
he is redrawing it.

## Project specification

Full spec agreed on 2026-07-19: see **[SPEC.md](SPEC.md)** — read it before any site work. Key decisions:

- **Astro** SSG, deployed to GitHub Pages via GitHub Actions from a new repo `Almandine/warbox` (custom domain moves there; DNS untouched)
- **Series-first hierarchy**: a series owns its games and its own material. `/series/` lists every
  series plus the full catalog; `/series/<series>/` is a series hub; `/series/<series>/<game>/` is a
  game hub. Resource pages — anything attached to a series or a game that isn't the companion
  spreadsheet (manual covers, timelines, maps, scenario lists) — hang off either level as
  `/series/<series>/<slug>/` or `/series/<series>/<game>/<slug>/`. Every internal link is built in
  `src/lib/urls.ts`; nothing hand-writes these paths. Full route list and data schemas: BLUEPRINT.md.
- Data-driven: one YAML per game (`src/data/games/`) drives the game list and game hub pages;
  `src/data/series.yaml` defines the series (name, order, accent colour, optional card image). One
  markdown file per resource in `src/content/resources/`, the `resources` content collection.
- v1 pages: Home (cover band + intro + series cards + Latest updates), Series index + series hubs +
  game hubs + resource pages, How-to guide, About, Contact (Formspree → contact@warbox.org via
  Cloudflare Email Routing)
- Design: light, understated military/tactical — warm paper, muted forest-green accent (field-manual feel; not garish). Analytics: Cloudflare Web Analytics.

## Development

The repo root **is** the site — `npm run dev` (port 4321), `npm run build`.

- **All colours come from `src/styles/global.css` `:root`.** Never write a literal `rgb()`/hex in a component; translucent variants use `rgb(from var(--token) r g b / <alpha>)`. Two documented exceptions: `public/favicon.svg` and the per-series `accent:` in `src/data/series.yaml`.
- **The map texture is a hex lattice**, defined once as `--tex-hex` / `--tex-hex-size` in `global.css`. Use those tokens; never hand-roll a grid in a component. The tile is an inline SVG, so its line colour is spelled out there rather than read from `--wg-ink` — the one duplication inside `global.css`, commented in place.
- Adding a game companion, a resource page, or a series is a data edit, never a code edit — see the runbooks in [README.md](README.md).
- The home page cover band (`src/components/Cover.astro`) draws the wordmark until an image is
  dropped into `src/assets/cover/` — no code change, no path to register.
- `samples/` holds two design references and is **not** part of the site: `sample_website.html` (structure and interaction language) and `ChatGPT_prototype/` (a separate full implementation, source of the colour palette). `samples/ChatGPT_prototype/node_modules/` is large and git-ignored.
- Adding a page, route, or content collection: <https://docs.astro.build/en/guides/routing/>, <https://docs.astro.build/en/guides/content-collections/>

## Deployment

**Live at <https://warbox.org> since 2026-07-22.** Repo: `Almandine/warbox` (public). Every push to `main` rebuilds and republishes via `.github/workflows/deploy.yml` (~2 min).

- GitHub access: the **`alm-vops`** account is Norbi's AI-facing GitHub identity and has **Write** on this repo only. `Almandine` is his personal account and keeps admin — Pages, domain and secrets are his. Do not authenticate as `Almandine`.
- Pages source must be **GitHub Actions** (not "Deploy from a branch"). The `deploy` job fails with a 404 "Ensure GitHub Pages has been enabled" until it is set.
- `public/CNAME` keeps the custom domain sticky across deploys. DNS lives at Cloudflare and is already correct — do not touch it.
- The old `Almandine/Almandine.github.io` repo released the domain during the cut-over; it is now free to archive.

## Status

**MVP is live** (2026-07-22), since reorganised around series. Real content: two Modern Campaigns
companions (Danube Front '85, Middle East '67) with five screenshots each, and the Panzer Campaigns
manual cover — now a resource page at `/series/panzer-campaigns/manual-cover/` rather than a
standalone `/artwork/` page. Integrations all working: Formspree contact form, Cloudflare Email
Routing, Cloudflare Web Analytics.

The catalog also carries seed placeholder content so every route renders: seven more games
(France '40, Poland '39, Budapest '45, both Crusades books, Eagles Strike, Advance of the Reich)
listed as `status: planned`, and six placeholder resource pages alongside the real manual cover —
all carrying a visible draft note. `astro.config.mjs` redirects the URLs that were live before the
reorganisation (`/games/`, `/artwork/`, the two companion pages) to their new series-scoped homes.

No articles are published yet, so the Articles item is hidden from the nav automatically. The
collection, reading layout, RSS feed and `_template.md` are all in place for the first one.

## Open items

Carried forward deliberately — do not quietly drop these.

1. **Cover image blocked on a name mismatch.** The home page's cover band is built and waiting: drop
   one image into `src/assets/cover/` and it takes over. `inbox/main_image.png` cannot be that image
   — it reads "Almandine's War Room", the site is "Almandine's Warbox". Norbi is redrawing it.
   Nothing goes in until the wording matches — see the Name section above.
2. **The manual cover carries WDS branding.** `/series/panzer-campaigns/manual-cover/` publishes a
   cover headed "Wargame Design Studio · Panzer Campaigns · User Manual", set in their own styling.
   It is fan art for a game Norbi owns, non-commercial, and the page states it is not official — but
   it is another company's name and trade dress. Norbi was told; he may want to clear it with WDS.
   Raise it again if Panzer Campaigns' series material grows.
3. **Screenshots show Hungarian dates.** The scenario tracker images render dates as
   `10 június 1985`, which reads as a bug on an English-language site. Norbi will re-export them
   with an English locale; replace the files in `src/assets/screenshots/<game-id>/` when he does.
4. **Companion versions are unset.** Both game YAMLs omit `version:`. The Danube Front source file
   was named `v06`; Middle East had none. Left blank rather than guessed — ask Norbi.
5. **Draft copy remains** on How to use, About and Contact, each carrying a visible DRAFT note. The
   personal passages in About are Norbi's to supply; do not invent biography.
6. **Not built, offered and unanswered:** a `/contact/thanks/` page so Formspree redirects back to
   the site instead of showing its own branded page.
7. **Series cards have no pictures.** All four draw the monogram placeholder. Norbi wants a picture
   per series (a German panzer on the Panzer Campaigns card, and so on) — one file into
   `src/assets/series/<id>/`, named in `image:` in `src/data/series.yaml`.
8. **The placeholder copy is not Norbi's.** The seven planned games and six placeholder resource
   pages carry descriptions written for this build. The campaign facts were checked against WDS and
   the usual references, but the wording is a stand-in — he should read it and make it his.
9. **Optional:** archive the old `Almandine/Almandine.github.io` repo, now that it has released the
   domain.
