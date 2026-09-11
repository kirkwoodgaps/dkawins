// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  // Canonical host. The apex redirects to www; see CLAUDE.md.
  site: 'https://www.dkawins.com',

  // REQUIRED by CLAUDE.md. The 10 indexed URLs all carry a trailing slash.
  // Without this, every one of them takes a redirect at best.
  trailingSlash: 'always',

  adapter: vercel(),
  integrations: [react(), markdoc(), keystatic()],
});
