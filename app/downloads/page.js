'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './downloads.module.css';
import Header from '../components/Header';
import DownloadItemRow from '../components/DownloadItemRow';

const allDownloads = [
  {
    title: 'GIBCA Company Profile - Brochure',
    size: '1.5MB',
    type: 'Brochure',
    product: 'GIBCA Company Profile',
    link: 'https://www.gfiuae.com/gfiuae/wp-content/uploads/2023/11/Gibca-Company-Profile-Brochure_compressed.pdf',
    gated: false,
  },
  {
    title: 'ISO Certificate 9001 - QMS',
    size: '1.5MB',
    type: 'Certificate',
    product: 'ISO',
    link: 'https://www.gfiuae.com/gfiuae/wp-content/uploads/2023/11/Gibca-Company-Profile-Brochure_compressed.pdf',
    gated: false,
  },
  {
    title: 'Series™ 7560 Specification',
    size: '1.5MB',
    type: 'Specification',
    product: 'Series™ 7560',
    link: 'https://www.gfiuae.com/gfiuae/wp-content/uploads/2023/11/Gibca-Company-Profile-Brochure_compressed.pdf',
    gated: false,
  },
  {
    title: 'Exclusive Case Study',
    size: '1.5MB',
    type: 'Case Study',
    product: 'Custom',
    link: 'https://www.gfiuae.com/gfiuae/wp-content/uploads/2023/11/Gibca-Company-Profile-Brochure_compressed.pdf',
    gated: true,
  },
];

const uniqueValues = (key) => [
  ...new Set(allDownloads.map((item) => item[key])),
].filter(Boolean);

const fileIcons = {
  Brochure: '📄',
  Certificate: '📑',
  Specification: '📊',
  'Case Study': '📂'
};

export default function DownloadsPage() {
  const [product, setProduct] = useState('');
  const [docType, setDocType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [transferFiles, setTransferFiles] = useState([]);
  const animationRef = useRef();

  useEffect(() => {
    const createFile = () => {
      const types = ['Brochure', 'Certificate', 'Specification', 'Case Study'];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = (0.5 + Math.random() * 4.5).toFixed(1);
      
      return {
        id: Date.now() + Math.random(),
        type,
        icon: fileIcons[type],
        size: `${size}MB`,
        progress: 0,
        x: Math.random() * 80 + 10, // 10-90%
        speed: .2 + Math.random() * 2,
        rotation: Math.random() * 30 - 15,
        opacity: 0.7 + Math.random() * 0.3,
        direction: Math.random() > 0.5 ? 1 : -1
      };
    };

    const updateFiles = () => {
      setTransferFiles(prevFiles => {
        // Remove completed files
        let files = prevFiles.filter(f => f.progress < 100);
        
        // Add new files randomly
        if (files.length < 10 && Math.random() > 0.7) {
          files = [...files, createFile()];
        }
        
        // Update progress
        return files.map(f => ({
          ...f,
          progress: Math.min(f.progress + f.speed, 1000),
          x: f.x + (Math.random() - 0.1) * 0 * f.direction
        }));
      });
    };

    // Initial files
    const initialFiles = Array.from({ length: 5 }, () => createFile());
    setTransferFiles(initialFiles);

    // Animation loop
    animationRef.current = setInterval(updateFiles, 30);

    return () => clearInterval(animationRef.current);
  }, []);

  const filtered = allDownloads.filter((item) => {
    return (
      (!product || item.product === product) &&
      (!docType || item.type === docType) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.animatedBackground}>
          {/* Server Rack */}
          <div className={styles.serverRack}>
            <div className={styles.serverNodes}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.serverNode}>
                  <div className={styles.serverLight} style={{ animationDelay: `${i * .2}s` }} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Data Center Visualization */}
          <div className={styles.dataCenter}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.serverTower} />
            ))}
          </div>
          
          {/* Animated File Transfers */}
          {transferFiles.map((file) => (
            <div
              key={file.id}
              className={styles.fileTransfer}
              style={{
                left: `${file.x}%`,
                top: `${file.progress}%`,
                transform: `rotate(${file.rotation}deg)`,
                opacity: file.opacity
              }}
            >
              <div className={styles.fileIcon}>{file.icon}</div>
              <div className={styles.fileType}>{file.type}</div>
              <div className={styles.fileSize}>{file.size}</div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </div>
          ))}
          
          {/* Network Connections */}
         
          
          {/* Animated Data Packets */}
          
        </div>
        
        <div className={styles.heroContent}>
          <h1>
            <span className={styles.titleGlow}>DOWNLOADS</span>
          </h1>
          <p>
            As your collaborative consultant in flexible space management, we want
            to provide you with the resources you need to efficiently specify the
            right product for the job.
          </p>
        </div>
      </section>

      <div className={styles.filters}>
        <select value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value="">Select Product</option>
          {uniqueValues('product').map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select value={docType} onChange={(e) => setDocType(e.target.value)}>
          <option value="">Type of Document</option>
          {uniqueValues('type').map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <button onClick={() => { setProduct(''); setDocType(''); setSearchTerm(''); }}>
          Clear All
        </button>

        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.table}>
        {filtered.map((item, index) => (
          <DownloadItemRow key={index} item={item} />
        ))}
      </div>
    </>
  );
}