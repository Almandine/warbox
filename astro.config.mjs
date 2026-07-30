// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://warbox.org',
  // GitHub Pages serves /page/index.html — keep URLs and links consistent with that.
  trailingSlash: 'always',
  /**
   * URLs that were live before the site was reorganised around series.
   * /manual-cover/ → /artwork/ came first; the artwork section then became
   * material belonging to the Panzer Campaigns series, and the flat game
   * catalog became a level under its series.
   */
  redirects: {
    '/manual-cover/': '/series/panzer-campaigns/manual-cover/',
    '/artwork/': '/series/panzer-campaigns/manual-cover/',
    '/games/': '/series/',
    '/games/mc-danube-front-85/': '/series/modern-campaigns/mc-danube-front-85/',
    '/games/mc-middle-east-67/': '/series/modern-campaigns/mc-middle-east-67/',
  },
  integrations: [sitemap()],
});
