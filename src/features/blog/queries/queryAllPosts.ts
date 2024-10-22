export const queryAllPosts = /* GraphQL */ `
  query allPosts {
    allPost {
      _id
      slug {
        current
      }
      _createdAt
      _updatedAt
      seoTitle
      seoDescription
      seoImage {
        asset {
          altText
          url
          metadata {
            dimensions {
              height
              width
              aspectRatio
            }
          }
        }
      }
      type
      questionsAnswers {
        question
        answer
      }
      title
      description
      mainImage {
        asset {
          url
          altText
          metadata {
            dimensions {
              height
              width
              aspectRatio
            }
          }
        }
      }
      categories {
        title
        slug {
          current
        }
      }
      bodyRaw
    }
  }
`;
