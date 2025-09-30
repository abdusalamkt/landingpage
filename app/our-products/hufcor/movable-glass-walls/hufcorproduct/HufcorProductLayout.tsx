"use client";

import styles from "./hufcorproduct.module.css";
import { useEffect, useRef } from "react";
import { useInView, motion } from "framer-motion";
import DownloadSection from "@/app/components/DownloadSection";
// import ContactUs from "@/app/components/ContactUs";
import Image from "next/image";
import Header from "@/app/components/Header";
import { usePathname } from "next/navigation";
import FinishesSection from "@/app/components/FinishesSection";
import FaqSection from "@/app/components/FaqSection";
import WhatSetsUsApart from "@/app/components/WhatSetsUsApart";
import SmartGlassSection from "./SmartGlassSection";

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

  return (
    <div>
      <Header />

      {/* Hero Section */}
      {/* Hero Section */}
{(heroTitle || heroHighlight || heroDescription || heroImage?.sourceUrl?.trim()) && (
  <section className={styles.hero}>
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
          quality={100}
          className={styles.heroImage}
        />
      </div>
    )}
  </section>
)}

      <WhatSetsUsApart 
        features={safeFeatures}
        brand="red" // Blue color for Hufcor products
        description={description} // Pass the description from query
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
        <section className={styles.customization}>
          <h2 className={styles.sectionHeading}>
            <img src="/icon/hufcor/custom.png" alt="icon" className={styles.icon} />
            customization <span className={styles.red}> options</span>
          </h2>
          <p className={styles.sectionDescription}>{customizationOptionsDescription}</p>
        </section>
      )}

      {/* Panel Configuration */}
      {safePanelConfig.length > 0 && (
        <section className={styles.panelConfig}>
          <h2 className={styles.panelConfigHeading}>
            PANEL <span>CONFIGURATION</span>
          </h2>
          <div className={styles.cardGrid}>
            {safePanelConfig.map((item: any, i: number) => (
              <div className={styles.card} key={i}>
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Finishes Section */}
      {safeFinishes.length > 0 && (
        <FinishesSection
          finishes={safeFinishes.map((finish) => ({
            ...finish,
            thumbnail: finish.thumbnail ?? { sourceUrl: "", altText: "" },
            panel: finish.panel ?? { sourceUrl: "", altText: "" },
          }))}
        />
      )}

      {/* Pocket Doors */}
      {safePocketDoors.length > 0 && (
        <section className={styles.pocketSection}>
          <h2 className={styles.sectionHeading} style={{ fontSize: "3.2rem" , marginBottom: "1rem" }}>
            {/* <img src="/workforce1.png" alt="icon" className={styles.icon} /> */}
            POCKET DOOR <span className={styles.red}>OPTIONS</span>
          </h2>
          <p className={styles.pocketDescription}>
Hufcor pocket doors keep operable walls storage out of sight, delivering a clean and refined aesthetic. Designed to match or complement surroundings, they enhance the flow and elegance of any space.          </p>
          <div className={styles.pocketGrid}>
            {safePocketDoors.map((item: any, i: number) => (
              <div key={i} className={styles.pocketCard}>
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Choices Section */}

{safeChoices.length > 0 && (
  <section className="apart-section-mirror">
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
        <SmartGlassSection />

      {/* Downloads / FAQ / Contact */}
      <DownloadSection downloadData={downloadData} />
      {faqData && faqData.length > 0 && <FaqSection faqData={faqData} />}
      {/* <ContactUs /> */}
    </div>
  );
}