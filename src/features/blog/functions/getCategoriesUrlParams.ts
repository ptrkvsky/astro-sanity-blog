import type { SanityAllCategories } from '../interfaces/SanityAllCategories';

/**
 * Get categories' slug and return an object to build categorie's pages
 * @param sanityCategories
 * @returns object
 */
export function getCategoriesUrlParams(sanityCategories: SanityAllCategories) {
  const urlParams = sanityCategories.allCategory.map((category) => {
    const param = {
      params: {
        slug: category?.slug?.current,
      },
      props: {
        category,
      },
    };
    return param;
  });
  return urlParams;
}
