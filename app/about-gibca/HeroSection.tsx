'use client';
import Image from 'next/image';
import styles from './HeroSection.module.css';

type HeroFields = {
  heroHighlightText?: string;
  heroHeading?: string;
  heroDescription1?: string;
  heroDescription2?: string;
  heroCtaUrl?: string;
  heroCtaText?: string;
  heroImage?: { sourceUrl?: string };
};

export default function HeroSection({ fields }: { fields?: HeroFields }) {
  if (!fields) return null;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroText}>
          <h2 className={styles.heroHeading}>
            <span className={styles.greenText}>{fields.heroHighlightText}</span><br />
            {fields.heroHeading}
          </h2>
          <p>{fields.heroDescription1}</p>

          {/* Render heroDescription2 as HTML from WYSIWYG */}
          {fields.heroDescription2 && (
            <div
              className={styles.heroDescription2}
              dangerouslySetInnerHTML={{ __html: fields.heroDescription2 }}
            />
          )}

          <a
            href={fields.heroCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
            style={{padding:"5px 32px",gap:"1rem",width:"-webkit-fill-available",justifyContent:"center",marginTop:"1rem"}}
          >
            <span>{fields.heroCtaText}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
          </a>
        </div>

        <div className={styles.heroImage}>
          <Image
            src={fields.heroImage?.sourceUrl || '/placeholder.png'}
            alt="About Hero"
            width={800}
            height={600}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}