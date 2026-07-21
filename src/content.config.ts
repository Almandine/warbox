import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * One YAML file per game in src/data/games/. The file name is the id and the
 * URL slug: src/data/games/pc-normandy-44.yaml → /games/pc-normandy-44/
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

/** WDS series metadata: display order, blurb and the accent colour used on cards. */
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

export const collections = { games, series, articles };
