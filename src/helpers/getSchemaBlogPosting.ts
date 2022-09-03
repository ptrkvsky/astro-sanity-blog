import type { Frontmatter } from './../interfaces/Frontmatter';
import type { WithContext, BlogPosting } from 'schema-dts';
import { seoConfig } from 'src/config';

const getSchemaBlogPosting = ({
  dateModified,
  datePublished,
  description,
  image,
  keywords,
  rawText,
  slug,
  title,
}: Frontmatter) => {
  const dateModifiedISO = new Date(dateModified).toISOString();
  const datePublishedISO = new Date(datePublished).toISOString();

  const schema: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.baseURL}/posts/${slug}`,
    },
    headline: title,
    image: {
      '@type': 'ImageObject',
      url: image,
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
    articleBody: rawText,
    keywords,
  };

  return schema;
};

export default getSchemaBlogPosting;
