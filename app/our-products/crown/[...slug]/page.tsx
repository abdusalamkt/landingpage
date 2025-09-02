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
        description
        features {
          featureTitle
          featureContent
        }
        imagebanner1 {
          sourceUrl
          altText
        }
        imagebanner1Title
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
        description: fields.description,
        features: fields.features || [],
        customization_heading: fields.customizationOptionHeading,
        customization_options: fields.customizationOptionPoints || [],
        imagebanner1: fields.imagebanner1, // Add this line
        imagebanner1Title: fields.imagebanner1Title, // Add this line
      }}
      faqData={relatedFaqs}
      downloadData={relatedDownloads}
    />
  );
}