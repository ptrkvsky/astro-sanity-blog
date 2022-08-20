import type { MDXInstance } from 'astro';

/**
 * @description take a list of posts and return the most recent date
 * @param posts
 * @returns
 */
const getMostRecentDate = (posts: MDXInstance<Record<string, any>>[]) => {
  const [mostRecentDate] = posts
    .map((post) => {
      const { frontmatter } = post;
      return frontmatter.date;
    })
    .reverse();

  return mostRecentDate;
};

export default getMostRecentDate;
