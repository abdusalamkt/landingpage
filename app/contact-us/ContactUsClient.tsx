'use client';

import { useEffect, useState, useRef } from 'react';

export default function ContactUsClient({ data }: { data: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.slideshowImages?.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => 
          prev === data.slideshowImages.length - 1 ? 0 : prev + 1
        );
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Prevent event bubbling for dropdown scroll
  const handleDropdownScroll = (e: React.UIEvent<HTMLUListElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 dangerouslySetInnerHTML={{ __html: data.heading }} />
        <div className="contact-subtitle">
          <span>{data.subtitle}</span>
          <hr />
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-image-container">
          {data?.slideshowImages?.map((image: any, index: number) => (
            <div 
              key={index}
              className={`contact-image slideshow ${index === currentIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image?.sourceUrl})` }}
            />
          ))}
        </div>
        <div className="contact-form">
          <h2>{data.formHeading}</h2>
          <form>
            <input type="text" placeholder="Name" required />
            <div className="input-row">
              <input type="email" placeholder="Email ID" required />
              <input type="tel" placeholder="Mobile No." required />
            </div>
            <input type="text" placeholder="Project Name & Location" />
            
            {/* Custom Dropdown */}
            <div className="custom-dropdown-wrapper" ref={dropdownRef}>
              <div
                className="custom-dropdown"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {selectedProduct || 'Products of Interest'}
                <span className="arrow">{showDropdown ? '▲' : '▼'}</span>
              </div>

              {showDropdown && (
                <ul 
                  className="custom-options"
                  onScroll={handleDropdownScroll}
                  onWheel={handleDropdownScroll}
                >
                  {data.products?.map((product: any, i: number) => (
                    <li
                      key={i}
                      onClick={() => {
                        setSelectedProduct(product.productName);
                        setShowDropdown(false);
                      }}
                    >
                      {product.productName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <textarea placeholder="Message" rows={3}></textarea>
            <button className="cta-button" type="submit">
              SUBMIT
            </button>
          </form>
        </div>
      </div>

      <div className="contact-footer">
        <div className="footer-column">
          <h2>ADDRESS</h2>
          <div dangerouslySetInnerHTML={{ __html: data.address.replace(/<br\s*\/?>/g, '<br />') }} />
        </div>
        <div className="footer-column">
          <h2>PHONE</h2>
          <div dangerouslySetInnerHTML={{ __html: data.phone.replace(/<br\s*\/?>/g, '<br />') }} />
        </div>
        <div className="footer-column">
          <h2>EMAIL</h2>
          <p>
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          background: linear-gradient(214.96deg, #222222 42.24%, #3D3D3D 101.05%);
          color: white;
          padding: 4rem 2rem;
          font-family: 'Poppins', sans-serif;
          padding-top: 170px;
        }

        img {
          height: 100%;
        }

        .contact-header h1 {
          font-size: 7rem;
          font-weight: 400;
          line-height: 1;
          text-transform: uppercase;
        }

        .highlight {
          color: #10b981;
        }

        .contact-subtitle {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          margin-bottom: 3rem;
        }

        .contact-subtitle span {
          font-size: 4rem;
          font-weight: 400;
          font-family: 'Bebas Neue', sans-serif;
        }

        .contact-subtitle hr {
          flex-grow: 1;
          border: none;
          border-top: 1px solid #aaa;
        }

        .contact-content {
          display: flex;
          flex-wrap: wrap;
          background: white;
          overflow: hidden;
          max-width: 1100px;
          margin: 0 auto;
          border-radius: 12px;
        }

        .contact-image-container {
          position: relative;
          flex: 1;
          min-width: 300px;
          overflow: hidden;
          border-radius: 12px 0 0 12px;
        }

        .contact-image.slideshow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s ease;
        }

        .contact-image.slideshow.active {
          opacity: 1;
        }

        .contact-form {
          flex: 1;
          padding: 2rem;
          background: white;
          color: black;
        }

        .contact-form h2 {
          text-align: center;
          font-size: 2.5rem;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          color: #3d3d3d;
        }

        .contact-form form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 0.75rem 1rem;
          border: none;
          border-bottom: 1px solid #ccc;
          outline: none;
          font-size: 1rem;
          background: transparent;
        }

        .input-row {
          display: flex;
          gap: 1rem;
        }

        .input-row input {
          flex: 1;
        }

        /* Custom Dropdown Styles */
        .custom-dropdown-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        .custom-dropdown {
          padding: 0.75rem 1rem;
          border: none;
          border-bottom: 1px solid #ccc;
          background: transparent;
          cursor: pointer;
          color: #333;
          font-size: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: border-color 0.2s;
        }

        .custom-dropdown:hover {
          border-bottom-color: #109C5D;
        }

        .custom-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          width: 100%;
          max-height: 200px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          z-index: 1000;
          list-style: none;
          padding: 0;
          margin: 0;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          scrollbar-width: thin;
          scrollbar-color: #109C5D #f1f1f1;
        }

        .custom-options::-webkit-scrollbar {
          width: 6px;
        }

        .custom-options::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .custom-options::-webkit-scrollbar-thumb {
          background: #109C5D;
          border-radius: 3px;
        }

        .custom-options li {
          padding: 10px 1rem;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f0f0f0;
          font-size: 1rem;
          color: #333;
        }

        .custom-options li:hover {
          background-color: #f8f9fa;
          color: #109C5D;
        }

        .no-products {
          padding: 10px 1rem;
          color: #999;
          font-style: italic;
          cursor: default;
        }

        .no-products:hover {
          background-color: transparent;
          color: #999;
        }

        .arrow {
          font-size: 0.8rem;
          margin-left: 10px;
          color: #666;
        }

        .cta-button {
          padding: 2px 0rem;
          border-radius: 8px;
          border: 1px solid white;
        }

        .contact-footer {
          display: flex;
          gap: 2rem;
          padding-top: 2rem;
          justify-content: space-between;
          flex-wrap: wrap;
          max-width: 1200px;
          margin: 4rem auto;
        }

        .footer-column {
          flex: 1;
          min-width: 200px;
          text-align: -webkit-center;
        }

        .footer-column h2 {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
        }

        .footer-column p, .footer-column a {
          font-size: 1.2rem;
          line-height: 1.6;
          text-decoration: none;
        }

        .contact-footer .footer-column div {
          white-space: pre-line;
        }

        /* Add a subtle gradient overlay */
        .contact-image.slideshow::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          pointer-events: none;
        }

        /* Add a soft focus effect during transition */
        .contact-image.slideshow.current.slide-out {
          filter: blur(2px);
        }

        .contact-image.slideshow.next.slide-in {
          filter: blur(0);
        }

        /* Mobile responsiveness for dropdown */
        @media (max-width: 768px) {
          .custom-options {
            max-height: 150px;
          }
          
          .custom-options li {
            padding: 8px 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}