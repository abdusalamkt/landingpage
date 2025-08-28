'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useInView, motion } from "framer-motion";
import styles from "./acristaliaproduct.module.css";
import Header from "@/app/components/Header";
import DownloadSection from "@/app/components/DownloadSection";
// import ContactUs from "@/app/components/ContactUs";
import FaqSection from "@/app/components/FaqSection";
import WhatSetsUsApart from "@/app/components/WhatSetsUsApart";

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

// Add Choices interface
interface Choice {
  choiceTitle: string;
  choicePoints: Array<{
    point: string;
  }>;
}

interface CarouselItem {
  title: string;
  image?: { sourceUrl: string; altText?: string };
  description: string;
  points?: Array<{ point: string }>;
  buttonLabel?: string;
  buttonUrl?: string;
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
  keyFeatures: KeyFeatureGroup[];
  features?: Array<{
    featureTitle: string;
    featureContent: string;
  }>;
  description?: string;
  // Add choices field
  choices?: Choice[];
  glasscurtainproductoptionstitle?: string;
  carousel?: CarouselItem[];

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
// Carousel moved out but not lazy (keeps interactivity local)
const ProductCarousel = ({ carouselData, sectionTitle }: { carouselData: CarouselItem[]; sectionTitle: string }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselContainer}>
        <h2 className={styles.carouselHeading}>{sectionTitle}</h2>

        <div className={styles.carouselTabs}>
          {carouselData.map((product, index) => (
            <div key={index} className={styles.tabWrapper}>
              <button
                className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(index)}
                onMouseEnter={() => setHoveredTab(index)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {product.title}
              </button>
              <div className={styles.underlineContainer}>
                <div
                  className={`${styles.underline} ${activeTab === index ? styles.activeUnderline : ''} ${
                    hoveredTab === index ? styles.hoveredUnderline : ''
                  }`}
                ></div>
              </div>
              {index < carouselData.length - 1 && <div className={styles.tabSeparator}></div>}
            </div>
          ))}
        </div>

        <div className={styles.carouselContent}>
          {carouselData.map((product, index) => (
            <div
              key={index}
              className={`${styles.carouselSlide} ${activeTab === index ? styles.activeSlide : ''}`}
            >
              <div className={styles.carouselImage}>
                {product.image?.sourceUrl && (
                  <Image
  src={product.image.sourceUrl}
  alt={product.image?.altText || product.title}
  fill
  quality={90}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
  style={{ objectFit: 'cover', borderRadius: '10px' }}
  priority={index === 0}
/>

                )}
              </div>
              <div className={styles.carouselText}>
                <p>{product.description}</p>
                <ul className={styles.featureList}>
                  {product.points?.map((point, i) => (
                    <li key={i}>{point.point}</li>
                  ))}
                </ul>
                {product.buttonUrl && (
                  <a href={product.buttonUrl} style={{ alignSelf: 'center' }}>
                    <button className={styles.learnMoreBtn}>{product.buttonLabel || 'Learn More'}</button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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

  const safeKeyFeatures = Array.isArray(fields.keyFeatures) ? fields.keyFeatures : [];
  const safeFeatures = Array.isArray(fields.features) ? fields.features : [];
  const safeChoices = Array.isArray(fields.choices) ? fields.choices : [];
  const embedUrl = getYouTubeEmbedUrl(fields.videoLink);
    const carouselData = Array.isArray(fields.carousel) ? fields.carousel : [];
  const showCarousel = fields.glasscurtainproductoptionstitle && carouselData.length > 0;

  return (
    <div>
      <Header />

      {/* Hero Section */}
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
       {/* Carousel */}
      {showCarousel && <ProductCarousel carouselData={carouselData} sectionTitle={fields.glasscurtainproductoptionstitle || ''} />}

      {/* ✅ What Sets Us Apart (shared component) */}
       {safeFeatures.length > 0 && (
        <WhatSetsUsApart 
          features={safeFeatures}
          brand="blue" // You can set brand color for Acristalia
          description={fields.description}
        />
      )}

      
      {/* Key Features Section */}
       {safeKeyFeatures.length > 0 && (
        <section className={styles.keyFeaturesSection}>
          <h2 className={styles.sectionHeading}>
            <img src="/logos/key features.png" alt="icon" className={styles.icon} />
            KEY <span className={styles.red} style={{marginLeft:"10px"}} >FEATURES</span>
          </h2>

          {safeKeyFeatures.map((group, groupIndex) => (
            <KeyFeatureGroupComponent 
              key={groupIndex} 
              group={group} 
              groupIndex={groupIndex} 
            />
          ))}
        </section>
      )}
      {/* ✅ Choices Section for Acristalia */}
      {safeChoices.length > 0 && (
        <section className="apart-section">
          {/* Left Side */}
          <div className="apart-left">
            <div className="apart-bg-number">!</div>
            <h2 className="apart-heading">
              Be spoilt for  <span className="apart-highlight" style={{ color: "#0066B3" }}>choices!</span>
            </h2>
            <p className="apart-desc">
            </p>
          </div>

          {/* Right Side */}
          <div className="apart-right">
            <h3
              className="features-title"
              style={{
                background: "linear-gradient(269.42deg, #0066B3 0.16%, #004680 99.84%)",
              }}
            >
              <span className="features-bar" style={{ backgroundColor: "#0066B3" }} />
              AVAILABLE OPTIONS
            </h3>
          <div className="features-grid" style={{ display: "block" }}>

              {safeChoices.map((choice, index) => (
                <div key={index} className="feature-item" style={{ marginBottom: "2rem" }}>
                  <h4 style={{ color: "#0066B3" }}>{choice.choiceTitle}</h4>
                  <div className="choice-points-group">
                    {choice.choicePoints?.map((pt, i) => (
                      <span key={i} className="choice-point">
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


      {/* Download Section */}
      {downloadData.length > 0 && <DownloadSection downloadData={downloadData} theme="acristalia" />}

      {/* FAQ Section */}
      {faqData && <FaqSection faqData={faqData} theme="acristalia" />}
    </div>
  );
}