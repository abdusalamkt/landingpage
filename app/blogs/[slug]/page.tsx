import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import styles from "./blogpage.module.css";
import Image from "next/image";
import { Metadata } from "next";

// ───────────────────────────────
// GraphQL Query
// ───────────────────────────────
const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      content
      slug
      date
      blogPostFields {
        productTags
        categoryLabel
        readTime
        cardDescription
        blogImage {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        heading
        description
        blogDetails {
          title
          details
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

// ───────────────────────────────
// Props Interface (Fixed for Next.js 15)
// ───────────────────────────────
interface Props {
  params: Promise<{ slug: string }>;
}

// ───────────────────────────────
// Generate Metadata (SEO)
// ───────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
    });

    const post = data?.postBy;
    const fields = post?.blogPostFields;

    if (!post) {
      return {
        title: "Blog Post Not Found | GFI UAE",
        description: "The requested blog post does not exist.",
      };
    }

    const description =
      fields?.description ||
      fields?.cardDescription ||
      post.content?.slice(0, 160) ||
      "GFI UAE blog post";

    const keywords = Array.isArray(fields?.productTags)
      ? fields.productTags.join(", ")
      : fields?.productTags?.split(",").join(", ");

    return {
      title: `${post.title} | GFI UAE`,
      description,
      keywords,
      openGraph: {
        title: `${post.title} | GFI UAE`,
        description,
        url: `https://gfiuae.com/blogs/${post.slug}`,
        type: "article",
        images: [
          {
            url: fields?.blogImage?.sourceUrl || "/og-default.jpg",
            width: fields?.blogImage?.mediaDetails?.width || 1200,
            height: fields?.blogImage?.mediaDetails?.height || 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} | GFI UAE`,
        description,
        images: [fields?.blogImage?.sourceUrl || "/og-default.jpg"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post | GFI UAE",
      description: "GFI UAE blog post",
    };
  }
}

// ───────────────────────────────
// Page Component
// ───────────────────────────────
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  try {
    const { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
    });

    const post = data?.postBy;
    
    if (!post) {
      return (
        <div className={styles.blogContainer}>
          <h1>Post not found</h1>
          <p>The blog post you are looking for does not exist.</p>
        </div>
      );
    }

    const fields = post.blogPostFields;

    return (
      <div className={styles.blogContainer}>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              datePublished: post.date,
              author: { "@type": "Organization", name: "GFI UAE" },
              description:
                fields?.description ||
                fields?.cardDescription ||
                post.content?.slice(0, 160),
              image: fields?.blogImage?.sourceUrl || "/placeholder.jpg",
              keywords: Array.isArray(fields?.productTags)
                ? fields.productTags
                : fields?.productTags
                    ?.split(",")
                    .map((t: string) => t.trim()) || [],
              url: `https://gfiuae.com/blogs/${post.slug}`,
            }),
          }}
        />

        {/* Hero Image */}
        {fields?.blogImage?.sourceUrl && (
          <div className={styles.heroImageWrapper}>
            <div style={{ position: "relative", width: "100%", height: "75vh" }}>
              <Image
                src={fields.blogImage.sourceUrl}
                alt={fields.blogImage.altText || post.title}
                fill
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority
              />
            </div>
          </div>
        )}

        {/* Main Title */}
        <h1 className={styles.mainTitle}>{fields?.heading || post.title}</h1>

        {/* Intro / Description */}
        <div
          className={styles.intro}
          dangerouslySetInnerHTML={{
            __html: fields?.description || post.content || "",
          }}
        />

        {/* Blog Details Sections */}
        {fields?.blogDetails?.map((detail: any, index: number) => (
          <div
            key={index}
            className={`${styles.section} ${
              index % 2 === 1 ? styles.reverse : ""
            }`}
          >
            <div className={styles.textCol}>
              <h2 className={styles.subTitle}>{detail.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: detail.details || "" }} />
            </div>

            <div className={styles.imageCol}>
              {detail.image?.sourceUrl ? (
                <Image
                  src={detail.image.sourceUrl}
                  alt={detail.image.altText || detail.title}
                  width={detail.image.mediaDetails?.width || 700}
                  height={detail.image.mediaDetails?.height || 500}
                  className={styles.detailImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}></div>
              )}
            </div>
          </div>
        ))}

        <hr className={styles.divider} />

        {/* About Section */}
        <div className={styles.aboutSection}>
          <h3 className={styles.aboutHeading}>About Gibca</h3>
          <p className={styles.aboutText}>
            GIBCA has been at the forefront of architectural innovation for
            decades, offering world–class products and solutions across the
            Middle East. With a commitment to quality, design, and customer
            satisfaction, GIBCA continues to set benchmarks in the construction
            and design industry. Our pivot door solutions embody this ethos,
            combining durability, functionality, and timeless aesthetics.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    return (
      <div className={styles.blogContainer}>
        <h1>Error loading post</h1>
        <p>There was an error loading this blog post. Please try again later.</p>
      </div>
    );
  }
}