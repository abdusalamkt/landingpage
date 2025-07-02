'use client';
import React from 'react';
import './OurClientsSection.css';

type ClientLogo = {
  logoImage: {
    sourceUrl: string;
    altText?: string;
  };
};

type OurClientsSectionProps = {
  logos: ClientLogo[];
};

const OurClientsSection: React.FC<OurClientsSectionProps> = ({ logos }) => {
  const flatLogos = logos
    .map((item) => item?.logoImage)
    .filter((img) => img?.sourceUrl);

  const duplicatedLogos = [...flatLogos, ...flatLogos, ...flatLogos];

  return (
    <div className="clients-wrapper">
      <h2 className="clients-heading">
        OUR <span className="highlight">CLIENTS</span>
      </h2>
      <div className="clients-carousel-container">
        <div className="clients-carousel-track">
          {duplicatedLogos.map((logo, index) => (
            <div key={`logo-${index}`} className="client-logo-slide">
              <div className="logo-container">
                <img
                  src={logo.sourceUrl}
                  alt={logo.altText || `Client ${index + 1}`}
                  className="client-logo"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurClientsSection;
