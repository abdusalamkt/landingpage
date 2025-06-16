import { gql } from '@apollo/client';

export const GET_LANDING_PAGE = gql`
  query GetLandingPageBySlug {
    page(id: "landingpage", idType: URI) {
      landingPageFields {
        logo {
          sourceUrl
        }
        bannerHeading
        bannerImage1 {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        bannerImage2 {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        bannerImage3 {
          sourceUrl
          altText
          mediaDetails {
            width
            height
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
        newsPost {
          ... on Post {
            id
            databaseId
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
        }
        numberOfClients
        projectsCompleted
        workforce
        yearsOfExperience
        productsDescription
        product1Title
        product1Image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        product2Title
        product2Image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        product3Title
        product3Image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        product4Title
        product4Image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        product5Title
        product5Image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        product6Title
        product6Image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        product7Title
        product7Image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
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
      }
      id
      databaseId
      title
      uri
    }
  }
`;