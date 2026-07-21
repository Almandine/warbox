# Warbox.org — Project Specification

Agreed with Norbi on 2026-07-19 (interview session). This is the source of truth for what the site is; update it when decisions change.

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

- **Data-driven**: a single structured data file (games catalog, e.g. `src/data/games.yaml` or Astro content collection) drives the game list and per-game pages. Adding a new companion = add files + one data entry, never touch HTML.
- Downloadable files (Excels, PDFs) live **in the repo** and are served directly by the site (e.g. `warbox.org/downloads/...`). No bit.ly, no external cloud hosting.
- Each game entry: name, WDS series (Panzer Campaigns, Squad Battles, Sword & Siege, …), Excel download, multiple screenshots, date added/updated.

## Pages (v1)

1. **Home** — intro + auto-generated "Latest updates" section (newest entries from the data file, sorted by date)
2. **Games** — overview list grouped by WDS series; each game links to its own subpage
3. **Game subpages** — one per game: screenshots, download link, notes
4. **How to use** — single English step-by-step guide for the Excels (identical usage across all games)
5. **Panzer Campaigns manual cover** — description + downloads in multiple formats
6. **About** — short personal page (who Norbi is, why he loves WDS games, why he shares these aids)
7. **Contact** — form via **Formspree** (free tier); messages go to **contact@warbox.org** (Cloudflare Email Routing → forwards to Norbi's gmail). Email address never displayed on the site.

8. **Articles** — Norbi's own writing (AI-assisted play, after action reports, tips). Markdown files, one per article; index page + per-article pages; RSS feed. The section is built in v1 but the "Articles" nav item only appears once the first article exists.

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
