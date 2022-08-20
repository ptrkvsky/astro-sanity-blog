import type { CategoryPosts } from '@features/blog/interfaces/CategoryPosts';
import type { Frontmatter } from '@interfaces/Frontmatter';

const getPostsByCategory = (frontmatters: Frontmatter[]) => {
  const postsByCategory = frontmatters.reduce((acc, curr) => {
    // Si la catégorie courante n'est pas présente dans l'élément courant
    if (acc.findIndex((el) => el.category === curr.category) === -1) {
      // Je vais chercher tous les postes de cette catégorie
      const postsCategory = frontmatters.filter(
        (frontmatter) => frontmatter.category === curr.category
      );
      // Je créé un nouvel objet catPost avec la catégorie courante  et un tableau vide
      const newPostCat: CategoryPosts = {
        category: curr.category,
        posts: postsCategory,
      };
      return [...acc, newPostCat];
    } else {
      // Je retourn un nouveau tableau qui spread acc, et ajoute mon nouvel objet fraichement créé
      return [...acc];
    }
  }, [] as CategoryPosts[]);

  return postsByCategory;
};

export default getPostsByCategory;
