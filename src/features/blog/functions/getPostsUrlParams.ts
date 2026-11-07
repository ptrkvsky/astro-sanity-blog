import type { SanityAllPost } from '../interfaces/SanityAllPost';
import { sortPosts } from './articleContent';
export function getPostsUrlParams(sanityPosts: SanityAllPost) {
  const posts = sortPosts(
    sanityPosts.allPost.filter((post) => post.slug?.current),
  );
  return posts.map((post) => {
    const category = post.categories?.find((item) => item?.slug?.current)?.slug
      .current;
    const relatedPosts = category
      ? posts
          .filter(
            (related) =>
              related._id !== post._id &&
              related.categories?.some(
                (item) => item?.slug?.current === category,
              ),
          )
          .slice(0, 3)
      : [];
    return {
      params: { slug: post.slug.current },
      props: { post, relatedPosts },
    };
  });
}
