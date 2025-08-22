export const revalidate = 0;
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import AcristaliaProductLayout from "../acristaliaproduct/acristaliaproductlayout";

const GET_ACRISTALIA_PRODUCT = gql`
  query GetAcristaliaProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      acristaliaSeriesFields {
        logo { sourceUrl altText }
        heroTitle
        heroHighlight
        heroDescription
        heroImage { sourceUrl altText }
        heroButton1Label
        heroButton2Label
        heroButton1Url
        heroButton2Url
        videoLink
        videoDescription
        features {
          featureTitle
          featureContent
        }
        description
        keyFeatures {
          imageBanner { sourceUrl altText }
          features {
            icon { sourceUrl altText }
            title
            description
          }
        }
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
    slug: page.uri.replace(/\/$/, "").split("/"),
  }));
}

export default async function AcristaliaProduct({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const { data: productData } = await client.query({
    query: GET_ACRISTALIA_PRODUCT,
    variables: {
      uri: `/${slugPath}/`,
    },
  });

  const { data: faqData } = await client.query({ query: GET_FAQS });
  const { data: downloadData } = await client.query({ query: GET_DOWNLOADS });

  const fields = productData?.page?.acristaliaSeriesFields;
  const pageSlug = productData?.page?.slug;
  const pageId = productData?.page?.id;

  if (!fields) return <div>Product not found</div>;

  // Filter FAQ
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

  // Filter Downloads
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
    <AcristaliaProductLayout
      fields={fields}
      faqData={relatedFaqs}
      downloadData={relatedDownloads}
    />
  );
}
