import Header from "@/app/components/Header";
import Link from "next/link";
import ImageSlider from "./ImageSlider"; // client component for slider
import styles from "./hufcor.module.css";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

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
    }
  }
`;

async function getHufcorPageFields() {
  const res = await fetch(WORDPRESS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: GET_HUFCOR_PAGE }),
    next: { revalidate: 0 }, // cache for 1 hour
  });

  const json = await res.json();
  return json?.data?.page?.hufcorPageFields;
}

export default async function HufcorPage() {
  const fields = await getHufcorPageFields();

  if (!fields) {
    return <div>Failed to load content.</div>;
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

      {/* Banner Section */}
      <div className={styles.banner}>
        <div className={styles.overlay} />
        <div className={styles.bannerContent}>
          {logo?.sourceUrl && (
            <img src={logo.sourceUrl} alt={logo.altText || "Logo"} className={styles.logo} />
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
              operableslider?.map((slide: any) => ({
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
                operableslider?.map((slide: any) => ({
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
            {operableButtons?.map((btn: any, idx: number) => (
              <Link href={btn.url}  key={idx} target="_blank" rel="noopener noreferrer">
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
                glassslider?.map((slide: any) => ({
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
            {glassButtons?.map((btn: any, idx: number) => (
              <Link href={btn.url} key={idx} target="_blank" rel="noopener noreferrer">
                <button>{btn.label}</button>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Desktop Image Container */}
        <div className={`${styles.imageContainer} ${styles.glassSlider}`}>
          <ImageSlider
            slides={
              glassslider?.map((slide: any) => ({
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