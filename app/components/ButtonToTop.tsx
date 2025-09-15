'use client';

import { useState, useEffect } from 'react';
import './ButtonToTop.css'; // We'll move the CSS to a separate file

export default function ButtonToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const halfPage = document.documentElement.scrollHeight / 3;
      setIsVisible(scrolled > halfPage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isVisible && (
        <div className="button-to-top-wrap">
          <button onClick={scrollToTop} className="glass-button">
            <svg 
  className="back-button-icon" 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <path 
    d="M12 25V5M12 5L5 12M12 5L19 12" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  />
</svg>

          </button>
          <div className="button-to-top-shadow"></div>
        </div>
      )}
    </>
  );
}