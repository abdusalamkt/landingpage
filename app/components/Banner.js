"use client";
import { useState, useEffect } from 'react';
import './Banner.css';

const ROTATING_WORDS = [
  "LEAD", "INNOVATE", "CREATE", "DESIGN", 
  "BUILD", "INSPIRE", "DEVELOP", "TRANSFORM",
  "ELEVATE", "PIONEER"
];

export default function Banner({ heading, images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  const headingParts = heading?.split(' ') || [];
  const firstTwoWords = headingParts.slice(0, 2).join(' ');
  const remainingWords = headingParts.slice(2).join(' ');

  // Slideshow logic
  useEffect(() => {
    if (!images || images.length === 0) return;
    const imageInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(imageInterval);
  }, [images]);

  // Typewriter logic
  useEffect(() => {
    let timeout;
    const currentWord = ROTATING_WORDS[wordIndex];

    if (typing) {
      if (displayedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setTyping(false), 1500); // hold word
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 50);
      } else {
        setTyping(true);
        setWordIndex((wordIndex + 1) % ROTATING_WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, typing, wordIndex]);

  return (
    <section className="banner-container">
      <div className="slideshow">
        {images?.map((item, index) => {
  const img = item?.image;
  if (!img?.sourceUrl) return null;

  return (
    <div
      key={index}
      className={`slide ${index === currentIndex ? 'active' : ''}`}
      style={{ backgroundImage: `url(${img.sourceUrl})` }}
      aria-label={img.altText || `Slide ${index + 1}`}
    />
  );
})}

      </div>

      <div className="banner-content">
        <h1 className="banner-heading">
          <span className="first-line">{firstTwoWords}</span>
          <span className="second-line">
            {remainingWords}{' '}
            <span className="typewriter-bg">
              {displayedText}
              <span className="cursor" />
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}
