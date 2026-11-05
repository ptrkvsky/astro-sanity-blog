// export default {
//   author: 'Johan Petrikovsky',
//   url: import.meta.env.PUBLIC_URL,
// };

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  author: 'Johan Petrikovsky',
  baseURL: import.meta.env.PUBLIC_URL, // Change this to your production URL.
  productionURL: 'https://developpeur-web.tech', // Change this to your production URL.
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

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const version = import.meta.env.PUBLIC_SANITY_API_VERSION;
const dataSet = import.meta.env.PUBLIC_SANITY_DATASET;

export const config = {
  mode: import.meta.env.MODE,
  sanityGraphqlEndpoint: `https://${projectId}.api.sanity.io/${version}/graphql/${dataSet}/default`,
};
