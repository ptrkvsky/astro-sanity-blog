import type { CategoryPosts } from '@features/blog/interfaces/CategoryPosts';
import type { Post } from '@interfaces/SanitySchema';
import { sortPosts } from '../features/blog/functions/articleContent';
export default function getPostsByCategory(posts: Post[]) {
  const groups = new Map<string, CategoryPosts>();
  for (const post of sortPosts(posts)) {
    const category = post.categories?.find((item) => item?.slug?.current) || {
      title: 'Autres articles',
      slug: { current: '' },
    };
    const key = category.slug.current;
    if (!groups.has(key))
      groups.set(key, { category, posts: [] } as CategoryPosts);
    groups.get(key)!.posts.push(post);
  }
  return [...groups.values()];
}
