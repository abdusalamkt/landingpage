'use client';
import Image from 'next/image';
import { useState } from 'react';
import './HeroSection.css';

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
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!fields) {
    return (
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-text">
            <h2 className="hero-heading">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text">
          <h2 className="hero-heading">
            {fields.heroHighlightText && (
              <>
                <span className="green-text">{fields.heroHighlightText}</span><br />
              </>
            )}
            {fields.heroHeading}
          </h2>
          {fields.heroDescription1 && <p>{fields.heroDescription1}</p>}

          {fields.heroDescription2 && (
            <div
              className="hero-description-2"
              dangerouslySetInnerHTML={{ __html: fields.heroDescription2 }}
            />
          )}

          {fields.heroCtaUrl && (
            <a
              href={fields.heroCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              <span>{fields.heroCtaText}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 
                      0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/>
              </svg>
            </a>
          )}
        </div>

        <div className="hero-image">
          <div className="image-wrapper">
            {fields.heroImage?.sourceUrl && (
              <Image
                src={fields.heroImage.sourceUrl}
                alt={fields.heroHeading || "About Hero"}
                fill
                priority
                className="image"
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}