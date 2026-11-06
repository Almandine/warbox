# Warbox.org — Project Specification

First agreed with Norbi on 2026-07-19 (interview session). **Revised 2026-11-06** (second interview):
the site becomes the home of Norbi's WDS software, starting with the **WDS Scenario Picker**; the
Excel companions stay, but in second place. This file is the source of truth for what the site is;
update it when decisions change. Sections marked *(2026-11-06)* are new or changed in that revision.

## Name

The site is called **Almandine's Warbox** (decided 2026-07-21, confirmed again 2026-11-06) — "Almandine" is Norbi's handle, and the domain stays `warbox.org`. The header sets it as a two-part wordmark; `SITE_OWNER` / `SITE_NAME` / `SITE_TITLE` in `src/consts.ts` are the single source for it.

Norbi's preferred name was *Almandine's War Room*; **Warbox won because it was the domain that was actually free** (confirmed 2026-07-22). Artwork he supplied before that decision still says "War Room" — that is the artwork being out of date, not the site. Do not rename the site to match it.

**Tagline** *(2026-11-06)*: *Tools and companions for Wargame Design Studio games* (replaces
*Companions for computer wargames*, which described the Excels only). `SITE_DESCRIPTION` is
rewritten to match: the Scenario Picker first, then the companion spreadsheets and reference material.

## Purpose *(2026-11-06)*

Almandine's Warbox is **a personal wargaming brand**, and the WDS Scenario Picker is its first
product. The site is the Picker's main website: what it is, screenshots, how to install and use it,
the download of the newest version, and a way to send Norbi feedback.

Later it grows in two directions, without a redesign:

- **More software.** The WDS Adjutant comes next, and possibly other tools. Each one gets its own
  product page alongside the Picker.
- **More material.** The companion spreadsheets, resources (manual cover), articles and the
  knowledge base. All are kept, and all are secondary to the software.

**The WDS Adjutant is left out of the site completely for now** (no page, no "coming soon", no
mention). That includes the Picker pages, which must not mention the Picker's Adjutant checkbox.

## Audience

WDS players worldwide, in two groups *(2026-11-06)*: those who already use the Picker (coming for
the newest version, or arriving from the in-app update notice), and those who have never heard of
it (who need to understand in one screen what it does and why they would want it). Site language:
English only.

## Technology

- **Astro** static site generator (chosen for AI-maintainability — Claude Code will do all future development; Norbi is a software engineer but new to web tech)
- Hosted on **GitHub Pages**, built and deployed via **GitHub Actions**, from the public repo `Almandine/warbox` (local checkout: `C:\Dev\Personal\Website - warbox.org`). A push to `main` deploys.
- Domain: **warbox.org** via Cloudflare (wired and verified; do not touch DNS)

## Navigation *(2026-11-06)*

**Home · Scenario Picker · Companions · About · Contact**, then Articles / Knowledge appended
automatically once each has its first published entry (existing behaviour).

- *Companions* is the old *Series* item, renamed. It still leads to `/series/`, and every existing
  `/series/...` URL keeps working unchanged.
- When the Adjutant arrives, it gets its own item next to the Picker. If there are ever more than
  two or three tools, the items fold into one *Software* menu then, not before.

## Pages

### Home *(2026-11-06)*

1. **Picker block first**, taking most of the first screen: name, one-sentence pitch, a main
   screenshot, a **Download** button showing the version number and release date, a "Learn more" link
   to the Picker page, and two or three short feature points.
2. Below that, the rest of the brand: the companions (series cards, as today), then Latest updates.
   Picker releases appear in Latest updates too.
3. The cover band (open item 1 in CLAUDE.md) stays where it is designed to be, if the image ever
   arrives.

### Scenario Picker — `/picker/` *(2026-11-06)*

The product page. This is also the page the in-app update notice opens (see the download section
below), so the download must be reachable at the top without scrolling. Sections, in order:

