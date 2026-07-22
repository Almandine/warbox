// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://warbox.org',
  // GitHub Pages serves /page/index.html — keep URLs and links consistent with that.
  trailingSlash: 'always',
  // /manual-cover/ was live before the section was widened to Artwork.
  redirects: {
    '/manual-cover/': '/artwork/',
  },
  integrations: [sitemap()],
});
