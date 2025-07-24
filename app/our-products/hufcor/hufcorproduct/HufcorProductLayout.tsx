"use client";

import styles from "./hufcorproduct.module.css";
import { useEffect, useRef } from "react";
import { useInView, motion } from "framer-motion";
import DownloadSection from "@/app/components/DownloadSection";
import ContactUs from "@/app/components/ContactUs";
import Image from "next/image";
import Header from "@/app/components/Header";
import { usePathname } from "next/navigation";
import FinishesSection from "@/app/components/FinishesSection";
import FaqSection from "@/app/components/FaqSection";

interface FaqData {
  question: string;
  answer: string;
}

interface HufcorProductLayoutProps {
  fields: any;
  faqData?: FaqData[];
}

export default function HufcorProductLayout({ fields, faqData }: HufcorProductLayoutProps) {
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
    customizationOptionsDescription,
    panelConfig,
    finishes,
    choices,
    doorType,
    imagebanner1,
    imagebanner2,
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
      {(heroTitle || heroHighlight || heroDescription || heroImage?.sourceUrl?.trim()) && (
        <section className={styles.hero}>
          <div className={styles.textContent}>
            <h1 className={styles.series}>
              {heroTitle} <span className={styles.red}>{heroHighlight}</span>
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
                width={700}
                height={500}
                priority
                className={styles.heroImage}
              />
            </div>
          )}
        </section>
      )}

      {/* Features Section */}
      {safeFeatures.length > 0 && (
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
      )}

      {/* Dynamic Image Banner 1 */}
      {imagebanner1?.sourceUrl?.trim() && (
        <section className={styles.noiseBanner} ref={bannerRef}>
          <div className={styles.noiseOverlay}></div>
          <Image
            src={imagebanner1.sourceUrl}
            alt={imagebanner1.altText || "Banner Image 1"}
            fill
            style={{ objectFit: "cover", zIndex: -1 }}
          />
          <div className={`${styles.bannerText} ${bannerInView ? styles.show : ""}`}>
            <span className={`${styles.word} ${styles.left}`}>YOUR</span>
            <span className={`${styles.word} ${styles.bottom}`}>INNOVATION</span>
            <span className={`${styles.word} ${styles.right}`}>SPACE</span>
          </div>
        </section>
      )}

      {/* Customization Options Description */}
      {customizationOptionsDescription && (
        <section className={styles.customization}>
          <h2 className={styles.sectionHeading}>
            <img src="/workforce1.png" alt="icon" className={styles.icon} />
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
      {safeFinishes.length > 0 && <FinishesSection finishes={safeFinishes} />}

      {/* Pocket Door Options */}
      {safePocketDoors.length > 0 && (
        <section className={styles.pocketSection}>
          <h2 className={styles.sectionHeading}>
            <img src="/workforce1.png" alt="icon" className={styles.icon} />
            POCKET DOOR <span className={styles.red}>OPTIONS</span>
          </h2>
          <p className={styles.pocketDescription}>
            Hufcor's pocket doors conceal operable wall storage areas for a clean, refined look.
            They can match or complement surrounding finishes for seamless design integration.
          </p>
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

      {/* Dynamic Image Banner 2 */}
      {imagebanner2?.sourceUrl?.trim() && (
        <section className={styles.noiseBanner1} ref={bannerRef1}>
          <div className={styles.noiseOverlay}></div>
          <Image
            src={imagebanner2.sourceUrl}
            alt={imagebanner2.altText || "Banner Image 2"}
            fill
            style={{ objectFit: "cover", zIndex: -1 }}
          />
          <div className={`${styles.bannerText1} ${bannerInView1 ? styles.show : ""}`}>
            <span className={`${styles.word1} ${styles.left}`}>YOUR</span>
            <span className={`${styles.word1} ${styles.bottom}`}>INNOVATION</span>
            <span className={`${styles.word1} ${styles.right}`}>SPACE</span>
          </div>
        </section>
      )}

      {/* Choices Section */}
      {safeChoices.length > 0 && (
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
      )}

      {/* Download, FAQ, Contact */}
      <DownloadSection />
      {faqData && faqData.length > 0 && <FaqSection faqData={faqData} />}
      <ContactUs />
    </div>
  );
}
