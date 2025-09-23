'use client';

import { useEffect, useState, useRef } from 'react';
import './contact.css';

export default function ContactUsClient({ data }: { data: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: ''
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Slideshow auto-rotation
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Fixed dropdown wheel handling
  const handleDropdownWheel = (e: React.WheelEvent<HTMLUListElement>) => {
    const target = e.currentTarget;
    const { deltaY } = e;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    const isScrollingUp = deltaY < 0;
    const isScrollingDown = deltaY > 0;
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;
    
    // Always prevent default and stop propagation when scrolling inside dropdown
    e.preventDefault();
    e.stopPropagation();
    
    // Only scroll if we're not at the boundaries or we're scrolling away from the boundary
    if (
      (!isAtTop && !isAtBottom) || // Not at any boundary
      (isAtTop && isScrollingDown) || // At top but scrolling down
      (isAtBottom && isScrollingUp)   // At bottom but scrolling up
    ) {
      // Manually scroll the dropdown
      target.scrollTop += deltaY;
    }
    // If at boundary and trying to scroll further, do nothing (don't let page scroll)
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project: formData.project,
          product: selectedProduct,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          project: '',
          message: ''
        });
        setSelectedProduct('');
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div className="input-row">
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile No."
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
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
                  onWheel={handleDropdownWheel}
                >
                  {data.products?.length > 0 ? (
                    data.products.map((product: any, i: number) => (
                      <li
                        key={i}
                        onClick={() => {
                          setSelectedProduct(product.productName);
                          setShowDropdown(false);
                        }}
                      >
                        {product.productName}
                      </li>
                    ))
                  ) : (
                    <li className="no-products">No products available</li>
                  )}
                </ul>
              )}
            </div>
            <input
              type="text"
              name="project"
              placeholder="Project Name & Location"
              value={formData.project}
              onChange={handleInputChange}
            />

            

            <textarea
              name="message"
              placeholder="Message"
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
            />

            {submitMessage && (
              <div
                className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}
              >
                {submitMessage}
              </div>
            )}

            <button
              className="cta-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SENDING...' : 'SUBMIT'}
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
    </div>
  );
}