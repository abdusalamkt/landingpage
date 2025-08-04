'use client';

import { useEffect, useState } from 'react';
import styles from './pivotdoors.module.css';

interface Slide {
  src: string;
  title: string;
}

interface ImageSliderProps {
  slides: Slide[];
  isReverse?: boolean;
}

export default function ImageSlider({ slides, isReverse = false }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return <div className={styles.sliderContainer}>No images available</div>;
  }

  return (
    <div className={styles.sliderContainer}>
      <div className={`${styles.sliderImageWrapper} ${isReverse ? styles.glassSlider : ''}`}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.sliderImage} ${index === currentIndex ? styles.active : ''}`}
            style={{ backgroundImage: `url(${slide.src})` }}
          >
            {slide.title && <div className={styles.caption}>{slide.title}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}