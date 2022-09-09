import type { BreadcrumbGraphItem } from '@interfaces/BreadcrumbGraphItem';
import type { FAQItem } from '@interfaces/FAQItem';
import type { Graph } from 'schema-dts';
import { getBreadcrumb } from './getBreadcrumb';
import { getFaq } from './getFaq';
import getGraphWebsite from './getGraphWebsite';
import { type ParamsGetWebPage, getWebPage } from './getWebPage';

export interface ParamsGetGraphBlogPost {
  slug: string;
  datePublishedISO: string;
  dateModifiedISO: string;
  breadcrumbId: '#breadcrumb';
  faqItems: FAQItem[];
  breadcrumbItems: BreadcrumbGraphItem[];
}

export function getGraphBlogPost({
  slug,
  datePublishedISO,
  dateModifiedISO,
  breadcrumbId,
  faqItems,
  breadcrumbItems,
}: ParamsGetGraphBlogPost) {
  const website = getGraphWebsite();

  const paramsGetWebPage: ParamsGetWebPage = {
    url: `/${slug}/`,
    datePublishedISO,
    dateModifiedISO,
    breadcrumbId,
  };

  const webpage = getWebPage(paramsGetWebPage);
  const FAQPage = getFaq(faqItems);
  const breadcrumbList = getBreadcrumb(breadcrumbItems);

  const schema: Graph = {
    '@context': 'https://schema.org',
    '@graph': [website, webpage, FAQPage, breadcrumbList],
  };

  return schema;
}
