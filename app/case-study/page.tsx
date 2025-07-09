import { gql } from '@apollo/client';
import client from '@/lib/apolloClient';
import "./casestudies.css";
import CaseStudiesClient from './CaseStudiesClient';

const CASE_STUDIES_QUERY = gql`
  query {
    caseStudies(first: 100) {
      nodes {
        title
        slug
        caseStudyFields {
          region
          thumbnailImage {
            sourceUrl
            altText
          }
        }
        productsCaseStudy {
          nodes {
            name
            slug
          }
        }
        sectorsCaseStudy {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const revalidate = 3600;

export default async function CaseStudiesPage() {
  const { data } = await client.query({ query: CASE_STUDIES_QUERY });
  const allStudies = data.caseStudies.nodes;

  return <CaseStudiesClient allStudies={allStudies} />;
}
