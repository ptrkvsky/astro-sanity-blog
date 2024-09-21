import type { Post } from '@interfaces/SanitySchema';
import type { SanityAllPost } from '../interfaces/SanityAllPost';

/**
 * Get posts and return an object to build post's pages
 * @param sanityPosts
 * @returns object
 */
export function getPostsUrlParams(sanityPosts: SanityAllPost) {
  return sanityPosts.allPost.map((post) => {
    const relatedPosts = sanityPosts.allPost
      .filter(
        (relatedPost) =>
          relatedPost._id !== post._id &&
          relatedPost.categories[0].slug.current ===
            post.categories[0].slug.current &&
          new Date(relatedPost._createdAt).getTime() <
            new Date(post._createdAt).getTime(),
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 3);

    const param = {
      params: {
        slug: post?.slug?.current,
      },
      props: {
        post,
        relatedPosts,
      },
    };
    return param;
  });
}
