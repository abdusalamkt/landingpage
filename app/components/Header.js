'use client';
import { useState, useRef } from 'react';
import './Header.css';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formRef = useRef(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation would go here
    if (formRef.current.checkValidity()) {
      setFormSubmitted(true);
      // Reset form after animation completes
      setTimeout(() => {
        setShowQuoteModal(false);
        setFormSubmitted(false);
        formRef.current.reset();
      }, 3000);
    }
  };

  const dropdownItems = {
    products: [
      { name: "CROWN", link: "#" },
      { name: "HUFCOR", link: "#" },
      { name: "HPL", link: "#" },
      { name: "OPS", link: "#" }
    ],
    resources: [
      { name: "Blogs", link: "#" },
      { name: "Case Studies", link: "#" },
      { name: "Downloads", link: "#" }
    ]
  };

  return (
    <>
      <header className="site-header">
        <div className="logo" id="headerLogo">
          <img src="./Logo.png" alt="Logo" />
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#">ABOUT US</a></li>

            <li
              className="dropdown-parent"
              onMouseEnter={() => toggleDropdown('products')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <div className="dropdown-trigger">
                <a href="#">PRODUCTS</a>
                <span className={`dropdown-arrow ${activeDropdown === 'products' ? 'active' : ''}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className={`dropdown-menu ${activeDropdown === 'products' ? 'active' : ''}`}>
                {dropdownItems.products.map((item, index) => (
                  <a
                    href={item.link}
                    key={index}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </li>

            <li><a href="#">SERVICE & MAINTENANCE</a></li>
            <li><a href="/projects">PROJECTS</a></li>

            <li
              className="dropdown-parent"
              onMouseEnter={() => toggleDropdown('resources')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <div className="dropdown-trigger">
                <a href="#">RESOURCES</a>
                <span className={`dropdown-arrow ${activeDropdown === 'resources' ? 'active' : ''}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className={`dropdown-menu ${activeDropdown === 'resources' ? 'active' : ''}`}>
                {dropdownItems.resources.map((item, index) => (
                  <a
                    href={item.link}
                    key={index}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </li>

            <li><a href="#">CONTACT US</a></li>
            <li>
              <button className="flashing-arrow-btn" onClick={() => setShowQuoteModal(true)}>
  <span className="flashing-arrow-btn__img">
    <svg width="34" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
      </defs>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="url(#arrow-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
  GET A FREE QUOTE
</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Quote Modal Overlay */}
     
      {showQuoteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowQuoteModal(false)}>
              &times;
            </button>
            
            {!formSubmitted ? (
              <>
                <h2>Get a Free Quote</h2>
                <form className="quote-form" ref={formRef} onSubmit={handleSubmit}>
                  <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Your email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" placeholder="Your phone number" />
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service Needed</label>
                  <select id="service" required>
                    <option value="">Select a service</option>
                    <option value="products">Products</option>
                    <option value="service">Service & Maintenance</option>
                    <option value="projects">Projects</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="4" placeholder="Tell us about your project"></textarea>
                </div>

                  <button type="submit" className="submit-button">Submit Request</button>
                </form>
              </>
            ) : (
              <div className="success-animation">
                <div className="mail-container">
                  <div className="envelope">
                    <div className="envelope-front"></div>
                    <div className="envelope-back"></div>
                    <div className="letter">
                      <div className="letter-content"></div>
                    </div>
                  </div>
                </div>
                <div className="success-message">
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}