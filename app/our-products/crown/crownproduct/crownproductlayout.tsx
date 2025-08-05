"use client";

import styles from "./crownproduct.module.css";
import { useEffect, useRef } from "react";
import { useInView, motion } from "framer-motion";
import DownloadSection from "@/app/components/DownloadSection";
import ContactUs from "@/app/components/ContactUs";
import Image from "next/image";
import Header from "@/app/components/Header";
import { usePathname } from "next/navigation";
import FaqSection from "@/app/components/FaqSection";

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
    key_features: Specification[];
    customization_heading?: string;
    customization_options?: Specification[];
  };
  faqData?: FaqData[];
  downloadData?: DownloadData[];
}

const KeyfeaturesItem = ({ spec, index }: { spec: Specification; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={styles.featureBlock}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.headingLineWrap}>
        <motion.h3
          initial={{ x: -50, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          {spec.title}
        </motion.h3>
        <motion.div
          className={styles.line}
          initial={{ x: 50, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.1 }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
      >
        <ul className={styles.specificationPoints}>
          {spec.points?.map((point, i) => (
            <li key={i}>{point.points}</li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default function CrownProductPage({ fields, faqData = [], downloadData = [] }: CrownProductProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
const customization_heading = fields.customization_heading;

  const safeKeyFeatures = Array.isArray(fields.key_features) ? fields.key_features : [];
  const safeCustomizationOptions = Array.isArray(fields.customization_options) ? fields.customization_options : [];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          {fields.logo?.sourceUrl && (
            <div className={styles.heroLogo}>
              <Image src={fields.logo.sourceUrl} alt={fields.logo.altText || 'Logo'} width={220} height={60} />
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

      {/* Features Section */}
      {safeKeyFeatures.length > 0 && (
        <section className={styles.features}>
          <h2 className={styles.sectionHeading}>
            <img src="/workforce1.png" alt="icon" className={styles.icon} />
            KEY <span className={styles.red}>FEATURES</span>
          </h2>
          {safeKeyFeatures.map((spec, index) => (
            <KeyfeaturesItem key={index} spec={spec} index={index} />
          ))}
        </section>
      )}

      {/* Customization Options Section */}
{safeCustomizationOptions.length > 0 && (
  <section className={styles.choices}>
    <div className={styles.choiceIntro}>
      <h2>Customization Options</h2>
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
      {downloadData.length > 0 && <DownloadSection downloadData={downloadData} />}
      {faqData.length > 0 && <FaqSection faqData={faqData} />}
      <ContactUs />
    </div>
  );
}
