'use client';

import React from 'react';
import Image from 'next/image';
import { useInView, motion } from "framer-motion";
import styles from "./acristaliaproduct.module.css";
import Header from "@/app/components/Header";
import DownloadSection from "@/app/components/DownloadSection";
import ContactUs from "@/app/components/ContactUs";
import FaqSection from "@/app/components/FaqSection";

interface MediaItem {
  sourceUrl: string;
  altText: string;
}

interface Feature {
  icon: MediaItem;
  title: string;
  description: string;
}

interface KeyFeatureGroup {
  imageBanner: MediaItem;
  features: Feature[];
}

interface Specification {
  title: string;
  points: { points: string }[];
}

interface AcristaliaData {
  logo: MediaItem;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage: MediaItem;
  heroButton1Label: string;
  heroButton2Label: string;
  heroButton1Url: string;
  heroButton2Url: string;
  videoLink: string;
  videoDescription: string;
  specifications: Specification[];
  keyFeatures: KeyFeatureGroup[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface AcristaliaProductLayoutProps {
  fields: AcristaliaData;
  faqData?: FAQItem[];
  downloadData?: any[];
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;

  let videoId = '';
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}` : url;
}

const SpecificationItem = ({ spec, index }: { spec: Specification; index: number }) => {
  const ref = React.useRef(null);
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

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={styles.keyFeatureCard}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {feature.icon?.sourceUrl && (
        <div className={styles.featureIcon}>
          <Image
            src={feature.icon.sourceUrl}
            alt={feature.icon.altText || "Feature Icon"}
            width={64}
            height={64}
          />
        </div>
      )}
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureDescription}>{feature.description}</p>
    </motion.div>
  );
};

const KeyFeatureGroupComponent = ({ group, groupIndex }: { group: KeyFeatureGroup; groupIndex: number }) => {
  const bannerRef = React.useRef(null);
  const bannerInView = useInView(bannerRef, { once: true, amount: 0.5 });

  return (
    <div className={styles.keyFeatureGroup}>
      {group.imageBanner?.sourceUrl && (
        <div className={styles.keyFeaturesBanner} ref={bannerRef}>
          <div className={styles.noiseOverlay}></div>
          <Image
            src={group.imageBanner.sourceUrl}
            alt={group.imageBanner.altText || `Key Features Banner ${groupIndex + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className={`${styles.bannerText} ${bannerInView ? styles.show : ""}`}>
            <span className={`${styles.word} ${styles.left}`}>KEY</span>
            <span className={`${styles.word} ${styles.bottom}`}>FEATURES</span>
            <span className={`${styles.word} ${styles.right}`}>GROUP </span>
          </div>
        </div>
      )}
      {group.features && group.features.length > 0 && (
        <div className={styles.keyFeaturesGrid}>
          {group.features.map((feature, index) => (
            <FeatureCard key={`${groupIndex}-${index}`} feature={feature} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AcristaliaProductLayout({
  fields,
  faqData = [],
  downloadData = [],
}: AcristaliaProductLayoutProps) {
  const safeSpecifications = Array.isArray(fields.specifications) ? fields.specifications : [];
  const safeKeyFeatures = Array.isArray(fields.keyFeatures) ? fields.keyFeatures : [];
  const embedUrl = getYouTubeEmbedUrl(fields.videoLink);

  return (
    <div>
      <Header />

      <section className={styles.hero}>
        <div className={styles.textContent}>
          {fields.logo?.sourceUrl && (
            <div className={styles.heroLogo}>
              <Image src={fields.logo.sourceUrl} alt={fields.logo.altText || "Logo"} width={220} height={60} />
            </div>
          )}
          <h1 className={styles.series}>
            {fields.heroTitle} <span className={styles.red}>{fields.heroHighlight}</span>
          </h1>
          {fields.heroDescription && <p className={styles.description}>{fields.heroDescription}</p>}
          <div className={styles.buttons}>
            {fields.heroButton1Label && fields.heroButton1Url && (
              <a href={fields.heroButton1Url} target="_blank" rel="noopener noreferrer">
                <button className={styles.outline}>{fields.heroButton1Label}</button>
              </a>
            )}
            {fields.heroButton2Label && fields.heroButton2Url && (
              <a href={fields.heroButton2Url} target="_blank" rel="noopener noreferrer">
                <button className={styles.primary}>{fields.heroButton2Label}</button>
              </a>
            )}
          </div>
        </div>

        {fields.heroImage?.sourceUrl && (
          <div className={styles.imageWrapper}>
            <Image src={fields.heroImage.sourceUrl} alt={fields.heroImage.altText || "Hero"} width={700} height={500} priority />
          </div>
        )}
      </section>

      {/* Video Section */}
      {embedUrl && (
        <>
          <div className={styles.fullscreenVideoSection}>
            <iframe
              src={`${embedUrl}&vq=hd720`}
              title="Acristalia Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoIframe}
            />
          </div>
          {fields.videoDescription && (
            <div className={styles.videoDescription}>
              <p>{fields.videoDescription}</p>
            </div>
          )}
        </>
      )}

      {/* Specifications Section */}
      {safeSpecifications.length > 0 && (
        <section className={styles.features}>
          <h2 className={styles.sectionHeading}>
            <img src="/workforce1.png" alt="icon" className={styles.icon} />
            SPECIFICATIONS
          </h2>
          {safeSpecifications.map((spec, index) => (
            <SpecificationItem key={index} spec={spec} index={index} />
          ))}
        </section>
      )}

      {/* Key Features Section */}
      <section className={styles.keyFeaturesSection}>
        <h2 className={styles.sectionHeading}>
          <img src="/workforce1.png" alt="icon" className={styles.icon} />
          KEY <span className={styles.red}>FEATURES</span>
        </h2>
        {safeKeyFeatures.length > 0 ? (
          safeKeyFeatures.map((group, groupIndex) => (
            <KeyFeatureGroupComponent key={groupIndex} group={group} groupIndex={groupIndex} />
          ))
        ) : (
          <div className={styles.noFeaturesMessage}>
            <p>Key features will be displayed here when available.</p>
          </div>
        )}
      </section>

      {/* Download Section with Acristalia theme */}
      {downloadData.length > 0 && <DownloadSection downloadData={downloadData} theme="acristalia" />}

      {/* FAQ Section with Acristalia theme */}
      {faqData && <FaqSection faqData={faqData} theme="acristalia" />}

      <ContactUs />
    </div>
  );
}