import { getCollection, type CollectionEntry } from 'astro:content';

export type Game = CollectionEntry<'games'>;
export type Series = CollectionEntry<'series'>;

/** The date a game was last touched — what "Latest updates" and cards sort by. */
export function lastTouched(game: Game): Date {
  return game.data.date_updated ?? game.data.date_added;
}

/** "12 Jul 2026" — short, unambiguous for an international audience. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Games grouped into their series, in series.yaml order; empty series dropped. */
export async function getGamesBySeries(): Promise<{ series: Series; games: Game[] }[]> {
  const [allSeries, allGames] = await Promise.all([getCollection('series'), getCollection('games')]);

  return allSeries
    .sort((a, b) => a.data.order - b.data.order)
    .map((series) => ({
      series,
      games: allGames
        .filter((game) => game.data.series === series.data.id)
        // Available companions first, then alphabetically within each group.
        .sort((a, b) => {
          if (a.data.status !== b.data.status) return a.data.status === 'available' ? -1 : 1;
          return a.data.title.localeCompare(b.data.title);
        }),
    }))
    .filter((group) => group.games.length > 0);
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
