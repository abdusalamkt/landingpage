import React from 'react';
import './OurClientsSection.css';

const clientLogos = [
  'logo/Asset 1.png',
  'logo/dubai-world-trade-centre-seeklogo.png',
  'logo/idcseo4fuQ_1747221992115.png',
  'logo/OCCC LOGO.png',
  'logo/Schneider-Electric-logo-jpg-.png',
  'logo/snapchat-logo-svgrepo-com.png',
  'logo/Standard Jotun.png',
  

];

const OurClientsSection = () => {
  // Duplicate logos for seamless infinite loop
  const duplicatedLogos = [...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos];
  
  return (
    <div className="clients-wrapper">
      <h2 className="clients-heading">OUR <span className='highlight'>CLIENTS</span></h2>
      <div className="clients-carousel-container">
        <div className="clients-carousel-track">
          {duplicatedLogos.map((logo, index) => (
            <div key={`logo-${index}`} className="client-logo-slide">
              <div className="logo-container">
                <img 
                  src={logo} 
                  alt={`Client ${index + 1}`} 
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