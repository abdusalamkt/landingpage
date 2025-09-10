'use client';

import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AppointmentModal.css';

const timeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM',
];

const defaultProducts = [
  'Operable Walls',
  'Movable Glass Wall',
  'Washroom Cubicles',
  'Locker Systems',
  'Wall Cladding',
  'Integrated Panel Systems',
  'Terrace Solutions',
  'Hydraulic Doors',
  'Pivot Doors',
  'Installation Services',
];

export default function AppointmentModal({ isOpen, onClose, products = [] }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    product: '',
    message: '',
    date: null,
    time_slot: '',
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // ✅ Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSuccess(true);
      setForm({
        name: '',
        email: '',
        mobile: '',
        product: '',
        message: '',
        date: null,
        time_slot: '',
      });

      setTimeout(() => {
        setSuccess(false);
        setSubmitting(false);
        onClose();
      }, 2500);
    }, 1000);
  };

  const isDayBlocked = (date) => {
    const day = date.getDay();
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);

    return day === 0 || day === 6 || date < minDate;
  };

  // Prevent event bubbling for dropdown scroll
  const handleDropdownScroll = (e) => {
    e.stopPropagation();
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
            <button className="close-btn" onClick={onClose}>×</button>
            <h3>Book Appointment</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
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

              <div className="custom-dropdown-wrapper" ref={dropdownRef}>
                <div
                  className="custom-dropdown"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {form.product || 'Select Interested Product'}
                  <span className="arrow">{showDropdown ? '▲' : '▼'}</span>
                </div>

                {showDropdown && (
                  <ul 
                    className="custom-options"
                    onScroll={handleDropdownScroll}
                    onWheel={handleDropdownScroll}
                  >
                    {(products.length > 0 ? products : defaultProducts).map((p, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setForm({ ...form, product: p });
                          setShowDropdown(false);
                        }}
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
              />

              <DatePicker
                selected={form.date}
                onChange={(date) => setForm({ ...form, date })}
                minDate={new Date(new Date().setDate(new Date().getDate() + 2))}
                filterDate={(date) => !isDayBlocked(date)}
                placeholderText="Pick a date"
                required
                dateFormat="dd-MM-yyyy"
              />

              {form.date && (
                <select
                  name="time_slot"
                  value={form.time_slot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time Slot</option>
                  {timeSlots.map((slot, i) => (
                    <option key={i} value={slot}>{slot}</option>
                  ))}
                </select>
              )}

              <button type="submit" disabled={submitting}>
                {submitting ? 'Booking...' : 'Book Appointment'}
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
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2 className="success-title">Appointment Booked!</h2>
            <p className="success-message">We'll contact you soon to confirm your appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
}