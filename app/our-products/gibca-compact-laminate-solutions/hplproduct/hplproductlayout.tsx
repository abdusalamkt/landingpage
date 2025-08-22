'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './hplproduct.module.css';
import Header from '@/app/components/Header';

// Lazy-loaded sections
const WhatSetsUsApart = dynamic(() => import('@/app/components/WhatSetsUsApart'), {
  ssr: false,
  loading: () => <div style={{ minHeight: 100 }}>Loading features...</div>,
});

const DownloadSection = dynamic(() => import('@/app/components/DownloadSection'), {
  ssr: false,
  loading: () => <div style={{ minHeight: 100 }}>Loading downloads...</div>,
});

const FaqSection = dynamic(() => import('@/app/components/FaqSection'), {
  ssr: false,
  loading: () => <div style={{ minHeight: 100 }}>Loading FAQs...</div>,
});

// Types
interface Feature {
  featureTitle: string;
  featureContent: string;
}

interface Model {
  title: string;
  image?: { sourceUrl: string; altText?: string };
  description: string;
  button?: Array<{ buttonLabel: string; buttonUrl: string }>;
}

interface Finish {
  title: string;
  image?: { sourceUrl: string; altText?: string };
}

interface DesignOption {
  icon?: { sourceUrl: string; altText?: string };
  title: string;
  description: string;
}

interface CarouselItem {
  title: string;
  image?: { sourceUrl: string; altText?: string };
  description: string;
  points?: Array<{ point: string }>;
  buttonLabel?: string;
  buttonUrl?: string;
}

interface HplFields {
  logo?: { sourceUrl: string; altText?: string };
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage?: { sourceUrl: string; altText?: string };
  heroButton1Label?: string;
  heroButton2Label?: string;
  heroButton1Url?: string;
  heroButton2Url?: string;
  description?: string;
  features?: Feature[];
  modelsHeading?: string;
  models?: Model[];
  customizationHeading?: string;
  customizationDescription?: string;
  finishes?: Finish[];
  designOptions?: DesignOption[];
  outdoorProductOptionsTitle?: string;
  carousel?: CarouselItem[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface DownloadData {
  fileType: string;
  fileTitle: string;
  filePdf: { sourceUrl: string; title: string };
  gated: boolean;
}

interface HplProductLayoutProps {
  fields: HplFields;
  faqData?: FAQ[];
  downloadData?: DownloadData[];
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
                    width={600}
                    height={500}
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

// Main layout
export default function HplProductLayout({ fields, faqData = [], downloadData = [] }: HplProductLayoutProps) {
  const safeFeatures = Array.isArray(fields.features) ? fields.features : [];
  const carouselData = Array.isArray(fields.carousel) ? fields.carousel : [];
  const showCarousel = fields.outdoorProductOptionsTitle && carouselData.length > 0;

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          <div className={styles.heroLogo}>
            {fields.logo?.sourceUrl && (
              <Image src={fields.logo.sourceUrl} alt={fields.logo?.altText || 'Logo'} width={220} height={48} />
            )}
          </div>
          <h1 className={styles.series}>
            {fields.heroTitle}
            <span className={styles.red}>{fields.heroHighlight}</span>
          </h1>
          <p className={styles.description}>{fields.heroDescription}</p>
          <div className={styles.buttons}>
            {fields.heroButton1Url && (
              <a href={fields.heroButton1Url}>
                <button className={styles.outline}>{fields.heroButton1Label}</button>
              </a>
            )}
            {fields.heroButton2Url && (
              <a href={fields.heroButton2Url}>
                <button className={styles.primary}>{fields.heroButton2Label}</button>
              </a>
            )}
          </div>
        </div>
        <div className={styles.imageWrapper}>
          {fields.heroImage?.sourceUrl && (
            <Image
              src={fields.heroImage.sourceUrl}
              alt={fields.heroImage?.altText || 'Hero Image'}
              width={700}
              height={500}
              priority
            />
          )}
        </div>
      </section>

      {/* Features */}
      {safeFeatures.length > 0 && (
        <WhatSetsUsApart features={safeFeatures} brand="green" description={fields.description} />
      )}

      {/* Models */}
      {fields.models && fields.models.length > 0 && (
        <section className={styles.cubicleModels}>
          <h2 className={styles.sectionHeading}>
            <img src="/icon/hufcor/custom.png" alt="icon" className={styles.icon} />
            {fields.modelsHeading}
          </h2>
          <div className={styles.modelGrid}>
            {fields.models.map((model, idx) => (
              <div key={idx} className={styles.modelCard}>
                <h3>{model.title}</h3>
                {model.image?.sourceUrl && (
                  <Image
                    src={model.image.sourceUrl}
                    alt={model.image?.altText || model.title}
                    width={400}
                    height={250}
                  />
                )}
                <p>{model.description}</p>
                <div className={styles.modelButtons}>
                  {model.button && model.button.length > 0 && model.button[0].buttonUrl ? (
                    <a href={model.button[0].buttonUrl}>
                      <button className={styles.primary}>{model.button[0].buttonLabel || 'Read More'}</button>
                    </a>
                  ) : (
                    <button
                      className={styles.primary}
                      onClick={() => alert(`Read more about ${model.title}`)}
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customization Options */}
      {fields.customizationHeading && (
        <section className={styles.customizationOption}>
          <div className={styles.customizationHeader}>
            <h2>{fields.customizationHeading}</h2>
          </div>
          <p className={styles.customDescription}>{fields.customizationDescription}</p>

          {/* Finishes */}
          {fields.finishes && fields.finishes.length > 0 && (
            <div className={styles.finishesSection}>
              <div className={styles.customizationHeader}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '-20px' }}>CHOOSE FROM OUR DIFFERENT FINISHES</h2>
              </div>
              <p className={styles.customDescription}>CUSTOM FINISHES AVAILABLE UPON REQUEST</p>
              <div className={styles.finishes}>
                {fields.finishes.map((finish, idx) => (
                  <div key={idx} className={styles.finishCard}>
                    <p>{finish.title}</p>
                    <div className={styles.finishImageContainer}>
                      {finish.image?.sourceUrl && (
                        <Image
                          src={finish.image.sourceUrl}
                          alt={finish.image?.altText || finish.title}
                          width={200}
                          height={350}
                          className={styles.finishImage}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design Options */}
          {fields.designOptions && fields.designOptions.length > 0 && (
            <div className={styles.designOptionsSection}>
              <div className={styles.customizationHeader}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '-20px' }}>DIFFERENT DESIGN OPTIONS</h2>
              </div>
              <p className={styles.customDescription}>LEVEL UP YOUR CUBICLE WITH OUR SMART OPTIONS</p>
              <div className={styles.designOptions}>
                {fields.designOptions.map((opt, idx) => (
                  <div key={idx} className={styles.designOption}>
                    <div className={styles.designOptionIcon}>
                      {opt.icon?.sourceUrl && (
                        <Image
                          src={opt.icon.sourceUrl}
                          alt={opt.icon?.altText || opt.title}
                          width={300}
                          height={300}
                        />
                      )}
                    </div>
                    <h4>{opt.title}</h4>
                    <p>{opt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Carousel */}
      {showCarousel && <ProductCarousel carouselData={carouselData} sectionTitle={fields.outdoorProductOptionsTitle || ''} />}

      {/* Downloads */}
      {downloadData && downloadData.length > 0 && <DownloadSection downloadData={downloadData} theme="gibca" />}

      {/* FAQs */}
      {faqData && faqData.length > 0 && <FaqSection faqData={faqData} theme="gibca" />}
    </div>
  );
}
