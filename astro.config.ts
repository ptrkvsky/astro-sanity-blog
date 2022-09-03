import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import image from '@astrojs/image';
import { remarkReadingTime } from './lib/remark-reading-time.js';
import sitemap from '@astrojs/sitemap';
import { manifest } from './src/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://developpeur-web.tech',
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
        path: './tailwind.config.js',
      },
    }),
    compress(),
    react(),
    tailwind(),
    mdx({
      remarkPlugins: [remarkReadingTime],
    }),
    image(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: false,
    },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest,
        workbox: {
          globDirectory: 'dist',
          globPatterns: [
            '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico,html}',
          ],
        },
      }),
    ],
  },
});
