'use client';
import { useState } from 'react';

const GatedFormModal = ({ onClose, item }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally send to API or save
    // await fetch('/api/submit-gated-form', { ... })
    setSubmitted(true);
    window.open(item.link, '_blank'); // or set a state to show button instead
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose} className="close">×</button>
        <h2>Access "{item.title}"</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" required placeholder="Name" onChange={handleChange} />
          <input name="email" type="email" required placeholder="Email" onChange={handleChange} />
          <input name="phone" required placeholder="Phone" onChange={handleChange} />
          <button type="submit">Get Access</button>
        </form>
      </div>
    </div>
  );
};

export default GatedFormModal;
