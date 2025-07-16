// graphql/queries.js
import { gql } from '@apollo/client';

export const GET_ALL_PROJECT_IMAGES = gql`
  query GetAllProjectImages {
    projects(first: 100) {
      nodes {
        title
        projectGalleryFields {
          gallerySections {
            sector {
              name
            }
            images {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;
