export const revalidate = false; 

import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";
import ChildrenClientFeatures from "./ChildrenClientFeatures";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

// Types for ACF data structure
interface MediaDetails {
  width: number;
  height: number;
}

interface ImageField {
  sourceUrl: string;
  altText: string;
  mediaDetails: MediaDetails;
}

interface Specification {
  spec: string;
  value: string;
}

interface KeyFeature {
  features: string;
}

interface Finish {
  title: string;
  image: ImageField;
}

interface CustomizedPatternImage {
  patterns: ImageField;
}

interface SmartCubicleItem {
  image: ImageField;
  title: string;
  description: string;
}

interface SEO {
  title: string;
  metaDesc: string;
  canonical: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: {
    sourceUrl: string;
  };
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: {
    sourceUrl: string;
  };
}

interface WashroomCubiclesField {
  heroImage: ImageField;
  heading: string;
  subheading: string;
  specification: Specification[];
  keyFeatures: KeyFeature[];
  choicesToAddHeading: string;
  description: string;
  finishes: Finish[];
  customizedPatternImages: CustomizedPatternImage[];
  patternTitle: string;
  patternDescription: string;
  smartCubicleHeading: string;
  items: SmartCubicleItem[];
  downloadButtonLabel: string;
  downloadButtonUrl: string;
}

interface PageData {
  washroomCubiclesField: WashroomCubiclesField;
  seo?: SEO;
}

// ✅ Updated GraphQL query with SEO fields
const GET_WASHROOM_CUBICLES = `
  query GetWashroomCubicle {
    page(id: "children", idType: URI) {
      washroomCubiclesField {
        heroImage {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        heading
        subheading
        specification {
          spec
          value
        }
        keyFeatures {
          features
        }
        choicesToAddHeading
        description
        finishes {
          title
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        customizedPatternImages {
          patterns {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        patternTitle
        patternDescription
        smartCubicleHeading
        items {
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
          title
          description
        }
        downloadButtonLabel
        downloadButtonUrl
      }
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

// ✅ Server-side data fetching function
async function getWashroomCubiclesData(): Promise<PageData | null> {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_WASHROOM_CUBICLES }),
      next: { revalidate: false }, 
    });

    const json = await res.json();
    return json?.data?.page || null;
  } catch (error) {
    console.error('Error fetching washroom cubicles data:', error);
    return null;
  }
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const fallbackUrl = "https://gfiuae.com/children";

  try {
    const data = await getWashroomCubiclesData();

    // Use WordPress SEO if available
    if (data?.seo) {
      console.log("✅ SEO found for Children page");
      return mapSEOtoMetadata(data.seo, fallbackUrl);
    }

    // Generate from page fields if SEO not available
    if (data?.washroomCubiclesField) {
      const { heading, subheading, heroImage } = data.washroomCubiclesField;
      const title = `${heading || "Children Washroom Cubicles"} | GFI UAE`;
      const description =
        subheading ||
        "Premium children's washroom cubicles with customizable designs and safety features. Explore our range at GFI UAE.";

      return {
        title,
        description,
        alternates: { canonical: fallbackUrl },
        openGraph: {
          title,
          description,
          url: fallbackUrl,
          type: "website",
          siteName: "GFI UAE",
          images: heroImage?.sourceUrl
            ? [
                {
                  url: heroImage.sourceUrl,
                  width: heroImage.mediaDetails?.width || 1200,
                  height: heroImage.mediaDetails?.height || 630,
                  alt: heroImage.altText || heading,
                },
              ]
            : [],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: heroImage?.sourceUrl ? [heroImage.sourceUrl] : [],
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    console.warn("⚠️ No SEO or page data found for Children page, using fallback");
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // Generic fallback
  return {
    title: "Children Washroom Cubicles | GFI UAE",
    description: "Premium children's washroom cubicles with customizable designs and safety features from GFI UAE.",
    alternates: { canonical: fallbackUrl },
  };
}

// ✅ Main Server Component
export default async function ChildrenPage() {
  const data = await getWashroomCubiclesData();

  if (!data?.washroomCubiclesField) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Content not found</h1>
        <p>The washroom cubicles page could not be loaded.</p>
      </div>
    );
  }

  return <ChildrenClientFeatures acfData={data.washroomCubiclesField} />;
}