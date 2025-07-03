export const dynamicParams = false;
export const revalidate = false;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import HufcorProductLayout from "../hufcorproduct/HufcorProductLayout";

const GET_HUFCOR_PRODUCT = gql`
  query GetHufcorProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      title
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
        customizationRows {
          label
          value
        }
        panelConfig {
          label
          image {
            sourceUrl
            altText
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

// ✅ FIXED: Properly handle Promise params in Next.js 15
export default async function HufcorProduct({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  // Await the params Promise
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const { data } = await client.query({
    query: GET_HUFCOR_PRODUCT,
    variables: {
      uri: `/${slugPath}/`,
    },
  });

  const fields = data?.page?.hufcorSeriesFields;
  if (!fields) return <div>Product not found</div>;

  return <HufcorProductLayout fields={fields} />;
}