export const revalidate = 0;
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import CrownProductPage from "../crownproduct/crownproductlayout";

const GET_CROWN_PRODUCT = gql`
  query GetCrownProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      crownSeriesFields {
        logo {
          sourceUrl
          altText
        }
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
        keyFeatures {
          title
          points {
            points
          }
        }
        customizationOptionHeading
        customizationOptionPoints {
          title
          points {
            points
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
        pages(where: { parent: 1234 }) {
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

export default async function CrownProduct({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const { data: productData } = await client.query({
    query: GET_CROWN_PRODUCT,
    variables: {
      uri: `/${slugPath}/`,
    },
  });

  const { data: faqData } = await client.query({ query: GET_FAQS });
  const { data: downloadData } = await client.query({ query: GET_DOWNLOADS });

  const fields = productData?.page?.crownSeriesFields;
  const pageSlug = productData?.page?.slug;
  const pageId = productData?.page?.id;

  if (!fields) return <div>Product not found</div>;

  let relatedFaqs: any[] = [];
  faqData?.fAQs?.nodes?.forEach((faqNode: any) => {
    const relatedPage = faqNode.faqItems?.relatedProductPage;
    const items = faqNode.faqItems?.faqItems;
    const isMatch =
      relatedPage?.slug === pageSlug ||
      relatedPage?.id === pageId ||
      relatedPage?.uri === productData?.page?.uri;

    if (isMatch && items?.length) {
      relatedFaqs.push(...items.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      })));
    }
  });

  let relatedDownloads: any[] = [];
  downloadData?.downloads?.nodes?.forEach((downloadNode: any) => {
    const relatedPage = downloadNode.downloadFields?.product;
    const downloads = downloadNode.downloadFields?.productdownloads;

    const isMatch =
      relatedPage?.slug === pageSlug ||
      relatedPage?.id === pageId ||
      relatedPage?.uri === productData?.page?.uri;

    if (isMatch && downloads?.length) {
      relatedDownloads.push(...downloads.map((download: any) => ({
        fileType: download.filetype,
        fileTitle: download.filetitle,
        filePdf: download.filepdf,
        gated: download.gated,
      })));
    }
  });

  return (
    <CrownProductPage
      fields={{
        logo: fields.logo,
        hero_title: fields.heroTitle,
        hero_highlight: fields.heroHighlight,
        hero_description: fields.heroDescription,
        hero_image: fields.heroImage,
        hero_button_1_label: fields.heroButton1Label,
        hero_button_1_url: fields.heroButton1Url,
        hero_button_2_label: fields.heroButton2Label,
        hero_button_2_url: fields.heroButton2Url,
        key_features: fields.keyFeatures || [],
        customization_heading: fields.customizationOptionHeading,
        customization_options: fields.customizationOptionPoints || [],
      }}
      faqData={relatedFaqs}
      downloadData={relatedDownloads}
    />
  );
}