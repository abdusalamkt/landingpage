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
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showDocTypeDropdown, setShowDocTypeDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const animationRef = useRef();
  const productDropdownRef = useRef();
  const docTypeDropdownRef = useRef();

  // Parse downloads and keep all entries (including duplicates) for proper filtering
  const parsedDownloads = (serverData?.downloads?.nodes || [])
    .flatMap((node) => {
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
    })
    .filter((item) => item.link); // Only filter out items without links

  const uniqueValues = (key) =>
    [...new Set(parsedDownloads.map((item) => item[key]))].filter(Boolean);

  const productOptions = uniqueValues("product");
  const docTypeOptions = uniqueValues("type");

  // Listen for modal state changes from DownloadItemRow
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    window.addEventListener('downloadModalOpen', handleModalOpen);
    window.addEventListener('downloadModalClose', handleModalClose);

    return () => {
      window.removeEventListener('downloadModalOpen', handleModalOpen);
      window.removeEventListener('downloadModalClose', handleModalClose);
    };
  }, []);

  // Background animation
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
          x: f.x,
        }));
      });
    };

    const initialFiles = Array.from({ length: 5 }, () => createFile());
    setTransferFiles(initialFiles);
    animationRef.current = setInterval(updateFiles, 30);
    return () => clearInterval(animationRef.current);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown-wrapper")) {
        setShowProductDropdown(false);
        setShowDocTypeDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Enhanced wheel event handling for dropdown scrolling
  useEffect(() => {
    const handleDropdownWheel = (dropdownRef, isOpen) => {
      if (!isOpen || !dropdownRef.current) return null;

      const handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = dropdownRef.current;
        const scrollTop = dropdown.scrollTop;
        const scrollHeight = dropdown.scrollHeight;
        const clientHeight = dropdown.clientHeight;
        
        // Calculate new scroll position
        const deltaY = e.deltaY;
        const newScrollTop = Math.max(0, Math.min(scrollHeight - clientHeight, scrollTop + deltaY));
        
        // Only scroll if there's somewhere to scroll
        if (newScrollTop !== scrollTop) {
          dropdown.scrollTop = newScrollTop;
        }
      };

      dropdownRef.current.addEventListener("wheel", handleWheel, { 
        passive: false,
        capture: true 
      });

      return () => {
        if (dropdownRef.current) {
          dropdownRef.current.removeEventListener("wheel", handleWheel, { capture: true });
        }
      };
    };

    // Set up wheel handlers for both dropdowns
    const cleanupProduct = handleDropdownWheel(productDropdownRef, showProductDropdown);
    const cleanupDocType = handleDropdownWheel(docTypeDropdownRef, showDocTypeDropdown);

    return () => {
      cleanupProduct?.();
      cleanupDocType?.();
    };
  }, [showProductDropdown, showDocTypeDropdown]);

  // Prevent body scroll when dropdowns or modal are open
  useEffect(() => {
    if (showProductDropdown || showDocTypeDropdown || isModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showProductDropdown, showDocTypeDropdown, isModalOpen]);

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
    const existingItem = acc.find((item) => item.link === current.link);
    if (!existingItem) {
      acc.push(current);
    }
    return acc;
  }, []);

  const handleClearAll = () => {
    setProduct("");
    setDocType("");
    setSearchTerm("");
    setShowProductDropdown(false);
    setShowDocTypeDropdown(false);
  };

  return (
    <div className={`${styles.pageContainer} ${isModalOpen ? styles.modalOpen : ''}`}>
      <div className={`${styles.headerContainer} ${isModalOpen ? styles.hidden : ''}`}>
        <Header />
      </div>
      
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

      <div className={`${styles.filters} ${(showProductDropdown || showDocTypeDropdown) ? styles.filtersExpanded : ''}`}>
        {/* Custom Product Dropdown */}
        <div className="custom-dropdown-wrapper">
          <div
            className={styles.customDropdown}
            onClick={() => {
              setShowProductDropdown(!showProductDropdown);
              setShowDocTypeDropdown(false);
            }}
          >
            {product || "Select Product"}
            <span className={styles.arrow}>
              {showProductDropdown ? "▲" : "▼"}
            </span>
          </div>

          {showProductDropdown && (
            <ul 
              ref={productDropdownRef}
              className={`${styles.customOptions} customOptions`}
            >
              <li
                onClick={() => {
                  setProduct("");
                  setShowProductDropdown(false);
                }}
                className={styles.clearOption}
              >
                All Products
              </li>
              {productOptions.map((p, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setProduct(p);
                    setShowProductDropdown(false);
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Custom Document Type */}
        <div className="custom-dropdown-wrapper">
          <div
            className={styles.customDropdown}
            onClick={() => {
              setShowDocTypeDropdown(!showDocTypeDropdown);
              setShowProductDropdown(false);
            }}
          >
            {docType || "Type of Document"}
            <span className={styles.arrow}>
              {showDocTypeDropdown ? "▲" : "▼"}
            </span>
          </div>

          {showDocTypeDropdown && (
            <ul 
              ref={docTypeDropdownRef}
              className={`${styles.customOptions} customOptions`}
            >
              <li
                onClick={() => {
                  setDocType("");
                  setShowDocTypeDropdown(false);
                }}
                className={styles.clearOption}
              >
                All Document Types
              </li>
              {docTypeOptions.map((t, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setDocType(t);
                    setShowDocTypeDropdown(false);
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={handleClearAll}>Clear All</button>

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
    </div>
  );
}