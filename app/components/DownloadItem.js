'use client';
import { useState } from 'react';
import GatedFormModal from './GatedFormModal';

const DownloadItem = ({ item }) => {
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    if (item.gated) {
      setShowForm(true);
    } else {
      window.open(item.link, '_blank');
    }
  };

  return (
    <div className="download-item">
      <img src={item.thumbnail} alt={item.title} />
      <h3>{item.title}</h3>
      <button onClick={handleClick}>
        {item.gated ? 'Get Access' : 'Download'}
      </button>

      {item.gated && showForm && (
        <GatedFormModal
          onClose={() => setShowForm(false)}
          item={item}
        />
      )}
    </div>
  );
};

export default DownloadItem;
