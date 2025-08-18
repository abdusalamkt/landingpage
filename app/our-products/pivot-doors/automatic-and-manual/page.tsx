"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import styles from "./automatic-and-manual.module.css";

interface HeroImage {
  sourceUrl: string;
  altText?: string;
}

interface ImageBanner {
  sourceUrl: string;
  altText?: string;
}

export default function AutomaticAndManualPage() {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Example static data (replace with props or fetch later)
  const heroTitle = "Automatic & Manual";
  const heroHighlight = "Pivot Doors";
  const heroDescription =
    "Our automatic and manual pivot doors combine precision engineering with seamless operation, offering unmatched design flexibility and performance.Our automatic and manual pivot doors combine precision engineering with seamless operation, offering unmatched design flexibility and performance.";
  const heroImage: HeroImage = {
    sourceUrl: "/PRODUCT SECTION/PIVOT DOORS.webp",
    altText: "Automatic & Manual Pivot Door",
  };
  const heroButton1Label = "Download Brochure";
  const heroButton1Url = "/downloads/pivot-doors-brochure.pdf";
  const heroButton2Label = "Get a Quote";
  const heroButton2Url = "/contact";

  const imagebanner1: ImageBanner = {
    sourceUrl: "/PRODUCT SECTION/PIVOT DOORS.webp",
    altText: "Pivot Door Banner 1",
  };
  const imagebanner1Title = "Precision Meets Style";

  const bannerRef = useRef(null);
  const bannerInView = useInView(bannerRef, { once: true, amount: 0.5 });
  const bannerRef1 = useRef(null);
  const bannerInView1 = useInView(bannerRef1, { once: true, amount: 0.5 });

  // Manual Pivot Door data
  const systems = [
    {
      title: "COMPACT",
      highlight: "SYSTEM",
      description:
        "This system is the most compact system: the hinge acts as a revolving point.",
      points: [
        "Double-swinging and 360° rotating doors",
        "No hold positions or closing function",
        "Adjustable closing speed of the door (soft close and back check)",
      ],
      image: "/896.jpg",
      reverse: false,
    },
    {
      title: "COMPACT H",
      highlight: "SYSTEM",
      description:
        "This system has three functions: rotation, closing, and hold positions. It can turn through 360° and is characterized by a hold position at every quarter of a circle.",
      points: [
        "Rotates 360° in both directions",
        "Hold positions at 0°, 90°, 180° and 270°",
        "Self-opening – door automatically moves from each 45° angle in the desired hold position to the next hold position",
        "Self-closing – door moves to rest in the desired hold position after a few movements",
      ],
      image: "/896.jpg",
      reverse: true,
    },
    {
      title: "CONFIGURA",
      highlight: "SYSTEM",
      description:
        "The system adds a new dimension to the pivot door by creating the ultimate smoothness in total control of the movement of the door.",
      points: [
        "Hold positions at 0°, 90° and 180°",
        "Self-closing from 120° and 170° – after opening the door returns automatically",
        "Door can be manually set to the hold position at 0° or 90°",
        "Adjustable closing damping (soft close)",
        "Adjustable hydraulic backcheck",
      ],
      image: "/896.jpg",
      reverse: false,
    },
  ];

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

      {/* Dynamic Image Banner 1 */}
      {imagebanner1?.sourceUrl?.trim() && (
        <section
          className={`${styles.noiseBanner} ${bannerInView ? styles.animate : ""}`}
          ref={bannerRef}
        >
          <div className={styles.noiseOverlay}></div>
          <Image
            src={imagebanner1.sourceUrl}
            alt={imagebanner1.altText || "Banner Image 1"}
            fill
            style={{ zIndex: -1, objectFit: "cover" }}
          />
          {typeof imagebanner1Title === "string" && imagebanner1Title.trim() !== "" && (
            <div className={styles.bannerCaption}>{imagebanner1Title}</div>
          )}
        </section>
      )}

      {/* Manual Pivot Door Section */}
      <section className={styles.pivotSection}>
        <div className={styles.sectionHeader}>
          <h2>MANUAL PIVOT DOOR</h2>
          <p>
            Our Automatic Pivot doors are a revolutionary design that allows for perfect pivot
            movement at the hinges, giving it an ultra-smooth and outstanding performance.
          </p>
        </div>

        {systems.map((sys, index) => (
          <div
            key={index}
            className={`${styles.systemBlock} ${sys.reverse ? styles.reverse : ""}`}
          >
            <div className={styles.manualImageWrapper}>
              <Image
                src={sys.image}
                alt={`${sys.title} ${sys.highlight}`}
                width={800}
                height={800}
              />
            </div>
            <div className={styles.textWrapper}>
              <h3>
                {sys.title} <span className={styles.highlight}>{sys.highlight}</span>
              </h3>
              <p className={styles.description}>{sys.description}</p>
              <ul>
                {sys.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
