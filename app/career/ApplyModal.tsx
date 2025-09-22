'use client';

import { useState, useEffect, useRef } from 'react';
import './ApplyModal.css';

type ApplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
};

export default function ApplyModal({ isOpen, onClose, jobTitle }: ApplyModalProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    cv: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'cv' && files && files[0]) {
      setForm({ ...form, cv: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Drag & Drop Handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm({ ...form, cv: e.dataTransfer.files[0] });
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.type === 'dragenter' || e.type === 'dragover'
      ? setDragActive(true)
      : setDragActive(false);
  };

  const removeFile = () => {
    setForm({ ...form, cv: null });
    setUploadProgress(0);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.mobile || !form.cv) {
      setFormErrors('Please fill all required fields and upload your CV.');
      return;
    }
    setFormErrors(null);
    setSubmitting(true);
    setUploadProgress(0);

    const fileSize = form.cv.size;
    const totalTime = Math.min(2000 + fileSize / 1000, 5000);
    const intervalTime = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min((elapsed / totalTime) * 100, 100);
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setSuccess(true);
          setForm({ firstName: '', lastName: '', email: '', mobile: '', cv: null });
          setUploadProgress(0);
          setTimeout(() => {
            setSuccess(false);
            setSubmitting(false);
            onClose();
          }, 2500);
        }, 500);
      }
    }, intervalTime);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className={`modal-box ${success ? 'success-mode' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!success ? (
          <>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
            <h3>Apply for {jobTitle || 'Job'}</h3>

            {formErrors && <p className="form-error">{formErrors}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                required
              />

              {/* Drag & Drop */}
              <div
                className={`drag-drop-area ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={openFilePicker} // clickable area
              >
                {!form.cv ? (
                  <span>Drag & Drop CV here or click to upload</span>
                ) : (
                  <div className="file-info">
                    <span>{form.cv.name} ({formatFileSize(form.cv.size)})</span>
                    <button type="button" className="remove-file-btn" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                      ✕
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  name="cv"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
              </div>

              {form.cv && submitting && (
                <div className="progress-bar-wrapper">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <button type="submit" disabled={submitting}>
                {submitting ? 'Uploading...' : 'Submit Application'}
              </button>
            </form>
          </>
        ) : (
          <div className="success-animation">
            <div className="confetti">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="confetti-piece"></div>
              ))}
            </div>
            <div className="checkmark-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2 className="success-title">Application Submitted!</h2>
            <p className="success-message">We'll review your application and contact you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
