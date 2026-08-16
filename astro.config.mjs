// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const siteUrl = (process.env.SITE_URL || 'http://localhost:4321').replace(/\/$/, '');

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/style-guide'),
    }),
  ],
  image: {
    layout: 'constrained',
  },
});
