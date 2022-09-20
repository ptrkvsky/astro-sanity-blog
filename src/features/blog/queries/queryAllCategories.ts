export const queryAllCategories = `query postCategories {
	allCategory {
    _id
    title
    description 
    slug{
      current
    }
  }
}`;
