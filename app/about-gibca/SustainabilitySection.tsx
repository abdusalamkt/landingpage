'use client';

import styles from './SustainabilitySection.module.css';
import Image from 'next/image';
import { useState } from 'react';

interface ImageField {
  sourceUrl: string;
  altText?: string;
}

interface Certificate {
  title: string;
  description: string;
  isoImage: ImageField;
  pdfUrl?: string; // Add PDF URL field
}

interface SustainabilityFields {
  isoHeading: string;
  isoHighlight: string;
  isoDescription: string;
  mainImage: ImageField;
  overlayImage: ImageField;
  certifications: Certificate[];
}

interface SustainabilitySectionProps {
  fields: SustainabilityFields;
}

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

// PDF Modal Component
function PDFModal({ isOpen, onClose, pdfUrl, title }: PDFModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.pdfContainer}>
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`}
            className={styles.pdfViewer}
            title={`PDF viewer for ${title}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function SustainabilitySection({ fields }: SustainabilitySectionProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    pdfUrl: string;
    title: string;
  }>({
    isOpen: false,
    pdfUrl: '',
    title: ''
  });

  if (!fields?.isoHeading) return null;

  // Hardcoded PDF URLs for testing
  const hardcodedPdfUrls = [
    "https://test.shopgfiuae.com/wp-content/uploads/2025/09/EMS-14001.pdf",
    "https://test.shopgfiuae.com/wp-content/uploads/2025/09/QMS-9001.pdf",
    "https://test.shopgfiuae.com/wp-content/uploads/2025/09/GIBCA_2025_SCS-IAQ-11123_s.pdf",
    "https://test.shopgfiuae.com/wp-content/uploads/2025/09/GIBCA_2025_SCS-IAQ-11122_s.pdf",
    "https://test.shopgfiuae.com/wp-content/uploads/2025/09/GIBCA-FSC-CERTIFICATE.pdf"
  ];

  const openPDFModal = (pdfUrl: string, title: string) => {
    if (pdfUrl) {
      setModalState({
        isOpen: true,
        pdfUrl,
        title
      });
    }
  };

  const closePDFModal = () => {
    setModalState({
      isOpen: false,
      pdfUrl: '',
      title: ''
    });
  };

  return (
    <>
      <section className={styles.sustainabilitySection}>
        <div className={styles.commitment}>
          <div className={styles.imageWrapper}>
            {fields?.mainImage?.sourceUrl && (
              <Image
                src={fields.mainImage.sourceUrl}
                alt={fields.mainImage.altText || 'Main image'}
                width={400}
                height={400}
                className={styles.mainImage}
              />
            )}
            {fields?.overlayImage?.sourceUrl && (
              <Image
                src={fields.overlayImage.sourceUrl}
                alt={fields.overlayImage.altText || 'Overlay image'}
                width={400}
                height={400}
                className={styles.overlayImage}
              />
            )}
          </div>

          <div className={styles.textContent}>
            <h2 className={styles.heading}>
              {fields.isoHeading
                .split(' ')
                .slice(0, -1)
                .join(' ')}{' '}
              <span className={styles.lastWord}>
                {fields.isoHeading.split(' ').slice(-1)}
              </span>
            </h2>

            {fields.isoDescription && (
              <div
                className={styles.isoDescription}
                dangerouslySetInnerHTML={{ __html: fields.isoDescription }}
              />
            )}
          </div>
        </div>

        {fields.certifications?.length > 0 && (
          <div className={styles.certifications}>
            <h3>CERTIFICATIONS</h3>
            <div className={styles.certGrid}>
              {fields.certifications.map((cert, idx) => {
                // Assign hardcoded PDF URL based on index (cycling through available PDFs)
                const pdfUrl = hardcodedPdfUrls[idx % hardcodedPdfUrls.length];
                
                return (
                  <div 
                    className={`${styles.certCard} ${styles.clickable}`}
                    key={idx}
                  >
                    {cert.isoImage?.sourceUrl && (
                      <Image
                        src={cert.isoImage.sourceUrl}
                        alt={cert.isoImage.altText || cert.title}
                        width={800}
                        height={800}
                        quality={90}
                        className={styles.certCardImage}
                      />
                    )}
                    <h4>{cert.title}</h4>
                    <p>{cert.description}</p>
                    {/* <div className={styles.viewCertificate}>
                      <span>View Document</span>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* PDF Modal */}
      <PDFModal
        isOpen={modalState.isOpen}
        onClose={closePDFModal}
        pdfUrl={modalState.pdfUrl}
        title={modalState.title}
      />
    </>
  );
}