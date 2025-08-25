// app/service-maintenance/Hero.tsx
'use client'; // Only if needed (e.g for animations or interactivity)

import './hero.css';

interface HeroProps {
  title?: string;
  highlight?: string;
  description?: string;
  bgImage?: string;
}

export default function Hero({ title, highlight, description, bgImage }: HeroProps) {
  return (
    <section
      className="hero-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">
            {title} <span className="highlight-heading">{highlight}</span>
          </h1>
          <p className="hero-description">{description}</p>
        </div>
      </div>
    </section>
  );
}
