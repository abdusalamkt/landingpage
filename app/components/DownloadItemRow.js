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
  let timer;

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  if (showForm) {
    setIsAnimating(true);
    // Delay the event listener so it doesn't capture the opening click
    timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100); // 100ms is enough to avoid immediate close
    document.body.style.overflow = 'hidden';
  }

  return () => {
    clearTimeout(timer);
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

  const openPdfInBrowser = (url) => {
    // Clean and properly encode the URL
    let cleanUrl = url;
    
    console.log('Original URL:', cleanUrl);
    
    // Remove any .jpg extension that might have been appended
    if (cleanUrl.endsWith('.jpg') && !cleanUrl.includes('.pdf.jpg')) {
      cleanUrl = cleanUrl.replace(/\.jpg$/, '');
    }
    
    // If the URL ends with .pdf.jpg, remove the .jpg part
    if (cleanUrl.endsWith('.pdf.jpg')) {
      cleanUrl = cleanUrl.replace(/\.jpg$/, '');
    }
    
    // Handle the specific case where WordPress converts ™ to -pdf in the URL
    // Replace -pdf.pdf with the proper encoded trademark symbol %E2%84%A2.pdf
    if (cleanUrl.includes('-pdf.pdf')) {
      cleanUrl = cleanUrl.replace('-pdf.pdf', '.pdf');
    }
    
    // Also handle cases where it might just be -pdf at the end
    if (cleanUrl.includes('-pdf') && !cleanUrl.endsWith('.pdf')) {
      cleanUrl = cleanUrl.replace('-pdf', '') + '.pdf';
    }
    
    // Ensure the URL ends with .pdf if it doesn't already
    if (!cleanUrl.endsWith('.pdf')) {
      cleanUrl += '.pdf';
    }
    
    console.log('Cleaned URL:', cleanUrl);
    
    // Open in new tab to use browser's built-in PDF viewer
    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
  };

  const downloadPdf = (url, filename) => {
    // Clean the URL similar to openPdfInBrowser
    let cleanUrl = url;
    
    if (cleanUrl.endsWith('.jpg') && !cleanUrl.includes('.pdf.jpg')) {
      cleanUrl = cleanUrl.replace(/\.jpg$/, '');
    }
    
    if (cleanUrl.endsWith('.pdf.jpg')) {
      cleanUrl = cleanUrl.replace(/\.jpg$/, '');
    }
    
    // Handle the specific case where WordPress converts ™ to -pdf in the URL
    if (cleanUrl.includes('-pdf.pdf')) {
      cleanUrl = cleanUrl.replace('-pdf.pdf', '.pdf');
    }
    
    // Also handle cases where it might just be -pdf at the end
    if (cleanUrl.includes('-pdf') && !cleanUrl.endsWith('.pdf')) {
      cleanUrl = cleanUrl.replace('-pdf', '') + '.pdf';
    }
    
    if (!cleanUrl.endsWith('.pdf')) {
      cleanUrl += '.pdf';
    }
    
    // Create a temporary link for download
    const link = document.createElement('a');
    link.href = cleanUrl;
    link.download = filename || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCleanFilename = (url, title) => {
    // Try to get filename from title first
    if (title && title.trim()) {
      const cleanTitle = title.trim().replace(/[^a-zA-Z0-9\s-_]/g, '');
      return `${cleanTitle}.pdf`;
    }
    
    // Fallback to extracting from URL
    const urlParts = url.split('/');
    let filename = urlParts[urlParts.length - 1] || 'document.pdf';
    
    // Clean up the filename
    if (filename.endsWith('.jpg') && !filename.includes('.pdf.jpg')) {
      filename = filename.replace(/\.jpg$/, '.pdf');
    }
    
    if (filename.endsWith('.pdf.jpg')) {
      filename = filename.replace(/\.jpg$/, '');
    }
    
    if (!filename.endsWith('.pdf')) {
      filename += '.pdf';
    }
    
    return filename;
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    
    if (!item.link) {
      console.error('No download link available');
      return;
    }

    if (item.gated && !canDownload) {
      setShowForm(true);
    } else {
      // For non-gated files or when access is granted, open in browser PDF viewer
      openPdfInBrowser(item.link);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    if (name && email && phone) {
      // Store access permission
      localStorage.setItem(
        'gated_download_access',
        JSON.stringify({ timestamp: Date.now() })
      );
      
      // Open PDF in browser after form submission
      openPdfInBrowser(item.link);

      closeModal();
      setCanDownload(true);
    }
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  // Calculate file size (you might want to get this from your backend)

  return (
    <>
      <div className={styles.row}>
  <div className={styles.title}>{item.title || 'Untitled Document'}</div>
 
  <div>PDF</div>
  <button className={styles.downloadBtn} onClick={handleDownload}>
    {item.gated && !canDownload ? '🔒' : '👁️'}
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
              <span className={styles.btnText}>View PDF</span>
              <span className={styles.btnHoverEffect}></span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}