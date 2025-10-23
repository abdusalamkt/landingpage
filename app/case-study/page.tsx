// app/case-study/page.tsx
import { gql } from '@apollo/client';
import client from '@/lib/apolloClient';
import "./casestudies.css";
import CaseStudiesClient from './CaseStudiesClient';
import { Metadata } from "next";

// Hardcoded SEO for Case Studies listing page
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Case Studies | GFI UAE",
    description: "Know more about our work ranging from Hufcor operable walls to Toilet Cubicles. Pivot Doors and more for Dubai Mall, SLS hotel, Timeout market and others.",
    keywords: ["GFI UAE", "case studies", "projects", "products", "solutions", "success stories"],
    openGraph: {
      title: "Case Studies | GFI UAE",
      description: "Explore our latest case studies and project highlights across various products, sectors, and regions.",
      url: "https://gfiuae.com/case-study",
      siteName: "GFI UAE",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: "Case Studies | GFI UAE",
      description: "Explore our latest case studies and project highlights across various products, sectors, and regions.",
      images: ["https://gfiuae.com/og-image-case-studies.jpg"]
    }
  };
}

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
