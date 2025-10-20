'use client';

import React, { useState, useEffect } from "react";
import "./GetInTouchSection.css";

const GetInTouchSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Auto-hide message after 10 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Successfully subscribed! Welcome to our newsletter.');
        setEmail('');
      } else {
        setMessage('❌ Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('⚠️ An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="get-in-touch-section">
      <div className="overlay" />
      <div className="content-wrapper">
        <div className="left-title">
          <h2>
            <span className="highlight">CAN'T FIND</span> WHAT <br />
            YOU'RE LOOKING FOR?
          </h2>
        </div>
        <div className="right-form">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="cta-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Get in Touch'}
            </button>
          </form>
          {message && (
            <div className={`submit-message ${message.includes('✅') ? 'success' : 'error'}`}>
              <div className="message-content">
                {message.includes('✅') && (
                  <div className="success-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M20 6L9 17L4 12" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <span>{message}</span>
                <button 
                  className="close-button"
                  onClick={() => setMessage('')}
                  aria-label="Close message"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M18 6L6 18M6 6l12 12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="message-timer"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;