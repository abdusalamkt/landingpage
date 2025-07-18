"use client";

import styles from "./hufcorproduct.module.css";
import { useEffect, useRef } from "react";
import { useInView, motion } from "framer-motion";
import DownloadSection from "@/app/components/DownloadSection";
import ContactUs from "@/app/components/ContactUs";
import Image from "next/image";
import Header from "@/app/components/Header";
import { usePathname } from "next/navigation";
import FinishesSection from '@/app/components/FinishesSection';



export default function HufcorProductLayout({ fields }: { fields: any }) {
  const pathname = usePathname();

  // ✅ Scroll to top whenever path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!fields) return <div>Invalid product data</div>;

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
    customizationRows,
    panelConfig,
    choices,
  } = fields;

  const safeFeatures = Array.isArray(features) ? features : [];
  const safeCustomizationRows = Array.isArray(customizationRows) ? customizationRows : [];
  const safePanelConfig = Array.isArray(panelConfig) ? panelConfig : [];
  const safeChoices = Array.isArray(choices) ? choices : [];

  const bannerRef = useRef(null);
const bannerInView = useInView(bannerRef, { once: true, amount: 0.5 });

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          <h1 className={styles.series}>
            {heroTitle} <span className={styles.red}>{heroHighlight}</span>
          </h1>
          <p className={styles.description}>{heroDescription}</p>
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

        <div className={styles.imageWrapper}>
          {heroImage?.sourceUrl && (
            <Image
              src={heroImage.sourceUrl}
              alt={heroImage.altText || ""}
              width={700}
              height={500}
              className={styles.heroImage}
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionHeading}>
          <img src="/workforce1.png" alt="icon" className={styles.icon} />
          KEY <span className={styles.red}> FEATURES</span>
        </h2>

        {safeFeatures.map((feature: any, index: number) => {
          const ref = useRef(null);
          const inView = useInView(ref, { once: true, margin: "-100px" });

          return (
            <motion.div
              ref={ref}
              key={index}
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
                  {feature.featureTitle}
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
                {feature.featureContent?.split("\n").map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </section>
        {/* image section */}
       <section className={styles.noiseBanner} ref={bannerRef}>
  <div className={styles.noiseOverlay}></div>
  <div className={`${styles.bannerText} ${bannerInView ? styles.show : ''}`}>
    <span className={`${styles.word} ${styles.left}`}>YOUR</span>
    <span className={`${styles.word} ${styles.bottom}`}>INNOVATION</span>
    <span className={`${styles.word} ${styles.right}`}>SPACE</span>
  </div>
</section>




      {/* Customization Section */}
      <section className={styles.customization}>
        <h2 className={styles.sectionHeading}>
          <img src="/workforce1.png" alt="icon" className={styles.icon} />
          customization <span className={styles.red}> options</span>
        </h2>
        <div className={styles.table}>
          {safeCustomizationRows.map((row: any, i: number) => (
            <div className={styles.row} key={i}>
              <span>{row.label}</span>
              <span className={styles.red}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Panel Config Section */}
      <section className={styles.panelConfig}>
        <h2 className={styles.panelConfigHeading}>
          PANEL <span>CONFIGURATION</span>
        </h2>
        <div className={styles.configGrid}>
          {safePanelConfig.map((item: any, i: number) => (
            <div className={styles.configItem} key={i}>
              <div className={styles.mediaWrapper}>
                <img
                  src={item.image?.sourceUrl || "/idk-rock1.gif"}
                  alt={item.image?.altText || ""}
                  className={styles.gif}
                />
                <div className={styles.overlay}>
                  <h4>{item.label}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
          <FinishesSection />

      {/* Choices Section */}
      <section className={styles.choices}>
        <h2 className={styles.sectionHeading}>
          <img src="/workforce1.png" alt="icon" className={styles.icon} />
          a choice to <span className={styles.red}>add</span>
        </h2>

        {safeChoices.map((choice: any, index: number) => {
          const ref = useRef(null);
          const inView = useInView(ref, { once: true, margin: "-100px" });

          return (
            <motion.div
              ref={ref}
              key={index}
              className={styles.choiceBlock}
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
                  {choice.choiceTitle}
                </motion.h3>
                <motion.div
                  className={styles.line}
                  initial={{ x: 50, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.1 }}
                />
              </div>
              <motion.div
                className={styles.choicePointsWrap}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
              >
                {choice.choicePoints?.map((pt: any, i: number) => (
                  <div key={i} className={styles.choicePoint}>
                    {pt.point}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </section>

      <DownloadSection />
      <ContactUs />
    </div>
  );
}
