// ✅ Enable static generation with long revalidation
export const revalidate = 86400; // Revalidate once per day (24 hours)
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
  query GetFaqs  {
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
    downloads (first: 100) {
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

export default async function HufcorProduct({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  // ✅ Run all queries in parallel for faster loading
  const [productResult, faqResult, downloadResult] = await Promise.all([
    client.query({
      query: GET_HUFCOR_PRODUCT,
      variables: { uri: `/${slugPath}/` },
      context: {
        fetchOptions: {
          next: { revalidate: 86400 }, // Cache for 24 hours
        },
      },
    }),
    client.query({
      query: GET_FAQS,
      context: {
        fetchOptions: {
          next: { revalidate: 86400 },
        },
      },
    }),
    client.query({
      query: GET_DOWNLOADS,
      context: {
        fetchOptions: {
          next: { revalidate: 86400 },
        },
      },
    }),
  ]);

  const fields = productResult.data?.page?.hufcorSeriesFields;
  const pageSlug = productResult.data?.page?.slug;
  const pageId = productResult.data?.page?.id;
  const pageUri = productResult.data?.page?.uri;

  if (!fields) return <div>Product not found</div>;

  // Process FAQ data
  let relatedFaqs: any[] = [];
  if (faqResult.data?.fAQs?.nodes) {
    faqResult.data.fAQs.nodes.forEach((faqNode: any) => {
      const faqItemsArray = faqNode?.faqItems?.faqItems ?? [];
      const relatedPage = faqNode?.faqItems?.relatedProductPage;

      if (Array.isArray(faqItemsArray) && relatedPage) {
        const isMatch =
          relatedPage?.slug === pageSlug ||
          relatedPage?.id === pageId ||
          relatedPage?.uri === pageUri;

        if (isMatch) {
          faqItemsArray.forEach((item: any) => {
            if (item?.question && item?.answer) {
              relatedFaqs.push({
                question: item.question,
                answer: item.answer,
              });
            }
          });
        }
      }
    });
  }

  // Process Download data
  let relatedDownloads: any[] = [];
  if (downloadResult.data?.downloads?.nodes) {
    downloadResult.data.downloads.nodes.forEach((downloadNode: any) => {
      const relatedPage = downloadNode.downloadFields?.product;
      const downloads = downloadNode.downloadFields?.productdownloads;

      if (relatedPage && downloads?.length) {
        const isMatch =
          relatedPage?.slug === pageSlug ||
          relatedPage?.id === pageId ||
          relatedPage?.uri === pageUri;

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