import type { Post } from '@interfaces/SanitySchema';
import type { Frontmatter } from '@interfaces/Frontmatter';

export interface CategoryPosts {
  category: string;
  posts: Post[];
}
