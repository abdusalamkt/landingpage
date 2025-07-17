'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AppointmentModal.css'; // optional custom CSS

const timeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM',
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

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (form.date) {
      checkAvailableSlots(form.date);
    }
  }, [form.date]);

  const checkAvailableSlots = async (date) => {
    setLoadingSlots(true);
    // try {
    //   const res = await axios.get(`/api/check-slots?date=${date.toISOString().split('T')[0]}`);
    //   setAvailableSlots(res.data.available || []);
    // } catch (error) {
    //   console.error('Error checking slots:', error);
    //   setAvailableSlots([]);
    // }
    setLoadingSlots(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post('/api/book-appointment', {
        ...form,
        date: form.date.toISOString().split('T')[0],
      });

      if (res.data.success) {
        setSuccess(true);
        setForm({ name: '', email: '', mobile: '', product: '', message: '', date: null, time_slot: '' });
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      alert('Failed to book appointment.');
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Book Appointment</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
          <input type="tel" name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required />

          <select name="product" value={form.product} onChange={handleChange} >
            <option value="">Select Interested Product</option>
            {products.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>

          <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} />

          <label>Select Date</label>
          <DatePicker
            selected={form.date}
            onChange={(date) => setForm({ ...form, date })}
            minDate={new Date()}
            required
          />

          {form.date && (
            <select name="time_slot" value={form.time_slot} onChange={handleChange} >
              <option value="">Select Time Slot</option>
              {loadingSlots ? (
                <option disabled>Loading slots...</option>
              ) : availableSlots.length > 0 ? (
                availableSlots.map((slot, i) => <option key={i} value={slot}>{slot}</option>)
              ) : (
                <option disabled>No slots available</option>
              )}
            </select>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>

        {success && <p className="success-msg">Appointment booked successfully!</p>}
      </div>
    </div>
  );
}
