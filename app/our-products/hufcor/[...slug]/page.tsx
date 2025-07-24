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
        imagebanner1 {
          sourceUrl
          altText
        }
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

  const fields = productData?.page?.hufcorSeriesFields;
  const pageSlug = productData?.page?.slug;
  const pageId = productData?.page?.id;

  if (!fields) return <div>Product not found</div>;

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

  return <HufcorProductLayout fields={fields} faqData={relatedFaqs} />;
}