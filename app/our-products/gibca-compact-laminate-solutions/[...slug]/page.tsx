export const revalidate = 0;
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import HplProductLayout from "../hplproduct/hplproductlayout";

// GraphQL Queries
const GET_HPL_PRODUCT = gql`
  query GetHplProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      hplSeriesFields {
        logo { sourceUrl altText }
        heroTitle
        heroHighlight
        heroDescription
        heroImage { sourceUrl altText }
        heroButton1Label
        heroButton2Label
        heroButton1Url
        heroButton2Url
        description
        features {
          featureTitle
          featureContent
        }
        modelsHeading
        models {
          title
          image { sourceUrl altText }
          description
          button {
            buttonLabel
            buttonUrl
          }
        }
        customizationHeading
        customizationDescription
        finishes {
          title
          image { sourceUrl altText }
        }
        designOptions {
          icon { sourceUrl altText }
          title
          description
        }
      }
    }
  }
`;

const GET_FAQS = gql`
  query GetFaqs {
    fAQs {
      nodes {
        title
        faqItems {
          faqItems {
            question
            answer
          }
          relatedProductPage {
            ... on Page {
              id
              title
              slug
              uri
            }
          }
        }
      }
    }
  }
`;

const GET_DOWNLOADS = gql`
  query GetDownloads {
    downloads {
      nodes {
        title
        downloadFields {
          productdownloads {
            filetype
            filetitle
            filepdf {
              sourceUrl
              title
            }
            gated
          }
          product {
            ... on Page {
              id
              title
              slug
              uri
            }
          }
        }
      }
    }
  }
`;

// Correct type definitions for Next.js 15
interface PageParams {
  slug: string[];
}

interface HplProductPageProps {
  params: Promise<PageParams>;
}

// Generate static params for SSG
export async function generateStaticParams() {
  const { data } = await client.query({
    query: gql`
      query {
        pages(where: { parent: 946 }) {
          nodes {
            uri
          }
        }
      }
    `,
  });

  return data.pages.nodes.map((page: any) => ({
    slug: page.uri.replace(/\/$/, "").split("/").filter(Boolean),
  }));
}

// Page Component
export default async function HplProduct({ params }: HplProductPageProps) {
  // Await the params promise
  const { slug } = await params;
  const slugPath = slug.join("/");

  const { data: productData } = await client.query({
    query: GET_HPL_PRODUCT,
    variables: { uri: `/${slugPath}/` }, // WordPress URI must match exactly
  });

  const { data: faqData } = await client.query({ query: GET_FAQS });
  const { data: downloadData } = await client.query({ query: GET_DOWNLOADS });

  const fields = productData?.page?.hplSeriesFields;
  const pageSlug = productData?.page?.slug;
  const pageId = productData?.page?.id;

  if (!fields) {
    return <div>Product not found</div>;
  }

  // Filter related FAQs
  const relatedFaqs: any[] = [];
  faqData?.fAQs?.nodes?.forEach((faqNode: any) => {
    const relatedPage = faqNode.faqItems?.relatedProductPage;
    const items = faqNode.faqItems?.faqItems;
    if (relatedPage && items?.length) {
      const isMatch =
        relatedPage.slug === pageSlug ||
        relatedPage.id === pageId ||
        relatedPage.uri === productData?.page?.uri;
      if (isMatch) {
        items.forEach((item: any) => {
          relatedFaqs.push({ question: item.question, answer: item.answer });
        });
      }
    }
  });

  // Filter related Downloads
  const relatedDownloads: any[] = [];
  downloadData?.downloads?.nodes?.forEach((downloadNode: any) => {
    const relatedPage = downloadNode.downloadFields?.product;
    const downloads = downloadNode.downloadFields?.productdownloads;
    if (relatedPage && downloads?.length) {
      const isMatch =
        relatedPage.slug === pageSlug ||
        relatedPage.id === pageId ||
        relatedPage.uri === productData?.page?.uri;
      if (isMatch) {
        downloads.forEach((download: any) => {
          relatedDownloads.push({
            fileType: download.filetype,
            fileTitle: download.filetitle,
            filePdf: download.filepdf,
            gated: download.gated,
          });
        });
      }
    }
  });

  return (
    <HplProductLayout
      fields={fields}
      faqData={relatedFaqs}
      downloadData={relatedDownloads}
    />
  );
}