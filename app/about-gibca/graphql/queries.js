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
        isoHeading
        isoHighlight
        isoDescription
        mainImage {
          sourceUrl
          altText
        }
        overlayImage {
          sourceUrl
          altText
        }
        certifications {
          title
          description
          isoImage {
            sourceUrl
            altText
          }
        }
        isoButtonText
        isoButtonUrl
      }
    }
  }
`;
