import type { BreadcrumbItem } from '@interfaces/BreadcrumbItem';
import type { Post } from '@interfaces/SanitySchema';

export function getBreadcrumbItems(post: Post) {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      name: 'Accueil',
      path: '/',
    },
    {
      name: 'Articles',
      path: '/posts',
    },
    {
      //@ts-ignore
      name: post?.categories ? post?.categories[0]?.title : '',
      path: `/categorie/${post?.categories[0]?.slug.current}`,
    },
  ];
  return breadcrumbItems;
}
