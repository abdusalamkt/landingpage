// app/lib/seo.ts
import { Metadata } from "next";

/**
 * Fetch SEO Framework data for any WP page/post by URI
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
                metaDesc
                title
                canonical
                social {
                  facebook {
                    title
                    description
                    image {
                      sourceUrl
                    }
                  }
                  twitter {
                    title
                    description
                    image {
                      sourceUrl
                    }
                  }
                }
              }
            }
            ... on Post {
              seo {
                metaDesc
                title
                canonical
                social {
                  facebook {
                    title
                    description
                    image {
                      sourceUrl
                    }
                  }
                  twitter {
                    title
                    description
                    image {
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { uri },
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  return json?.data?.nodeByUri?.seo || null;
}

/**
 * Map SEO Framework fields to Next.js Metadata object
 */
export function mapSEOtoMetadata(seo: any, fallbackUrl: string): Metadata {
  if (!seo) {
    return {
      title: "Default Site Title",
      description: "Default description",
      alternates: {
        canonical: fallbackUrl,
      },
    };
  }

  return {
    title: seo?.title || "Default Site Title",
    description: seo?.metaDesc || "Default description",
    alternates: {
      canonical: seo?.canonical || fallbackUrl,
    },
    openGraph: {
      title: seo?.social?.facebook?.title || seo?.title,
      description: seo?.social?.facebook?.description || seo?.metaDesc,
      images: seo?.social?.facebook?.image?.sourceUrl
        ? [{ url: seo.social.facebook.image.sourceUrl }]
        : [],
      type: "website",
      url: seo?.canonical || fallbackUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.social?.twitter?.title || seo?.title,
      description: seo?.social?.twitter?.description || seo?.metaDesc,
      images: seo?.social?.twitter?.image?.sourceUrl
        ? [seo.social.twitter.image.sourceUrl]
        : [],
    },
  };
}