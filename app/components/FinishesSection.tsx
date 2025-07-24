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

  const [currentImage, setCurrentImage] = useState<string>('');
  const [nextImage, setNextImage] = useState('');
  const [revealHeight, setRevealHeight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <section className="finishes-section">
      <h2 className="heading">
        CHOOSE FROM OUR <span>DIFFERENT FINISHES!</span>
        <p className="subheading">Custom colors also available</p>
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
          padding: 4rem 2rem;
          background: #fff;
          text-align: center;
        }

        .heading {
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          font-size: 51px;
          margin: 0;
        }

        .heading span {
          color: #cf202f;
        }

        .subheading {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 19.27px;
          text-transform: uppercase;
          margin-top: 0.5rem;
          color: #555;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin: 0 auto;
          gap: 4rem;
          flex-wrap: wrap;
          margin-top: 3rem;
          margin-right: -80px;
        }

        .tiles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          align-self: center;
          max-height: 100vh;
          margin-right: -80px;
        }

        .tile {
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          background: #fdfdfd;
          transition: transform 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tile:hover {
          transform: scale(1.05);
        }

        .tile img {
          width: 93px;
          height: 160px;
          object-fit: cover;
          border-radius: 4px;
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
          margin-top: 0.5rem;
          font-weight: 500;
          color: #333;
          font-size: 0.9rem;
          text-align: center;
          display: flex;
          align-items: center;
        }

        .main-image-wrap {
          max-width: 50vw;
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
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: contain;
          display: block;
        }

        .main-image-after {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            gap: 2rem;
          }

          .main-image-wrap {
            max-width: 90vw;
          }
        }
      `}</style>
    </section>
  );
}
