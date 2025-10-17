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
  const [passTab, setPassTab] = useState("single");
  const [animationState, setAnimationState] = useState({
    activeTabPosition: 0,
    activeTabWidth: 0,
    initialLoad: true
  });
  
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
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
    <div className={styles.container}>
      <Header />

      {/* Hero Section */}
      {(heroTitle || heroHighlight || heroDescription || heroImage?.sourceUrl?.trim()) && (
        <section className={`${styles.hero} ${isMobile ? styles.mobileHero : ''} ${isTablet ? styles.tabletHero : ''}`}>
          <div className={styles.textContent}>
            <h1 className={styles.series}>
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
        <section className={`${styles.noiseBanner} ${isMobile ? styles.mobileNoiseBanner : ''} ${isTablet ? styles.tabletNoiseBanner : ''}`} ref={bannerRef}>
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
        <section className={`${styles.customizationSection} ${isMobile ? styles.mobileCustomization : ''} ${isTablet ? styles.tabletCustomization : ''}`}>
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
            <div className={`${styles.tabsContainer} ${isMobile ? styles.mobileTabsContainer : ''} ${isTablet ? styles.tabletTabsContainer : ''}`}>
              {/* Left side - buttons */}
              <div className={`${styles.tabsSidebar} ${isMobile ? styles.mobileTabsSidebar : ''} ${isTablet ? styles.tabletTabsSidebar : ''}`}>
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
                  className={`${styles.tabButton} ${activeTab === "passdoor" ? styles.active : ""}`}
                  onClick={() => handleTabChange("passdoor", 2)}
                >
                  <span className={styles.tabLabel}>Pass Door</span>
                  <span className={styles.tabArrow}>&gt;</span>
                </button>
                <button 
                  ref={el => { tabRefs.current[3] = el; }}
                  className={`${styles.tabButton} ${activeTab === "pocket" ? styles.active : ""} ${styles.lastTab}`}
                  onClick={() => handleTabChange("pocket", 3)}
                >
                  <span className={styles.tabLabel}>Pocket Doors</span>
                  <span className={styles.tabArrow}>&gt;</span>
                </button>
              </div>
              
              {/* Right side - content */}
              <div className={`${styles.tabContentWrapper} ${isMobile ? styles.mobileTabContent : ''} ${isTablet ? styles.tabletTabContent : ''}`}>
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
                        <div className={`${styles.cardGrid} ${isMobile ? styles.mobileCardGrid : ''} ${isTablet ? styles.tabletCardGrid : ''}`}>
                          {safePanelConfig.map((item: any, i: number) => (
                            <motion.div 
                              className={`${styles.card} ${isMobile ? styles.mobileCard : ''}`} 
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
                    
                   {activeTab === "passdoor" && (
  <div className={styles.tabPanel}>
    <div className={styles.passTabsWrapper}>
      <div className={styles.passTabsHeader}>
        <button
          className={`${styles.passTab} ${passTab === "single" ? styles.passTabActive : ""}`}
          onClick={() => setPassTab("single")}
        >
          Single Leaf
        </button>
        <button
          className={`${styles.passTab} ${passTab === "double" ? styles.passTabActive : ""}`}
          onClick={() => setPassTab("double")}
        >
          Double Leaf
        </button>
        <button
          className={`${styles.passTab} ${passTab === "accessories" ? styles.passTabActive : ""}`}
          onClick={() => setPassTab("accessories")}
        >
          Accessories
        </button>
      </div>

      <div className={styles.passTabContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={passTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* --- Single Leaf --- */}
            {passTab === "single" && (
              <div className={styles.passContentArea}>
                <div className={styles.passImageContainer}>
                  <img src="/hufcor/passdoor/singleleaf.webp" alt="Single Leaf Pass Door" />
                </div>
                {/* <h3 className={styles.passContentTitle}>Single Pass Door Configuration</h3> */}
                <p className={styles.passContentDesc}>
                  Compact, elegant, and efficient — our single pass doors offer seamless access 
                  without compromising the aesthetics of your partition system.
                </p>

               
              </div>
            )}

            {/* --- Double Leaf --- */}
            {passTab === "double" && (
              <div className={styles.passContentArea}>
                <div className={styles.passImageContainer}>
                  <img src="/hufcor/passdoor/doubleleaf.webp" alt="Double Leaf Pass Door" />
                </div>
                {/* <h3 className={styles.passContentTitle}>Double Pass Door Configuration</h3> */}
                <p className={styles.passContentDesc}>
                  Double pass doors provide a wider and more flexible entryway, ideal for high-traffic 
                  areas with synchronized leaf movement for a grander feel.
                </p>
              </div>
            )}

            {/* --- Accessories --- */}
            {passTab === "accessories" && (
              <div className={styles.accessoriesWrapper}>
                {/* <h3 className={styles.passContentTitle}>Pass Door Accessories</h3> */}
                {/* <p className={styles.passContentDesc}>
                  Enhance your pass door functionality and aesthetics with our premium accessories.
                </p> */}

                <div className={styles.accessoryGrid}>
                  {[
                    { title: "EXIT SIGNS", img: "" },
                    { title: "FRAME", img: "/images/accessories/kick-plate.jpg" },
                    // { title: "PEEP VIEWER", img: "/images/accessories/vision-panel.jpg" },
                    { title: "FRAME AND PREP FOR A WINDOW", img: "/images/accessories/auto-closer.jpg" },
                    { title: "AUTOMATIC DOOR CLOSERS", img: "/images/accessories/threshold.jpg" },
                    { title: "PANIC HARDWARE", img: "/images/accessories/acoustic-seal.jpg" },
                    { title: "LOCKS", img: "/images/accessories/custom-finish.jpg" },
                  ].map((item, idx) => (
                    <div key={idx} className={styles.accessoryCard}>
                      <div className={styles.accessoryText}>{item.title}</div>
                      <div
                        className={styles.accessoryImage}
                        style={{ backgroundImage: `url(${item.img})` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
)}

                    {activeTab === "pocket" && safePocketDoors.length > 0 && (
                      <div className={styles.tabPanel}>
                        <div className={`${styles.pocketGrid} ${isMobile ? styles.mobilePocketGrid : ''} ${isTablet ? styles.tabletPocketGrid : ''}`}>
                          {safePocketDoors.map((item: any, i: number) => (
                            <motion.div 
                              key={i} 
                              className={`${styles.pocketCard} ${isMobile ? styles.mobilePocketCard : ''}`}
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
                                  width={isMobile ? 120 : 180}
                                  height={isMobile ? 80 : 120}
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

      

      {/* Dynamic Image Banner 2 */}
      {imagebanner2?.sourceUrl?.trim() && (
        <section className={`${styles.noiseBanner1} ${isMobile ? styles.mobileNoiseBanner : ''} ${isTablet ? styles.tabletNoiseBanner : ''}`} ref={bannerRef1}>
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