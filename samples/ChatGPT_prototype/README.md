# Warbox

Static Astro site for [warbox.org](https://warbox.org): fan-made companions for Wargame Design Studio games.

## Local development

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, then inspect it locally with `npm run preview`.

## Add a game companion

1. Copy the spreadsheet to `public/downloads/companions/<game-id>.xlsx`.
2. Copy its screenshots to `src/assets/screenshots/<game-id>/`.
3. Create `src/data/games/<game-id>.yaml`, using an existing file as a template.
4. Commit and push. GitHub Pages rebuilds and deploys the site (normally within a few minutes).

The YAML filename is the game URL: `pc-normandy-44.yaml` becomes `/games/pc-normandy-44/`. The series ID must match an item in `src/data/series.yaml`.

## Publish an article

1. Add `src/content/articles/<slug>.md` with the required frontmatter: `title`, `date`, `description`, and `category` (`aar`, `ai`, `tips`, or `misc`).
2. Set `draft: false` (or omit it) when ready to publish. Drafts are excluded from routes, RSS, latest updates, and navigation.
3. Put article images in `src/assets/articles/<slug>/`, then reference them from Markdown.
4. Commit and push.

## Before launch

- Replace the three clearly fictional sample games, their zero-byte download placeholders, and the temporary prose.
- Put the Formspree form ID in `src/consts.ts` to enable Contact.
- Enable Cloudflare Web Analytics and paste its beacon into the marked location in `src/layouts/Base.astro`.
- Configure the GitHub repository’s Pages source as GitHub Actions and set its custom domain to `warbox.org`.

The deployment workflow is present in `.github/workflows/deploy.yml`, but this workspace has intentionally not been initialized, committed, pushed, or deployed.
