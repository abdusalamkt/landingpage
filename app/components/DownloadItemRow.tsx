'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './downloadItemRow.module.css';
import { Lock, Eye } from "lucide-react";

type DownloadItem = {
  title: string;
  link: string;
  gated: boolean;
};

type DownloadItemRowProps = {
  item: DownloadItem;
  theme?: 'default' | 'hufcor' | 'acristalia' | 'crown' | 'gibca';
};

const UNLOCK_KEY = 'gated_download_access';
const UNLOCK_DURATION_MS = 1000 * 60 * 60 * 24 * 14; // 14 days


export default function DownloadItemRow({ item, theme = 'default' }: DownloadItemRowProps) {
  const [showForm, setShowForm] = useState(false);
  const [canDownload, setCanDownload] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLFormElement>(null);

  // ✅ Check unlock access status
  const checkUnlockAccess = () => {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      const now = Date.now();
      if (now - timestamp < UNLOCK_DURATION_MS) {
        setCanDownload(true);
      }
    }
  };

  // ✅ Initial check + listen to unlock events
  useEffect(() => {
    checkUnlockAccess();

    const handleUnlock = () => checkUnlockAccess();
    window.addEventListener('unlockGatedDownloads', handleUnlock);

    return () => {
      window.removeEventListener('unlockGatedDownloads', handleUnlock);
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    if (showForm) {
      setIsAnimating(true);
      timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
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

  const cleanUrl = (url: string): string => {
    let result = url;
    if (result.endsWith('.pdf.jpg')) result = result.replace(/\.jpg$/, '');
    if (result.endsWith('.jpg')) result = result.replace(/\.jpg$/, '');
    if (result.includes('-pdf.pdf')) result = result.replace('-pdf.pdf', '.pdf');
    if (result.includes('-pdf') && !result.endsWith('.pdf')) result = result.replace('-pdf', '') + '.pdf';
    if (!result.endsWith('.pdf')) result += '.pdf';
    return result;
  };

  const openPdfInBrowser = (url: string) => {
    const cleaned = cleanUrl(url);
    window.open(cleaned, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.link) return console.error('No download link available');
    if (item.gated && !canDownload) {
      setShowForm(true);
    } else {
      openPdfInBrowser(item.link);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value.trim();
    const company = (form.elements.namedItem('company') as HTMLInputElement)?.value.trim();

    if (name && email && phone && company) {
      localStorage.setItem(UNLOCK_KEY, JSON.stringify({ timestamp: Date.now() }));
      openPdfInBrowser(item.link);
      closeModal();

      // ✅ Trigger event for all rows to unlock
      window.dispatchEvent(new Event('unlockGatedDownloads'));
    }
  };

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const rowClassName = `${styles.row} ${styles[`${theme}Theme`] || ''}`;

  return (
    <>
      <div className={rowClassName}>
        <div className={styles.title}>
  {(item.title || 'Untitled Document').replace(/-/g, ' ')}
</div>
        <div>PDF</div>
      <button className={styles.downloadBtn} onClick={handleDownload}>
  {item.gated && !canDownload ? (
    // Lock
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 
               2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 
               0-2-2zm-3 0H9V7a3 3 0 0 1 6 0v3z"/>
    </svg>
  ) : (
    // Eye
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 
               12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 
               0 0 6 3 3 0 0 0 0-6z"/>
    </svg>
  )}
</button>


      </div>

      {showForm && (
        <div className={`${styles.modalOverlay} ${isAnimating ? styles.animating : ''}`} onClick={closeModal}>
          <form
            ref={modalRef}
            className={`${styles.modal} ${isAnimating ? styles.animating : ''}`}
            onSubmit={handleSubmit}
            onClick={handleFormClick}
          >
            <button className={styles.close} type="button" onClick={(e) => { e.stopPropagation(); closeModal(); }}>×</button>
            <h3>
              <span className={styles.titleText}>Download Ready</span>
              <span className={styles.subtitle}>one more step away!</span>
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
              <input name="company" placeholder="Company" required className={styles.input} />
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
