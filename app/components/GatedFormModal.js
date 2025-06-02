'use client';
import { useState } from 'react';
import './GatedFormModal.css';

const GatedFormModal = ({ onClose, onSuccess, item }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional: Send to backend here
    // await fetch('/api/save-lead', { method: 'POST', body: JSON.stringify(form) })

    if (onSuccess) onSuccess();
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
