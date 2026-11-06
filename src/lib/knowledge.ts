import { getCollection, type CollectionEntry } from 'astro:content';

export type KnowledgeEntry = CollectionEntry<'knowledge'>;

export const CATEGORIES = {
  symbols: 'Unit symbols',
  organization: 'Unit organization',
  terms: 'Terminology',
  misc: 'Notes',
} as const;

export type Category = keyof typeof CATEGORIES;

/** Published entries, grouped by category order then their own `order`. */
export async function getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  const entries = await getCollection('knowledge', ({ data }) => !data.draft);
  const categoryRank = Object.keys(CATEGORIES) as Category[];

  return entries.sort((a, b) => {
    const byCategory =
      categoryRank.indexOf(a.data.category) - categoryRank.indexOf(b.data.category);
    return byCategory !== 0 ? byCategory : a.data.order - b.data.order;
  });
}

/** Categories that actually have an entry, in CATEGORIES order. */
export function usedCategories(entries: KnowledgeEntry[]): Category[] {
  const used = new Set(entries.map((entry) => entry.data.category));
  return (Object.keys(CATEGORIES) as Category[]).filter((key) => used.has(key));
}
