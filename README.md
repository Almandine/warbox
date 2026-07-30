# Warbox.org

**Almandine's Warbox** — the source for [warbox.org](https://warbox.org). An Astro static site;
see [CLAUDE.md](CLAUDE.md) for the project's working notes, [SPEC.md](SPEC.md) for what the site
is, and [BLUEPRINT.md](BLUEPRINT.md) for how it is built.

## Project structure

```text
/
├── astro.config.mjs
├── src/
│   ├── consts.ts               # site title, nav, form/analytics ids
│   ├── content.config.ts       # collection schemas: games, series, resources, articles
│   ├── data/
│   │   ├── series.yaml         # the WDS series — name, order, accent colour, card image
│   │   └── games/<id>.yaml     # one file per game
│   ├── content/
│   │   ├── resources/<series>/[<game>/]<slug>.md   # manual covers, timelines, maps, scenario lists
│   │   └── articles/<slug>.md
│   ├── assets/
│   │   ├── cover/               # home page cover image, if any
│   │   ├── series/<id>/         # series card images
│   │   ├── screenshots/<game-id>/
│   │   ├── resources/<series>/[<game>/]<slug>/   # resource preview images
│   │   └── articles/<slug>/
│   ├── lib/                     # urls.ts, games.ts, resources.ts, articles.ts, screenshots.ts
│   ├── components/, layouts/, styles/
│   └── pages/
└── public/
    ├── CNAME
    └── downloads/
        ├── companions/<game-id>.xlsx
        └── resources/<series>/[<game>/]<slug>/<file>
```

## Commands

All commands are run from the repo root:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build the production site to `./dist/`           |
| `npm run preview`         | Preview the build locally, before deploying      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## Runbook: adding a game companion

1. Copy the spreadsheet → `public/downloads/companions/<game-id>.xlsx`
2. Copy its screenshots → `src/assets/screenshots/<game-id>/`
3. Create `src/data/games/<game-id>.yaml` (copy an existing file as a template). `series:` must
   match an `id` in `src/data/series.yaml`. The page appears at
   `/series/<series>/<game-id>/` — no route to register.
4. `git add -A && git commit -m "Add <game> companion" && git push` → live in ~2 min

## Runbook: adding a resource page

A resource is anything attached to a series or a game that isn't the companion spreadsheet — a
manual cover, a timeline, a map, a scenario list, a link collection.

1. Create the markdown file:
   - Series-wide material → `src/content/resources/<series>/<slug>.md`
   - Material for one game → `src/content/resources/<series>/<game-id>/<slug>.md`

   Fill in the frontmatter (`title`, `series`, `game` if it belongs to one, `kind`, `summary`,
   `order`, `date_added`; see `src/content.config.ts` for the full schema and
   `src/content/resources/panzer-campaigns/manual-cover.md` for a worked example). The page body
   is ordinary markdown.
2. If the page has a preview image, put it where the markdown file's own path points:
   `src/assets/resources/<same path>/<file>`, and set `preview:` to the file name.
3. If the page offers downloads, put the files at `public/downloads/resources/<same path>/<file>`,
   and list them under `files:` in the frontmatter.
4. The page appears at `/series/<series>/<slug>/` (or `/series/<series>/<game-id>/<slug>/`) — no
   route to register. The build fails loudly if `series` or `game` don't match a real entry.
5. `git add -A && git commit -m "Add <resource>" && git push` → live in ~2 min

## Runbook: adding a series

1. Add an entry to `src/data/series.yaml`: `id`, `name`, `order`, `accent` (hex colour), a
   `monogram` (2–3 letters, shown until there's a card image), and a `blurb`.
2. Optional: drop a card image into `src/assets/series/<id>/` and set `image:` to its file name.
3. Games and resources can now reference the new series by its `id`. The hub appears at
   `/series/<id>/` — no route to register.
4. `git add -A && git commit -m "Add <series>" && git push` → live in ~2 min

## Publishing an article

One markdown file in `src/content/articles/`, images next to it in `src/assets/articles/<slug>/`,
push. The "Articles" nav item appears automatically once the first non-draft article exists.

## Want to learn more?

[Astro documentation](https://docs.astro.build), [Astro Discord](https://astro.build/chat).
