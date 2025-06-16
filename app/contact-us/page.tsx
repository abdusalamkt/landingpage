'use client';

import './contact.css';
import Header from '../components/Header';
import { useEffect, useState } from 'react';

const slideshowImages = [
  '/gallery/img1.jpg',
  '/gallery/img2.jpg',
  '/gallery/img3.jpg',
  '/gallery/img4.png',
];

export default function ContactUsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <div className="contact-page">
        <div className="contact-header">
          <h1>
            HAVE A <span className="highlight">SPACE</span><br />
            REVAMP IN MIND?
          </h1>
          <div className="contact-subtitle">
            <span>LET’S DISCUSS!</span>
            <hr />
          </div>
        </div>

        <div className="contact-content">
          <div
            className="contact-image slideshow"
            style={{
              backgroundImage: `url(${slideshowImages[currentIndex]})`,
            }}
          />
          <div className="contact-form">
            <h2>GET IN TOUCH!</h2>
            <form>
              <input type="text" placeholder="Name" required />
              <div className="input-row">
                <input type="email" placeholder="Email ID" required />
                <input type="tel" placeholder="Mobile No." required />
              </div>
              <input type="text" placeholder="Project Name & Location" />
              <select required>
                <option value="">Products of Interest</option>
                <option value="option1">Product 1</option>
                <option value="option2">Product 2</option>
              </select>
              <textarea placeholder="Message" rows={3}></textarea>
              <button className="cta-button" type="submit">SUBMIT</button>
            </form>
            
          </div>
        </div><div className="contact-footer">
  <div className="footer-column">
    <h2>ADDRESS</h2>
    <p>Gibca Furniture Industry<br />P.O. Box 20923<br />Ajman, United Arab Emirates</p>
  </div>
  <div className="footer-column">
    <h2>PHONE</h2>
    <p>Telephone: +971-6-7436888<br />Fax: +971-6-7436903</p>
  </div>
  <div className="footer-column">
    <h2>EMAIL</h2>
    <p><a href="mailto:marketing@gfiuae.com">marketing@gfiuae.com</a></p>
  </div>
</div>

      </div>
    </>
  );
}
