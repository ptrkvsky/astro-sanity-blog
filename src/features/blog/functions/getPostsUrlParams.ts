import type { Post } from '@interfaces/SanitySchema';
import type { SanityAllPost } from '../interfaces/SanityAllPost';

/**
 * Get posts and return an object to build post's pages
 * @param sanityPosts
 * @returns object
 */
const getPostsUrlParams = (sanityPosts: SanityAllPost) => {
  console.dir(sanityPosts, { depth: null });
  return sanityPosts.allPost.map((post) => {
    const param = {
      params: {
        slug: post?.slug?.current,
      },
      props: {
        post,
      },
    };
    return param;
  });
};

export default getPostsUrlParams;
