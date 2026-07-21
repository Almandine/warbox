/** Site-wide constants. Imported by layouts and pages — no magic strings elsewhere. */

export const SITE_URL = 'https://warbox.org';
export const SITE_TITLE = 'Warbox';
export const SITE_TAGLINE = 'Companions for computer wargames';
export const SITE_DESCRIPTION =
  'Fan-made Game Companion spreadsheets, reference material and downloads for Wargame Design Studio titles — Panzer Campaigns, Squad Battles, Sword & Siege and more.';

/**
 * Formspree form id for the contact page. Null until the account exists —
 * the contact form renders disabled with a notice while this is null.
 */
export const FORMSPREE_ID: string | null = null;

/** Cloudflare Web Analytics beacon token. Null until enabled in the CF dashboard. */
export const CF_ANALYTICS_TOKEN: string | null = null;

export const WDS_URL = 'https://wargameds.com';

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: 'Games', href: '/games/' },
  { label: 'How to use', href: '/how-to-use/' },
  { label: 'Manual cover', href: '/manual-cover/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
