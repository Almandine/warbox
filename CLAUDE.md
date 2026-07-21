# Warbox.org

**Almandine's Warbox** — Norbi's wargaming website aimed at an international audience. The site name is "Almandine's Warbox"; the domain is warbox.org. Set once in `src/consts.ts` (`SITE_OWNER` / `SITE_NAME` / `SITE_TITLE`) — never hardcode it in a component. Working language with Norbi is Hungarian (personal project), but the site itself is in English. CLAUDE.md files are always written in English (standing rule).

## Domain

- **warbox.org** — registered 2026-07-18, 1 years, auto-renew enabled
- Registrar and DNS: **Cloudflare** (apex resolves to Cloudflare proxy IPs; HTTPS works)

## Hosting (current state)

- GitHub Pages: <https://github.com/Almandine/Almandine.github.io>
- That repo currently holds only a practice HTML page ("Egy szuper oldal") — **deletable** once the real site is deployed; serves as a placeholder until then
- GitHub user/org: `Almandine`
- Domain → Cloudflare → GitHub Pages chain verified working (2026-07-18)
- The site itself is not deployed yet — it is built in this folder and pushed to a new `Almandine/warbox` repo at the deployment step

## Project specification

Full spec agreed on 2026-07-19: see **[SPEC.md](SPEC.md)** — read it before any site work. Key decisions:

- **Astro** SSG, deployed to GitHub Pages via GitHub Actions from a new repo `Almandine/warbox` (custom domain moves there; DNS untouched)
- Data-driven catalog of WDS Game Companion Excels: one YAML per game drives the game list and per-game subpages; downloads and screenshots live in the repo
- v1 pages: Home (with Latest updates), Games by series + per-game pages, How-to guide, PC manual cover, About, Contact (Formspree → contact@warbox.org via Cloudflare Email Routing)
- Design: light, understated military/tactical — warm paper, muted forest-green accent (field-manual feel; not garish). Analytics: Cloudflare Web Analytics.

## Development

The repo root **is** the site — `npm run dev` (port 4321), `npm run build`.

- **All colours come from `src/styles/global.css` `:root`.** Never write a literal `rgb()`/hex in a component; translucent variants use `rgb(from var(--token) r g b / <alpha>)`. Two documented exceptions: `public/favicon.svg` and the per-series `accent:` in `src/data/series.yaml`.
- Adding a game companion is a data edit, never a code edit — see the runbook in [BLUEPRINT.md](BLUEPRINT.md).
- `samples/` holds two design references and is **not** part of the site: `sample_website.html` (structure and interaction language) and `ChatGPT_prototype/` (a separate full implementation, source of the colour palette). `samples/ChatGPT_prototype/node_modules/` is large and git-ignored.
- Adding a page, route, or content collection: <https://docs.astro.build/en/guides/routing/>, <https://docs.astro.build/en/guides/content-collections/>

## Status / next steps

Building the site step by step (started 2026-07-21). Done so far:

1. Astro scaffold + design system (tokens, Base layout, Header/Footer, home hero and stat band)
2. Games data layer (content collections, seed content) + `/games/` catalog page
3. Light/paper repalette from the ChatGPT prototype; all colours token-derived

Remaining: game subpage with download button and screenshot gallery (lightbox, horizontal snap gallery) → the static pages (How to use, Manual cover, About, Contact) → Articles + RSS + Latest updates → deployment per BLUEPRINT.md.

Owner (Norbi) still to do: Formspree account, Cloudflare Email Routing (contact@warbox.org), Cloudflare Analytics toggle, create the `warbox` repo.
