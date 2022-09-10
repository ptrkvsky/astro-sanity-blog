import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import image from '@astrojs/image';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import { manifest } from './src/config';

import prefetch from '@astrojs/prefetch';

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
    image(),
    sitemap(),
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    prefetch(),
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
        strategies: 'generateSW',
        workbox: {
          globDirectory: 'dist',
          globPatterns: [
            '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
          ],
          // Don't fallback on document based (e.g. `/some-page`) requests
          // Even though this says `null` by default, I had to set this specifically to `null` to make it work
          navigateFallback: null,
        },
      }),
    ],
  },
});
