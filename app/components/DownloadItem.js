'use client';
import { useState, useEffect } from 'react';
import GatedFormModal from './GatedFormModal';

const DownloadItem = ({ item }) => {
  const [showForm, setShowForm] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const storageKey = `gated-access-${item.id || item.slug || item.title}`;

  useEffect(() => {
    const unlocked = localStorage.getItem(storageKey);
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, [storageKey]);

  const handleClick = () => {
    if (item.gated && !isUnlocked) {
      setShowForm(true);
    } else {
      window.open(item.link, '_blank');
    }
  };

  const handleFormSuccess = () => {
    localStorage.setItem(storageKey, 'true');
    setIsUnlocked(true);
    setShowForm(false);
    window.open(item.link, '_blank');
  };

  return (
    <div className="download-item">
      <img src={item.thumbnail} alt={item.title} />
      <h3>{item.title}</h3>
      <button onClick={handleClick}>
        {item.gated && !isUnlocked ? 'Get Access' : 'Download'}
      </button>

      {item.gated && showForm && (
        <GatedFormModal
          onClose={() => setShowForm(false)}
          item={item}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default DownloadItem;
