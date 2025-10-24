import Header from "@/app/components/Header";
import WhatSetsUsApart from "@/app/components/WhatSetsUsApart";
import FaqSection from "@/app/components/FaqSection";
import Image from "next/image";
import styles from "./automatic-and-manual.module.css";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

interface HeroImage {
  sourceUrl: string;
  altText?: string;
}

interface ImageBanner {
  sourceUrl: string;
  altText?: string;
}

interface SystemPoint {
  point: string;
}

interface System {
  title: string;
  description: string;
  image: {
    sourceUrl: string;
    altText?: string;
  };
  points: SystemPoint[];
}

interface AutomaticPivotCard {
  title: string;
  description: string;
}

interface Feature {
  featureTitle: string;
  featureContent: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqNode {
  title: string;
  faqItems: {
    faqItems: FaqItem[];
    relatedProductPage: {
      id: string;
      title: string;
      slug: string;
      uri: string;
    };
  };
}

interface PivotDoorsData {
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage: HeroImage;
  heroButton1Label: string;
  heroButton1Url: string;
  heroButton2Label: string;
  heroButton2Url: string;
  features: Feature[];
  description: string;
  configurationDescription: string;
  videoLink: string;
  manualPivotDescription: string;
  imageBanner1: ImageBanner;
  imageBanner1Title: string;
  systems: System[];
  automaticPivotDescription: string;
  imageBanner2: ImageBanner;
  imageBanner2Title: string;
  automaticPivotCards: AutomaticPivotCard[];
}

interface GraphQLResponse {
  data: {
    page: {
      title: string;
      slug: string;
      PivotDoors: PivotDoorsData;
      seo?: {
        title?: string;
        metaDesc?: string;
        canonical?: string;
        opengraphTitle?: string;
        opengraphDescription?: string;
        opengraphImage?: {
          sourceUrl?: string;
        };
        twitterTitle?: string;
        twitterDescription?: string;
        twitterImage?: {
          sourceUrl?: string;
        };
      };
    };
    fAQs: {
      nodes: FaqNode[];
    };
  };
}

// ✅ Combined query for page fields + SEO
const GET_PIVOT_DOORS_PAGE = `
  query GetPivotDoorsPage {
    page(id: 1335, idType: DATABASE_ID) {
      title
      slug
      PivotDoors {
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
        description
        configurationDescription
        videoLink
        manualPivotDescription
        imageBanner1 {
          sourceUrl
          altText
        }
        imageBanner1Title
        systems {
          title
          description
          image {
            sourceUrl
            altText
          }
          points {
            point
          }
        }
        automaticPivotDescription
        imageBanner2 {
          sourceUrl
          altText
        }
        imageBanner2Title
        automaticPivotCards {
          title
          description
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
    fAQs {
      nodes {
        title
        faqItems {
          faqItems {
            question
            answer
          }
          relatedProductPage {
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

// ✅ Fetch pivot doors data with SEO
async function getPivotDoorsData() {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_PIVOT_DOORS_PAGE }),
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    const json: GraphQLResponse = await res.json();
    
    const page = json?.data?.page;
    const pivotData = page?.PivotDoors;
    const faqNodes = json?.data?.fAQs?.nodes || [];
    
    const pivotDoorFaq = faqNodes.find(
      (faq) => 
        faq.title.toLowerCase().includes('pivot doors') ||
        faq.faqItems.relatedProductPage?.slug === 'pivot-doors' ||
        faq.faqItems.relatedProductPage?.uri === '/pivot-doors/'
    );

    return {
      pivotData: pivotData || null,
      faqData: pivotDoorFaq?.faqItems?.faqItems || [],
      seo: page?.seo || null,
    };
  } catch (error) {
    console.error("❌ Error fetching pivot doors data:", error);
    return {
      pivotData: null,
      faqData: [],
      seo: null,
    };
  }
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const fallbackUrl = "https://gfiuae.com/pivot-doors";

  try {
    const { seo, pivotData } = await getPivotDoorsData();

    // Use WordPress SEO if available
    if (seo) {
      console.log("✅ SEO found for Pivot Doors page");
      return mapSEOtoMetadata(seo, fallbackUrl);
    }

    // Generate from page fields if SEO not available
    if (pivotData) {
      const { heroTitle, heroHighlight, heroDescription, heroImage } = pivotData;
      const title = `${heroTitle} ${heroHighlight || ""} | GFI UAE`;
      const description = heroDescription || `Explore ${heroTitle} ${heroHighlight}. Premium pivot door solutions from GFI UAE.`;

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
                  width: 1200,
                  height: 630,
                  alt: heroImage.altText || title,
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

    console.warn("⚠️ No SEO or page data found for Pivot Doors page, using fallback");
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // ✅ Comprehensive fallback metadata
  return {
    title: "Pivot Doors | Automatic & Manual Solutions | GFI UAE",
    description:
      "Explore our range of automatic and manual pivot doors. Premium engineering and design from GFI UAE.",
    keywords:
      "pivot doors, automatic doors, manual doors, architectural solutions, GFI UAE, Dubai, construction",
    alternates: {
      canonical: fallbackUrl,
    },
    openGraph: {
      title: "Pivot Doors | Automatic & Manual Solutions | GFI UAE",
      description:
        "Explore our range of automatic and manual pivot doors. Premium engineering and design.",
      url: fallbackUrl,
      type: "website",
      siteName: "GFI UAE",
      images: [
        {
          url: `${fallbackUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Pivot Doors by GFI UAE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pivot Doors | Automatic & Manual Solutions | GFI UAE",
      description:
        "Explore our range of automatic and manual pivot doors. Premium engineering and design.",
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

export default async function AutomaticAndManualPage() {
  const { pivotData, faqData } = await getPivotDoorsData();

  if (!pivotData) {
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

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Create systems data with alternating reverse layout
  const manualSystems = pivotData?.systems?.map((system, index) => ({
    title: system.title.split(' ')[0] || system.title,
    highlight: system.title.split(' ').slice(1).join(' ') || 'SYSTEM',
    description: system.description,
    points: system.points.map(p => p.point),
    image: system.image.sourceUrl,
    reverse: index % 2 !== 0,
  })) || [];

  // Get video ID for embed
  const videoId = pivotData?.videoLink ? getYouTubeVideoId(pivotData.videoLink) : 'MANI5dLvcXY';

  return (
    <div>
      <Header />

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${pivotData.heroTitle} ${pivotData.heroHighlight}`,
            description: pivotData.heroDescription || pivotData.description,
            url: "https://gfiuae.com/pivot-doors",
            publisher: {
              "@type": "Organization",
              name: "GFI UAE",
            },
            mainEntity: {
              "@type": "Product",
              name: `${pivotData.heroTitle} ${pivotData.heroHighlight}`,
              description: pivotData.heroDescription,
              image: pivotData.heroImage?.sourceUrl,
              brand: {
                "@type": "Brand",
                name: "GFI UAE",
              },
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          <h1 className={styles.series}>
            {pivotData.heroTitle} <span className={styles.red}>{pivotData.heroHighlight}</span>
          </h1>

          {pivotData.heroDescription && <p className={styles.description}>{pivotData.heroDescription}</p>}
          <div className={styles.buttons}>
            {pivotData.heroButton1Label && pivotData.heroButton1Url && (
              <a href={pivotData.heroButton1Url} target="_blank" rel="noopener noreferrer">
                <button className={styles.outline}>{pivotData.heroButton1Label}</button>
              </a>
            )}
            {pivotData.heroButton2Label && pivotData.heroButton2Url && (
              <a href={pivotData.heroButton2Url} target="_blank" rel="noopener noreferrer">
                <button className={styles.primary}>{pivotData.heroButton2Label}</button>
              </a>
            )}
          </div>
        </div>

        {pivotData.heroImage?.sourceUrl?.trim() && (
          <div className={styles.imageWrapper}>
            <Image
              src={pivotData.heroImage.sourceUrl}
              alt={pivotData.heroImage.altText || "Hero Image"}
              width={800}
              height={600}
              priority
              loading="eager"
              className={styles.heroImage}
              quality={85}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </section>

      {/* What Sets Us Apart Section */}
      {pivotData?.features && pivotData.features.length > 0 && (
        <WhatSetsUsApart 
          features={pivotData.features} 
          brand="green" 
          description={pivotData.description} 
        />
      )}

      {/* Configuration Section */}
      <section className={styles.pivotSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeading}>
            <img
              src="/icon/hufcor/custom.png"
              alt="Configuration Icon"
              className={styles.icon}
            />
            CONFIGURATION
          </h2>
          <p>
            {pivotData?.configurationDescription || 
              "Our configuration system ensures perfect pivoting precision. This section explains the key features of our configurable pivot doors and how each component works seamlessly together."}
          </p>
        </div>
      </section>

      {/* Manual Pivot Door Section */}
      <section className={styles.pivotSection}>
        <div className={styles.sectionHeader}>
          <h2>MANUAL PIVOT DOOR</h2>
          <p>
            {pivotData?.manualPivotDescription ||
              "Our Manual Pivot doors are a revolutionary design that allows for perfect pivot movement at the hinges, giving it an ultra-smooth and outstanding performance."}
          </p>
        </div>

        {pivotData?.imageBanner1?.sourceUrl && (
          <section className={styles.noiseBanner}>
            <div className={styles.noiseOverlay}></div>
            <Image
              src={pivotData.imageBanner1.sourceUrl}
              alt={pivotData.imageBanner1.altText || "Banner Image 1"}
              fill
              style={{ zIndex: -1, objectFit: "cover" }}
              priority
            />
            {pivotData.imageBanner1Title && pivotData.imageBanner1Title.trim() !== "" && (
              <div className={styles.bannerCaption}>{pivotData.imageBanner1Title}</div>
            )}
          </section>
        )}

        {manualSystems.map((sys, index) => (
          <div
            key={index}
            className={`${styles.systemBlock} ${sys.reverse ? styles.reverse : ""}`}
          >
            <div className={styles.manualImageWrapper}>
              <Image
                src={sys.image}
                alt={`${sys.title} ${sys.highlight}`}
                width={600}
                height={600}
                priority
              />
            </div>
            <div className={styles.textWrapper}>
              <h3>
                {sys.title} <span className={styles.highlight}>{sys.highlight}</span>
              </h3>
              <p className={styles.description}>{sys.description}</p>
              <ul>
                {sys.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Automatic Pivot Door Section */}
      <section className={styles.pivotSection}>
        <div className={styles.sectionHeader}>
          <h2>AUTOMATIC PIVOT DOOR</h2>
          <p>
            {pivotData?.automaticPivotDescription ||
              "Our Automatic Pivot doors combine engineering precision with cutting-edge design, delivering silent operation, superior safety, and long-lasting durability."}
          </p>
        </div>

        {pivotData?.imageBanner2?.sourceUrl && (
          <section className={styles.noiseBanner}>
            <div className={styles.noiseOverlay}></div>
            <Image
              src={pivotData.imageBanner2.sourceUrl}
              alt={pivotData.imageBanner2.altText || "Banner Image 2"}
              fill
              style={{ zIndex: -1, objectFit: "cover" }}
              priority
            />
            {pivotData.imageBanner2Title && pivotData.imageBanner2Title.trim() !== "" && (
              <div className={styles.bannerCaption}>{pivotData.imageBanner2Title}</div>
            )}
          </section>
        )}

        {/* Automatic cards */}
        <div className="flex flex-col items-center gap-8 pt-8">
          {/* First row (3 cards) */}
          <div className="flex justify-center gap-6 w-full flex-wrap">
            {pivotData?.automaticPivotCards?.slice(0, 3).map((card, i) => (
              <div
                key={i}
                className="w-1/4 min-w-[350px] bg-white p-6 rounded-xl shadow-md text-center 
                           transition-all duration-6000 ease-in-out transform hover:-translate-y-0.5 hover:scale-101 hover:shadow-xl"
              >
                <h3 className="text-3xl mb-2 text-[#3d3d3d]">{card.title}</h3>
                <p className="text-base text-[#3d3d3dd1]">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Second row (2 cards centered) */}
          <div className="flex justify-center gap-6 w-full flex-wrap">
            {pivotData?.automaticPivotCards?.slice(3, 5).map((card, i) => (
              <div
                key={i}
                className="w-1/4 min-w-[400px] bg-white p-6 rounded-xl shadow-md text-center 
                           transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-101 hover:shadow-xl"
              >
                <h3 className="text-3xl mb-2 text-[#3d3d3d]">{card.title}</h3>
                <p className="text-base text-[#3d3d3dd1]">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqData.length > 0 && (
        <FaqSection 
          faqData={faqData} 
          theme="gibca" 
        />
      )}
    </div>
  );
}