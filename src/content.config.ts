import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * One YAML file per game in src/data/games/. The file name is the id, and the
 * game hangs off its series in the URL:
 * src/data/games/pc-normandy-44.yaml → /series/panzer-campaigns/pc-normandy-44/
 *
 * Screenshots are referenced by bare file name; they live in
 * src/assets/screenshots/<game-id>/ and are resolved by src/lib/screenshots.ts.
 */
const games = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml}', base: './src/data/games' }),
  schema: z.object({
    title: z.string(),
    /** Must match an id in src/data/series.yaml. */
    series: z.string(),
    status: z.enum(['available', 'planned']).default('available'),
    /** File name under public/downloads/companions/. */
    excel: z.string().optional(),
    /** Companion version, not game version. */
    version: z.string().optional(),
    date_added: z.coerce.date(),
    date_updated: z.coerce.date().optional(),
    /** Official WDS product page. */
    wds_url: z.string().url().optional(),
    description: z.string().optional(),
    screenshots: z
      .array(
        z.object({
          file: z.string(),
          caption: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

/**
 * WDS series metadata. A series is the top level of the site: it owns its games
 * and its own material, and gets a card on the home page.
 */
const series = defineCollection({
  loader: file('src/data/series.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
    /** Hex colour for the card's top rule and badge. */
    accent: z.string(),
    blurb: z.string().optional(),
    wds_url: z.string().url().optional(),
    /** Card image file name, under src/assets/series/<id>/. */
    image: z.string().optional(),
    /** Shown on the card while there is no image. Defaults to the initials. */
    monogram: z.string().optional(),
  }),
});

/**
 * Norbi's own writing: one markdown file per article in src/content/articles/.
 * Images live next to it in src/assets/articles/<slug>/ and are referenced
 * relatively from the markdown so Astro optimizes them.
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      /** Used for the article card and the meta description. */
      description: z.string(),
      category: z.enum(['aar', 'ai', 'tips', 'misc']),
      /** Optional game id, linking the article back to its companion page. */
      game: z.string().optional(),
      /** Drafts are excluded from the build entirely. */
      draft: z.boolean().default(false),
      cover: image().optional(),
    }),
});

/**
 * Everything attached to a series or a game that is not the companion
 * spreadsheet itself: manual covers, timelines, maps, scenario lists, link
 * collections. One markdown file each, the body is the page.
 *
 * `series` (and optionally `game`) decide where the page hangs:
 *   series only → /series/<series>/<slug>/
 *   series+game → /series/<series>/<game>/<slug>/
 *
 * Images and downloads follow the file's own path under src/content/resources/.
 * For src/content/resources/panzer-campaigns/manual-cover.md they live in
 * src/assets/resources/panzer-campaigns/manual-cover/ and
 * public/downloads/resources/panzer-campaigns/manual-cover/.
 */
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    /** Must match an id in src/data/series.yaml. */
    series: z.string(),
    /** Must match a file name in src/data/games/. Omit for series-level material. */
    game: z.string().optional(),
    /** URL segment. Defaults to the file name. */
    slug: z.string().optional(),
    /** Picks the icon and the label on the card; no other effect. */
    kind: z.enum(['page', 'artwork', 'scenarios', 'references', 'map']).default('page'),
    /** One sentence, shown on the card that links here. */
    summary: z.string(),
    /** Sort order on the hub page; lower first. */
    order: z.number().default(50),
    date_added: z.coerce.date().optional(),
    /** Preview image file name, resolved by src/lib/resources.ts. */
    preview: z.string().optional(),
    /** Downloads offered on the page, in order. */
    files: z
      .array(
        z.object({
          file: z.string(),
          label: z.string(),
          note: z.string().optional(),
        }),
      )
      .default([]),
    /** Renders a visible draft note. The page is still built and linked. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { games, series, articles, resources };
