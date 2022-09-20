import type { CategoryPosts } from '@features/blog/interfaces/CategoryPosts';
import type { Frontmatter } from '@interfaces/Frontmatter';
import type { Post } from '@interfaces/SanitySchema';

const getPostsByCategory = (posts: Post[]) => {
  const postsByCategory = posts.reduce((acc, curr) => {
    // Si la catégorie courante n'est pas présente dans l'élément courant
    if (
      acc.findIndex((el) => el.category.title === curr.categories[0].title) ===
      -1
    ) {
      // Je vais chercher tous les postes de cette catégorie
      const postsCategory = posts.filter(
        (post) => post.categories[0].title === curr.categories[0].title
      );
      // Je créé un nouvel objet catPost avec la catégorie courante  et un tableau vide
      const newPostCat: CategoryPosts = {
        category: curr.categories[0],
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
