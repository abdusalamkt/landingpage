// RequestServiceModal.tsx
import { useEffect, useRef, useState } from 'react';
import styles from "./RequestServiceModal.module.css";

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestServiceModal({ isOpen, onClose }: RequestServiceModalProps) {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setIsSubmitting(false);
      setSelectedService("");
      setShowServiceDropdown(false);
    }
  }, [isOpen]);

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
      if (event.key === 'Escape' && !showSuccess) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, showSuccess]);

  // Auto-close success animation
  useEffect(() => {
    let closeTimer: NodeJS.Timeout;
    
    if (showSuccess) {
      closeTimer = setTimeout(() => {
        setShowSuccess(false);
        // Close modal after fade out animation
        setTimeout(() => {
          onClose();
        }, 300);
      }, 5000);
    }

    return () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
      }
    };
  }, [showSuccess, onClose]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate service selection
    if (!selectedService) {
      alert("Please select a service type");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/request-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, serviceType: selectedService }),
      });

      const result = await res.json();

      if (result.success) {
        // Reset form immediately while it still exists
        if (e.currentTarget) {
          e.currentTarget.reset();
        }
        
        setIsSubmitting(false);
        setSelectedService("");
        setShowServiceDropdown(false);
        setShowSuccess(true);
        // Auto-close is handled by useEffect
      } else {
        setIsSubmitting(false);
        alert("❌ Failed: " + (result.message || "Please try again."));
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error("Request Service submit error:", err);
      alert("⚠️ Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    if (!showSuccess && !isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleClose}
      onWheel={handleOverlayWheel}
    >
      <div 
        className={styles.modalContainer} 
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {!showSuccess && (
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            ×
          </button>
        )}
        
        {showSuccess ? (
          <div className={styles.successContainer}>
            <div className={styles.confetti}>
              {[...Array(50)].map((_, i) => (
                <div key={i} className={styles.confettiPiece}></div>
              ))}
            </div>
            <div className={styles.checkmarkAnimation}>
              <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2 className={styles.successTitle}>Request Submitted!</h2>
            <p className={styles.successMessage}>We'll get back to you shortly.</p>
          </div>
        ) : (
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <span className='highlight'>Request</span> Service
              </h2>
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input 
                      required 
                      type="text" 
                      placeholder="Last Name *" 
                      name="lastName"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <input 
                      type="text" 
                      placeholder="Job Title" 
                      name="jobTitle"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input 
                      required 
                      type="text" 
                      placeholder="Company Name *" 
                      name="companyName"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <textarea 
                    placeholder="Address *" 
                    required 
                    rows={2}
                    name="Address"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <input 
                      required
                      type="tel" 
                      placeholder="Phone *" 
                      name="phone"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input 
                      type="email" 
                      placeholder="Email *" 
                      required 
                      name="email"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <div className={styles.customDropdownWrapper}>
                      <div
                        className={`${styles.customDropdown} ${isSubmitting ? styles.disabled : ''}`}
                        onClick={() => !isSubmitting && setShowServiceDropdown(!showServiceDropdown)}
                      >
                        {selectedService || "Type of Service *"}
                        <span className={styles.arrow}>
                          {showServiceDropdown ? "▲" : "▼"}
                        </span>
                      </div>

                      {showServiceDropdown && !isSubmitting && (
                        <ul className={styles.customOptions}>
                          {["Free Inspection Service", "Maintenance", "Repair"].map((service) => (
                            <li
                              key={service}
                              onClick={() => {
                                setSelectedService(service);
                                setShowServiceDropdown(false);
                              }}
                            >
                              {service}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <input 
                      required 
                      type="text" 
                      placeholder="Project City *" 
                      name="projectCity"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input 
                      required 
                      type="text" 
                      placeholder="Project Country *" 
                      name="projectCountry"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <textarea 
                    placeholder="Message *" 
                    required 
                    rows={4}
                    name="message"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}