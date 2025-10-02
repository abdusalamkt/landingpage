'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './hplproduct.module.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SandwichPanelsComparison from './whySandwich';

// Add this component after the imports and before the main layout
const LockingOptionsSection = () => {
  const [activeCategory, setActiveCategory] = useState<'mechanical' | 'smart'>('mechanical');

  const mechanicalLocks = [
    {
      type: 'Key Cylinder Lock',
      description: 'Simple and reliable',
      icon: '🔑'
    },
    {
      type: 'Hasp Lock',
      description: 'Use with padlock for personal security',
      icon: '🔒'
    },
    {
      type: 'Combination Lock (Dial or Mechanical)',
      description: 'Keyless convenience',
      icon: '⌨️'
    },
    {
      type: 'Battery-Operated Digital Lock (Touch or Keypad)',
      description: 'Programmable codes, no wiring needed',
      icon: '🔋'
    }
  ];

  const smartLocks = [
    {
      type: 'Network / Wired Smart Locks',
      description: 'Cloud-connected, real-time monitoring & centralized control',
      icon: '🌐'
    },
    {
      type: 'Bluetooth Smart Locks',
      description: 'Unlock via mobile app, ideal for standalone or limited connectivity setups',
      icon: '📱'
    }
  ];

  return (
    <section className={styles.lockingOptionsSection}>
      <div className={styles.lockingHeader}>
        <div className={styles.headerWithIcon}>
          <svg className={styles.lockIcon} width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h2>SELECT YOUR <span className={styles.greenText}>LOCKING</span> OPTION</h2>
        </div>
        <p className={styles.lockingSubtitle}>ADDITIONAL LOCK OPTIONS AVAILABLE UPON REQUEST</p>
      </div>

      <div className={styles.lockingContentWrapper}>
        <div className={styles.lockingImageSection}>
          <div className={styles.lockingImage}>
            <Image
              src="/hpl/smartlocker.jpg"
              alt="Locker Systems with different lock options"
              width={1200}
              height={800}
              quality={90}
              style={{ objectFit: 'cover', width: '100%', height: '90vh', borderRadius: '12px' }}
            />
          </div>
        </div>

        <div className={styles.lockingOptionsContent}>
          <div className={styles.lockingCategorySection}>
            <h3 className={styles.categoryTitle}>MECHANICAL & BATTERY LOCK OPTIONS</h3>
            <ul className={styles.optionsList}>
              <li><strong>Key Cylinder Lock</strong> - Simple and reliable.</li>
              <li><strong>Hasp Lock</strong> - Use with padlock for personal security.</li>
              <li><strong>Combination Lock (Dial or Mechanical)</strong> - Keyless convenience.</li>
              <li><strong>Battery-Operated Digital Lock (Touch or Keypad)</strong> - Programmable codes, no wiring needed.</li>
            </ul>
          </div>

          <div className={styles.lockingCategorySection}>
            <h3 className={styles.categoryTitle}>SMART LOCK OPTIONS</h3>
            <div className={styles.smartLockItem}>
             <b>Network / Wired Smart Locks</b> 
              <ul className={styles.optionsList}>
                <li>Cloud-connected</li>
                <li>Real-time monitoring & centralized control</li>
              </ul>
            </div>
            <div className={styles.smartLockItem}>
              <b>Bluetooth Smart Locks</b>
              <ul className={styles.optionsList}>
                <li>Unlock via mobile app</li>
                <li>Ideal for standalone or limited connectivity setups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Comparison Data
const comparisonData = [
{
feature: 'Access',
traditional: 'Plumbing and electrical are concealed inside the wall and requires breaking or demolishing to access.',
ips: 'Our Integrated Panels open with hinges, gas lifts, or latches making it quick to access and easy to work on.',
},
{
feature: 'Durability',
traditional: 'Toilet cubicles are known to be high moisture areas and a traditional wall will succumb to moisture, mold, and cracking over time.',
ips: 'Our panels core USP is to resist moisture, impact, and daily wear making it far more durable than a traditional wall.',
},
{
feature: 'Finishes & Design',
traditional: 'Limited to paint, tiles, or cladding and often do not match the interiors of your cubicles.',
ips: 'Our panels give you a plethora of options to choose from. Be it laminate, glass, steel, acrylic or veneer you are in control of your interiors.',
},
{
feature: 'Installation Time',
traditional: 'Blockwork, plastering, curing, painting – all time-consuming processes.',
ips: 'Semi ready modular panels that are manufactured based on your dimensions and assembled & installed faster with minimal disruption.',
},
{
feature: 'Disruption in Busy Areas',
traditional: 'Repairs or modifications involve noise, dust, and days of downtime which are inconvenient in high-traffic facilities.',
ips: 'Panels can be removed or adjusted instantly. Even in busy washrooms, hospitals, or offices, work is completed quickly with minimal interruption.',
},
{
feature: 'Flexibility',
traditional: 'Fixed structure, difficult to modify or upgrade.',
ips: 'Modular system allows easy reconfiguration and future upgrades.',
},
{
feature: 'Cost Over Time',
traditional: 'Lower upfront cost, but high maintenance and repair expenses.',
ips: 'Significantly reduced long-term costs due to durability and ease of maintenance.',
},
];


const ComparisonSection = () => {
return (
<section className={styles.comparisonSection}>
<div className={styles.comparisonHeader}>
<h2>Why choose our IPS Panels over traditional walls for your cubicles?</h2>
<p>
Below are 7 reasons why you should no longer consider our IPS wall panels to hide your plumbing solution!
</p>
</div>


<div className={styles.tableWrapper}>
<table className={styles.comparisonTable}>
<thead>
<tr>
<th>Feature</th>
<th>Traditional Wall</th>
<th><h3>Integrated Panel System</h3></th>
</tr>
</thead>
<tbody>
{comparisonData.map((row, idx) => (
<tr key={idx}>
<td className={styles.featureCol}>{row.feature}</td>
<td className={styles.traditionalCol}>{row.traditional}</td>
<td className={styles.ipsCol}>{row.ips}</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
);
};

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
  currentSlug?: string;
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

// Main layout
export default function HplProductLayout({ fields, faqData = [], downloadData = [], currentSlug }: HplProductLayoutProps) {
  const safeFeatures = Array.isArray(fields.features) ? fields.features : [];
  const carouselData = Array.isArray(fields.carousel) ? fields.carousel : [];
  const showCarousel = fields.outdoorProductOptionsTitle && carouselData.length > 0;

  return (
    <div>

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
              fill
              priority
              quality={90}
              style={{ objectFit: 'cover', borderRadius: '20px 0 0 20px' }}
            />
          )}
        </div>
      </section>

      {/* Features */}
      {safeFeatures.length > 0 && (
        <WhatSetsUsApart features={safeFeatures} brand="green" description={fields.description} />
      )}

      {/*Models */}
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
                    width={1200}
                    height={1250}
                    quality={100}
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
      {currentSlug === 'integrated-panel-systems' && <ComparisonSection />}
      {currentSlug === 'locker-systems' && <LockingOptionsSection />}
      

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
              {/* <p className={styles.customDescription}>LEVEL UP YOUR WASHROOM SYSTEM WITH OUR SMART OPTIONS</p> */}
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
      {/* <SandwichPanelsComparison/> */}
      {/* Downloads */}
      {downloadData && downloadData.length > 0 && <DownloadSection downloadData={downloadData} theme="gibca" />}

      {/* FAQs */}
      {faqData && faqData.length > 0 && <FaqSection faqData={faqData} theme="gibca" />}
    </div>
  );
}