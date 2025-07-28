import Header from "@/app/components/Header";
import Link from "next/link";
import ImageSlider from "./ImageSlider"; // client component for slider
import styles from "./acristalia.module.css";

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
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      throw new Error('GraphQL query failed');
    }

    return json?.data?.page?.acristaliaPageFields;
  } catch (error) {
    console.error('Error fetching Acristalia page data at build time:', error);
    return null;
  }
}

// Generate static props at build time
export async function generateStaticProps() {
  const fields = await getAcristaliaPageFields();
  
  return {
    props: {
      fields,
    },
    // Regenerate the page at most once every 2 months (in seconds)
    revalidate: 60 * 60 * 24 * 60, // 60 days
  };
}

// For App Router (if using app directory)
export const revalidate = 5184000; // 60 days in seconds
export const dynamic = 'force-static';

export default async function AcristaliaPage() {
  // Fetch data at build time
  const fields = await getAcristaliaPageFields();

  if (!fields) {
    return (
      <>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          fontSize: '18px' 
        }}>
          Content temporarily unavailable. Please try again later.
        </div>
      </>
    );
  }

  const {
    logo,
    heroHeading,
    heroSubheading,
    heroBanner,
    products = [],
  } = fields;

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
          className={`${styles.productSection} ${index % 2 === 0 ? '' : styles.reverse}`}
        >
          <div className={styles.imageContainer}>
            <ImageSlider
              slides={
                product.productSlider?.map((slide: any) => ({
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
              <div className={styles.line}></div>
            </div>

            <div className={styles.buttons}>
              {product.buttons?.map((btn: any, idx: number) => (
                <Link href={btn.url || '#'} key={idx}>
                  <button 
                    className={btn.label?.toLowerCase() === 'view product' ? styles['view-product'] : ''}
                  >
                    {btn.label || 'Button'}
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