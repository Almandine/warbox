import { getCollection, type CollectionEntry } from 'astro:content';

export type Artwork = CollectionEntry<'artwork'>;

/**
 * Preview images, resolved the same way screenshots are: the YAML names a bare
 * file, which must exist at src/assets/artwork/<id>/<file>.
 */
const previews = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/artwork/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

export function getPreview(id: string, file: string | undefined): ImageMetadata | undefined {
  if (!file) return undefined;
  return previews[`../assets/artwork/${id}/${file}`]?.default;
}

/** Newest first. */
export async function getArtwork(): Promise<Artwork[]> {
  const items = await getCollection('artwork');
  return items.sort((a, b) => b.data.date_added.getTime() - a.data.date_added.getTime());
}
