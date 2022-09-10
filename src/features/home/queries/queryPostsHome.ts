export const queryPostsHome = `query postsHome  {
  allPost(where: {isHome: {eq: true}}){
  	slug{
      current
    }
    title
    description
    mainImage{
    	asset{ 
        url
      	altText
        metadata{
          dimensions{
            height
            width
            aspectRatio
          }
        }
      }
    }
  }
}`;
