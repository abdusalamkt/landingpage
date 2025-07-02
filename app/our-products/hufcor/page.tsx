"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import styles from "./hufcor.module.css";

const slides1 = [
  { src: "/hufcor/hufcor.PNG", title: "Operable Wall 1" },
  { src: "/hufcor/600.jpg", title: "Operable Wall 2" },
];

const slides2 = [
  { src: "/hufcor/def.jpg", title: "Glass Wall 1" },
  { src: "/hufcor/hufcor.PNG", title: "Glass Wall 2" },
];

export default function HufcorPage() {
  return (
    <div>
      <Header />

      {/* Banner Section */}
      <div className={styles.banner}>
        <div className={styles.overlay} />
        <div className={styles.bannerContent}>
          <img src="/hufcor/HUFCOR HIG RES.png" alt="Logo" className={styles.logo} />
          <h1 className={styles.heading}>
            HUFCOR <span className={styles.red}>PRODUCTS</span>
          </h1>
        </div>
      </div>

      {/* First Product Section (Image Left) */}
      <div className={styles.productSection}>
        <div className={styles.imageContainer}>
          <ImageSlider slides={slides1} />
        </div>
        <div className={styles.textContainer}>
          <h2>OPERABLE WALLS</h2>
          <p>
            Hufcor Operable Walls System, offering premium quality craftsmanship,
            design adaptability and varying levels of acoustic performance.
            Customization options offered are boundless with the Operable Wall
            System, letting you create a space that fits your objectives.
          </p>
          <div className={styles.productRangeRow}>
            <h3>PRODUCT RANGE</h3>
            <div className={styles.line}></div>
          </div>
          <div className={styles.buttons}>
            <button>Series 600™</button>
            <button>SERIES 7000™</button>
          </div>
        </div>
      </div>

      {/* Second Product Section (Image Right) */}
      <div className={`${styles.productSection} ${styles.reverse}`}>
        <div className={styles.textContainer}>
          <h2>MOVABLE GLASS WALLS</h2>
          <p>
            Sleek, modern and functional — Hufcor’s glass wall systems bring in natural
            light while providing acoustic separation. Designed to blend into contemporary
            architecture with flexible space division.
          </p>
          <div className={styles.productRangeRow}>
            <h3>PRODUCT RANGE</h3>
            <div className={styles.line}></div>
          </div>
          <div className={styles.buttons}>
            <button>Elite Glass™</button>
            <button>Summit Glass™</button>
          </div>
        </div>
        <div className={`${styles.imageContainer} ${styles.glassSlider}`}>
  <ImageSlider slides={slides2} />
</div>

      </div>
    </div>
  );
}

// Auto-fading ImageSlider component
const ImageSlider = ({ slides }: { slides: { src: string; title: string }[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000); // change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderImageWrapper}>
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.src}
            alt={slide.title}
            className={`${styles.sliderImage} ${index === current ? styles.active : ""}`}
          />
        ))}
        <div className={styles.caption}>{slides[current].title}</div>
      </div>
    </div>
  );
};
