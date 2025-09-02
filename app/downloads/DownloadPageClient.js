"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./downloads.module.css";
import Header from "../components/Header";
import DownloadItemRow from "../components/DownloadItemRow";

// Icons map
const fileIcons = {
  Brochures: "📄",
  Finishes: "🪵",
  "Project Reference": "📂",
  Specification: "📊",
};

export default function DownloadPageClient({ serverData }) {
  const [product, setProduct] = useState("");
  const [docType, setDocType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [transferFiles, setTransferFiles] = useState([]);
  const animationRef = useRef();

  // Parse downloads and keep all entries (including duplicates) for proper filtering
  const parsedDownloads = (serverData?.downloads?.nodes || []).flatMap((node) => {
    const productTitle = node.downloadFields?.product?.title || "";
    return (
      node.downloadFields?.productdownloads?.map((item) => ({
        title: item.filetitle,
        type: item.filetype,
        product: productTitle,
        link: item.filepdf?.sourceUrl,
        gated: item.gated,
      })) || []
    );
  }).filter(item => item.link); // Only filter out items without links

  const uniqueValues = (key) =>
    [...new Set(parsedDownloads.map((item) => item[key]))].filter(Boolean);

  useEffect(() => {
    const createFile = () => {
      const types = Object.keys(fileIcons);
      const type = types[Math.floor(Math.random() * types.length)];
      const size = (0.5 + Math.random() * 4.5).toFixed(1);

      return {
        id: Date.now() + Math.random(),
        type,
        icon: fileIcons[type],
        size: `${size}MB`,
        progress: 0,
        x: Math.random() * 80 + 10,
        speed: 0.2 + Math.random() * 2,
        rotation: Math.random() * 30 - 15,
        opacity: 0.7 + Math.random() * 0.3,
        direction: Math.random() > 0.5 ? 1 : -1,
      };
    };

    const updateFiles = () => {
      setTransferFiles((prevFiles) => {
        let files = prevFiles.filter((f) => f.progress < 100);
        if (files.length < 10 && Math.random() > 0.7) {
          files = [...files, createFile()];
        }
        return files.map((f) => ({
          ...f,
          progress: Math.min(f.progress + f.speed, 100),
          x: f.x + (Math.random() - 0.1) * 0 * f.direction,
        }));
      });
    };

    const initialFiles = Array.from({ length: 5 }, () => createFile());
    setTransferFiles(initialFiles);
    animationRef.current = setInterval(updateFiles, 30);
    return () => clearInterval(animationRef.current);
  }, []);

  // Filter the parsed downloads (with duplicates for proper filtering)
  const filtered = parsedDownloads.filter((item) => {
    return (
      (!product || item.product === product) &&
      (!docType || item.type === docType) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Remove duplicates from filtered results for display (based on link URL)
  const uniqueFiltered = filtered.reduce((acc, current) => {
    const existingItem = acc.find(item => item.link === current.link);
    
    if (!existingItem) {
      // New unique file - add it
      acc.push(current);
    }
    // If duplicate exists, keep the first occurrence only
    
    return acc;
  }, []);

  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.animatedBackground}>
          {transferFiles.map((file) => (
            <div
              key={file.id}
              className={styles.fileTransfer}
              style={{
                left: `${file.x}%`,
                top: `${file.progress}%`,
                transform: `rotate(${file.rotation}deg)`,
                opacity: file.opacity,
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
        </div>
        <div className={styles.heroContent}>
          <h1>
            <span className={styles.titleGlow}>DOWNLOADS</span>
          </h1>
          <p>
            As your collaborative consultant in flexible space management, we
            want to provide you with the resources you need to efficiently
            specify the right product for the job.
          </p>
        </div>
      </section>

      <div className={styles.filters}>
        <select value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value="">Select Product</option>
          {uniqueValues("product").map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select value={docType} onChange={(e) => setDocType(e.target.value)}>
          <option value="">Type of Document</option>
          {uniqueValues("type").map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button onClick={() => {
          setProduct("");
          setDocType("");
          setSearchTerm("");
        }}>
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
        {uniqueFiltered.map((item, index) => (
          <DownloadItemRow key={`${item.link}-${index}`} item={item} />
        ))}
      </div>
    </>
  );
}