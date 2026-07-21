/**
 * Inline SVG icon set — no icon font, no CDN, no runtime JS.
 * All icons are drawn on a 24×24 grid with `currentColor`.
 * Add a new icon by adding one entry to `ICON_PATHS`.
 */

export const ICON_PATHS = {
  hexagon: '<path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7Z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'caret-right': '<path d="M9 5l7 7-7 7"/>',
  download: '<path d="M12 3v12M8 11l4 4 4-4M4 20h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  image:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M4 17l5-5 4 4 3-3 4 4"/>',
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5Z"/><path d="M3 12.5l9 5 9-5M3 16.5l9 5 9-5"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  'file-text':
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5Z"/>',
  books:
    '<path d="M12 6.5v14"/><path d="M3 4h4.5A4.5 4.5 0 0 1 12 6.5 4.5 4.5 0 0 1 16.5 4H21v13h-4.5a4.5 4.5 0 0 0-4.5 2.5A4.5 4.5 0 0 0 7.5 17H3Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  'arrows-h': '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M3.5 12h17"/>',
  rss: '<circle cx="5.5" cy="18.5" r="1.5"/><path d="M4 12a8 8 0 0 1 8 8M4 5a15 15 0 0 1 15 15"/>',
  external:
    '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  hourglass: '<path d="M6 3h12M6 21h12"/><path d="M17 3v3l-5 6 5 6v3H7v-3l5-6-5-6V3Z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.4 8.3-8 9.4C7.4 20.3 4 17 4 12V6Z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;

/** Icons drawn as a solid shape rather than a stroke. */
export const FILLED_ICONS = new Set<IconName>(['hexagon']);
