'use client';

import { useEffect, useState, useRef } from 'react';
import './contact.css';

export default function ContactUsClient({ data }: { data: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: ''
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | null }>({});

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

    e.preventDefault();
    e.stopPropagation();

    if (
      (!isAtTop && !isAtBottom) ||
      (isAtTop && isScrollingDown) ||
      (isAtBottom && isScrollingUp)
    ) {
      target.scrollTop += deltaY;
    }
  };

  // Validation rules
  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'name') {
      if (!value.trim()) error = 'Name is required';
      else if (value.trim().length < 4) error = 'Name must be at least 4 letters';
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email is required';
      else if (!emailRegex.test(value)) error = 'Invalid email address';
    }

    if (name === 'phone') {
      const phoneRegex = /^\+?\d{7,15}$/; // allows + and digits (7-15 numbers)
      if (!value.trim()) error = 'Phone number is required';
      else if (!phoneRegex.test(value)) error = 'Enter a valid phone number';
    }

    return error;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing (only if field was previously touched)
    if (touched[name] && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle field blur - validate only when user leaves the field
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    } else {
      // Clear error if valid
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear hover state when leaving field
    setHoveredField(null);
  };

  // Handle field focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setHoveredField(name);
  };

  // Handle field hover
  const handleInputMouseEnter = (name: string) => {
    setHoveredField(name);
  };

  // Handle field leave
  const handleInputMouseLeave = () => {
    setHoveredField(null);
  };

  // Set input refs
  const setInputRef = (name: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    inputRefs.current[name] = el;
  };

  // Validate all before submit
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const newTouched: { [key: string]: boolean } = {};

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const fieldError = validateField(key, (formData as any)[key]);
      if (fieldError) newErrors[key] = fieldError;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage('');

    if (!validateForm()) {
      setSubmitMessage("⚠️ Please fix errors before submitting.");
      
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField]?.focus();
      }
      
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          product: selectedProduct,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage("✅ Message sent successfully! We will get back to you soon.");
        setFormData({ name: "", email: "", phone: "", project: "", message: "" });
        setSelectedProduct("");
        setErrors({});
        setTouched({});
        setHoveredField(null);
      } else {
        setSubmitMessage("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("⚠️ An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if tooltip should be shown
  const shouldShowTooltip = (fieldName: string) => {
    return (hoveredField === fieldName || document.activeElement === inputRefs.current[fieldName]) && 
           touched[fieldName] && 
           errors[fieldName];
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
            {/* Full-width Name field */}
            <div className="input-with-tooltip full-width">
              <input
                ref={setInputRef('name')}
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onMouseEnter={() => handleInputMouseEnter('name')}
                onMouseLeave={handleInputMouseLeave}
                className={touched.name && errors.name ? 'error-field' : ''}
                required
              />
              {shouldShowTooltip('name') && (
                <div className="error-tooltip">
                  <span className="tooltip-text">{errors.name}</span>
                  <div className="tooltip-arrow"></div>
                </div>
              )}
            </div>

            <div className="input-row">
              <div className="input-with-tooltip half-width">
                <input
                  ref={setInputRef('email')}
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  onMouseEnter={() => handleInputMouseEnter('email')}
                  onMouseLeave={handleInputMouseLeave}
                  className={touched.email && errors.email ? 'error-field' : ''}
                  required
                />
                {shouldShowTooltip('email') && (
                  <div className="error-tooltip">
                    <span className="tooltip-text">{errors.email}</span>
                    <div className="tooltip-arrow"></div>
                  </div>
                )}
              </div>
              <div className="input-with-tooltip half-width">
                <input
                  ref={setInputRef('phone')}
                  type="tel"
                  name="phone"
                  placeholder="Mobile No."
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  onMouseEnter={() => handleInputMouseEnter('phone')}
                  onMouseLeave={handleInputMouseLeave}
                  className={touched.phone && errors.phone ? 'error-field' : ''}
                  required
                />
                {shouldShowTooltip('phone') && (
                  <div className="error-tooltip">
                    <span className="tooltip-text">{errors.phone}</span>
                    <div className="tooltip-arrow"></div>
                  </div>
                )}
              </div>
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

            <div className="input-with-tooltip full-width">
              <input
                type="text"
                name="project"
                placeholder="Project Name & Location"
                value={formData.project}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onMouseEnter={() => handleInputMouseEnter('project')}
                onMouseLeave={handleInputMouseLeave}
              />
            </div>

            <div className="input-with-tooltip full-width">
              <textarea
                name="message"
                placeholder="Message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onMouseEnter={() => handleInputMouseEnter('message')}
                onMouseLeave={handleInputMouseLeave}
              />
            </div>

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