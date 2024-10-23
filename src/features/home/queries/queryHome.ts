export const queryHome = /* GraphQL */ `
  query HomeQuery {
    allHome {
      title
      sections {
        ... on SectionArticles {
          title
          articles {
            title
            slug {
              current
            }
            description
            _id
          }
          _type
        }
        ... on SectionProjects {
          _type
          title
          subTitle
          projects {
            _id
            title
            slug {
              current
            }
            mainImage {
              asset {
                url
                metadata {
                  dimensions {
                    width
                    height
                  }
                }
              }
            }
            year
            technos {
              _id
              title
            }
            keyPointsRaw
            companyInfo {
              name

              website
            }
          }
        }
      }
      seoTitle
      seoDescription
      seoImage {
        asset {
          url
        }
      }
      canonicalUrl
      noIndex
      openGraph {
        title
        description
        image {
          asset {
            url
          }
        }
        type
      }
    }
  }
`;

export type Techno = {
  _id: string;
  title: string;
};

interface Article {
  title: string;
  slug: {
    current: string;
  };
  description: string;
  _id: string;
}

export interface SectionArticles {
  title: string;
  articles: Article[];
  _type: 'sectionArticles';
}

export type SectionReferences = {
  _type: 'sectionProjects';
  title: string;
  subTitle: string;
  projects: Array<{
    _id: string;
    title: string;
    slug: {
      current: string;
    };
    mainImage: {
      asset: {
        url: string;
        metadata: {
          dimensions: {
            width: number;
            height: number;
          };
        };
      };
    };
    year: number | string;
    technos: Array<Techno>;
    keyPointsRaw: any;
    companyInfo: {
      name: string;
      website: string;
    };
  }>;
};

export type SectionsHome = Array<SectionReferences | SectionArticles>;

export interface HomeQueryResult {
  allHome: Array<{
    title: string;
    sections: SectionsHome;
    seoTitle: string;
    seoDescription: string;
    seoImage: {
      asset: {
        url: string;
      };
    };
    canonicalUrl: string;
    noIndex: boolean;
    openGraph: {
      title: string;
      description: string;
      image: {
        asset: {
          url: string;
        };
      };
      type: string;
    };
  }>;
}
