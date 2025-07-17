'use client';

import { useState } from 'react';
import styles from './FinishesSection.module.css';

interface FinishOption {
  label: string;
  thumbnail: string;
  panel: string;
}

const finishOptions: FinishOption[] = [
  {
    label: 'Carpet',
    thumbnail: '/finishes/thumbnails/carpet.jpg',
    panel: '/finishes/panels/Carpet.png',
  },
  {
    label: 'Laminate',
    thumbnail: '/finishes/thumbnails/LAMINATE.jpg',
    panel: '/finishes/panels/Laminate.png',
  },
  {
    label: 'Vinyl',
    thumbnail: '/finishes/thumbnails/VIYNL.jpg',
    panel: '/finishes/panels/Vinyl.png',
  },
  {
    label: 'Steel',
    thumbnail: '/finishes/thumbnails/steel.png',
    panel: '/finishes/panels/Vinyl.png',
  },
  {
    label: 'Fabric',
    thumbnail: '/finishes/thumbnails/Fabric.jpg',
    panel: '/finishes/panels/Fabric.png',
  },
  {
    label: 'Whiteboard',
    thumbnail: '/finishes/thumbnails/whiteboard.PNG',
    panel: '/finishes/panels/Carpet.PNG',
  },
];

export default function FinishesSection() {
  const [currentImage, setCurrentImage] = useState(finishOptions[0].panel);
  const [nextImage, setNextImage] = useState('');
  const [revealHeight, setRevealHeight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleImageChange = (newImage: string) => {
    if (newImage !== currentImage && !isTransitioning) {
      setNextImage(newImage);
      setIsTransitioning(true);
      setRevealHeight(0);

      requestAnimationFrame(() => {
        setRevealHeight(100);
      });

      setTimeout(() => {
        setCurrentImage(newImage);
        setNextImage('');
        setRevealHeight(0);
        setIsTransitioning(false);
      }, 600);
    }
  };

  return (
    <section className={styles.finishesSection}>
      <h2 className={styles.heading}>
        CHOOSE FROM OUR <span>DIFFERENT FINISHES!</span>
        <p className={styles.subheading}>Custom colors also available</p>
      </h2>

      <div className={styles.container}>
        <div className={styles.tiles}>
          {finishOptions.map((item, idx) => (
            <div
              key={idx}
              className={styles.tile}
              onMouseEnter={() => handleImageChange(item.panel)}
            >
              <span>{item.label}</span>
              <img src={item.thumbnail} alt={item.label} />
            </div>
          ))}
        </div>

        <div className={styles.mainImageWrap}>
          <div className={styles.imageComparisonWrapper}>
            <div className={styles.beforeImage}>
              <img src={currentImage} alt="Current panel" className={styles.mainImage} />
            </div>

            {nextImage && (
              <div
                className={styles.afterImage}
                style={{ height: `${revealHeight}%` }}
              >
                <img src={nextImage} alt="Next panel" className={styles.mainImage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
