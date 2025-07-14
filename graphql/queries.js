import { gql } from '@apollo/client';

export const GET_LANDING_PAGE = gql`
  query GetLandingPageBySlug {
    page(id: "landingpage", idType: URI) {
      landingPageFields {
        logo {
          sourceUrl
        }
        bannerHeading

        bannerImages {
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }

        newsHeading
        newsBannerImage {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
       

        numberOfClients
        projectsCompleted
        workforce
        yearsOfExperience
        productsDescription
        clientLogos {
  logoImage {
    sourceUrl
    altText
  }
}

        products {
          title
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
          link
        }

        section1Bg {
          sourceUrl
        }
        section1Title
        section1Description
        section1ButtonLabel
        section1ButtonLink
        section1ImageMain {
          sourceUrl
        }
        section1ImageTopRight {
          sourceUrl
        }
        section1ImageBottomLeft {
          sourceUrl
        }

        section2Bg {
          sourceUrl
        }
        section2Title
        section2Description
        section2ButtonLabel
        section2ButtonLink
        section2ImageMain {
          sourceUrl
        }
        section2ImageTopRight {
          sourceUrl
        }
        section2ImageBottomLeft {
          sourceUrl
        }
        testimonials {
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
          name
          designation
          quote
          starRating
        }  
      }
      id
      databaseId
      title
      uri
    }
  }
`;
