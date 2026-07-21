// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://warbox.org',
  // GitHub Pages serves /page/index.html — keep URLs and links consistent with that.
  trailingSlash: 'always',
  integrations: [sitemap()],
});
