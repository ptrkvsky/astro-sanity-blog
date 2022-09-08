import type { Post } from './../interfaces/SanitySchema';

import type { WithContext, BlogPosting } from 'schema-dts';
import { seoConfig } from 'src/config';

const getSchemaBlogPosting = ({
  _updatedAt,
  _createdAt,
  description,
  seoImage,
  // keywords,
  // body,
  slug,
  title,
}: Post) => {
  const dateModifiedISO = new Date(_updatedAt).toISOString();
  const datePublishedISO = new Date(_createdAt).toISOString();

  const schema: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.baseURL}/posts/${slug?.current}`,
    },
    headline: title,
    image: {
      '@type': 'ImageObject',
      url: seoImage?.asset.url,
    },
    inLanguage: 'fr-FR',
    datePublished: datePublishedISO,
    dateModified: dateModifiedISO,
    author: {
      '@type': 'Person',
      name: seoConfig.author,
      url: seoConfig.baseURL,
    },
    description: description,
    // articleBody: body,
    // keywords,
  };

  return schema;
};

export default getSchemaBlogPosting;
