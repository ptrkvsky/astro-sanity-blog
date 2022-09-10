import { slugify } from '@lib/slugify';
import type { Post } from '@interfaces/SanitySchema';
import type { BreadcrumbGraphItem } from '@interfaces/BreadcrumbGraphItem';

export function getGraphBreadcrumbItems(post: Post) {
  const breadcrumbItems: BreadcrumbGraphItem[] = [
    {
      label: 'Accueil',
      slug: '/',
    },
    {
      //@ts-ignore
      label: post.categories[0]?.title,
      //@ts-ignore
      slug: `/categorie/${slugify(post?.categories[0]?.title)}/`,
    },
    {
      //@ts-ignore
      label: post.title,
      //@ts-ignore
      slug: `/posts/${slugify(post?.slug?.current)}/`,
    },
  ];
  return breadcrumbItems;
}
