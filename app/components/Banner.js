// /app/components/Banner.js
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Split heading into parts
  const headingParts = heading.split(' ');
  const firstTwoWords = headingParts.slice(0, 2).join(' ');
  const remainingWords = headingParts.slice(2).join(' ');

  // Auto-rotate images
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(imageInterval);
  }, [images.length]);

  // Word change animation cycle
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 500); // Half of the flip animation duration
    }, 2000);
    return () => clearInterval(animationInterval);
  }, []);

  // Get current and next words
  const currentWord = ROTATING_WORDS[currentWordIndex];
  const nextWordIndex = (currentWordIndex + 1) % ROTATING_WORDS.length;
  const nextWord = ROTATING_WORDS[nextWordIndex];

  return (
    <section className="banner-container">
      <div className="slideshow">
        {images.map((img, index) => (
          <div 
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img.sourceUrl})` }}
          />
        ))}
      </div>
      <div className="banner-content">
        <h1 className="banner-heading">
          <span className="first-line">
            {firstTwoWords}
          </span>
          <span className="second-line">
            {remainingWords}{' '}
            <span className="flip-container">
              {Array.from(currentWord).map((letter, i) => (
                <span key={i} className={`flip-letter ${isAnimating ? 'flip' : ''}`}>
                  <span className="flip-letter-front">{letter}</span>
                  <span className="flip-letter-back">{nextWord[i] || ''}</span>
                </span>
              ))}
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}