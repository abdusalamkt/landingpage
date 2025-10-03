'use client';

import styles from './Hero.module.css';

interface HeroProps {
  title?: string;
  highlight?: string;
  description?: string;
  bgImage?: string;
}

export default function Hero({ title, highlight, description, bgImage }: HeroProps) {
  return (
    <section
      className={styles.heroContainer}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.heroOverlay}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {title} <span className={styles.highlightHeading}>{highlight}</span>
          </h1>
          <p className={styles.heroDescription}>{description}</p>
        </div>
      </div>
    </section>
  );
}
