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

const tabs = ["Brochures", "Finishes", "Project Reference", "Specification"] as const;
type Tab = typeof tabs[number];

// Default fallback data (in case no data is passed)
const defaultDownloadData: Record<
  Tab,
  Array<{ title: string; link: string; gated: boolean }>
> = {
  Brochures: [
    { title: "GIBCA COMPANY PROFILE - BROCHURE", link: "/downloads/company-brochure.pdf", gated: false },
    { title: "ISO CERTIFICATE 9001 – QMS", link: "/downloads/iso-qms.pdf", gated: true },
  ],
  Finishes: [
    { title: "FINISHES SAMPLE SHEET", link: "/downloads/finishes.pdf", gated: false },
  ],
  "Project Reference": [
    { title: "RECENT PROJECTS SUMMARY", link: "/downloads/projects.pdf", gated: false },
  ],
  Specification: [
    { title: "PARTITION SPEC SHEET", link: "/downloads/spec.pdf", gated: true },
  ],
};

export default function DownloadSection({ downloadData }: DownloadSectionProps) {
  // Tell TS activeTab will always be one of the tab strings
  const [activeTab, setActiveTab] = useState<Tab>("Brochures");

  // Group the dynamic downloadData by fileType
  const processedDownloadData: Record<
    Tab,
    Array<{ title: string; link: string; gated: boolean }>
  > = {
    Brochures: [],
    Finishes: [],
    "Project Reference": [],
    Specification: [],
  };

  if (downloadData && downloadData.length > 0) {
    downloadData.forEach((item) => {
      const type = item.fileType?.trim() as Tab;
      if (type && tabs.includes(type) && item.filePdf?.sourceUrl) {
        processedDownloadData[type].push({
          title: item.fileTitle,
          link: item.filePdf.sourceUrl,
          gated: !!item.gated,
        });
      }
    });
  }

  const displayData = downloadData && downloadData.length > 0 ? processedDownloadData : defaultDownloadData;

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
        {displayData[activeTab]?.map((item, index) => (
          <DownloadItemRow key={index} item={item}  />
        ))}

        {(!displayData[activeTab] || displayData[activeTab].length === 0) && (
          <p className={styles.empty}>No downloads available in this category.</p>
        )}
      </div>
    </section>
  );
}
