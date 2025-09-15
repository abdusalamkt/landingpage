'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './BackButton.css';

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleGoBack = () => {
    router.back();
  };

  if (pathname === '/') {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderHidden(true);
      } else {
        setIsHeaderHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`back-button-wrap ${isHeaderHidden ? 'header-hidden' : ''}`}>
      <button 
        className="glass-back-button"
        onClick={handleGoBack}
        aria-label="Go back"
      >
        <svg 
          className="back-button-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M26 12H5M5 12L12 19M5 12L12 5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className="back-tooltip">back</span>
      </button>
      <div className="back-button-shadow"></div>
    </div>
  );
};

export default BackButton;
