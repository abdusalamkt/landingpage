import Header from "@/app/components/Header";
import Link from "next/link";
import ImageSlider from "./ImageSlider";
import styles from "./Hpl.module.css";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

// ✅ Combined query for page fields + SEO
const GET_HPL_PAGE = `
  query GetHplPage {
    page(id: "/hpl-main-page", idType: URI) {
      HplPageFields {
        logo {
          sourceUrl
          altText
        }
        heroHeading
        heroSubheading
        heroBanner {
          sourceUrl
          altText
        }
        products {
          productHeading
          productDescription
          productRangeTitle
          buttons {
            label
            url
          }
          productSlider {
            image {
              sourceUrl
              altText
            }
            title
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

interface Product {
  productHeading: string;
  productDescription: string;
  productRangeTitle: string;
  buttons: Array<{
    label: string;
    url: string;
  }>;
  productSlider: Array<{
    image: {
      sourceUrl: string;
      altText: string;
    };
    title: string;
  }>;
}

interface HplPageFields {
  logo: {
    sourceUrl: string;
    altText: string;
  };
  heroHeading: string;
  heroSubheading: string;
  heroBanner: {
    sourceUrl: string;
    altText: string;
  };
  products: Product[];
}

interface HplPageData {
  fields: HplPageFields | null;
  seo: any | null;
}

// ✅ Fetch HPL page data with SEO
async function getHplPageData(): Promise<HplPageData> {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: GET_HPL_PAGE }),
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error("❌ GraphQL errors:", json.errors);
      return { fields: null, seo: null };
    }

    const page = json?.data?.page;
    return {
      fields: page?.HplPageFields || null,
      seo: page?.seo || null,
    };
  } catch (error) {
    console.error("❌ Error fetching HPL page data:", error);
    return { fields: null, seo: null };
  }
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const fallbackUrl = "https://gfiuae.com/hpl-main-page";

  try {
    const { seo, fields } = await getHplPageData();

    // Use WordPress SEO if available
    if (seo) {
      console.log("✅ SEO found for HPL page");
      return mapSEOtoMetadata(seo, fallbackUrl);
    }

    // Generate from page fields if SEO not available
    if (fields) {
      const { heroHeading, heroSubheading, heroBanner, products } = fields;
      const title = `${heroHeading} ${heroSubheading || ""} | GFI UAE`;
      const description =
        products?.[0]?.productDescription ||
        `Explore ${heroHeading} products. Premium high-pressure laminate solutions from GFI UAE.`;

      return {
        title,
        description,
        keywords:
          "HPL, high pressure laminate, decorative laminates, surface materials, interior design, GFI UAE",
        alternates: { canonical: fallbackUrl },
        openGraph: {
          title,
          description,
          url: fallbackUrl,
          type: "website",
          siteName: "GFI UAE",
          images: heroBanner?.sourceUrl
            ? [
                {
                  url: heroBanner.sourceUrl,
                  width: 1200,
                  height: 630,
                  alt: heroBanner.altText || heroHeading,
                },
              ]
            : [],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: heroBanner?.sourceUrl ? [heroBanner.sourceUrl] : [],
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    console.warn("⚠️ No SEO or page data found for HPL page, using fallback");
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // ✅ Comprehensive fallback metadata
  return {
    title: "HPL Products | High Pressure Laminates | GFI UAE",
    description:
      "Explore premium high-pressure laminate (HPL) products and decorative surface solutions. Quality laminates for interior design and architecture from GFI UAE.",
    keywords:
      "HPL, high pressure laminate, decorative laminates, surface materials, interior design, architectural laminates, GFI UAE, Dubai",
    alternates: {
      canonical: fallbackUrl,
    },
    openGraph: {
      title: "HPL Products | High Pressure Laminates | GFI UAE",
      description:
        "Explore premium high-pressure laminate (HPL) products and decorative surface solutions.",
      url: fallbackUrl,
      type: "website",
      siteName: "GFI UAE",
      images: [
        {
          url: `${fallbackUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "HPL Products by GFI UAE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "HPL Products | High Pressure Laminates | GFI UAE",
      description:
        "Explore premium high-pressure laminate (HPL) products and decorative surface solutions.",
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

export default async function HplPage() {
  const { fields } = await getHplPageData();

  if (!fields) {
    return (
      <>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            fontSize: "18px",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div>
            <h1>Content Temporarily Unavailable</h1>
            <p>Please try again later.</p>
          </div>
        </div>
      </>
    );
  }

  const { logo, heroHeading, heroSubheading, heroBanner, products = [] } = fields;

  return (
    <>
      <Header />

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${heroHeading} ${heroSubheading}`,
            description: products?.[0]?.productDescription || heroHeading,
            url: "https://gfiuae.com/hpl-main-page",
            publisher: {
              "@type": "Organization",
              name: "GFI UAE",
            },
            mainEntity: products.map((product) => ({
              "@type": "Product",
              name: product.productHeading,
              description: product.productDescription,
              image: product.productSlider?.[0]?.image?.sourceUrl,
              category: "High Pressure Laminate",
            })),
          }),
        }}
      />

      {/* Banner Section */}
      <div
        className={styles.banner}
        style={
          heroBanner?.sourceUrl
            ? { backgroundImage: `url(${heroBanner.sourceUrl})` }
            : {}
        }
      >
        <div className={styles.overlay} />
        <div className={styles.bannerContent}>
          {logo?.sourceUrl && (
            <img
              src={logo.sourceUrl}
              alt={logo.altText || "HPL Logo"}
              className={styles.logo}
            />
          )}
          <h1 className={styles.heading}>
            {heroHeading} <span className={styles.red}>{heroSubheading}</span>
          </h1>
        </div>
      </div>

      {/* Product Sections */}
      {products.map((product: Product, index: number) => (
        <div
          key={index}
          className={`${styles.productSection} ${
            index % 2 === 0 ? "" : styles.reverse
          }`}
        >
          <div className={styles.imageContainer}>
            <ImageSlider
              slides={
                product.productSlider?.map((slide) => ({
                  src: slide.image?.sourceUrl || "",
                  title: slide.title || "",
                })) || []
              }
              isReverse={index % 2 !== 0}
            />
          </div>
          <div className={styles.textContainer}>
            <h2>{product.productHeading}</h2>
            <p>{product.productDescription}</p>

            <div className={styles.productRangeRow}>
              <h3>{product.productRangeTitle}</h3>
            </div>

            <div className={styles.buttons}>
              {product.buttons?.map((btn, idx: number) => (
                <Link href={btn.url || "#"} key={idx}>
                  <button
                    className={
                      btn.label?.toLowerCase() === "view product"
                        ? styles["view-product"]
                        : ""
                    }
                  >
                    {btn.label || "Button"}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}