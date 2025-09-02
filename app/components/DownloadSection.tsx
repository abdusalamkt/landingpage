"use client";

import { useState, useEffect } from "react";
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
  theme?: 'hufcor' | 'acristalia' | 'default' | 'crown' | 'gibca';
}

const allTabs = ["Brochures", "Finishes", "Project Reference", "Specification","Technical Drawings"] as const;
type Tab = typeof allTabs[number];

const defaultDownloadData: Record<Tab, Array<{ title: string; link: string; gated: boolean }>> = {
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
  "Technical Drawings": [],
};

export default function DownloadSection({ downloadData, theme = 'default' }: DownloadSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  const processedDownloadData: Record<Tab, Array<{ title: string; link: string; gated: boolean }>> = {
    Brochures: [],
    Finishes: [],
    "Project Reference": [],
    Specification: [],
    "Technical Drawings":[],
  };

  if (downloadData && downloadData.length > 0) {
    downloadData.forEach((item) => {
      const type = item.fileType?.trim() as Tab;
      if (type && allTabs.includes(type) && item.filePdf?.sourceUrl) {
        processedDownloadData[type].push({
          title: item.fileTitle,
          link: item.filePdf.sourceUrl,
          gated: !!item.gated,
        });
      }
    });
  }

  const displayData = downloadData && downloadData.length > 0 ? processedDownloadData : defaultDownloadData;

  const availableTabs = allTabs.filter((tab) => displayData[tab]?.length > 0);

  useEffect(() => {
    if (!activeTab && availableTabs.length > 0) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const getThemeClass = () => {
    switch (theme) {
      case 'hufcor': return styles.hufcorTheme;
      case 'acristalia': return styles.acristaliaTheme;
      case 'crown': return styles.crownTheme;
      case 'gibca': return styles.gibcaTheme;
      default: return styles.defaultTheme;
    }
  };

  return (
    <section className={`${styles.downloadSection} ${getThemeClass()}`}>
      <h2 className={styles.heading}>
        DOWNLOADS <span className={styles.red}>SECTION</span>
      </h2>

      {availableTabs.length > 0 && (
        <>
          <div className={styles.tabs}>
            {availableTabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.active : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab && (
            <div className={styles.list}>
              {displayData[activeTab]?.map((item, index) => (
                <DownloadItemRow key={index} item={item} theme={theme} />
              ))}
              {(!displayData[activeTab] || displayData[activeTab].length === 0) && (
                <p className={styles.empty}>No downloads available in this category.</p>
              )}
            </div>
          )}
        </>
      )}

      {availableTabs.length === 0 && (
        <p className={styles.empty}>No downloads available at the moment.</p>
      )}
    </section>
  );
}
