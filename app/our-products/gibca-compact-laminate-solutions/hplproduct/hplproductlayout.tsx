'use client';

import React from 'react';
import Image from 'next/image';
import styles from './hplproduct.module.css';
import Header from '@/app/components/Header';
import WhatSetsUsApart from '@/app/components/WhatSetsUsApart';
import DownloadSection from '@/app/components/DownloadSection';
import FaqSection from '@/app/components/FaqSection';

interface Feature {
  featureTitle: string;
  featureContent: string;
}

interface Model {
  title: string;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
  description: string;
  button?: Array<{
    buttonLabel: string;
    buttonUrl: string;
  }>;
}

interface Finish {
  title: string;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
}

interface DesignOption {
  icon?: {
    sourceUrl: string;
    altText?: string;
  };
  title: string;
  description: string;
}

interface HplFields {
  logo?: {
    sourceUrl: string;
    altText?: string;
  };
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage?: {
    sourceUrl: string;
    altText?: string;
  };
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
}

interface FAQ {
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

interface HplProductLayoutProps {
  fields: HplFields;
  faqData?: FAQ[];
  downloadData?: DownloadData[];
}

export default function HplProductLayout({
  fields,
  faqData = [],
  downloadData = [],
}: HplProductLayoutProps) {
  const safeFeatures = Array.isArray(fields.features) ? fields.features : [];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          <div className={styles.heroLogo}>
            {fields.logo?.sourceUrl && (
              <Image
                src={fields.logo.sourceUrl}
                alt={fields.logo?.altText || 'Logo'}
                width={220}
                height={48}
              />
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
                <button className={styles.outline}>
                  {fields.heroButton1Label}
                </button>
              </a>
            )}
            {fields.heroButton2Url && (
              <a href={fields.heroButton2Url}>
                <button className={styles.primary}>
                  {fields.heroButton2Label}
                </button>
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

      {/* What Sets Us Apart Section */}
      <WhatSetsUsApart
        features={safeFeatures}
        brand="green"
        description={fields.description}
      />

      {/* Cubicle Models Section */}
      {fields.models && fields.models.length > 0 && (
        <section className={styles.cubicleModels}>
          <h2 className={styles.sectionHeading}>
            <img src="/workforce1.png" alt="icon" className={styles.icon} />
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
                      <button className={styles.primary}>
                        {model.button[0].buttonLabel || 'Read More'}
                      </button>
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

      {/* Customization Option Section */}
      {fields.customizationHeading && (
        <section className={styles.customizationOption}>
          <div className={styles.customizationHeader}>
            <div className={styles.customIconWrapper}>
              <img
                src="/workforce1.png"
                alt="Customization Icon"
                className={styles.customIcon}
              />
            </div>
            <h2>
              {fields.customizationHeading.split(' ')[0]}{' '}
              <span>{fields.customizationHeading.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>
          <p className={styles.customDescription}>
            {fields.customizationDescription}
          </p>

          {fields.finishes && (
            <div className={styles.step}>
              <h3>CHOOSE FROM OUR DIFFERENT FINISHES</h3>
              <p>CUSTOM FINISHES AVAILABLE UPON REQUEST</p>
              <div className={styles.finishes}>
                {fields.finishes.map((finish, idx) => (
                  <div key={idx} className={styles.finishCard}>
                    <p>{finish.title}</p>
                    {finish.image?.sourceUrl && (
                      <Image
                        src={finish.image.sourceUrl}
                        alt={finish.image?.altText || finish.title}
                        width={200}
                        height={150}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {fields.designOptions && (
            <div className={styles.step}>
              <h3>DIFFERENT DESIGN OPTIONS</h3>
              <p>AVAILABLE IN LARGE RANGE OF DECORS AND TEXTURE</p>
              <div className={styles.designOptions}>
                {fields.designOptions.map((opt, idx) => (
                  <div key={idx} className={styles.designOption}>
                    {opt.icon?.sourceUrl && (
                      <img
                        src={opt.icon.sourceUrl}
                        alt={opt.icon?.altText || opt.title}
                      />
                    )}
                    <h4>{opt.title}</h4>
                    <p>{opt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Downloads Section */}
      {downloadData && downloadData.length > 0 && (
        <DownloadSection downloadData={downloadData} theme="gibca" />
      )}

      {/* FAQ Section */}
      {faqData && faqData.length > 0 && (
        <FaqSection faqData={faqData} theme="gibca" />
      )}
    </div>
  );
}
