export const GET_ABOUT_US_PAGE_FIELDS = `
  query GetAboutUsPageFields {
    page(id: "about-gibca", idType: URI) {
      aboutUsPageFields {
        heroHighlightText
        heroHeading
        heroDescription1
        heroDescription2
        heroCtaUrl
        heroCtaText
        heroImage {
          sourceUrl
        }
        videoUrl
        timelineEvents {
          year
          title
          description
          image {
            sourceUrl
          }
        }
        visionTitle
        visionDescription
        missionTitle
        missionDescription
        isoHeading
        isoHighlight
        isoDescription
        isoGallery {
          sourceUrl
          altText
        }
          
      }
    }
  }
`;
