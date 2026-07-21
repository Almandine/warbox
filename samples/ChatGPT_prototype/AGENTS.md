# Warbox.org

Norbi's future wargaming website aimed at an international audience. Working language with Norbi is Hungarian (personal project), but the site itself will be in English. AGENTS.md files are always written in English (standing rule).

## Domain

- **warbox.org** — registered 2026-07-18, 1 years, auto-renew enabled
- Registrar and DNS: **Cloudflare** (apex resolves to Cloudflare proxy IPs; HTTPS works)

## Hosting (current state)

- GitHub Pages: <https://github.com/Almandine/Almandine.github.io>
- The repo currently holds only a practice HTML page ("Egy szuper oldal") — **deletable** once the real site is built; serves as a placeholder until then
- GitHub user/org: `Almandine`
- Domain → Cloudflare → GitHub Pages chain verified working (2026-07-18)

## Project specification

Full spec agreed on 2026-07-19: see **[SPEC.md](SPEC.md)** — read it before any site work. Key decisions:

- **Astro** SSG, deployed to GitHub Pages via GitHub Actions from a new repo `Almandine/warbox` (custom domain moves there; DNS untouched)
- Data-driven catalog of WDS Game Companion Excels: one data file drives the game list and per-game subpages; downloads and screenshots live in the repo
- v1 pages: Home (with Latest updates), Games by series + per-game pages, How-to guide, PC manual cover, About, Contact (Formspree → contact@warbox.org via Cloudflare Email Routing)
- Design: light, clean, documentation-like. Analytics: Cloudflare Web Analytics.

## Status / next steps

- Spec done ([SPEC.md](SPEC.md)); full implementation plan done ([BLUEPRINT.md](BLUEPRINT.md)) — all architectural decisions are made there, **do not re-decide them**, just execute
- Next: scaffold + build the site per BLUEPRINT.md (suitable for Sonnet/Opus — no top-tier model needed), then deploy per its Deployment section
- Owner (Norbi) still to do: Formspree account, Cloudflare Email Routing (contact@warbox.org), Cloudflare Analytics toggle
