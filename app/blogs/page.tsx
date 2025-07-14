'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blogs.module.css';
import { gql } from '@apollo/client';
import client from '@/lib/apolloClient';

const GET_ALL_BLOGS = gql`
  query GetAllBlogs {
    posts(first: 20) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        blogPostFields {
          productTags
          categoryLabel
          readTime
          cardDescription
        }
      }
    }
  }
`;

const TAGS = ['Hufcor', 'HPL Solutions', 'Pivot Doors', 'Gibca Office Partitioning', 'Hydraulic Doors', 'Glass Partitions', 'Movable Walls'];

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [imageLoadedMap, setImageLoadedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest'>('Newest');

  useEffect(() => {
    client.query({ query: GET_ALL_BLOGS }).then(({ data }) => {
      setPosts(data.posts.nodes);
      setLoading(false);
    });
  }, []);

  const handleImageLoad = (postId: string) => {
    setImageLoadedMap((prev) => ({ ...prev, [postId]: true }));
  };

  // Filter posts by selectedTag
  const filteredPosts = selectedTag
    ? posts.filter((post) => {
        const rawTags = post.blogPostFields?.productTags || '';
        const tagsArray = Array.isArray(rawTags)
          ? rawTags
          : rawTags.split(',').map((t: string) => t.trim());
        return tagsArray.some((tag: string) => tag.toLowerCase() === selectedTag.toLowerCase());
      })
    : posts;

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1>BLOGS</h1>
        <p>
          Explore our latest insights, stories, and updates. From expert tips to company news, our blog keeps you informed and inspired.
        </p>
      </section>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.tags}>
          <button
            className={`${styles.tagBtn} ${selectedTag === null ? styles.activeTag : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagBtn} ${selectedTag === tag ? styles.activeTag : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className={styles.sortBy}>
          <label htmlFor="sortSelect">Sort by:</label>
          <select
            id="sortSelect"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'Newest' | 'Oldest')}
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Blog Grid */}
      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
                <div className={styles.imageWrapper}>
                  <div className={styles.skeleton} />
                </div>
                <div className={styles.cardMeta}>
                  <div className={styles.metaLineSkeleton}></div>
                </div>
                <div className={styles.cardTitleSkeleton}></div>
                <div className={styles.cardDescSkeleton}></div>
                <div className={styles.readMoreSkeleton}></div>
              </div>
            ))
          : sortedPosts.map((post) => {
              const isImageLoaded = imageLoadedMap[post.id];

              return (
                <Link key={post.id} href={`/blogs/${post.slug}`} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.skeleton} style={{ opacity: isImageLoaded ? 0 : 1 }} />
                    {post.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        fill
                        className={`${styles.cardImage} ${isImageLoaded ? styles.loaded : ''}`}
                        onLoad={() => handleImageLoad(post.id)}
                        placeholder="blur"
                        blurDataURL="/placeholder.jpg"
                      />
                    )}
                    <div className={styles.overlayTags}>
                      {(Array.isArray(post.blogPostFields.productTags)
                        ? post.blogPostFields.productTags
                        : post.blogPostFields.productTags?.split(',') || []
                      ).map((tag: string, i: number) => (
                        <span key={i} className={styles.productTag}>
                          {tag.trim()}
                        </span>
                      ))}
                      {post.blogPostFields.categoryLabel !== 'null' &&
                        post.blogPostFields.categoryLabel && (
                          <span className={styles.typeTag}>
                            {post.blogPostFields.categoryLabel}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.date}>
                      {new Date(post.date).toISOString().slice(0, 10)}
                    </span>
                    <span className={styles.readTime}>{post.blogPostFields.readTime}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardDesc}>{post.blogPostFields.cardDescription}</p>
                  <span className={styles.readMore}>Read More</span>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
