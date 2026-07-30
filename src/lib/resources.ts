import { getCollection, type CollectionEntry } from 'astro:content';
import type { IconName } from '../icons';
import { resourceUrl } from './urls';

export type Resource = CollectionEntry<'resources'>;

/**
 * Preview images, resolved the way screenshots are: the frontmatter names a
 * bare file, which must exist at src/assets/resources/<resource-id>/<file> —
 * the same path the markdown file itself sits at under src/content/resources/.
 */
const previews = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/resources/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

export function getResourcePreview(resource: Resource): ImageMetadata | undefined {
  const { preview } = resource.data;
  if (!preview) return undefined;
  return previews[`../assets/resources/${resource.id}/${preview}`]?.default;
}

/** URL segment: the explicit slug, else the markdown file's own name. */
export function resourceSlug(resource: Resource): string {
  return resource.data.slug ?? resource.id.split('/').pop()!;
}

export function resourceHref(resource: Resource): string {
  return resourceUrl(resource.data.series, resource.data.game, resourceSlug(resource));
}

/** What each kind is called, and the icon it gets on a card. */
export const KINDS: Record<Resource['data']['kind'], { label: string; icon: IconName }> = {
  page: { label: 'Reference', icon: 'file-text' },
  artwork: { label: 'Artwork', icon: 'image' },
  scenarios: { label: 'Scenarios', icon: 'layers' },
  references: { label: 'References', icon: 'books' },
  map: { label: 'Map', icon: 'map' },
};

const byOrder = (a: Resource, b: Resource) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

/** Material belonging to the series itself, not to one of its games. */
export async function getSeriesResources(seriesId: string): Promise<Resource[]> {
  const all = await getCollection('resources');
  return all.filter((r) => r.data.series === seriesId && !r.data.game).sort(byOrder);
}

/** Material belonging to one game. */
export async function getGameResources(gameId: string): Promise<Resource[]> {
  const all = await getCollection('resources');
  return all.filter((r) => r.data.game === gameId).sort(byOrder);
}

/** How many resources each series carries, counting its games' as well. */
export async function countResourcesBySeries(): Promise<Map<string, number>> {
  const all = await getCollection('resources');
  const counts = new Map<string, number>();
  for (const resource of all) {
    counts.set(resource.data.series, (counts.get(resource.data.series) ?? 0) + 1);
  }
  return counts;
}

/**
 * Fails the build loudly if a resource names a series or a game that does not
 * exist — a typo there would otherwise produce an orphan page nothing links to.
 */
export async function assertResourceReferencesResolve(): Promise<void> {
  const [resources, allSeries, allGames] = await Promise.all([
    getCollection('resources'),
    getCollection('series'),
    getCollection('games'),
  ]);
  const knownSeries = new Set(allSeries.map((s) => s.data.id));
  const gameSeries = new Map(allGames.map((g) => [g.id, g.data.series]));

  for (const resource of resources) {
    const where = `src/content/resources/${resource.id}.md`;
    const { series, game } = resource.data;

    if (!knownSeries.has(series)) {
      throw new Error(
        `${where} references unknown series "${series}". ` +
          `Known series: ${[...knownSeries].join(', ')}. Add it to src/data/series.yaml.`,
      );
    }

    if (game === undefined) continue;

    if (!gameSeries.has(game)) {
      throw new Error(
        `${where} references unknown game "${game}". ` +
          `Add src/data/games/${game}.yaml, or fix the id.`,
      );
    }

    if (gameSeries.get(game) !== series) {
      throw new Error(
        `${where} says series "${series}", but game "${game}" belongs to ` +
          `"${gameSeries.get(game)}". The two must agree.`,
      );
    }
  }
}
