// RequestServiceModal.tsx
import { useEffect, useRef } from 'react';
import styles from "./RequestServiceModal.module.css";

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestServiceModal({ isOpen, onClose }: RequestServiceModalProps) {
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Block background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Get scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Store current scroll position
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Get the stored scroll position
      const scrollY = document.body.style.top;
      
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle mouse wheel scrolling in the form container
  const handleWheelScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (formContainerRef.current) {
      formContainerRef.current.scrollTop += e.deltaY;
    }
  };

  // Prevent background scrolling on overlay
  const handleOverlayWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
    // You can add your form submission logic here
    onClose();
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={onClose}
      onWheel={handleOverlayWheel}
    >
      <div 
        className={styles.modalContainer} 
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Request Service</h2>
            <p className={styles.modalSubtitle}>
              Fill out the form below and our team will get back to you shortly
            </p>
          </div>

          <div 
            ref={formContainerRef}
            className={styles.formContainer}
            onWheel={handleWheelScroll}
          >
            <form className={styles.serviceForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input 
                    required 
                    type="text" 
                    placeholder="First Name *" 
                    name="firstName"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    required 
                    type="text" 
                    placeholder="Last Name *" 
                    name="lastName"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input 
                    type="text" 
                    placeholder="Job Title" 
                    name="jobTitle"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    required 
                    type="text" 
                    placeholder="Company Name *" 
                    name="companyName"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input 
                    required
                    type="text" 
                    placeholder="Address *" 
                    name="address"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    required
                    type="tel" 
                    placeholder="Phone *" 
                    name="phone"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input 
                    type="email" 
                    placeholder="Email *" 
                    required 
                    name="email"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <select 
                    required 
                    defaultValue=""
                    name="serviceType"
                  >
                    <option value="" disabled>Type of Service *</option>
                    <option value="Free Inspection Service">Free Inspection Service</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Repair">Repair</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input 
                    required 
                    type="text" 
                    placeholder="Project City *" 
                    name="projectCity"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    required 
                    type="text" 
                    placeholder="Project Country *" 
                    name="projectCountry"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <textarea 
                  placeholder="Message *" 
                  required 
                  rows={4}
                  name="message"
                ></textarea>
              </div>

              {/* Extra fields to ensure scrolling is needed */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input 
                    type="text" 
                    placeholder="Preferred Contact Method" 
                    name="contactMethod"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    type="date" 
                    placeholder="Preferred Date" 
                    name="preferredDate"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <textarea 
                  placeholder="Additional Requirements or Special Instructions" 
                  rows={3}
                  name="additionalRequirements"
                ></textarea>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input 
                    type="text" 
                    placeholder="Budget Range" 
                    name="budgetRange"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <select 
                    defaultValue=""
                    name="urgency"
                  >
                    <option value="" disabled>Urgency Level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitButton}>
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}