import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import DownloadPageClient from "./DownloadPageClient";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

// ✅ Combined query for downloads + SEO
const GET_DOWNLOADS_WITH_SEO = gql`
  query GetDownloadsWithSEO {
    downloads(first: 500) {
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
    page(id: "/downloads", idType: URI) {
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
`;

// ✅ Fetch downloads data with SEO
async function fetchDownloadsData() {
  try {
    const result = await client.query({
      query: GET_DOWNLOADS_WITH_SEO,
      context: {
        fetchOptions: {
          next: { revalidate: false }, 
        },
      },
    });

    return {
      downloads: result.data?.downloads || null,
      seo: result.data?.page?.seo || null,
    };
  } catch (error) {
    console.error("❌ Error fetching downloads data:", error);
    return {
      downloads: null,
      seo: null,
    };
  }
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const fallbackUrl = "https://gfiuae.com/downloads";

  try {
    const { seo } = await fetchDownloadsData();

    if (seo) {
      console.log("✅ SEO found for downloads page");
      return mapSEOtoMetadata(seo, fallbackUrl);
    }

    console.warn("⚠️ No SEO data found for downloads page, using fallback");
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // ✅ Comprehensive fallback metadata
  return {
    title: "Downloads | Product Resources & Documentation | GFI UAE",
    description:
      "Access technical documentation, brochures, CAD files, and specifications for GFI UAE products. Download product catalogs, installation guides, and more.",
    keywords:
      "downloads, product documentation, brochures, CAD files, specifications, technical guides, GFI UAE, product resources",
    alternates: {
      canonical: fallbackUrl,
    },
    openGraph: {
      title: "Downloads | Product Resources & Documentation | GFI UAE",
      description:
        "Access technical documentation, brochures, CAD files, and specifications for GFI UAE products.",
      url: fallbackUrl,
      type: "website",
      siteName: "GFI UAE",
      images: [
        {
          url: `${fallbackUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "GFI UAE Downloads",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Downloads | Product Resources & Documentation | GFI UAE",
      description:
        "Access technical documentation, brochures, CAD files, and specifications for GFI UAE products.",
      images: [`${fallbackUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function DownloadsPage() {
  const { downloads } = await fetchDownloadsData();

  if (!downloads) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Downloads</h1>
        <p>Unable to load downloads at this time. Please try again later.</p>
      </div>
    );
  }

  return <DownloadPageClient serverData={{ downloads }} />;
}