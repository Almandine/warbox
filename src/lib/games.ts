import { getCollection, type CollectionEntry } from 'astro:content';
import { countResourcesBySeries } from './resources';
import { gameUrl, seriesUrl } from './urls';

export type Game = CollectionEntry<'games'>;
export type Series = CollectionEntry<'series'>;

/** Series card images: src/assets/series/<series-id>/<file>. */
const seriesImages = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/series/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

export function getSeriesImage(series: Series): ImageMetadata | undefined {
  const { id, image } = series.data;
  if (!image) return undefined;
  return seriesImages[`../assets/series/${id}/${image}`]?.default;
}

/** Stands in for the card image until there is one: "PC", "S&S", "MC". */
export function seriesMonogram(series: Series): string {
  return (
    series.data.monogram ??
    series.data.name
      .split(/[\s]+/)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  );
}

/** Every series, in the order set in series.yaml. */
export async function getAllSeries(): Promise<Series[]> {
  const all = await getCollection('series');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export const hrefOf = {
  series: (series: Series) => seriesUrl(series.data.id),
  game: (game: Game) => gameUrl(game.data.series, game.id),
};

/** The date a game was last touched — what "Latest updates" and cards sort by. */
export function lastTouched(game: Game): Date {
  return game.data.date_updated ?? game.data.date_added;
}

/** "12 Jul 2026" — short, unambiguous for an international audience. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Available companions first, then alphabetically within each group. */
const byStatusThenTitle = (a: Game, b: Game) => {
  if (a.data.status !== b.data.status) return a.data.status === 'available' ? -1 : 1;
  return a.data.title.localeCompare(b.data.title);
};

/** The games of one series, in the order they should be listed. */
export async function getSeriesGames(seriesId: string): Promise<Game[]> {
  const games = await getCollection('games');
  return games.filter((game) => game.data.series === seriesId).sort(byStatusThenTitle);
}

/** Games grouped into their series, in series.yaml order; empty series dropped. */
export async function getGamesBySeries(): Promise<{ series: Series; games: Game[] }[]> {
  const [allSeries, allGames] = await Promise.all([getAllSeries(), getCollection('games')]);

  return allSeries
    .map((series) => ({
      series,
      games: allGames.filter((game) => game.data.series === series.data.id).sort(byStatusThenTitle),
    }))
    .filter((group) => group.games.length > 0);
}

export interface SeriesOverview {
  series: Series;
  games: Game[];
  /** Games in the series that have a companion ready to download. */
  companions: number;
  /** Resource pages belonging to the series or to any of its games. */
  resources: number;
}

/**
 * One row per series with the numbers the cards show. Every series appears,
 * including one that has nothing under it yet — a series is a place on the
 * site, not a by-product of its games.
 */
export async function getSeriesOverview(): Promise<SeriesOverview[]> {
  const [allSeries, allGames, resourceCounts] = await Promise.all([
    getAllSeries(),
    getCollection('games'),
    countResourcesBySeries(),
  ]);

  return allSeries.map((series) => {
    const games = allGames
      .filter((game) => game.data.series === series.data.id)
      .sort(byStatusThenTitle);

    return {
      series,
      games,
      companions: games.filter((game) => game.data.status === 'available').length,
      resources: resourceCounts.get(series.data.id) ?? 0,
    };
  });
}

/** Newest first, for the home page. */
export async function getGamesByDate(): Promise<Game[]> {
  const games = await getCollection('games');
  return games.sort((a, b) => lastTouched(b).getTime() - lastTouched(a).getTime());
}

/** Fails the build loudly if a game YAML names a series that does not exist. */
export async function assertSeriesReferencesResolve(): Promise<void> {
  const [allSeries, allGames] = await Promise.all([getCollection('series'), getCollection('games')]);
  const known = new Set(allSeries.map((s) => s.data.id));

  for (const game of allGames) {
    if (!known.has(game.data.series)) {
      throw new Error(
        `src/data/games/${game.id}.yaml references unknown series "${game.data.series}". ` +
          `Known series: ${[...known].join(', ')}. Add it to src/data/series.yaml.`,
      );
    }
  }
}
