// export default {
//   author: 'Johan Petrikovsky',
//   url: import.meta.env.PUBLIC_URL,
// };

// Type imports
import type { ManifestOptions } from 'vite-plugin-pwa';

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  author: 'Johan Petrikovsky',
  baseURL: import.meta.env.PUBLIC_URL, // Change this to your production URL.
  description:
    'Astro PWA Starter is an opionated Astro starter for building robust static websites.', // Change this to be your website's description.
  type: 'website',
  image: {
    url: 'https://picsum.photos/1200/630', // Change this to your website's thumbnail.
    alt: 'OpenGraph thumbnail description.', // Change this to your website's thumbnail description.
    width: 1200,
    height: 630,
  },
  siteName: 'Johan Petrikovsky', // Change this to your website's name,
  twitter: {
    card: 'summary_large_image',
  },
};

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
  name: 'Johan Petrikovsky développeur React Freelance', // Change this to your website's name.
  short_name: 'Site de Johan Petrikovsky', // Change this to your website's short name.
  description:
    'Johan Petrikovsky est un développeur React et Typescript Freelance.', // Change this to your websites description.
  theme_color: '#30E130', // Change this to your primary color.
  background_color: '#ffffff', // Change this to your background color.
  display: 'minimal-ui',
  icons: [
    {
      src: '/favicons/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/favicons/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/favicons/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
};
