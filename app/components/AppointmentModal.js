'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AppointmentModal.css';

const timeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM',
];

const defaultProducts = [
  'Glass Partition',
  'Movable Wall',
  'Operable Wall',
  'Automatic Door',
  'Acoustic Panels',
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

  // ✅ Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className={`modal-box ${success ? 'success-mode' : ''}`}>
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

              <div className="custom-dropdown-wrapper">
                <div
                  className="custom-dropdown"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {form.product || 'Select Interested Product'}
                  <span className="arrow">{showDropdown ? '▲' : '▼'}</span>
                </div>

                {showDropdown && (
                  <ul className="custom-options">
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

              <label>Select Date</label>
              <DatePicker
                selected={form.date}
                onChange={(date) => setForm({ ...form, date })}
                minDate={new Date(new Date().setDate(new Date().getDate() + 2))}
                filterDate={(date) => !isDayBlocked(date)}
                placeholderText="Pick a date"
                required
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
            <div className="checkmark-wrapper">
              <div className="checkmark-circle">
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
              <p>Appointment Booked Successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
