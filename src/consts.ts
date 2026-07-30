/** Site-wide constants. Imported by layouts and pages — no magic strings elsewhere. */

export const SITE_URL = 'https://warbox.org';

/** The wordmark is set in two parts so the header can style them differently. */
export const SITE_OWNER = "Almandine's";
export const SITE_NAME = 'Warbox';
export const SITE_TITLE = `${SITE_OWNER} ${SITE_NAME}`;

export const SITE_TAGLINE = 'Companions for computer wargames';
export const SITE_DESCRIPTION =
  'Fan-made Game Companion spreadsheets, reference material and downloads for Wargame Design Studio titles — Panzer Campaigns, Squad Battles, Sword & Siege and more.';

/**
 * Formspree form id for the contact page. Public by nature — it ships in the
 * HTML. Set to null to disable the form (it then renders read-only with a note).
 * Delivery address is configured in Formspree, not here.
 */
export const FORMSPREE_ID: string | null = 'xeeyzyrg';

/**
 * Cloudflare Web Analytics beacon token. Public by nature — it ships in the HTML.
 * Installed manually (CF dashboard: "Enable with JS Snippet installation") because
 * the domain is DNS-only, so Cloudflare cannot auto-inject it. Set to null to
 * remove analytics entirely.
 */
export const CF_ANALYTICS_TOKEN: string | null = '2619cc29fa474f319ea7b50749e0c9c3';

export const WDS_URL = 'https://wargameds.com';

export interface NavItem {
  label: string;
  href: string;
}

/**
 * The series are not in here on purpose: they are the site's own content, and
 * reach the reader as cards under the header rather than as menu entries.
 * "Series" is the one item that leads to them.
 */
export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Series', href: '/series/' },
  { label: 'How to use', href: '/how-to-use/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
