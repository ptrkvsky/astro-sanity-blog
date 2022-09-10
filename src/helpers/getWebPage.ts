import type { WebPage } from 'schema-dts';
import { seoConfig } from 'src/config';

export interface ParamsGetWebPage {
  url: string; // Should start with / end with /
  datePublishedISO: string;
  dateModifiedISO: string;
  breadcrumbId: '#breadcrumb';
  name: string;
  description: string;
}

export function getWebPage({
  url,
  name,
  description,
  datePublishedISO,
  dateModifiedISO,
}: ParamsGetWebPage) {
  const webPage: WebPage = {
    '@type': 'WebPage',
    '@id': `${seoConfig.baseURL}/`,
    url: `${seoConfig.baseURL}${url}`,
    name,
    isPartOf: {
      '@id': `${seoConfig.baseURL}/#website`,
    },
    datePublished: datePublishedISO,
    dateModified: dateModifiedISO,
    description,
    breadcrumb: {
      '@id': `${seoConfig.baseURL}${url}#breadcrumb`,
    },
    inLanguage: 'fr-FR',
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [`${seoConfig.baseURL}${url}`],
      },
    ],
  };

  return webPage;
}
