'use client';

import { useState } from 'react';

interface FinishOption {
  label: string;
  thumbnail: string;
  panel: string;
}

const finishOptions: FinishOption[] = [
  {
    label: 'Carpet',
    thumbnail: '/finishes/thumbnails/carpet.jpg',
    panel: '/finishes/panels/Carpet.png',
  },
  {
    label: 'Laminate',
    thumbnail: '/finishes/thumbnails/LAMINATE.jpg',
    panel: '/finishes/panels/Laminate.png',
  },
  {
    label: 'Vinyl',
    thumbnail: '/finishes/thumbnails/VIYNL.jpg',
    panel: '/finishes/panels/Vinyl.png',
  },
  {
    label: 'Steel',
    thumbnail: '/finishes/thumbnails/steel.png',
    panel: '/finishes/panels/Vinyl.png',
  },
  {
    label: 'Fabric',
    thumbnail: '/finishes/thumbnails/Fabric.jpg',
    panel: '/finishes/panels/Fabric.png',
  },
  {
    label: 'Whiteboard',
    thumbnail: '/finishes/thumbnails/whiteboard.PNG',
    panel: '/finishes/panels/Carpet.PNG',
  },
];
export default function FinishesSection() {
  const [currentImage, setCurrentImage] = useState(finishOptions[0].panel);
  const [nextImage, setNextImage] = useState('');
  const [revealHeight, setRevealHeight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageChange = (newImage: string, index: number) => {
    if (newImage !== currentImage && !isTransitioning) {
      setNextImage(newImage);
      setIsTransitioning(true);
      setRevealHeight(0);

      // Start the reveal animation
      setTimeout(() => {
        setRevealHeight(100);
      }, 50);

      // Complete the transition after animation
      setTimeout(() => {
        setCurrentImage(newImage);
        setNextImage('');
        setRevealHeight(0);
        setIsTransitioning(false);
        setSelectedIndex(index);
      }, 1000);
    }
  };

  return (
    <section className="finishes-section">
      <h2 className="heading">
        CHOOSE FROM OUR <span>DIFFERENT FINISHES!</span>
        <p className="subheading">Custom colors also available</p>
      </h2>

      <div className="container">
        <div className="tiles">
          {finishOptions.map((item, idx) => (
            <div
              key={idx}
              className={`tile ${selectedIndex === idx ? 'selected' : ''}`}
              onClick={() => handleImageChange(item.panel, idx)}
            >
              <span>{item.label}</span>
              <img src={item.thumbnail} alt={item.label} />
            </div>
          ))}
        </div>

        <div className="main-image-wrap">
          <div className="image-comparison-wrapper">
            <div className="before-image">
              <img src={currentImage} alt="Current panel" className="main-image" />
            </div>

            {nextImage && (
              <div
                className="after-image"
                style={{ height: `${revealHeight}%` }}
              >
                <img src={nextImage} alt="Next panel" className="main-image-after" />
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
          font-style: normal;
          font-size: 51px;
          line-height: 100%;
          letter-spacing: 0%;
          text-align: center;
          vertical-align: middle;
          margin: 0;
        }

        .heading span {
          color: #cf202f;
        }

        .subheading {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-style: normal;
          font-size: 19.27px;
          text-transform: uppercase;
          line-height: 100%;
          letter-spacing: 0%;
          text-align: center;
          vertical-align: middle;
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
        }

        .tiles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          align-self: center;
          max-height: 100vh;
        }

        .tile {
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          background: #fdfdfd;
          transition: transform 0.2s;
          align-self: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid transparent;
        }

        .tile:hover {
          transform: scale(1.05);
        }

        .tile.selected {
          border-color: #cf202f;
          transform: scale(1.02);
        }

        .tile img {
          width: 93px;
          height: 160px;
          object-fit: cover;
          border-radius: 4px;
          flex-shrink: 0;
          padding: 3px;
          transition: all 0.2s;
        }

        .tile img:hover {
          border: 1px solid #787878;
          box-shadow: 2px 3px 4px 0px #00000040;
        }

        .tile span {
          display: block;
          margin-top: 0.5rem;
          font-weight: 500;
          color: #333;
          font-size: 0.9rem;
          text-align: center;
          flex-grow: 1;
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

        .before-image {
          position: relative;
          z-index: 1;
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

        .main-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: contain;
          display: block;
        }

        .main-image-after {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
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