"use client";

import { useState } from "react";
import styles from "./DownloadSection.module.css";

const tabs = ["Brochures", "Finishes", "Project Reference", "Specification"];

const downloadData = {
  Brochures: [
    { title: "GIBCA COMPANY PROFILE - BROCHURE", link: "/downloads/company-brochure.pdf" },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf" },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf" },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf" },
  ],
  Finishes: [],
  "Project Reference": [],
  Specification: [],
};

export default function DownloadSection() {
  const [activeTab, setActiveTab] = useState("Brochures");

  return (
    <section className={styles.downloadSection}>
      <h2 className={styles.heading}>
        DOWNLOADS <span className={styles.red}>SECTION</span>
      </h2>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {downloadData[activeTab]?.map((item, i) => (
          <div key={i} className={styles.downloadItem}>
            <p className={styles.title}>{item.title}</p>
            <a href={item.link} className={styles.downloadBtn} target="_blank" rel="noopener noreferrer">
              DOWNLOAD
            </a>
          </div>
        ))}

        {downloadData[activeTab]?.length === 0 && (
          <p className={styles.empty}>No downloads available in this category.</p>
        )}
      </div>
    </section>
  );
}
