"use client";

import { useState } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import styles from "./casestudy.module.css";

export default function DynamicCaseStudyClient({
  title,
  fields,
}: {
  title: string;
  fields: any;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const openLightbox = (src: string) => {
    setLightboxImage(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage("");
  };

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          <h3>{fields.location}</h3>
          <h1 className={styles.series}>
            {title} {fields.herohighlight}
          </h1>
          {fields.herodescription && (
            <div className={styles.description}>{parse(fields.herodescription)}</div>
          )}
          <div className={styles.buttons}>
            {fields.herobutton1label && fields.herobutton1url && (
              <a href={fields.herobutton1url} target="_blank" rel="noopener noreferrer">
                <button className={styles.outline}>{fields.herobutton1label}</button>
              </a>
            )}
            {fields.herobutton2label && fields.herobutton2url && (
              <a href={fields.herobutton2url} target="_blank" rel="noopener noreferrer">
                <button className={styles.primary}>{fields.herobutton2label}</button>
              </a>
            )}
          </div>
        </div>

        {fields.heroimage?.sourceUrl && (
          <div className={styles.imageWrapper}>
            <Image
              src={fields.heroimage.sourceUrl}
              alt={fields.heroimage.altText || "Hero Image"}
              width={700}
              height={500}
              className={styles.heroImage}
            />
          </div>
        )}
      </section>

      {/* Info Boxes */}
      <section className={styles.infoSection}>
        {fields.infoboxes?.map((box: any, index: number) => (
          <div key={index} className={styles.infoBox}>
            <div className={styles.iconTitleRow}>
              {box.iconurl?.sourceUrl && (
                <img
                  src={box.iconurl.sourceUrl}
                  alt={box.iconurl.altText || "icon"}
                  className={styles.icon}
                />
              )}
              <h3 className={styles.infoTitle}>{box.title}</h3>
            </div>
            <div className={styles.infoText}>{parse(box.content)}</div>
          </div>
        ))}
      </section>

      {/* Challenge + Solution */}
      <section className={styles.caseStudySection}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            {fields.challengecontent && (
              <div className={styles.textBlock}>
                <div className={styles.iconTitleRow}>
                  <img src="/logos/Challenge.png" alt="Challenge" className={styles.icon} />
                  <h2 className={styles.title}>{fields.challengeheading || "CHALLENGE"}</h2>
                </div>
                <p className={styles.text}>{fields.challengecontent}</p>
              </div>
            )}
            {fields.solutioncontent && (
              <div className={styles.textBlock}>
                <div className={styles.iconTitleRow}>
                  <img src="/logos/Solution Icon.png" alt="Solution" className={styles.icon} />
                  <h2 className={styles.title}>{fields.solutionheading || "SOLUTION"}</h2>
                </div>
                <p className={styles.text}>{fields.solutioncontent}</p>
              </div>
            )}
          </div>

          <div className={styles.rightColumn}>
            {fields.galleryimages?.slice(0, 3).map((img: any, index: number) => (
              <div key={index} className={styles.imageBox}>
                <Image
                  src={img.sourceUrl}
                  alt={img.altText || `Gallery ${index + 1}`}
                  width={600}
                  height={400}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className={styles.projectGallery}>
        <h2 className={styles.galleryHeading}>
          PROJECT <span className={styles.highlight}>GALLERY</span>
        </h2>

        <div className={styles.galleryRowThree}>
          {fields.galleryimages?.slice(0, 3).map((img: any, index: number) => (
            <div
              key={index}
              className={styles.galleryImage}
              onClick={() => openLightbox(img.sourceUrl)}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={img.sourceUrl}
                alt={img.altText || `Gallery ${index + 1}`}
                width={400}
                height={300}
              />
            </div>
          ))}
        </div>

        <div className={styles.galleryRowTwo}>
          {fields.galleryimages?.slice(3, 5).map((img: any, index: number) => (
            <div
              key={index}
              className={styles.galleryImage}
              onClick={() => openLightbox(img.sourceUrl)}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={img.sourceUrl}
                alt={img.altText || `Gallery ${index + 4}`}
                width={600}
                height={400}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={closeLightbox}>✕</button>
            <Image src={lightboxImage} alt="Fullscreen" width={1200} height={800} />
          </div>
        </div>
      )}
    </>
  );
}
