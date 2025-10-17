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
            <span className="highlight">CAN'T FIND</span> WHAT 
            YOU'RE LOOKING FOR?
          </h2>
          <p className="getintouc-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quod dolores quaerat nihil hic fuga laudantium ipsam nam reiciendis error, laborum eaque enim maiores ipsum? Ipsum quo laudantium ad aliquid!
          </p>
        </div>
        <div className="right-form">
          <form onSubmit={handleSubmit}>
            {/* <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /> */}
            <button type="submit" className="cta-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Get in Touch'}
            </button>
            <button type="submit" className="cta-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'contact us'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;