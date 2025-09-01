import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import DownloadPageClient from "./DownloadPageClient";

// Move query outside
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

export default async function DownloadsPage() {
  const result = await client.query({ query: GET_DOWNLOADS });
  const data = result.data;

  return <DownloadPageClient serverData={data} />;
}
