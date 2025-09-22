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
    // Save current scroll position
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  } else {
    // Restore scroll position
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Prevent event bubbling for dropdown scroll
  const handleDropdownScroll = (e: React.UIEvent<HTMLUListElement>) => {
    e.stopPropagation();
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
        // Reset form
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
            <input 
              type="text" 
              name="project"
              placeholder="Project Name & Location" 
              value={formData.project}
              onChange={handleInputChange}
            />
            
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

            <textarea 
              name="message"
              placeholder="Message" 
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
            />
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
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