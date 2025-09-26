"use client";

import styles from "./hufcorproduct.module.css";
import { useEffect, useRef, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import DownloadSection from "@/app/components/DownloadSection";
import Image from "next/image";
import Header from "@/app/components/Header";
import { usePathname } from "next/navigation";
import FinishesSection from "@/app/components/FinishesSection";
import FaqSection from "@/app/components/FaqSection";
import WhatSetsUsApart from "@/app/components/WhatSetsUsApart";

interface FaqData {
  question: string;
  answer: string;
}

interface DownloadData {
  fileType: string;
  fileTitle: string;
  filePdf: {
    sourceUrl: string;
    title: string;
  };
  gated: boolean;
}

interface HufcorProductLayoutProps {
  fields: {
    heroTitle?: string;
    heroHighlight?: string;
    heroDescription?: string;
    heroImage?: {
      sourceUrl: string;
      altText?: string;
    };
    heroButton1Label?: string;
    heroButton1Url?: string;
    heroButton2Label?: string;
    heroButton2Url?: string;
    features?: Array<{
      featureTitle: string;
      featureContent: string;
    }>;
    description?: string;
    customizationOptionsDescription?: string;
    panelConfig?: Array<{
      label: string;
      description: string;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
    }>;
    finishes?: Array<{
      label: string;
      thumbnail?: {
        sourceUrl: string;
        altText?: string;
      };
      panel?: {
        sourceUrl: string;
        altText?: string;
      };
    }>;
    doorType?: Array<{
      title: string;
      subTitle: string;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
    }>;
    imagebanner1?: {
      sourceUrl: string;
      altText?: string;
    };
    imagebanner2?: {
      sourceUrl: string;
      altText?: string;
    };
    imagebanner1Title?: string;
    imagebanner2Title?: string;
    choices?: Array<{
      choiceTitle: string;
      choicePoints: Array<{
        point: string;
      }>;
    }>;
  };
  faqData?: FaqData[];
  downloadData?: DownloadData[];
}

export default function HufcorProductLayout({ 
  fields, 
  faqData, 
  downloadData 
}: HufcorProductLayoutProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("panel");
  const [animationState, setAnimationState] = useState({
    activeTabPosition: 0,
    activeTabWidth: 0,
    initialLoad: true
  });
  
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const {
    heroTitle,
    heroHighlight,
    heroDescription,
    heroImage,
    heroButton1Label,
    heroButton1Url,
    heroButton2Label,
    heroButton2Url,
    features,
    description,
    customizationOptionsDescription,
    panelConfig,
    finishes,
    choices,
    doorType,
    imagebanner1,
    imagebanner2,
    imagebanner1Title,
    imagebanner2Title,
  } = fields || {};

  const safeFeatures = Array.isArray(features) ? features : [];
  const safePanelConfig = Array.isArray(panelConfig) ? panelConfig : [];
  const safeChoices = Array.isArray(choices) ? choices : [];
  const safePocketDoors = Array.isArray(doorType) ? doorType : [];
  const safeFinishes = Array.isArray(finishes) ? finishes : [];

  const bannerRef = useRef(null);
  const bannerInView = useInView(bannerRef, { once: true, amount: 0.5 });
  const bannerRef1 = useRef(null);
  const bannerInView1 = useInView(bannerRef1, { once: true, amount: 0.5 });
  
  useEffect(() => {
    // Set initial position for active tab indicator
    if (tabRefs.current[0] && animationState.initialLoad) {
      const activeTabElement = tabRefs.current[0];
      setAnimationState({
        activeTabPosition: activeTabElement.offsetLeft,
        activeTabWidth: activeTabElement.offsetWidth,
        initialLoad: false
      });
    }
  }, [animationState.initialLoad]);

  const handleTabChange = (tabId: string, index: number) => {
    const tabElement = tabRefs.current[index];
    if (tabElement) {
      setAnimationState({
        activeTabPosition: tabElement.offsetLeft,
        activeTabWidth: tabElement.offsetWidth,
        initialLoad: false
      });
    }
    setActiveTab(tabId);
  };

  return (
    <div>
      <Header />

      {/* Hero Section */}
      {(heroTitle || heroHighlight || heroDescription || heroImage?.sourceUrl?.trim()) && (
        <section className={styles.hero}>
          <div className={styles.textContent}>
            <h1 className={styles.series} >
              {heroTitle} <span className={styles.red} style={{marginLeft:"0px"}}>{heroHighlight}</span>
            </h1>

            {heroDescription && <p className={styles.description}>{heroDescription}</p>}
            <div className={styles.buttons}>
              {heroButton1Label && heroButton1Url && (
                <a href={heroButton1Url} target="_blank" rel="noopener noreferrer">
                  <button className={styles.outline}>{heroButton1Label}</button>
                </a>
              )}
              {heroButton2Label && heroButton2Url && (
                <a href={heroButton2Url} target="_blank" rel="noopener noreferrer">
                  <button className={styles.primary}>{heroButton2Label}</button>
                </a>
              )}
            </div>
          </div>

          {heroImage?.sourceUrl?.trim() && (
            <div className={styles.imageWrapper}>
              <Image
                src={heroImage.sourceUrl}
                alt={heroImage.altText || "Product Hero Image"}
                width={1400}
                height={1400}
                priority
                quality={90}
                className={styles.heroImage}
              />
            </div>
          )}
        </section>
      )}

      <WhatSetsUsApart 
        features={safeFeatures}
        brand="red"
        description={description}
      />

      {/* Dynamic Image Banner 1 */}
      {imagebanner1?.sourceUrl?.trim() && (
        <section className={styles.noiseBanner} ref={bannerRef}>
          <div className={styles.noiseOverlay}></div>
          <Image
            src={imagebanner1.sourceUrl}
            alt={imagebanner1.altText || "Banner Image 1"}
            fill
            quality={100}
            style={{zIndex: -1 ,objectFit: "cover"}}
          />
          {typeof imagebanner1Title === "string" && imagebanner1Title.trim() !== "" && (
            <div className={styles.bannerCaption}>{imagebanner1Title}</div>
          )}
        </section>
      )}

      {/* Customization Option */}
      {customizationOptionsDescription && (
        <section className={styles.customizationSection}>
          <div className={styles.customizationHeader}>
            <h2 className={styles.sectionHeading}>
              <img src="/icon/hufcor/custom.png" alt="icon" className={styles.icon} />
              customization <span className={styles.red}> options</span>
            </h2>
            {customizationOptionsDescription && (
              <p className={styles.sectionDescription}>{customizationOptionsDescription}</p>
            )}
          </div>

          <div className={styles.customizationTabs}>
            <div className={styles.tabsContainer}>
              {/* Left side - buttons */}
              <div className={styles.tabsSidebar}>
                <div className={styles.tabIndicator} 
                  style={{ 
                    transform: `translateX(${animationState.activeTabPosition}px)`,
                    width: `${animationState.activeTabWidth}px`
                  }} 
                />
                <button 
                  ref={el => { tabRefs.current[0] = el; }}
                  className={`${styles.tabButton} ${activeTab === "panel" ? styles.active : ""} ${styles.firstTab}`}
                  onClick={() => handleTabChange("panel", 0)}
                >
                  <span className={styles.tabLabel}>Panel Configuration</span>
                  <span className={styles.tabArrow}>&gt;</span>
                </button>
                <button 
                  ref={el => { tabRefs.current[1] = el; }}
                  className={`${styles.tabButton} ${activeTab === "finishes" ? styles.active : ""}`}
                  onClick={() => handleTabChange("finishes", 1)}
                >
                  <span className={styles.tabLabel}>Finishes</span>
                  <span className={styles.tabArrow}>&gt;</span>
                </button>
                <button 
                  ref={el => { tabRefs.current[2] = el; }}
                  className={`${styles.tabButton} ${activeTab === "pocket" ? styles.active : ""} ${styles.lastTab}`}
                  onClick={() => handleTabChange("pocket", 2)}
                >
                  <span className={styles.tabLabel}>Pocket Doors</span>
                  <span className={styles.tabArrow}>&gt;</span>
                </button>
              </div>
              
              {/* Right side - content */}
              <div className={styles.tabContentWrapper}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={styles.tabContent}
                  >
                    {activeTab === "panel" && safePanelConfig.length > 0 && (
                      <div className={styles.tabPanel}>
                        <div className={styles.cardGrid}>
                          {safePanelConfig.map((item: any, i: number) => (
                            <motion.div 
                              className={styles.card} 
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <h3 className={styles.cardTitle}>{item.label}</h3> 
                              <p className={styles.cardDesc}>{item.description}</p>
                              {item.image?.sourceUrl?.trim() && (
                                <div className={styles.imageWrapper1}>
                                  <img
                                    src={item.image.sourceUrl}
                                    alt={item.image.altText || "Panel Config Image"}
                                    className={styles.cardImage}
                                  />
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === "finishes" && safeFinishes.length > 0 && (
                      <div className={styles.tabPanel}>
                        <FinishesSection
                          finishes={safeFinishes.map((finish) => ({
                            ...finish,
                            thumbnail: finish.thumbnail ?? { sourceUrl: "", altText: "" },
                            panel: finish.panel ?? { sourceUrl: "", altText: "" },
                          }))}
                        />
                      </div>
                    )}
                    
                    {activeTab === "pocket" && safePocketDoors.length > 0 && (
                      <div className={styles.tabPanel}>
                        <div className={styles.pocketGrid}>
                          {safePocketDoors.map((item: any, i: number) => (
                            <motion.div 
                              key={i} 
                              className={styles.pocketCard}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <h3 className={styles.pocketTitle}>{item.title}</h3>
                              <p className={styles.pocketSubtitle}>{item.subTitle}</p>
                              {item.image?.sourceUrl?.trim() && (
                                <Image
                                  src={item.image.sourceUrl}
                                  alt={item.image.altText || "Pocket Door"}
                                  width={180}
                                  height={120}
                                />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Choices Section */}

{safeChoices.length > 0 && (
  <section className="apart-section-mirror" >
    {/* Left Side */}
    <div className="apart-left-mirror">
      <div className="apart-bg-number-mirror">!</div>
      <h2 className="apart-heading-mirror">
        Be spoilt for  <span className="apart-highlight" style={{ color: "#D72027" }}>choices!</span>
      </h2>
      <p className="apart-desc-mirror">
      </p>
    </div>

    {/* Right Side */}
    <div className="apart-right-mirror">
      <h3
        className="features-title-mirror"
        style={{
          background: "linear-gradient(269.42deg, #d72027 0.16%, #8e1217 99.84%)",
        }}
      >
        <span className="features-bar-mirror" style={{ backgroundColor: "#D72027" }} />
        AVAILABLE OPTIONS
      </h3>
     <div className="features-grid-mirror" style={{ display: "block" }}>

        {safeChoices.map((choice, index) => (
          <div key={index} className="feature-item-mirror" style={{ marginBottom: "2rem" }}>
            <h4 style={{ color: "#D72027" }}>{choice.choiceTitle}</h4>
            <div className="choice-points-group-mirror">
              {choice.choicePoints?.map((pt, i) => (
                <span key={i} className="choice-point-mirror">
                  {pt.point}
                  
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}


      {/* Dynamic Image Banner 2 */}
      {imagebanner2?.sourceUrl?.trim() && (
        <section className={styles.noiseBanner1} ref={bannerRef1}>
          <div className={styles.noiseOverlay}></div>
          <Image
            src={imagebanner2.sourceUrl}
            alt={imagebanner2.altText || "Banner Image 2"}
            fill
            quality={100}
            style={{ objectFit: "cover", zIndex: -1 }}
          />
          {typeof imagebanner2Title === "string" && imagebanner2Title.trim() !== "" && (
            <div className={styles.bannerCaption}>{imagebanner2Title}</div>
          )}
          
        </section>
      )}

      {/* Downloads / FAQ / Contact */}
      <DownloadSection downloadData={downloadData} />
      {Array.isArray(faqData) && faqData.length > 0 && (
        <FaqSection faqData={faqData} theme="hufcor" />
      )}
    </div>
  );
}