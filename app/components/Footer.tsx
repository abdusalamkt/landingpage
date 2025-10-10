'use client';

import { useState } from 'react';
import './Footer.css';
import Link from 'next/link';
import { PanelBottom } from 'lucide-react';

const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

    // ✅ Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitMessage("");

  try {
      const response = await fetch("/api/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

    const result = await response.json();

    if (result.success) {
      setSubmitMessage("✅ Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } else {
      setSubmitMessage("❌ Failed to send message. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting footer form:", error);
    setSubmitMessage("⚠️ An error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

 // ✅ Handle newsletter submit
  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    setNewsletterMsg('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setNewsletterMsg('✅ Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        setNewsletterMsg('❌ Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing newsletter:', error);
      setNewsletterMsg('⚠️ An error occurred. Please try again.');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };
  return (
    <footer className="footer">
      {/* Contact Form Section */}
      <div className="contact-form-section">
        <div className="contact-form-container">
          <h2 className="form-title">HAVE A SPACE <span className="highlight">REVAMP </span>IN MIND?</h2>
          <p className="form-description">
            We're excited to hear about your project and explore how we can work together.<br />
            Let's start a conversation and turn your vision into reality.
          </p>

          {/* Updated form with submission logic */}
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
              className="form-input"
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
              className="form-input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
              className="form-input"
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <textarea
                name="message"
                placeholder="Write us a message"
                className="form-textarea"
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            {submitMessage && (
              <div
                className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}
              >
                {submitMessage}
              </div>
            )}

            <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING...' : 'SUBMIT'}
            </button>
          </form>
        </div>
        <div className="form-divider"></div>
      </div>

      {/* Footer Content */}
      <div className="footer-container">
        {/* Left Section - 60% */}
        <div className="footer-left">
          {/* Logo Section */}
          <div className="footer-logos">
            <div className="logo-item">
  <Link href="/our-products/gibca-compact-laminate-solutions"> 
    <img 
      src="/logos/2025 GIBCA LOGO WHITE.png" 
      alt="gibca-logo" 
      className="logo-image" 
    />
  </Link>
</div>

            {/* <div className="logo-divider"></div> */}
            <div className="logo-item">
              <Link href="/our-products/hufcor"> 
              <img src="/logos/HUFCOR ALL WHITE.png" alt="hufcor-logo" className="logo-image" /></Link>
            </div>
            <div className="logo-item">
              <Link href="/our-products/crown">
              <img src="/crown-doors-logo 1 - WHITE.svg" alt="crown-logo" className="logo-image" /></Link>
            </div>
            <div className="logo-item">
              <Link href="/our-products/terrace-solutions">
              <img src="/acristalialogo.png" alt="acristalia-logo" className="logo-image" style={{height:"50px"}}/></Link>
            </div>
            
            {/* <div className="logo-divider"></div> */}
            {/* <div className="logo-item">
              <img src="/hufcor-logo.png" alt="HUFCOR" className="logo-image" />
            </div> */}
          </div>

          {/* Links Section */}
          <div className="footer-links">
            <div className="link-column">
              <h4>RESOURCES</h4>
              <ul>
                <li><Link href="/case-study">Case Studies</Link></li>
                <li><Link href="/blogs">Blog</Link></li>
                <li><Link href="/projects">Gallery</Link></li>
                <li><Link href="/downloads">Downloads</Link></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>COMPANY</h4>
              <ul>
                <li><Link href="/about-gibca">About Us</Link></li>
                <li><Link href="/our-products">Products</Link></li>
                <li><Link href="/contact-us">Contact Us</Link></li>
                <li><Link href="/downloads">Downloads</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>SOCIALS</h4>
              <ul>
                <li><a href="https://www.linkedin.com/company/gibca-furniture-uae"  target="_blank" 
  rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://www.instagram.com/gibcafurniture/"  target="_blank" 
  rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://www.facebook.com/GFIUAE/"  target="_blank" 
  rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://www.youtube.com/@gibcafurnitureindustryuae6400"  target="_blank" 
  rel="noopener noreferrer">YouTube</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>PRODUCTS</h4>
              <ul>
                {/* <li><a href="#">Office Partitions</a></li> */}
                <li><Link href="/our-products/gibca-compact-laminate-solutions">Compact Laminate Solutions</Link></li>
                <li><Link href="/our-products/pivot-doors">Pivot Doors</Link></li>
                <li><Link href="/our-products/hufcor">Operable Walls</Link></li>
                <li><Link href="/our-products/crown">Hydraulic Doors</Link></li>
                <li><Link href="/our-products/terrace-solutions">Terrace Solutions</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vertical Divier */}
        <div className="vertical-divider"></div>

        {/* Right Section - 40% */}
        <div className="footer-right">
          <div className="newsletter-section">
            <h2>BUILD WITH A <span className="highlight">DIFFERENCE.</span></h2>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isNewsletterSubmitting}>
            {isNewsletterSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>
        {newsletterMsg && (
          <div
            className={`newsletter-message ${
              newsletterMsg.includes('✅') ? 'success' : 'error'
            }`}
          >
            {newsletterMsg}
          </div>
        )}

            <div className="social-section">
              <h4>FOLLOW OUR SOCIALS!</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/GFIUAE/" className="social-icon" target="_blank" 
  rel="noopener noreferrer">
                  <img src="/icon/facebook.png" alt="Facebook" className="social-icon-image" />
                </a>
                <a href="https://www.linkedin.com/company/gibca-furniture-uae" className="social-icon" target="_blank" 
  rel="noopener noreferrer">
                  <img src="/icon/linkedin2.png" alt="Linkedin" className="social-icon-image" />
                </a>
                <a href="https://www.instagram.com/gibcafurniture/" className="social-icon" target="_blank" 
  rel="noopener noreferrer">
                  <img src="/icon/insta.png" alt="Instagram" className="social-icon-image" />
                </a>
                <a href="https://www.youtube.com/@gibcafurnitureindustryuae6400" className="social-icon" target="_blank" 
  rel="noopener noreferrer">
                  <img src="/icon/youtube.png" alt="YouTube" className="social-icon-image" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
<div className="footer-bottom-bar">
  <p>
    &copy; 2025 GIBCA Furniture | All rights reserved | <a href="mailto:marketing@gfiuae.com"><b>marketing@gfiuae.com</b></a> 
  </p>
</div>

    </footer>
  );
};

export default Footer;