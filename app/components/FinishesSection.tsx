'use client';

import { useState, useEffect } from 'react';

interface FinishItem {
  label: string;
  thumbnail: {
    sourceUrl: string;
    altText?: string;
  };
  panel: {
    sourceUrl: string;
    altText?: string;
  };
}

export default function FinishesSection({ finishes }: { finishes?: FinishItem[] }) {
  const hasValidFinishes = Array.isArray(finishes) && finishes.length > 0;
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const [currentImage, setCurrentImage] = useState<string>('');
  const [nextImage, setNextImage] = useState('');
  const [revealHeight, setRevealHeight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (hasValidFinishes) {
      setCurrentImage(finishes[0].panel.sourceUrl || '');
    }
  }, [hasValidFinishes, finishes]);

  const handleImageChange = (newImage: string, index: number) => {
    if (newImage !== currentImage && !isTransitioning) {
      setNextImage(newImage);
      setIsTransitioning(true);
      setRevealHeight(0);
      setSelectedIndex(index);
    }
  };

  const handleImageLoad = () => {
    // Start reveal animation once image is loaded
    setTimeout(() => setRevealHeight(100), 50);

    // Complete transition after animation
    setTimeout(() => {
      setCurrentImage(nextImage);
      setNextImage('');
      setRevealHeight(0);
      setIsTransitioning(false);
    }, 1050);
  };

  if (!hasValidFinishes) return null;

  return (
    <section className={`finishes-section ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}>
      <h2 className="heading">
        {/* CHOOSE FROM OUR <span>DIFFERENT FINISHES!</span> */}
        {/* <p className="subheading">Custom colors also available</p> */}
      </h2>

      <div className="container">
        <div className="tiles">
          {finishes.map((item, idx) => (
            <div
              key={idx}
              className="tile"
              onClick={() => handleImageChange(item.panel.sourceUrl, idx)}
            >
              <span>{item.label}</span>
              <img
                src={item.thumbnail.sourceUrl}
                alt={item.thumbnail.altText || item.label}
                className={selectedIndex === idx ? 'selected' : ''}
              />
            </div>
          ))}
        </div>

        <div className="main-image-wrap">
          <div className="image-comparison-wrapper">
            <div className="before-image">
              <img
                src={currentImage}
                alt="Current panel"
                className="main-image"
              />
            </div>

            {nextImage && (
              <div className="after-image" style={{ height: `${revealHeight}%` }}>
                <img
                  src={nextImage}
                  alt="Next panel"
                  className="main-image-after"
                  onLoad={handleImageLoad}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .finishes-section {
          text-align: center;
        }

        .subheading {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 1.1rem;
          text-transform: uppercase;
          color: #3d3d3d;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin: 0 auto;
          flex-wrap: wrap;
          align-self: center;
        }

        .tiles {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-self: center;
        }

        .tile {
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tile:hover {
          transform: scale(1.05);
        }

        .tile img {
          width: 80px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          padding: 3px;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .tile img:hover {
          border: 1px solid #787878;
          box-shadow: 2px 3px 4px 0px #00000040;
        }

        .tile img.selected {
          border: 2px solid #cf202f;
          box-shadow: 0 0 10px rgba(207, 32, 47, 0.4);
        }

        .tile span {
          font-weight: 500;
          color: #3d3d3d;
          font-size: 0.7rem;
          text-align: center;
          display: flex;
          align-items: center;
        }

        .main-image-wrap {
          max-width: 33vw;
        }

        .image-comparison-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }

        .before-image,
        .after-image {
          width: 100%;
          position: relative;
        }

        .after-image {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          overflow: hidden;
          transition: height 1s ease-in-out;
        }

        .main-image,
        .main-image-after {
          height: 90vh;
          border-radius: 8px;
          object-fit: cover;
          display: block;
          margin: -35px auto;
        }

        .main-image-after {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        /* Tablet Styles (768px - 1023px) */
        @media (max-width: 1023px) and (min-width: 768px) {
          .tablet .container {
            flex-direction: column;
            gap: 2rem;
            align-items: center;
          }

          .tablet .tiles {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            width: 100%;
            max-width: 600px;
          }

          .tablet .tile img {
            width: 70px;
            height: 120px;
          }

          .tablet .tile span {
            font-size: 0.65rem;
          }

          .tablet .main-image-wrap {
            max-width: 70vw;
          }

          .tablet .main-image,
          .tablet .main-image-after {
            height: 60vh;
            margin: 0 auto;
          }
        }

        /* Mobile Styles (below 768px) */
        @media (max-width: 767px) {
          .mobile .container {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }

          .mobile .tiles {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            width: 100%;
            max-width: 400px;
          }

          .mobile .tile {
            padding: 4px;
          }

          .mobile .tile img {
            width: 60px;
            height: 100px;
            border-radius: 8px;
            padding: 2px;
          }

          .mobile .tile span {
            font-size: 0.6rem;
            line-height: 1.2;
          }

          .mobile .main-image-wrap {
            max-width: 90vw;
          }

          .mobile .main-image,
          .mobile .main-image-after {
            height: 50vh;
            margin: 0 auto;
          }

          .mobile .tile:hover {
            transform: scale(1.02);
          }

          /* Improve touch targets for mobile */
          .mobile .tile {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Small Mobile Devices (below 480px) */
        @media (max-width: 480px) {
          .mobile .tiles {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            max-width: 300px;
          }

          .mobile .tile img {
            width: 50px;
            height: 80px;
          }

          .mobile .tile span {
            font-size: 0.55rem;
          }

          .mobile .main-image,
          .mobile .main-image-after {
            height: 40vh;
          }
        }

        /* Large Desktop Screens (above 1440px) */
        @media (min-width: 1440px) {
          .container {
            gap: 2rem;
          }

          .tile img {
            width: 100px;
            height: 180px;
          }

          .tile span {
            font-size: 0.8rem;
          }

          .main-image-wrap {
            max-width: 40vw;
          }
        }

        /* Adjust layout for very wide screens */
        @media (min-width: 1920px) {
          .tile img {
            width: 120px;
            height: 200px;
          }

          .main-image,
          .main-image-after {
            height: 80vh;
          }
        }

        /* Ensure proper behavior on orientation change */
        @media (max-height: 600px) and (orientation: landscape) {
          .mobile .main-image,
          .mobile .main-image-after {
            height: 70vh;
          }

          .mobile .tiles {
            grid-template-columns: repeat(4, 1fr);
            max-width: 350px;
          }

          .mobile .tile img {
            width: 50px;
            height: 70px;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .tile {
            transition: none;
          }
          
          .tile:hover {
            transform: none;
          }
          
          .tile img {
            transition: none;
          }
          
          .after-image {
            transition: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .tile img.selected {
            border: 3px solid #cf202f;
            box-shadow: 0 0 15px rgba(207, 32, 47, 0.8);
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .tile span {
            color: #ffffff;
          }
          
          .tile img:hover {
            border: 1px solid #ffffff;
          }
        }
      `}</style>
    </section>
  );
}