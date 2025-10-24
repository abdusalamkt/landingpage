import { Metadata } from "next";
import OurProductsClient from "./OurProductsClient";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

// Server-side Apollo Client
const serverClient = new ApolloClient({
  uri: WORDPRESS_API_URL,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

// GraphQL Query with SEO
const GET_OUR_PRODUCTS_PAGE_WITH_SEO = gql`
  query GetOurProductsPageWithSEO {
    page(id: "our-products", idType: URI) {
      title
      ourProducts {
        productSections {
          sectionTitle
          sectionDescription
          sectionDefaultBg {
            sourceUrl
          }
          knowMoreUrl
          sectionCategories {
            categoryName
            categoriesUrl
            categoryHoverImage {
              sourceUrl
            }
            categoryProducts {
              productName
              productHoverBg {
                sourceUrl
              }
              productsUrl
            }
          }
        }
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

// Helper function to map SEO data
function mapSEOtoMetadata(seo: any, fallbackUrl: string): Metadata {
  const metadata: Metadata = {
    title: seo.title || undefined,
    description: seo.metaDesc || undefined,
    alternates: {
      canonical: seo.canonical || fallbackUrl,
    },
    openGraph: {
      title: seo.opengraphTitle || seo.title || undefined,
      description: seo.opengraphDescription || seo.metaDesc || undefined,
      url: seo.canonical || fallbackUrl,
      type: "website",
      siteName: "GFI UAE",
      images: seo.opengraphImage?.sourceUrl
        ? [
            {
              url: seo.opengraphImage.sourceUrl,
              width: 1200,
              height: 630,
              alt: seo.opengraphTitle || seo.title || "GFI UAE Products",
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.opengraphTitle || seo.title || undefined,
      description:
        seo.twitterDescription ||
        seo.opengraphDescription ||
        seo.metaDesc ||
        undefined,
      images: seo.twitterImage?.sourceUrl
        ? [seo.twitterImage.sourceUrl]
        : seo.opengraphImage?.sourceUrl
        ? [seo.opengraphImage.sourceUrl]
        : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  return metadata;
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const fallbackUrl = "https://gfiuae.com/our-products";

  try {
    const { data } = await serverClient.query({
      query: GET_OUR_PRODUCTS_PAGE_WITH_SEO,
    });

    const page = data?.page;
    const seo = page?.seo;
    const ourProducts = page?.ourProducts;

    // Use WordPress SEO if available
    if (seo) {
      console.log("✅ SEO found for Our Products page");
      return mapSEOtoMetadata(seo, fallbackUrl);
    }

    // Generate from page fields if SEO not available
    if (ourProducts?.productSections) {
      const sections = ourProducts.productSections;
      const title = "Our Products | Premium Solutions | GFI UAE";
      const description =
        sections.length > 0
          ? `Explore our range of premium products: ${sections
              .map((s: any) => s.sectionDescription)
              .slice(0, 3)
              .join(", ")}. Quality architectural solutions from GFI UAE.`
          : "Explore our range of premium architectural and construction solutions from GFI UAE.";

      const firstSectionImage = sections[0]?.sectionDefaultBg?.sourceUrl;

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
          images: firstSectionImage
            ? [
                {
                  url: firstSectionImage,
                  width: 1200,
                  height: 630,
                  alt: "GFI UAE Products",
                },
              ]
            : [],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: firstSectionImage ? [firstSectionImage] : [],
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    console.warn("⚠️ No SEO or page data found for Our Products page, using fallback");
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // ✅ Comprehensive fallback metadata
  return {
    title: "Our Products | Premium Architectural Solutions | GFI UAE",
    description:
      "Explore our comprehensive range of premium architectural and construction solutions. From operable walls to glass systems, discover quality products from GFI UAE.",
    keywords:
      "products, architectural solutions, operable walls, glass systems, construction materials, GFI UAE, Dubai, premium products",
    alternates: {
      canonical: fallbackUrl,
    },
    openGraph: {
      title: "Our Products | Premium Architectural Solutions | GFI UAE",
      description:
        "Explore our comprehensive range of premium architectural and construction solutions.",
      url: fallbackUrl,
      type: "website",
      siteName: "GFI UAE",
      images: [
        {
          url: `${fallbackUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "GFI UAE Products",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Our Products | Premium Architectural Solutions | GFI UAE",
      description:
        "Explore our comprehensive range of premium architectural and construction solutions.",
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

export default function OurProductsPage() {
  return <OurProductsClient />;
}