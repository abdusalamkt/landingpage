'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './downloadItemRow.module.css';

export default function DownloadItemRow({ item }) {
  const [showForm, setShowForm] = useState(false);
  const [canDownload, setCanDownload] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('gated_download_access');
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      const now = Date.now();
      const diff = now - timestamp;
      const hours = diff / (1000 * 60 * 60);
      if (hours < 0.1) {
        setCanDownload(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    if (showForm) {
      setIsAnimating(true);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [showForm]);

  const closeModal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowForm(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (item.gated && !canDownload) {
      setShowForm(true);
    } else {
      window.open(item.link, '_blank');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    if (name && email && phone) {
      localStorage.setItem(
        'gated_download_access',
        JSON.stringify({ timestamp: Date.now() })
      );
      window.open(item.link, '_blank');
      closeModal();
      setCanDownload(true);
    }
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className={styles.row}>
        <div className={styles.title}>{item.title}</div>
        <div>{item.size}</div>
        <div>PDF</div>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          {item.gated && !canDownload ? '🔒' : '⬇️'}
        </button>
      </div>

      {showForm && (
        <div 
          className={`${styles.modalOverlay} ${isAnimating ? styles.animating : ''}`}
          onClick={closeModal}
        >
          <form 
            ref={modalRef}
            className={`${styles.modal} ${isAnimating ? styles.animating : ''}`}
            onSubmit={handleSubmit}
            onClick={handleFormClick}
          >
            <button
              className={styles.close}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              ×
            </button>
            <h3>
              <span className={styles.titleText}>Download Ready</span>
              <span className={styles.subtitle}>one more step away !</span>
            </h3>
            <div className={styles.inputContainer}>
              <input name="name" placeholder="Name" required className={styles.input} />
              <span className={styles.inputUnderline}></span>
            </div>
            <div className={styles.inputContainer}>
              <input name="email" placeholder="Email" type="email" required className={styles.input} />
              <span className={styles.inputUnderline}></span>
            </div>
            <div className={styles.inputContainer}>
              <input name="phone" placeholder="Phone" required className={styles.input} />
              <span className={styles.inputUnderline}></span>
            </div>
            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Download</span>
              <span className={styles.btnHoverEffect}></span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}