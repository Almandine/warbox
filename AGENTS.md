# Warbox.org

**Almandine's Warbox** — Norbi's wargaming website aimed at an international audience. The site name is "Almandine's Warbox"; the domain is warbox.org. Set once in `src/consts.ts` (`SITE_OWNER` / `SITE_NAME` / `SITE_TITLE`) — never hardcode it in a component. Working language with Norbi is Hungarian (personal project), but the site itself is in English. AGENTS.md files are always written in English (standing rule).

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
- Data-driven catalog of WDS Game Companion Excels: one YAML per game drives the game list and per-game subpages; downloads and screenshots live in the repo
- v1 pages: Home (with Latest updates), Games by series + per-game pages, How-to guide, PC manual cover, About, Contact (Formspree → contact@warbox.org via Cloudflare Email Routing)
- Design: light, understated military/tactical — warm paper, muted forest-green accent (field-manual feel; not garish). Analytics: Cloudflare Web Analytics.

## Development

The repo root **is** the site — `npm run dev` (port 4321), `npm run build`.

- **All colours come from `src/styles/global.css` `:root`.** Never write a literal `rgb()`/hex in a component; translucent variants use `rgb(from var(--token) r g b / <alpha>)`. Two documented exceptions: `public/favicon.svg` and the per-series `accent:` in `src/data/series.yaml`.
- Adding a game companion is a data edit, never a code edit — see the runbook in [BLUEPRINT.md](BLUEPRINT.md).
- `samples/` holds two design references and is **not** part of the site: `sample_website.html` (structure and interaction language) and `ChatGPT_prototype/` (a separate full implementation, source of the colour palette). `samples/ChatGPT_prototype/node_modules/` is large and git-ignored.
- Adding a page, route, or content collection: <https://docs.astro.build/en/guides/routing/>, <https://docs.astro.build/en/guides/content-collections/>

## Deployment

**Live at <https://warbox.org> since 2026-07-22.** Repo: `Almandine/warbox` (public). Every push to `main` rebuilds and republishes via `.github/workflows/deploy.yml` (~2 min).

- GitHub access: the **`alm-vops`** account is Norbi's AI-facing GitHub identity and has **Write** on this repo only. `Almandine` is his personal account and keeps admin — Pages, domain and secrets are his. Do not authenticate as `Almandine`.
- Pages source must be **GitHub Actions** (not "Deploy from a branch"). The `deploy` job fails with a 404 "Ensure GitHub Pages has been enabled" until it is set.
- `public/CNAME` keeps the custom domain sticky across deploys. DNS lives at Cloudflare and is already correct — do not touch it.
- The old `Almandine/Almandine.github.io` repo released the domain during the cut-over; it is now free to archive.

## Status

**MVP is live** (2026-07-22). Real content: two Modern Campaigns companions (Danube Front '85,
Middle East '67) with five screenshots each, and the Panzer Campaigns manual cover under
`/artwork/`. Integrations all working: Formspree contact form, Cloudflare Email Routing, Cloudflare
Web Analytics.

No articles are published yet, so the Articles item is hidden from the nav automatically. The
collection, reading layout, RSS feed and `_template.md` are all in place for the first one.

## Open items

Carried forward deliberately — do not quietly drop these.

1. **Hero image blocked on a name mismatch.** `inbox/main_image.png` reads "Almandine's War Room",
   the site is "Almandine's Warbox". Norbi is redrawing it. Nothing goes on the home page until the
   wording matches — see the Name section above.
2. **The manual cover carries WDS branding.** `/artwork/` publishes a cover headed "Wargame Design
   Studio · Panzer Campaigns · User Manual", set in their own styling. It is fan art for a game
   Norbi owns, non-commercial, and the page states it is not official — but it is another company's
   name and trade dress. Norbi was told; he may want to clear it with WDS. Raise it again if the
   artwork section grows.
3. **Screenshots show Hungarian dates.** The scenario tracker images render dates as
   `10 június 1985`, which reads as a bug on an English-language site. Norbi will re-export them
   with an English locale; replace the files in `src/assets/screenshots/<game-id>/` when he does.
4. **Companion versions are unset.** Both game YAMLs omit `version:`. The Danube Front source file
   was named `v06`; Middle East had none. Left blank rather than guessed — ask Norbi.
5. **Draft copy remains** on How to use, About and Contact, each carrying a visible DRAFT note. The
   personal passages in About are Norbi's to supply; do not invent biography.
6. **Not built, offered and unanswered:** a `/contact/thanks/` page so Formspree redirects back to
   the site instead of showing its own branded page.
7. **Optional:** archive the old `Almandine/Almandine.github.io` repo, now that it has released the
   domain.
