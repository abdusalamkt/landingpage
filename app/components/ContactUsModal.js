// app/components/ContactUsModal.js
'use client';
import { useState, useRef } from 'react';
import './ContactUsModal.css'; // you can create separate styles if you want

export default function ContactUsModal({ onClose }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current && formRef.current.checkValidity()) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        if (formRef.current) formRef.current.reset();
        onClose(); // call parent to close modal
      }, 3000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
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
  );
}
