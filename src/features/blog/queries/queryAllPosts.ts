export const queryAllPosts = `query allPosts {
  allPost{
    _id
  	slug{
      current
    }
    _createdAt
    _updatedAt
    seoTitle
    seoDescription
    seoKeywords
    seoImage{
    	asset{ 
      	altText
        url
        metadata{
          dimensions{
            height
            width
            aspectRatio
          }
        }
      }
    }
    type
    questionsAnswers{
      question
      answer
    }
    title
    description
    mainImage{
    	asset{ 
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
    categories{
      title
      slug {
        current
      }
    }
    bodyRaw
  }
}`;
