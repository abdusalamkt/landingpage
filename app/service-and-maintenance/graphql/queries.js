export const GET_SERVICE_PAGE_FIELDS = `
  query GetServicePageFields {
    page(id: "service-maintenance", idType: URI) {
      serviceandMaintenanceFields {
        heroTitle
        heroHighlight
        heroDescription
        heroBgImage {
          sourceUrl
        }
        whyServiceTitle
        whyServiceDescription
        whyServiceImage {
          sourceUrl
        }
        whyServiceImageBefore {
          sourceUrl
        }
        whyServiceItems {
          title
          description
          position
          level
        }
        whatWeOfferItems {
          title
          description
        }
        whatWeOfferHeading
      }
    }
  }
`;
