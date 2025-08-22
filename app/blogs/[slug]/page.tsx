import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import styles from "./blogpage.module.css";
import Image from "next/image";

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

interface Props {
  params: { slug: string };
}

export const revalidate = 60 * 60; // regenerate every 1 hour

export default async function BlogPage({ params }: Props) {
  const { slug } = params;

  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });

  const post = data?.postBy;
  if (!post) {
    return <div className={styles.blogContainer}>Post not found</div>;
  }

  const { blogPostFields } = post;

  return (
    <div className={styles.blogContainer}>
      {/* Hero Image */}
      <div className={styles.heroImageWrapper}>
  <div style={{ position: 'relative', width: '100%', height: '75vh' }}>
    <Image
      src={blogPostFields.blogImage.sourceUrl}
      alt={blogPostFields.blogImage.altText || post.title}
      fill
      sizes="100vw"
      style={{ objectFit: 'cover', objectPosition: 'center' }}
      priority
    />
  </div>
</div>


      {/* Main Title */}
      <h1 className={styles.mainTitle}>
        {blogPostFields.heading || post.title}
      </h1>

      {/* Intro Text */}
      <div
        className={styles.intro}
        dangerouslySetInnerHTML={{
          __html: blogPostFields.description || post.content,
        }}
      />

      {/* Alternating Sections */}
      {blogPostFields.blogDetails?.map((detail: any, index: number) => (
        <div
          key={index}
          className={`${styles.section} ${
            index % 2 === 1 ? styles.reverse : ""
          }`}
        >
          <div className={styles.textCol}>
            <h2 className={styles.subTitle}>{detail.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: detail.details }} />
          </div>
          <div className={styles.imageCol}>
            {detail.image?.sourceUrl ? (
              <Image
                src={detail.image.sourceUrl}
                alt={detail.image.altText || detail.title}
                width={700}
                height={500}
                className={styles.detailImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}></div>
            )}
          </div>
        </div>
      ))}

      {/* Divider */}
      <hr className={styles.divider} />

      {/* About Gibca Section */}
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
}
