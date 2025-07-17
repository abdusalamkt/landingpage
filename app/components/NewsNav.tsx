'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './NewsNav.css';

interface NewsNavProps {
  heading: string;
  image: {
    sourceUrl: string;
    altText: string;
  };
  url: string;
}

const NewsNav: React.FC<NewsNavProps> = ({ heading, image, url }) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <div
      className={`news-nav ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div
        className="nav-trigger"
        style={
          hovered && image?.sourceUrl
            ? {
                backgroundImage: `url(${image.sourceUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
            : {}
        }
      >
        <div className="trigger-icon">
          <span className="pulse-circle"></span>
          <span className="pulse-circle delay"></span>
          <span className="pulse-circle delay-2"></span>
          <span className="fab-label">NEW</span>
        </div>
        <div className="trigger-text">
          <span>{heading}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsNav;
