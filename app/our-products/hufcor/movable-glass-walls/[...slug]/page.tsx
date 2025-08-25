export const revalidate = 86400;
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import HufcorProductLayout from "../hufcorproduct/HufcorProductLayout";

const GET_HUFCOR_PRODUCT = gql`
  query GetHufcorProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      hufcorSeriesFields {
        heroTitle
        heroHighlight
        heroDescription
        heroImage {
          sourceUrl
          altText
        }
        heroButton1Label
        heroButton1Url
        heroButton2Label
        heroButton2Url
        features {
          featureTitle
          featureContent
        }
        description
        imagebanner1 {
          sourceUrl
          altText
        }
        imagebanner1Title
        customizationOptionsDescription
        panelConfig {
          label
          description
          image {
            sourceUrl
            altText
          }
        }
        finishes {
          label
          thumbnail {
            sourceUrl
            altText
          }
          panel {
            sourceUrl
            altText
          }
        }
        doorType {
          title
          subTitle
          image {
            sourceUrl
            altText
          }
        }
        imagebanner2 {
          sourceUrl
          altText
        }
        imagebanner2Title
        choices {
          choiceTitle
          choicePoints {
            point
          }
        }
      }
    }
  }
`;

const GET_FAQS = gql`
  query GetFaqs {
    fAQs (first: 100) {
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

export async function generateStaticParams() {
  const { data } = await client.query({
    query: gql`
      query {
        pages(where: { parent: 575 }) {
          nodes {
            uri
          }
        }
      }
    `,
  });

  return data.pages.nodes.map((page: any) => ({
    slug: page.uri.replace(/\/$/, "").split("/"),
  }));
}

export default async function HufcorProduct({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const { data: productData } = await client.query({
    query: GET_HUFCOR_PRODUCT,
    variables: {
      uri: `/${slugPath}/`,
    },
  });

  const { data: faqData } = await client.query({
    query: GET_FAQS,
  });

  const { data: downloadData } = await client.query({
    query: GET_DOWNLOADS,
  });

  const fields = productData?.page?.hufcorSeriesFields;
  const pageSlug = productData?.page?.slug;
  const pageId = productData?.page?.id;

  if (!fields) return <div>Product not found</div>;

  // Process FAQ data
  let relatedFaqs: any[] = [];
  if (faqData?.fAQs?.nodes) {
    faqData.fAQs.nodes.forEach((faqNode: any) => {
      const relatedPage = faqNode.faqItems?.relatedProductPage;
      const items = faqNode.faqItems?.faqItems;

      if (relatedPage && items?.length) {
        const isMatch =
          relatedPage.slug === pageSlug ||
          relatedPage.id === pageId ||
          relatedPage.uri === productData?.page?.uri;

        if (isMatch) {
          items.forEach((item: any) => {
            relatedFaqs.push({
              question: item.question,
              answer: item.answer,
            });
          });
        }
      }
    });
  }

  // Process Download data
  let relatedDownloads: any[] = [];
  if (downloadData?.downloads?.nodes) {
    downloadData.downloads.nodes.forEach((downloadNode: any) => {
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
  }

  return (
    <HufcorProductLayout 
      fields={fields} 
      faqData={relatedFaqs} 
      downloadData={relatedDownloads}
    />
  );
}