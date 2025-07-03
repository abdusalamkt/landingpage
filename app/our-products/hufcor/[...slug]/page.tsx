export const revalidate = 86400; // Regenerate every 24 hours
export const dynamicParams = true; // Enable fallback for new slugs

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

export default async function HufcorProduct({
  params,
}: {
  params: { slug: string[] };
}) {
  const slugPath = params.slug.join("/");

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
