'use client';
import React from 'react';
import Link from 'next/link';
import './NewsBanner.css';

export default function NewsBanner({
  heading,
  image,
  slug,
}: {
  heading: string;
  image: { sourceUrl: string; altText: string };
  slug?: string;
}) {
  return (
    <section
      className="news-banner"
      style={{ backgroundImage: `url(${image.sourceUrl})` }}
      aria-label={image.altText || 'News Banner'}
    >
      <div className="overlay" />

      <div className="content-wrapper">
        <h2 className="news-heading">{heading}</h2>

        {slug && (
          <Link
            href={`/blogs/${slug}`}      // ✅ use slug
            target="_blank"              // ✅ always open in new tab
            rel="noopener noreferrer"   // ✅ security best practice
            className="know-more-button wave-button"
            aria-label="Know More"
          >
            <div className="know-label">
              <span className="know-small">Know</span>
              <span className="know-large">More!</span>
            </div>
            <span className="sr-only">Know More</span>
          </Link>
        )}
      </div>
    </section>
  );
}
