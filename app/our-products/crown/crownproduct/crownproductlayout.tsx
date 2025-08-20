"use client";

import styles from "./crownproduct.module.css";
import { useEffect } from "react";
import DownloadSection from "@/app/components/DownloadSection";
// import ContactUs from "@/app/components/ContactUs";
import Image from "next/image";
import Header from "@/app/components/Header";
import { usePathname } from "next/navigation";
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

interface Feature {
  featureTitle: string;
  featureContent: string;
}

interface Specification {
  title: string;
  points: { points: string }[];
}

interface CrownProductProps {
  fields: {
    logo?: { sourceUrl: string; altText?: string };
    hero_title: string;
    hero_highlight: string;
    hero_description: string;
    hero_image: { sourceUrl: string; altText?: string };
    hero_button_1_label: string;
    hero_button_1_url: string;
    hero_button_2_label: string;
    hero_button_2_url: string;
    features: Feature[];
    customization_heading?: string;
    customization_options?: Specification[];
    imagebanner1?: { sourceUrl: string; altText?: string };
    imagebanner1Title?: string;
    description?: string;  // Added description field
  };
  faqData?: FaqData[];
  downloadData?: DownloadData[];
}

export default function CrownProductPage({ fields, faqData = [], downloadData = [] }: CrownProductProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const customization_heading = fields.customization_heading;
  const safeFeatures = Array.isArray(fields.features) ? fields.features : [];
  const safeCustomizationOptions = Array.isArray(fields.customization_options) ? fields.customization_options : [];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          {fields.logo?.sourceUrl && (
            <div className={styles.heroLogo}>
              <Image 
                src={fields.logo.sourceUrl} 
                alt={fields.logo.altText || 'Logo'} 
                width={220} 
                height={60} 
              />
            </div>
          )}
          <h1 className={styles.series}>
            {fields.hero_title} <span className={styles.red}>{fields.hero_highlight}</span>
          </h1>
          {fields.hero_description && <p className={styles.description}>{fields.hero_description}</p>}
          <div className={styles.buttons}>
            {fields.hero_button_1_label && fields.hero_button_1_url && (
              <a href={fields.hero_button_1_url} target="_blank" rel="noopener noreferrer">
                <button className={styles.outline}>{fields.hero_button_1_label}</button>
              </a>
            )}
            {fields.hero_button_2_label && fields.hero_button_2_url && (
              <a href={fields.hero_button_2_url} target="_blank" rel="noopener noreferrer">
                <button className={styles.primary}>{fields.hero_button_2_label}</button>
              </a>
            )}
          </div>
        </div>

        {fields.hero_image?.sourceUrl && (
          <div className={styles.imageWrapper}>
            <Image
              src={fields.hero_image.sourceUrl}
              alt={fields.hero_image.altText || 'Hero Image'}
              width={700}
              height={500}
              priority
            />
          </div>
        )}
      </section>

      {/* Features Section - Using WhatSetsUsApart component */}
      <WhatSetsUsApart 
        features={safeFeatures} 
        brand="brown" // Brown color for Crown products
        description={fields.description} // Pass the description from query
      />

      {/* Image Banner Section */}
      {fields.imagebanner1?.sourceUrl && (
        <section className={styles.imageBanner}>
          <div className={styles.imageBannerContainer}>
            <Image
              src={fields.imagebanner1.sourceUrl}
              alt={fields.imagebanner1.altText || 'Banner Image'}
              fill
              style={{ objectFit: 'cover' }}
            />
            {fields.imagebanner1Title && (
              <div className={styles.imageBannerCaption}>
                <p>{fields.imagebanner1Title}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Customization Options Section */}
      {safeCustomizationOptions.length > 0 && (
        <section className={styles.choices}>
          <div className={styles.choiceIntro}>
            <h2>Customization 
              <span className={styles.red}> Options</span> </h2>
            {customization_heading && (
              <p className={styles.choiceDescription}>
                {customization_heading}
              </p>
            )}
          </div>

          {safeCustomizationOptions.map((option, index) => (
            <div className={styles.choiceBlock} key={index}>
              <div className={styles.headingLineWrap}>
                <h3>{option.title}</h3>
                <div className={styles.line}></div>
              </div>
              <div className={styles.choicePointsWrap}>
                {option.points.map((opt, i) => (
                  <div className={styles.choicePoint} key={i}>
                    {opt.points}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Downloads, FAQ, Contact */}
       {downloadData.length > 0 && <DownloadSection downloadData={downloadData} theme="crown" />}
  
      {faqData && <FaqSection faqData={faqData} theme="crown" />}

    </div>
  );
}