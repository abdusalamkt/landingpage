'use client';

import styles from './SustainabilitySection.module.css';
import Image from 'next/image';

interface ImageField {
  sourceUrl: string;
  altText?: string;
}

interface Certificate {
  title: string;
  description: string;
  isoImage: ImageField;
}

interface SustainabilityFields {
  isoHeading: string;
  isoHighlight: string;
  isoDescription: string;
  mainImage: ImageField;
  overlayImage: ImageField;
  certifications: Certificate[];
}

interface SustainabilitySectionProps {
  fields: SustainabilityFields;
}

export default function SustainabilitySection({ fields }: SustainabilitySectionProps) {
  if (!fields?.isoHeading) return null;

  return (
    <section className={styles.sustainabilitySection}>
      <div className={styles.commitment}>
  <div className={styles.imageWrapper}>
    {fields?.mainImage?.sourceUrl && (
      <Image
        src={fields.mainImage.sourceUrl}
        alt={fields.mainImage.altText || 'Main image'}
        width={400}
        height={400}
        className={styles.mainImage}
      />
    )}
    {fields?.overlayImage?.sourceUrl && (
      <Image
        src={fields.overlayImage.sourceUrl}
        alt={fields.overlayImage.altText || 'Overlay image'}
        width={400}
        height={400}
        className={styles.overlayImage}
      />
    )}
  </div>

  <div className={styles.textContent}>
    <h2 className={styles.heading}>
      {fields.isoHeading
        .split(' ')
        .slice(0, -1)
        .join(' ')}{' '}
      <span className={styles.lastWord}>
        {fields.isoHeading.split(' ').slice(-1)}
      </span>
    </h2>

    {/* ✅ Render isoDescription as HTML from WYSIWYG */}
    {fields.isoDescription && (
      <div
        className={styles.isoDescription}
        dangerouslySetInnerHTML={{ __html: fields.isoDescription }}
      />
    )}
  </div>
</div>


      {fields.certifications?.length > 0 && (
        <div className={styles.certifications}>
          <h3>CERTIFICATIONS</h3>
          {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, eaque natus dignissimos enim veniam nemo harum in aperiam facilis voluptatibus nam sint, distinctio ut dolorem dolores maxime magnam exercitationem odit.</p> */}
          <div className={styles.certGrid}>
            {fields.certifications.map((cert, idx) => (
              <div className={styles.certCard} key={idx}>
                {cert.isoImage?.sourceUrl && (
                  <Image
                    src={cert.isoImage.sourceUrl}
                    alt={cert.isoImage.altText || cert.title}
                    width={400}
                    height={400}
                    className={styles.certCardImage}
                  />
                )}
                <h4>{cert.title}</h4>
                <p>{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
