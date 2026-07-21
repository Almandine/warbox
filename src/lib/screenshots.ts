/**
 * Resolves the bare screenshot file names used in the game YAML files to real
 * image imports, so Astro's <Image> can optimize them.
 *
 * Convention: a screenshot listed as `overview.png` in src/data/games/<id>.yaml
 * must exist at src/assets/screenshots/<id>/overview.png.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/screenshots/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

export function getScreenshot(gameId: string, file: string): ImageMetadata | undefined {
  return files[`../assets/screenshots/${gameId}/${file}`]?.default;
}

/** Screenshots of a game that actually exist on disk, in YAML order. */
export function getScreenshots(
  gameId: string,
  listed: { file: string; caption?: string }[],
): { image: ImageMetadata; caption?: string }[] {
  return listed.flatMap((shot) => {
    const image = getScreenshot(gameId, shot.file);
    return image ? [{ image, caption: shot.caption }] : [];
  });
}
