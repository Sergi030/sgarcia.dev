// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './remark-reading-time.mjs';
import { remarkOutputBlock } from './remark-output-block.mjs';
import { features } from './src/config.ts';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

function featureFlagCleanup() {
  return {
    name: 'feature-flag-cleanup',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distPath = fileURLToPath(dir);
        const toRemove = [];
        if (!features.blog) toRemove.push('blog', 'rss.xml');
        if (!features.projects) toRemove.push('projects');
        for (const path of toRemove) {
          await rm(`${distPath}/${path}`, { recursive: true, force: true });
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://sgarcia.dev',
  integrations: [sitemap(), featureFlagCleanup()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkOutputBlock],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
