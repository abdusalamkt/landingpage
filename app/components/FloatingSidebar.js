"use client";

import styles from './FloatingSidebar.module.css';
import { FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

const FloatingSidebar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isVisible ? styles.visible : styles.hidden}`}>
        <button className={`${styles.toggleButton} ${isVisible ? styles.visible : styles.hidden}`} onClick={toggleSidebar}>
          <span className={styles.arrowWrapper}>
            <FaChevronLeft className={`${styles.arrow} ${styles.arrowUp}`} />
            <FaChevronRight className={`${styles.arrow} ${styles.arrowDown}`} />
          </span>
        </button>
        <ul>
          <li>
            <a href="https://linkedin.com/company/gibca-furniture-uae" target="_blank" rel="noopener noreferrer">
              <span className={styles.tooltip}>LinkedIn</span>
              <FaLinkedinIn className={styles.icon} />
            </a>
          </li>
          <li>
            <a href="tel:+97167436888">
              <span className={styles.tooltip}>Call</span>
              <FaPhoneAlt className={styles.icon} />
            </a>
          </li>
          <li>
            <a href="mailto:marketing@gfiuae.com">
              <span className={styles.tooltip}>Email</span>
              <FaEnvelope className={styles.icon} />
            </a>
          </li>
          <li>
            <a href="https://wa.me/971566822479" target="_blank" rel="noopener noreferrer">
              <span className={styles.tooltip}>WhatsApp</span>
              <FaWhatsapp className={styles.icon} />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default FloatingSidebar;