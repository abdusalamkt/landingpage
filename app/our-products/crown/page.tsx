import Header from "@/app/components/Header";
import Link from "next/link";
import ImageSlider from "./ImageSlider";
import styles from "./crown.module.css";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

// ✅ Combined query for page fields + SEO
const GET_CROWN_PAGE = `
  query GetCrownPage {
    page(id: "/crown-main-page", idType: URI) {
      crownPageFields {
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

interface Button {
  label: string;
  url: string;
}

interface Slide {
  image?: {
    sourceUrl: string;
    altText?: string;
  };
  title?: string;
}

interface Product {
  productHeading: string;
  productDescription: string;
  productRangeTitle: string;
  buttons?: Button[];
  productSlider?: Slide[];
}

interface CrownPageFields {
  logo?: {
    sourceUrl: string;
    altText?: string;
  };
  heroHeading: string;
  heroSubheading: string;
  heroBanner?: {
    sourceUrl: string;
    altText?: string;
  };
  products?: Product[];
}

// ✅ Fetch crown page data with SEO
async function getCrownPageData() {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: GET_CROWN_PAGE }),
      next: { revalidate: false }, 
    });

    const json = await res.json();
    const page = json?.data?.page;

    return {
      fields: page?.crownPageFields || null,
      seo: page?.seo || null,
    };
  } catch (error) {
    console.error("❌ Error fetching crown page data:", error);
    return {
      fields: null,
      seo: null,
    };
  }
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const fallbackUrl = "https://gfiuae.com/crown-main-page";

  try {
    const { seo, fields } = await getCrownPageData();

    // Use WordPress SEO if available
    if (seo) {
      console.log("✅ SEO found for Crown page");
      return mapSEOtoMetadata(seo, fallbackUrl);
    }

    // Generate from page fields if SEO not available
    if (fields) {
      const { heroHeading, heroSubheading, heroBanner, products } = fields;
      const title = `${heroHeading} ${heroSubheading || ""} | GFI UAE`;
      const description =
        products?.[0]?.productDescription ||
        `Explore ${heroHeading} products. Premium architectural solutions from GFI UAE.`;

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

    console.warn("⚠️ No SEO or page data found for Crown page, using fallback");
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // ✅ Comprehensive fallback metadata
  return {
    title: "Crown Products | Premium Architectural Solutions | GFI UAE",
    description:
      "Explore Crown's premium range of architectural products and solutions. Quality design and innovation from GFI UAE.",
    keywords:
      "Crown, architectural products, premium solutions, design, innovation, GFI UAE, Dubai, construction",
    alternates: {
      canonical: fallbackUrl,
    },
    openGraph: {
      title: "Crown Products | Premium Architectural Solutions | GFI UAE",
      description:
        "Explore Crown's premium range of architectural products and solutions.",
      url: fallbackUrl,
      type: "website",
      siteName: "GFI UAE",
      images: [
        {
          url: `${fallbackUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Crown Products by GFI UAE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Crown Products | Premium Architectural Solutions | GFI UAE",
      description:
        "Explore Crown's premium range of architectural products and solutions.",
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

export default async function CrownPage() {
  const { fields } = await getCrownPageData();

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
            url: "https://gfiuae.com/crown-main-page",
            publisher: {
              "@type": "Organization",
              name: "GFI UAE",
            },
           mainEntity: (products ?? []).map((product: Product) => ({

              "@type": "Product",
              name: product.productHeading,
              description: product.productDescription,
              image: product.productSlider?.[0]?.image?.sourceUrl,
              brand: {
                "@type": "Brand",
                name: "Crown",
              },
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
              alt={logo.altText || "Crown Logo"}
              className={styles.logo}
            />
          )}
          <h1 className={styles.heading}>
            {heroHeading} <span className={styles.red}>{heroSubheading}</span>
          </h1>
        </div>
      </div>

      {/* Product Sections */}
      {(products ?? []).map((product: Product, index: number) => (

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
              {product.buttons?.map((btn, idx) => (
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