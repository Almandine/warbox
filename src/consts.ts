/** Site-wide constants. Imported by layouts and pages — no magic strings elsewhere. */

export const SITE_URL = 'https://warbox.org';

/** The wordmark is set in two parts so the header can style them differently. */
export const SITE_OWNER = "Almandine's";
export const SITE_NAME = 'Warbox';
export const SITE_TITLE = `${SITE_OWNER} ${SITE_NAME}`;

export const SITE_TAGLINE = 'Tools and companions for Wargame Design Studio games';
export const SITE_DESCRIPTION =
  'Home of the WDS Scenario Picker, a free scenario browser for Wargame Design Studio games — plus fan-made companion spreadsheets and reference material for Panzer Campaigns, Squad Battles, Sword & Siege and more.';

/** The fixed legal line, shown in every page's footer (SPEC.md, "Legal line"). */
export const LEGAL_LINE =
  'Unofficial, fan-made. Not affiliated with or endorsed by Wargame Design Studio. Game names and box art belong to their owners.';

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
 * "Companions" (the old "Series" item, renamed 2026-11-06) is the one item that
 * leads to them; the How-to-use guide is reached from there and the footer.
 * Header.astro inserts Knowledge / Articles after the first three items.
 */
export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Scenario Picker', href: '/picker/' },
  { label: 'Companions', href: '/series/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
