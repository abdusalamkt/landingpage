'use client';

import { useState } from 'react';
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

export default function DownloadsPage() {
  const [product, setProduct] = useState('');
  const [docType, setDocType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
        <h1>DOWNLOADS</h1>
        <p>
          As your collaborative consultant in flexible space management, we want
          to provide you with the resources you need to efficiently specify the
          right product for the job.
        </p>
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
