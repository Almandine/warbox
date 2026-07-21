import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const games = defineCollection({
  loader: glob({ base: './src/data/games', pattern: '**/*.yaml' }),
  schema: z.object({
    title: z.string(), series: z.string(),
    status: z.enum(['available', 'planned']).default('available'),
    excel: z.string().optional(), version: z.string().optional(),
    date_added: z.coerce.date(), date_updated: z.coerce.date().optional(),
    wds_url: z.string().url().optional(), description: z.string().optional(),
    screenshots: z.array(z.object({ file: z.string(), caption: z.string().optional() })).default([]),
  }),
});

const series = defineCollection({
  loader: file('./src/data/series.yaml'),
  schema: z.object({ id: z.string(), name: z.string(), blurb: z.string().optional(), wds_url: z.string().url().optional(), order: z.number() }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(), date: z.coerce.date(), description: z.string(),
    category: z.enum(['aar', 'ai', 'tips', 'misc']), game: z.string().optional(),
    draft: z.boolean().default(false), cover: z.string().optional(),
  }),
});

export const collections = { games, series, articles };
