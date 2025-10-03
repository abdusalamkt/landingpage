'use client';

import { useState } from 'react';
import ApplyModal from './ApplyModal';
import styles from './career.module.css';

// Types
type Detail = { detailTitle: string; detailPoints: string };
type Job = { title: string; type: string; experience: string; location: string; description: string; details: Detail[] };
type HeroBanner = { id: string; sourceUrl: string; altText: string };

type CareerData = {
  heroHeading: string;
  heroDescription: string;
  heroBanner: HeroBanner | null;
  sectionHeading: string;
  sectionDescription: string;
  jobs: Job[];
};

interface CareerPageProps {
  data: CareerData;
}

export default function CareerPageClient({ data }: CareerPageProps) {
  const { heroHeading, heroDescription, heroBanner, sectionHeading, sectionDescription, jobs } = data;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');

  // CV Drop form state
  const [cvForm, setCvForm] = useState({
    name: '',
    email: '',
    message: '',
    file: null as File | null,
    isDragging: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleExpand = (index: number) => setExpandedIndex(index === expandedIndex ? null : index);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCvForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && isValidFileType(file)) setCvForm(prev => ({ ...prev, file }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCvForm(prev => ({ ...prev, isDragging: true }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setCvForm(prev => ({ ...prev, isDragging: false }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file && isValidFileType(file)) setCvForm(prev => ({ ...prev, file, isDragging: false }));
    else setCvForm(prev => ({ ...prev, isDragging: false }));
  };

  const isValidFileType = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return allowedTypes.includes(file.type);
  };

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvForm.name || !cvForm.email || !cvForm.file) {
      alert('Please fill all required fields and upload your CV');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('CV Submitted:', cvForm);
      setSubmitSuccess(true);

      setTimeout(() => {
        setCvForm({ name: '', email: '', message: '', file: null, isDragging: false });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting CV:', error);
      alert('There was an error submitting your CV. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCvForm(prev => ({ ...prev, file: null }));
  };

  return (
    <>
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.teamSection}>
          <h1 className={styles.heading} dangerouslySetInnerHTML={{ __html: heroHeading }} />
          <p className={styles.subtext} dangerouslySetInnerHTML={{ __html: heroDescription }} />
          {heroBanner ? <img className={styles.imagePlaceholder} src={heroBanner.sourceUrl} alt={heroBanner.altText || 'Hero Banner'} /> : <div className={styles.imagePlaceholder} />}
        </section>

        {/* Careers Section */}
        <section className={styles.openingsSection}>
          <h2 className={styles.openingsHeading} dangerouslySetInnerHTML={{ __html: sectionHeading }} />
          <p className={styles.subtext} dangerouslySetInnerHTML={{ __html: sectionDescription }} />
          <hr className={styles.divider} />

          {jobs.map((job, index) => (
            <div key={index} className={styles.jobItem}>
              <div className={styles.jobInfo}>
                <h3>{job.title}</h3>
                <div className={styles.tags}>
                  <span className={styles.tag}>{job.type}</span>
                  <span className={styles.tag}>{job.experience}</span>
                  <span className={styles.tag}>{job.location}</span>
                </div>
              </div>
              <div className={styles.jobActions}>
                <button type="button" className={styles.applyButton} onClick={() => { setSelectedJob(job.title); setModalOpen(true); }}>APPLY</button>
                <button className={styles.viewDetails} onClick={() => toggleExpand(index)}>
                  {expandedIndex === index ? 'Hide Details' : 'View Full Details'}
                </button>
              </div>
              {expandedIndex === index && (
                <div className={styles.jobDetails}>
                  <div dangerouslySetInnerHTML={{ __html: job.description }} />
                  {job.details.map((detail, i) => (
                    <div key={i}>
                      <h4>{detail.detailTitle}</h4>
                      <div dangerouslySetInnerHTML={{ __html: detail.detailPoints }} />
                    </div>
                  ))}
                  <button className={styles.closeButton} onClick={() => setExpandedIndex(null)}>Close</button>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* CV Drop Section */}
        <section className={styles.cvSection}>
          <div className={styles.cvContainer}>
            <h2 className={styles.cvHeading}>Can't find your preferred job?</h2>
            <p className={styles.cvSubtext}>Drop your CV here and we'll get in touch when matching opportunities arise</p>
            
            {!submitSuccess ? (
              <form className={styles.cvForm} onSubmit={handleCvSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={cvForm.name}
                      onChange={handleInputChange}
                      className={styles.textInput}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={cvForm.email}
                      onChange={handleInputChange}
                      className={styles.textInput}
                      required
                    />
                  </div>
                </div>

                {/* Message Section */}
                <div className={styles.messageGroup}>
                  <textarea
                    name="message"
                    placeholder="Tell us about yourself!"
                    value={cvForm.message}
                    onChange={handleInputChange}
                    className={styles.messageInput}
                    rows={4}
                    maxLength={500}
                  />
                  <div className={styles.charCount}>
                    {cvForm.message.length}/500 characters
                  </div>
                </div>

                <div
                  className={`${styles.fileDropZone} ${cvForm.isDragging ? styles.dragging : ''} ${cvForm.file ? styles.hasFile : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('cv-upload')?.click()}
                >
                  <input
                    type="file"
                    id="cv-upload"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className={styles.fileInput}
                  />
                  
                  {!cvForm.file ? (
                    <>
                      <div className={styles.uploadIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className={styles.dropText}>
                        <span className={styles.browseText}>Browse files</span> or drag and drop your CV here *
                      </p>
                      <p className={styles.fileTypes}>PDF, DOC, DOCX, TXT (Max 2MB)</p>
                    </>
                  ) : (
                    <div className={styles.filePreview}>
                      <div className={styles.fileInfo}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                          <polyline points="13 2 13 9 20 9" />
                        </svg>
                        <div>
                          <p className={styles.fileName}>{cvForm.file.name}</p>
                          <p className={styles.fileSize}>{(cvForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={removeFile} 
                        className={styles.removeFile}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner}></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>
            ) : (
              <div className={styles.successAnimation}>
                <div className={styles.confetti}>
                  {[...Array(50)].map((_, i) => (
                    <div key={i} className={styles.confettiPiece}></div>
                  ))}
                </div>
                <div className={styles.checkmarkAnimation}>
                  <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                    <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>CV Submitted Successfully!</h2>
                <p className={styles.successMessage}>We'll review your CV and contact you when matching opportunities arise.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <ApplyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} jobTitle={selectedJob} />
    </>
  );
}
