// app/lib/seo.ts
import { Metadata } from "next";

/**
 * Fetch Yoast SEO data for any WP page/post by URI
 */
export async function fetchSEO(uri: string) {
  const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query PageSEO($uri: ID!) {
          nodeByUri(uri: $uri) {
            ... on Page {
              seo {
                title
                metaDesc
                canonical
                opengraphTitle
                opengraphDescription
                opengraphImage {
                  sourceUrl
                }
                twitterTitle
                twitterDescription
                twitterImage {
                  sourceUrl
                }
              }
            }
            ... on Post {
              seo {
                title
                metaDesc
                canonical
                opengraphTitle
                opengraphDescription
                opengraphImage {
                  sourceUrl
                }
                twitterTitle
                twitterDescription
                twitterImage {
                  sourceUrl
                }
              }
            }
          }
        }
      `,
      variables: { uri },
    }),
    next: { revalidate: false }, // ISR: refresh every 1 min
  });

  const json = await res.json();
  return json?.data?.nodeByUri?.seo || null;
}

/**
 * Map Yoast SEO fields to Next.js Metadata object
 */
export function mapSEOtoMetadata(seo: any, fallbackUrl: string): Metadata {
  return {
    title: seo?.title || "Default Site Title",
    description: seo?.metaDesc || "Default description",
    alternates: {
      canonical: seo?.canonical || fallbackUrl,
    },
    openGraph: {
      title: seo?.opengraphTitle || seo?.title,
      description: seo?.opengraphDescription || seo?.metaDesc,
      images: seo?.opengraphImage?.sourceUrl
        ? [{ url: seo.opengraphImage.sourceUrl }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || seo?.title,
      description: seo?.twitterDescription || seo?.metaDesc,
      images: seo?.twitterImage?.sourceUrl
        ? [seo.twitterImage.sourceUrl]
        : [],
    },
  };
}
