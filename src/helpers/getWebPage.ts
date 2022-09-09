import type { WebPage } from 'schema-dts';
import { seoConfig } from 'src/config';

export interface ParamsGetWebPage {
  url: string; // Should start with / end with /
  datePublishedISO: string;
  dateModifiedISO: string;
  breadcrumbId: '#breadcrumb';
}

export function getWebPage({
  url,
  datePublishedISO,
  dateModifiedISO,
}: ParamsGetWebPage) {
  const webPage: WebPage = {
    '@type': 'WebPage',
    '@id': `${seoConfig.baseURL}/`,
    url: `${seoConfig.baseURL}${url}`,
    name: 'Johan Petrikovsky développeur frontend spécialisé en React  (Nexjs, Gatsby, GraphQL...)',
    isPartOf: {
      '@id': `${seoConfig.baseURL}/#website`,
    },
    datePublished: datePublishedISO,
    dateModified: dateModifiedISO,
    description:
      "Développeur React depuis 3ans j'aide les entreprises dans le développement de site internet et d'application web performantes",
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
