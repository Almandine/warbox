import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export const CATEGORIES = {
  aar: 'After action report',
  ai: 'Playing with AI',
  tips: 'Tips',
  misc: 'Notes',
} as const;

export type Category = keyof typeof CATEGORIES;

/** Published articles, newest first. Drafts never reach the build output. */
export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Categories that actually have an article, in CATEGORIES order. */
export function usedCategories(articles: Article[]): Category[] {
  const used = new Set(articles.map((article) => article.data.category));
  return (Object.keys(CATEGORIES) as Category[]).filter((key) => used.has(key));
}

/**
 * Rough reading time from the raw markdown. 200 wpm is the usual figure; these
 * articles are screenshot-heavy, so it overestimates rather than under.
 */
export function readingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
