import type { Post } from '@interfaces/SanitySchema';
import type { Graph } from 'schema-dts';
import { seoConfig } from '../config';
import getGraphWebsite from './getGraphWebsite';
import { getFaq } from './getFaq';

export function getGraphBlogPost(post: Post): Graph {
  const base = seoConfig.productionURL;
  const url = `${base}/posts/${post.slug.current}`;
  const category = post.categories?.find((item) => item?.slug?.current);
  const crumbs = [
    { name: 'Accueil', item: `${base}/` },
    { name: 'Articles', item: `${base}/posts` },
    ...(category
      ? [
          {
            name: category.title,
            item: `${base}/categorie/${category.slug.current}`,
          },
        ]
      : []),
    { name: post.title, item: url },
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getGraphWebsite(seoConfig.productionURL),
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Johan Petrikovsky',
        url: base,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        headline: post.title,
        description: post.seoDescription || post.description || post.title,
        inLanguage: 'fr-FR',
        dateCreated: post._createdAt,
        ...(post._updatedAt ? { dateModified: post._updatedAt } : {}),
        ...(post.seoImage?.asset?.url
          ? { image: post.seoImage.asset.url }
          : {}),
        author: { '@id': `${base}/#person` },
        isPartOf: { '@id': `${base}/#website` },
        mainEntityOfPage: { '@id': `${url}#webpage` },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: post.title,
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...crumb,
        })),
      },
      ...(post.questionsAnswers?.length
        ? [
            getFaq(
              post.questionsAnswers.map((item) => ({
                question: item.question || '',
                answer: item.answer || '',
              })),
            ),
          ]
        : []),
    ],
  };
}
