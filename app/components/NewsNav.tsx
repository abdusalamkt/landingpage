'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './NewsNav.css';

interface NewsItem {
  title: string;
  link: string;
}

const NewsNav = () => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const newsItems: NewsItem[] = [
    { title: 'New Update Available', link: '/news/latest' },
    { title: 'Special Offer - 50% Off', link: '/news/special-offer' },
    { title: 'New Features Released', link: '/news/features' }
  ];

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    if (hovered) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setIsPulsing(false);
      setTimeout(() => {
        setCurrentItemIndex((prev) => (prev + 1) % newsItems.length);
        setIsAnimating(false);
        setIsPulsing(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [hovered, newsItems.length]);

  const handleClick = () => {
    router.push(newsItems[currentItemIndex].link);
  };

  return (
    <div
      className={`news-nav ${hovered ? 'hovered' : ''} ${isAnimating ? 'animating' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div className="nav-trigger">
        <div className="trigger-icon">
          {isPulsing && (
            <>
              <span className="pulse-circle"></span>
              <span className="pulse-circle delay"></span>
              <span className="pulse-circle delay-2"></span>
            </>
          )}
          <span className="fab-label">NEW</span>
        </div>
        <div className="trigger-text">
          <span>{newsItems[currentItemIndex].title}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsNav;
