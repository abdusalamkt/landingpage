'use client';

import React, { useState } from "react";
import "./GetInTouchSection.css";

const GetInTouchSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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
        setMessage('✅ Submission successful!');
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
            <span className="highlight">CAN’T FIND</span> WHAT <br />
            YOU’RE LOOKING FOR?
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
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;
