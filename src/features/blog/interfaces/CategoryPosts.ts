import type { Category, Post } from '@interfaces/SanitySchema';
import type { Frontmatter } from '@interfaces/Frontmatter';

export interface CategoryPosts {
  category: Category;
  posts: Post[];
}
