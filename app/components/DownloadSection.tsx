"use client";

import { useState } from "react";
import styles from "./DownloadSection.module.css";
import DownloadItemRow from "./DownloadItemRow";

interface DownloadData {
  fileType: string;
  fileTitle: string;
  filePdf: {
    sourceUrl: string;
    title: string;
  };
  gated: boolean;
}

interface DownloadSectionProps {
  downloadData?: DownloadData[];
}

const tabs = ["Brochures", "Finishes", "Project Reference", "Specification"];

// Default download data as fallback
const defaultDownloadData = {
  Brochures: [
    { title: "GIBCA COMPANY PROFILE - BROCHURE", link: "/downloads/company-brochure.pdf", gated: false },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: false },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: true },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: false },
  ],
  Finishes: [ 
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: false },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: true },
  ],
  "Project Reference": [ 
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: false },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: false },
  ],
  Specification: [
    { title: "GIBCA COMPANY PROFILE - BROCHURE", link: "/downloads/company-brochure.pdf", gated: true },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: false },
  ],
};

export default function DownloadSection({ downloadData }: DownloadSectionProps) {
  const [activeTab, setActiveTab] = useState("Brochures");

  // Process download data to group by file type
  const processedDownloadData: { [key: string]: Array<{ title: string; link: string; gated: boolean }> } = {};
  
  if (downloadData && downloadData.length > 0) {
    // Initialize empty arrays for each tab
    tabs.forEach(tab => {
      processedDownloadData[tab] = [];
    });

    // Group downloads by file type
    downloadData.forEach((download) => {
      if (download.fileType && download.fileTitle && download.filePdf?.sourceUrl) {
        if (!processedDownloadData[download.fileType]) {
          processedDownloadData[download.fileType] = [];
        }
        processedDownloadData[download.fileType].push({
          title: download.fileTitle,
          link: download.filePdf.sourceUrl,
          gated: download.gated || false,
        });
      }
    });
  }

  // Use processed data if available, otherwise use default
  const displayDownloadData = downloadData && downloadData.length > 0 
    ? processedDownloadData 
    : defaultDownloadData;

  console.log('DownloadSection received downloadData:', downloadData);
  console.log('DownloadSection using displayDownloadData:', displayDownloadData);

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
        {displayDownloadData[activeTab]?.map((item, i) => (
          <DownloadItemRow key={i} item={item} />
        ))}

        {(!displayDownloadData[activeTab] || displayDownloadData[activeTab]?.length === 0) && (
          <p className={styles.empty}>No downloads available in this category.</p>
        )}
      </div>
    </section>
  );
}