1. **Hero** — name, pitch, version and date, Download button, size of the zip, "Windows 10/11, 64-bit".
2. **What it does** — the problem (the game's own Scenario Selector is a bare list of file names) and
   the answer (a sortable, colour-coded table with a full description panel, which then selects the
   scenario in the game's own selector for you). It never changes game files.
3. **Screenshots** — a gallery. Norbi supplies the images. Until he does, the page has labelled
   placeholder slots that list the views wanted (scenario table, scenario info, all scenarios, saved
   games, play log, Blitz balance).
4. **Features** — short points: the scenario table and filters, All Scenarios across every game,
   Saved Games and PBEM turn files, the play log with results and notes, Blitz Balance data, My Files,
   Game Files, update notices.
5. **Install** — download, unzip the whole folder into the WDS games folder, start
   `WDS Scenario Picker.exe`. Windows SmartScreen warns about an unsigned program: *More info → Run
   anyway*, once.
6. **Updating** — replace the folder with the new one; the play log and settings are kept. Older
   builds show an update button in their header when a new version is out.
7. **Supported games** — every game the Picker has scenario data for, grouped by series, with the
   200 px box art. Worded as "games the Picker currently has data for" — **never** "complete series"
   or "every game in the series". The community mod (SBWW2 West Front) is labelled as a mod.
8. **FAQ** — Is it official? (No.) Does it change my game? (No.) Does it go online? (Only the
   optional update and Blitz checks, which can be turned off.) Where is my play log kept? What does it
   need? Steam copies?
9. **Feedback** — a short line and button to the contact form, preselected for the Picker.

Content rule: **describe the distribution build only** — the same rule as the Picker's own manual
(`apps/picker/CLAUDE.md`). Nothing behind Developer Mode (the "Also launch WDS Adjutant" checkbox, the
Developer tab) appears anywhere on the site. Install facts come from the Picker's
`packaging/README.txt`, not from memory.

Claude writes the page copy, and Norbi reviews and rewrites it as he likes.

**Release notes / changelog page: undecided** (Norbi, 2026-11-06). Not built for now.

### Companions — `/series/` and below

Unchanged from the 2026-07 structure (series hubs, game hubs, resource pages, the How-to-use guide
for the Excels). It is now the secondary section of the site. Details in the content architecture
below.

### About

Short personal page. It now also says what Warbox is (Norbi's tools and material for WDS games) and
that the Picker is its first tool. The personal passages are Norbi's to supply; do not invent
biography.

### Contact / feedback *(2026-11-06)*

- The existing **Formspree** form stays the only feedback channel (Norbi: "don't overcomplicate it").
  Messages are private and go to contact@warbox.org (Cloudflare Email Routing → Norbi's gmail).
  There is no public issue list or forum. The email address is never shown on the site.
- New: one **"About"** dropdown — *Scenario Picker / Companions & material / Other*. A query
  parameter preselects it: **`https://warbox.org/contact/?about=picker`**. That exact URL is what the
  Picker's future "Send feedback" link opens. It is baked into builds and **must never change**,
  the same rule as `/picker/latest.json`.

### Articles, Knowledge

Kept as built: hidden from the nav until their first published entry. The knowledge-base scaffold
(2026-08-01) is kept (Norbi, 2026-11-06).

## Picker download and the update feed *(2026-11-06)*

- **The zip lives in GitHub Releases** on `Almandine/warbox`, not on Google Drive behind bit.ly. GitHub
  allows files up to 2 GB per release asset; 1.0 is 21.7 MB. Releases also keep the binaries out of
  the git history.
- **The asset name has no spaces**: `WDS-Scenario-Picker-<version>-x64.zip`, the same pattern the
  Picker's CI workflow already uses. GitHub rewrites spaces in uploaded asset names, so the hand-built
  `WDS Scenario Picker 1.0 x64.zip` is renamed on upload. The folder inside the zip is unchanged
  (`WDS Scenario Picker\`).
- **Only the newest version is offered.** The site links the latest release only. Removing old
  GitHub releases is optional housekeeping, done by hand.
- **`public/picker/latest.json` is the single source of truth** for the current version. The Astro
  build imports it, so the site's Download buttons, version text and date always match what the
  in-app notice says. A release edits this one file. Its shape:

  ```json
  {"version": "1.0", "released": "2026-11-xx",
   "download_url": "https://warbox.org/picker/",
   "zip_url": "https://github.com/Almandine/warbox/releases/download/picker-v1.0/WDS-Scenario-Picker-1.0-x64.zip",
   "zip_bytes": 21667270}
  ```

  The Picker reads only `version`, `released` and `download_url` (`app_update.py`) and ignores the
  rest. **`download_url` points at the product page, never at the raw zip**, so a player clicking the
  in-app notice sees what they are getting and the SmartScreen note before downloading. The page is
  on Norbi's own domain, so the link can never go stale.
- `/picker/latest.json` and `/picker/blitz/` stay exactly where they are. Every shipped build has those
  URLs baked in. The `/picker/` page lives beside them without disturbing them.
- Download counts: GitHub counts downloads per asset, and Cloudflare Web Analytics counts visits to
  the page. bit.ly's click count is no longer needed.

## Supported-games data *(2026-11-06)*

Generated, never typed in by hand. A sync script in the WDS repo (to be written, in the same spirit
as `tools/blitz_balance/publish.py --to`) reads `data/game_jsons/` (series, title, mod flag) and the
200 px covers in `data/covers/`, and writes:

- `src/data/picker-games.json` — one entry per game: series, title, `is_mod`, cover file name
- `src/assets/picker/covers/` — only the covers of those games

It runs at Picker release time, and its output is committed here like any other content. Box art is
shown (Norbi, 2026-11-06). WDS cleared box art inside the Picker; Norbi will also confirm the website
with them but expects no objection.

## Content architecture (companions)

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
- Small downloadable files (Excels, PDFs) live **in the repo** and are served directly by the site (e.g. `warbox.org/downloads/...`). Software releases are the exception: see "Picker download" above.
- Each game entry: name, WDS series, Excel download, multiple screenshots, date added/updated.
- Each series entry: name, ordering, accent colour, optional card image, blurb.

## Legal line *(2026-11-06)*

A short line in the footer of every page, plus a fuller version on the Picker page and in the FAQ:
*Unofficial, fan-made. Not affiliated with or endorsed by Wargame Design Studio. Game names and box
art belong to their owners.* WDS has asked for no specific wording. Add "shown with permission"
only once Norbi has confirmed the website use with them.

## Design

Unchanged for now (Norbi, 2026-11-06). Cool, understated **military / tactical aesthetic** — a printed field manual: warm paper background, muted forest-green accent (**revised 2026-07-21**; a dark tactical version was built first, reviewed, and set aside in favour of the light palette from `samples/ChatGPT_prototype/`). Confident, not garish: no neon, no RGB-gamer glow, no marketing gloss. Readability first; tactical styling stays subtle — card grid, monospace metadata labels, faint map grid, greyscale→colour image hover. Screenshots remain the main visuals. Live palette: `src/styles/global.css` `:root`; rationale and history in BLUEPRINT.md Design spec.

## Analytics

Cloudflare Web Analytics (free, cookie-less) — page views. Picker download counts come from GitHub's per-asset counter.

## Update workflows

**A Picker release** *(2026-11-06)*:
1. Upload the zip to a new GitHub Release `picker-v<version>` on `Almandine/warbox`, as
   `WDS-Scenario-Picker-<version>-x64.zip`
2. Edit `public/picker/latest.json` (version, released, zip_url, zip_bytes)
3. Run the supported-games sync if the pack set changed
4. Commit + push → the site and the in-app notice both show the new version

**A new game companion** (unchanged):
1. Drop the `.xlsx` into the downloads folder, screenshots into the images folder
2. Add one entry to the games data file
3. Commit + push → GitHub Actions rebuilds and deploys

## Follow-ups outside this repo *(2026-11-06)*

Not part of the site build itself; they land in the WDS repo once the new download path is live.

- `tools/release/README.md` "Manual steps after a Picker build" and `apps/picker/CLAUDE.md` step 5:
  GitHub Release + `latest.json` instead of Drive + bit.ly
- `apps/picker/wds_scenario_picker/app_update.py` docstring: `download_url` is the product page,
  not a bit.ly link
- The Picker gets a **Send feedback** link to `https://warbox.org/contact/?about=picker` (next build)
- The supported-games sync script (see above)

## History

- **2026-07-19** — first spec: a site for the Excel game companions and the manual cover.
- **2026-07-22** — MVP live; later reorganised around series; knowledge-base scaffold 2026-08-01.
- **2026-10** — `/picker/latest.json` and the signed Blitz feed published here for the Picker.
- **2026-11-06** — second interview: the site becomes the Picker's home and Almandine's Warbox a
  software-first brand.
