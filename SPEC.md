# Warbox.org — Project Specification

Agreed with Norbi on 2026-07-19 (interview session). This is the source of truth for what the site is; update it when decisions change.

## Name

The site is called **Almandine's Warbox** (decided 2026-07-21) — "Almandine" is Norbi's handle, and the domain stays `warbox.org`. The header sets it as a two-part wordmark; `SITE_OWNER` / `SITE_NAME` / `SITE_TITLE` in `src/consts.ts` are the single source for it.

Norbi's preferred name was *Almandine's War Room*; **Warbox won because it was the domain that was actually free** (confirmed 2026-07-22). Artwork he supplied before that decision still says "War Room" — that is the artwork being out of date, not the site. Do not rename the site to match it.

## Purpose

English-language static website about computer wargames. Initial goal: share Norbi's fan-made companion materials for Wargame Design Studio (WDS) games — Game Companion Excel spreadsheets and downloadable graphics (custom Panzer Campaigns User Manual cover PDF). Will grow gradually: more companions, articles written by Norbi (e.g. using AI to play these games, after action reports), later possibly other games and a curated WDS link collection.

## Audience

International wargaming community (WDS players). Site language: English only.

## Technology

- **Astro** static site generator (chosen for AI-maintainability — Claude Code will do all future development; Norbi is a software engineer but new to web tech)
- Hosted on **GitHub Pages**, built and deployed via **GitHub Actions**
- New dedicated repo: `Almandine/warbox` (the old `Almandine.github.io` placeholder becomes obsolete; custom domain setting moves to the new repo — DNS untouched)
- Domain: **warbox.org** via Cloudflare (already wired and verified)

## Content architecture

- **Series-first**: the site is a two-level hierarchy. A WDS series (Panzer Campaigns, Modern
  Campaigns, Sword & Siege, Squad Battles) is the top level and owns both its games and its own
  material; each game in turn owns its material. `/series/` lists every series; `/series/<series>/`
  is a series hub; `/series/<series>/<game>/` is a game hub.
- **Resources**: anything attached to a series or a game that is not the companion spreadsheet
  itself — manual covers, timelines, maps, scenario lists, link collections — is a resource page,
  living at `/series/<series>/<slug>/` or `/series/<series>/<game>/<slug>/`.
- **Data-driven**: one YAML file per game (`src/data/games/`) drives the game list and game hub
  pages; one YAML file (`src/data/series.yaml`) drives the series list. One markdown file per
  resource (`src/content/resources/`). Adding a new companion, a new resource, or a new series =
  add files + one data entry, never touch HTML.
- Downloadable files (Excels, PDFs) live **in the repo** and are served directly by the site (e.g. `warbox.org/downloads/...`). No bit.ly, no external cloud hosting.
- Each game entry: name, WDS series, Excel download, multiple screenshots, date added/updated.
- Each series entry: name, ordering, accent colour, optional card image, blurb.

## Pages (v1)

1. **Home** — cover band, intro, series cards, auto-generated "Latest updates" section (newest entries from the data files, sorted by date)
2. **Series** — every WDS series as a card, plus the full catalog of titles grouped by series
3. **Series hub** — one per series: its own material (resources) plus every title in it
4. **Game hub** — one per game: screenshots, download link, notes, material attached to that game
5. **Resource pages** — series-level or game-level material: description, preview image, downloads where there are any
6. **How to use** — single English step-by-step guide for the Excels (identical usage across all games)
7. **About** — short personal page (who Norbi is, why he loves WDS games, why he shares these aids)
8. **Contact** — form via **Formspree** (free tier); messages go to **contact@warbox.org** (Cloudflare Email Routing → forwards to Norbi's gmail). Email address never displayed on the site.

9. **Articles** — Norbi's own writing (AI-assisted play, after action reports, tips). Markdown files, one per article; index page + per-article pages; RSS feed. The section is built in v1 but the "Articles" nav item only appears once the first article exists.

The series themselves are not menu entries — they reach the reader as cards under the header, with
"Series" as the one nav item that leads to them.

Deferred (post-v1): curated WDS link collection (grouped articles from the WDS News section).

## Design

Cool, understated **military / tactical aesthetic** — a printed field manual: warm paper background, muted forest-green accent (**revised 2026-07-21**; a dark tactical version was built first, reviewed, and set aside in favour of the light palette from `samples/ChatGPT_prototype/`). Confident, not garish: no neon, no RGB-gamer glow, no marketing gloss. Readability first; tactical styling stays subtle — card grid, monospace metadata labels, faint map grid, greyscale→colour image hover. Screenshots remain the main visuals. Live palette: `src/styles/global.css` `:root`; rationale and history in BLUEPRINT.md Design spec.

## Analytics

Cloudflare Web Analytics (free, cookie-less) — covers page views and file downloads. No bit.ly click counting needed.

## Content status (2026-07-19)

- Norbi owns 30 WDS games; Excels are produced continuously — a few are ready now, with screenshots available/easy to make
- PC manual cover ready in its target formats
- Page texts (About, how-to guide, cover description): Norbi provides raw notes (Hungarian OK), Claude writes final English copy
- v1 launches with real content for the ready games; catalog grows over time

## Update workflow (target)

Adding a new game companion must be trivial:
1. Drop the `.xlsx` into the downloads folder, screenshots into the images folder
2. Add one entry to the games data file
3. Commit + push → GitHub Actions rebuilds and deploys

## External setup needed (owner actions)

- Formspree account + form ID
- Cloudflare Email Routing: contact@warbox.org → gmail
- Cloudflare Web Analytics toggle
- GitHub: create `warbox` repo, move Pages custom domain from Almandine.github.io
