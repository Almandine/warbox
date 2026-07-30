/**
 * Every internal link to a series, a game or a resource is built here, so the
 * URL shape lives in exactly one place. The site is a two-level hierarchy:
 *
 *   /series/<series>/
 *   /series/<series>/<slug>/            series-level material
 *   /series/<series>/<game>/
 *   /series/<series>/<game>/<slug>/     game-level material
 */

export const SERIES_ROOT = '/series/';

export const seriesUrl = (series: string) => `${SERIES_ROOT}${series}/`;

export const gameUrl = (series: string, game: string) => `${SERIES_ROOT}${series}/${game}/`;

export const resourceUrl = (series: string, game: string | undefined, slug: string) =>
  game ? `${SERIES_ROOT}${series}/${game}/${slug}/` : `${SERIES_ROOT}${series}/${slug}/`;

/** Download path of a resource file, mirroring the resource's own folder. */
export const resourceFileUrl = (resourceId: string, file: string) =>
  `/downloads/resources/${resourceId}/${file}`;

/** Download path of a game companion spreadsheet. */
export const companionUrl = (file: string) => `/downloads/companions/${file}`;
