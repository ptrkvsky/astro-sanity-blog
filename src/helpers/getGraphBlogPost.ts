import { getGraphBreadcrumbItems } from '@features/blog/functions/getGraphBreadcrumbItems';
import type { BreadcrumbGraphItem } from '@interfaces/BreadcrumbGraphItem';
import type { FAQItem } from '@interfaces/FAQItem';
import type { Post } from '@interfaces/SanitySchema';
import type { Graph } from 'schema-dts';
import { getBreadcrumb } from './getBreadcrumb';
import { getFaq } from './getFaq';
import getGraphWebsite from './getGraphWebsite';
import { type ParamsGetWebPage, getWebPage } from './getWebPage';

export function getGraphBlogPost(post: Post) {
  const website = getGraphWebsite();
  const graphBreadcrumbItems: BreadcrumbGraphItem[] =
    getGraphBreadcrumbItems(post);
  const faqItems = post.questionsAnswers as FAQItem[];
  post.questionsAnswers;

  const paramsGetWebPage: ParamsGetWebPage = {
    url: `/${post.slug?.current}/`,
    datePublishedISO: post._createdAt,
    dateModifiedISO: post._updatedAt,
    breadcrumbId: '#breadcrumb',
    name: post.title,
    description: post.seoDescription,
  };

  const webpage = getWebPage(paramsGetWebPage);
  const FAQPage = getFaq(faqItems);
  const breadcrumbList = getBreadcrumb(graphBreadcrumbItems);

  const schema: Graph = {
    '@context': 'https://schema.org',
    '@graph': [website, webpage, FAQPage, breadcrumbList],
  };

  return schema;
}
