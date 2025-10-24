import Header from "@/app/components/Header";
import Link from "next/link";
import ImageSlider from "./ImageSlider";
import styles from "./acristalia.module.css";
import { q } from "framer-motion/client";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

const GET_ACRISTALIA_PAGE = `
  query GetAcristaliaPage {
    page(id: "/acristalia-main-page", idType: URI) {
      acristaliaPageFields {
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
    }
  }
`;

async function getAcristaliaPageFields() {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: GET_ACRISTALIA_PAGE }),
      next: { revalidate: 0 }, // cache for 60 days
    });

    const json = await res.json();
    return json?.data?.page?.acristaliaPageFields;
  } catch (error) {
    console.error("Error fetching Acristalia page data:", error);
    return null;
  }
}

export default async function AcristaliaPage() {
  const fields = await getAcristaliaPageFields();

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
          }}
        >
          Content temporarily unavailable. Please try again later.
        </div>
      </>
    );
  }

  const { logo, heroHeading, heroSubheading, heroBanner, products = [] } = fields;

  return (
    <>
      <Header />

      {/* Banner Section */}
      <div
        className={styles.banner}
        style={heroBanner?.sourceUrl ? { backgroundImage: `url(${heroBanner.sourceUrl})` } : {}}
      >
        <div className={styles.overlay} />
        <div className={styles.bannerContent}>
          {logo?.sourceUrl && (
            <img
              src={logo.sourceUrl}
              alt={logo.altText || "Acristalia Logo"}
              className={styles.logo}
            />
          )}
          <h1 className={styles.heading}>
            {heroHeading} <span className={styles.red}>{heroSubheading}</span>
          </h1>
        </div>
      </div>

      {/* Product Sections */}
      {products.map((product: any, index: number) => (
        <div
          key={index}
          className={`${styles.productSection} ${index % 2 === 0 ? "" : styles.reverse}`}
        >
          <div className={styles.imageContainer}>
            <ImageSlider
              slides={
                product.productSlider?.map((slide: any) => ({
                  src: slide.image?.sourceUrl || "",
                  title: slide.title || "",
                  quality: 100,
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
              {product.buttons?.map((btn: any, idx: number) => (
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
