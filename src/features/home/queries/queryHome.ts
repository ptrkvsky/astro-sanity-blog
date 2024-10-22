export const queryHome = /* GraphQL */ `
  query HomeQuery {
    allHome {
      title
      sections {
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

export type HomeSection = {
  _type: string;
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

export interface HomeQueryResult {
  allHome: Array<{
    title: string;
    sections: Array<HomeSection>;
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
