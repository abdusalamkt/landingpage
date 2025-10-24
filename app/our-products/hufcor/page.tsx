import Header from "@/app/components/Header";
import Link from "next/link";
import ImageSlider from "./ImageSlider";
import styles from "./hufcor.module.css";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

// ✅ Combined GraphQL query (page fields + SEO)
const GET_HUFCOR_PAGE = `
  query GetHufcorPage {
    page(id: "/hufcor", idType: URI) {
      hufcorPageFields {
        logo {
          sourceUrl
          altText
        }
        heroHeading
        heroSubheading
        operableHeading
        operableDescription
        operableProductRangeTitle
        operableButtons {
          label
          url
        }
        operableslider {
          image {
            sourceUrl
            altText
          }
          title
        }
        glassHeading
        glassDescription
        glassProductRangeTitle
        glassButtons {
          label
          url
        }
        glassslider {
          image {
            sourceUrl
            altText
          }
          title
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

interface HufcorPageFields {
  logo?: {
    sourceUrl: string;
    altText?: string;
  };
  heroHeading: string;
  heroSubheading: string;
  operableHeading: string;
  operableDescription: string;
  operableProductRangeTitle: string;
  operableButtons?: Array<{
    label: string;
    url: string;
  }>;
  operableslider?: Array<{
    image?: {
      sourceUrl: string;
      altText?: string;
    };
    title?: string;
  }>;
  glassHeading: string;
  glassDescription: string;
  glassProductRangeTitle: string;
  glassButtons?: Array<{
    label: string;
    url: string;
  }>;
  glassslider?: Array<{
    image?: {
      sourceUrl: string;
      altText?: string;
    };
    title?: string;
  }>;
}

async function fetchHufcorPage(): Promise<{ fields: HufcorPageFields; seo: any | null }> {
  if (!WORDPRESS_API_URL) {
    throw new Error("WORDPRESS_GRAPHQL_ENDPOINT is not set");
  }

  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_HUFCOR_PAGE }),
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      console.error("❌ GraphQL errors:", json.errors);
      throw new Error("GraphQL query failed");
    }

    const page = json.data?.page;
    return {
      fields: (page?.hufcorPageFields as HufcorPageFields) || getFallbackData(),
      seo: page?.seo || null,
    };
  } catch (error) {
    console.error("❌ Failed to fetch Hufcor page:", error);
    return {
      fields: getFallbackData(),
      seo: null,
    };
  }
}

function getFallbackData(): HufcorPageFields {
  return {
    heroHeading: "Hufcor",
    heroSubheading: "Premium Solutions",
    operableHeading: "Operable Walls",
    operableDescription: "Innovative operable wall solutions for flexible spaces.",
    operableProductRangeTitle: "Product Range",
    operableButtons: [],
    operableslider: [],
    glassHeading: "Glass Partitions",
    glassDescription: "Modern glass partition systems for contemporary spaces.",
    glassProductRangeTitle: "Product Range",
    glassButtons: [],
    glassslider: [],
  };
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await fetchHufcorPage();
  const fallbackUrl = "https://gfiuae.com/hufcor";

  return mapSEOtoMetadata(
    seo || {
      title: "Hufcor Products | Premium Operable & Glass Walls | GFI UAE",
      metaDesc:
        "Explore Hufcor's innovative operable walls and glass partition systems. Premium architectural solutions for flexible space management in the UAE.",
      canonical: fallbackUrl,
      opengraphTitle: "Hufcor Products | Premium Operable & Glass Walls | GFI UAE",
      opengraphDescription:
        "Explore Hufcor's innovative operable walls and glass partition systems. Premium architectural solutions for flexible space management.",
    },
    fallbackUrl
  );
}

export default async function HufcorPage() {
  const { fields } = await fetchHufcorPage();

  if (!fields) {
    return (
      <div>
        <Header />
        <div style={{ padding: "50px", textAlign: "center" }}>
          <h1>Failed to load content.</h1>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const {
    logo,
    heroHeading,
    heroSubheading,
    operableHeading,
    operableDescription,
    operableProductRangeTitle,
    operableButtons,
    operableslider,
    glassHeading,
    glassDescription,
    glassProductRangeTitle,
    glassButtons,
    glassslider,
  } = fields;

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
            description: operableDescription || glassDescription,
            url: "https://gfiuae.com/hufcor",
            publisher: {
              "@type": "Organization",
              name: "GFI UAE",
            },
            mainEntity: [
              {
                "@type": "Product",
                name: operableHeading,
                description: operableDescription,
                image: operableslider?.[0]?.image?.sourceUrl,
                brand: {
                  "@type": "Brand",
                  name: "Hufcor",
                },
              },
              {
                "@type": "Product",
                name: glassHeading,
                description: glassDescription,
                image: glassslider?.[0]?.image?.sourceUrl,
                brand: {
                  "@type": "Brand",
                  name: "Hufcor",
                },
              },
            ],
          }),
        }}
      />

      {/* Banner Section */}
      <div className={styles.banner}>
        <div className={styles.overlay} />
        <div className={styles.bannerContent}>
          {logo?.sourceUrl && (
            <img
              src={logo.sourceUrl}
              alt={logo.altText || "Hufcor Logo"}
              className={styles.logo}
            />
          )}
          <h1 className={styles.heading}>
            {heroHeading} <span className={styles.red}>{heroSubheading}</span>
          </h1>
        </div>
      </div>

      {/* First Product Section (Image Left on Desktop) */}
      <div className={styles.productSection} id="operable">
        {/* Desktop Image Container */}
        <div className={styles.imageContainer}>
          <ImageSlider
            slides={
              operableslider?.map((slide) => ({
                src: slide.image?.sourceUrl || "",
                title: slide.title || "",
              })) || []
            }
          />
        </div>

        <div className={styles.textContainer}>
          <h2>{operableHeading}</h2>

          {/* Mobile Image Container - Shows after h2 on mobile only */}
          <div className={styles.mobileImageContainer}>
            <ImageSlider
              slides={
                operableslider?.map((slide) => ({
                  src: slide.image?.sourceUrl || "",
                  title: slide.title || "",
                })) || []
              }
            />
          </div>

          <p>{operableDescription}</p>

          <div className={styles.productRangeRow}>
            <h3>{operableProductRangeTitle}</h3>
            <div className={styles.line}></div>
          </div>

          <div className={styles.buttons}>
            {operableButtons?.map((btn, idx) => (
              <Link
                href={btn.url}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>{btn.label}</button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Second Product Section (Image Right on Desktop) */}
      <div className={`${styles.productSection} ${styles.reverse}`}>
        <div className={styles.textContainer}>
          <h2>{glassHeading}</h2>

          {/* Mobile Image Container - Shows after h2 on mobile only */}
          <div className={styles.mobileImageContainer}>
            <ImageSlider
              slides={
                glassslider?.map((slide) => ({
                  src: slide.image?.sourceUrl || "",
                  title: slide.title || "",
                })) || []
              }
            />
          </div>

          <p>{glassDescription}</p>

          <div className={styles.productRangeRow}>
            <h3>{glassProductRangeTitle}</h3>
            <div className={styles.line}></div>
          </div>

          <div className={styles.buttons}>
            {glassButtons?.map((btn, idx) => (
              <Link
                href={btn.url}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>{btn.label}</button>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Image Container */}
        <div className={`${styles.imageContainer} ${styles.glassSlider}`}>
          <ImageSlider
            slides={
              glassslider?.map((slide) => ({
                src: slide.image?.sourceUrl || "",
                title: slide.title || "",
              })) || []
            }
          />
        </div>
      </div>
    </>
  );
}