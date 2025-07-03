"use client";

import { useState, useEffect } from "react";
import styles from "./hufcor.module.css";

export default function ImageSlider({ slides }: { slides: { src: string; title: string }[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderImageWrapper}>
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.src}
            alt={slide.title}
            className={`${styles.sliderImage} ${i === current ? styles.active : ""}`}
          />
        ))}
        <div className={styles.caption}>{slides[current].title}</div>
      </div>
    </div>
  );
}
