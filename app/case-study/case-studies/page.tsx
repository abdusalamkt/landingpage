"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./casestudy.module.css";
import Header from "@/app/components/Header";

export default function CaseStudyPage() {
  const heroTitle = "Dubai Expo";
  const heroHighlight = "2020 Pavilion";
  const heroDescription =
    "The Abrahamic Family House is an extraordinary religious structure that encompasses a mosque, a synagogue, and a church, with the objective of promoting peaceful coexistence, harmony, and acceptance among people of all religions, ethnicities, and cultures.";
  const heroButton1Label = "CHECK PRODUCT";
  const heroButton1Url = "/downloads/expo2020-brochure.pdf";
  const heroButton2Label = "DOWNLOAD PDF";
  const heroButton2Url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const heroImage = {
    sourceUrl: "/gallery/img1.jpg",
    altText: "Expo 2020 Pavilion",
  };

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
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          <h3>ABU DHABI, yas island</h3>
          <h1 className={styles.series}>
            {heroTitle} {heroHighlight}
          </h1>
          <p className={styles.description}>{heroDescription}</p>
          <div className={styles.buttons}>
            <a href={heroButton1Url} target="_blank" rel="noopener noreferrer">
              <button className={styles.outline}>{heroButton1Label}</button>
            </a>
            <a href={heroButton2Url} target="_blank" rel="noopener noreferrer">
              <button className={styles.primary}>{heroButton2Label}</button>
            </a>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={heroImage.sourceUrl}
            alt={heroImage.altText}
            width={700}
            height={500}
            className={styles.heroImage}
          />
        </div>
      </section>

      {/* Info Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoBox}>
          <div className={styles.iconTitleRow}>
            <img src="/logos/Location.png" alt="Location" className={styles.icon} />
            <h3 className={styles.infoTitle}>LOCATION</h3>
          </div>
          <p className={styles.infoText}>Yas Island, Abu Dhabi, United Arab Emirates</p>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.iconTitleRow}>
            <img src="/logos/Project Name.png" alt="Project Name" className={styles.icon} />
            <h3 className={styles.infoTitle}>PROJECT NAME</h3>
          </div>
          <p className={styles.infoText}>Abrahamic Family House</p>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.iconTitleRow}>
            <img src="/logos/Build Partners.png" alt="Design/Build Partners" className={styles.icon} />
            <h3 className={styles.infoTitle}>DESIGN/ BUILD PARTNERS</h3>
          </div>
          <p className={styles.infoText}>
            Zublin Construction LLC ;<br />
            Adjaye Associates
          </p>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.iconTitleRow}>
            <img src="/logos/Products Installed.png" alt="Products Installed" className={styles.icon} />
            <h3 className={styles.infoTitle}>PRODUCTS INSTALLED</h3>
          </div>
          <p className={styles.infoText}>
            Frameless Double-Glazed Partition System (H9T);<br />
            Single Leaf Single-Glazed Lineal Acoustic Door
          </p>
        </div>
      </section>

      {/* Challenge + Solution */}
     <section className={styles.caseStudySection}>
      <div className={styles.contentWrapper}>
        {/* Left Column: Challenge + Solution */}
        <div className={styles.leftColumn}>
          <div className={styles.textBlock}>
            <div className={styles.iconTitleRow}>
              <img src="/logos/Challenge.png" alt="icon" className={styles.icon} />
              <h2 className={styles.title}>CHALLENGE</h2>
            </div>
            <p className={styles.text}>
              The Abrahamic Family House is an extraordinary religious structure that encompasses a mosque, a synagogue, and a church, with the objective of promoting peaceful coexistence, harmony, and acceptance among people of all religions, ethnicities, and cultures. It was designed to be a beacon of hope and unity, a place where individuals from all walks of life can come together as a single community dedicated to mutual understanding and peace.
            </p>
            <p className={styles.text}>
              The Abrahamic Family House is an extraordinary religious structure that encompasses a mosque, a synagogue, and a church, with the objective of promoting peaceful coexistence, harmony, and acceptance among people of all religions, ethnicities, and cultures. It was designed to be a beacon of hope and unity, a place where individuals from all walks of life can come together as a single community dedicated to mutual understanding and peace.
            </p>
            <p className={styles.text}>
              The Abrahamic Family House is an extraordinary religious structure that encompasses a mosque, a synagogue, and a church, with the objective of promoting peaceful coexistence, harmony, and acceptance among people of all religions, ethnicities, and cultures. It was designed to be a beacon of hope and unity, a place where individuals from all walks of life can come together as a single community dedicated to mutual understanding and peace.
            </p>
          </div>

          <div className={styles.textBlock}>
            <div className={styles.iconTitleRow}>
              <img src="/logos/Solution Icon.png" alt="icon" className={styles.icon} />
              <h2 className={styles.title}>SOLUTION</h2>
            </div>
            <p className={styles.text}>
              After careful consideration of the client’s needs, Gibca decided to install their Frameless double-glazed partition system (H9T), which had a height of 2600mm and a width of 1100mm. The partition system was complete with concealed fixings in false ceiling and finished floor to provide a sleek and appealing look.
            </p>
            <p className={styles.text}>
              After careful consideration of the client’s needs, Gibca decided to install their Frameless double-glazed partition system (H9T), which had a height of 2600mm and a width of 1100mm. The partition system was complete with concealed fixings in false ceiling and finished floor to provide a sleek and appealing look.
            </p>
            <p className={styles.text}>
              After careful consideration of the client’s needs, Gibca decided to install their Frameless double-glazed partition system (H9T), which had a height of 2600mm and a width of 1100mm. The partition system was complete with concealed fixings in false ceiling and finished floor to provide a sleek and appealing look.
            </p>
          </div>
        </div>

        {/* Right Column: Images */}
        <div className={styles.rightColumn}>
          <div className={styles.imageBox}>
            <Image src="/hufcor/600.jpg" alt="Image 1" width={600} height={400} />
          </div>
          <div className={styles.imageBox}>
            <Image src="/hufcor/7000.jpg" alt="Image 2" width={600} height={400} />
          </div>
          <div className={styles.imageBox}>
            <Image src="/hufcor/hufcor.PNG" alt="Image 3" width={600} height={400} />
          </div>
        </div>
      </div>
    </section>

      {/* Project Gallery Section */}
      <section className={styles.projectGallery}>
        <h2 className={styles.galleryHeading}>
          PROJECT <span className={styles.highlight}>GALLERY</span>
        </h2>

        <div className={styles.galleryRowThree}>
          {["/gallery/img1.jpg", "/gallery/img2.jpg", "/gallery/img3.jpg"].map((src, index) => (
            <div key={index} className={styles.galleryImage} onClick={() => openLightbox(src)}>
              <Image src={src} alt={`Gallery ${index + 1}`} width={400} height={300} />
            </div>
          ))}
        </div>

        <div className={styles.galleryRowTwo}>
          {["/gallery/img3.jpg", "/gallery/img1.jpg"].map((src, index) => (
            <div key={index} className={styles.galleryImage} onClick={() => openLightbox(src)}>
              <Image src={src} alt={`Gallery ${index + 4}`} width={600} height={400} />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Overlay */}
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
