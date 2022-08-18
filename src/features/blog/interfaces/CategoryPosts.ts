import type { Frontmatter } from '@interfaces/Frontmatter';

export interface CategoryPosts {
  category: string;
  posts: Frontmatter[];
}
