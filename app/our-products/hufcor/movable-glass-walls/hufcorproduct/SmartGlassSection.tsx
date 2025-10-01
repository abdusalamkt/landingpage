"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./hufcorproduct.module.css";

const SmartGlassSection = () => {
  const [isOpaque, setIsOpaque] = useState(false);
  const pathname = usePathname();

  // Define image sets for each page
  const acousticImages = {
    transparent: "/hufcor/smartglass/acoustic-transparent.png",
    opaque: "/hufcor/smartglass/acoustic-opaque.png",
  };

  const framelessImages = {
    transparent: "/hufcor/smartglass/frameless-transparent.jpg",
    opaque: "/hufcor/smartglass/frameless-opaque.jpg",
  };

  const weatherResistantImages = {
    transparent: "/hufcor/smartglass/weather-transparent.webp",
    opaque: "/hufcor/smartglass/weather-opaque.webp",
  };

  // Pick the correct image set based on the current page
  let currentImages = framelessImages; // default fallback
  if (pathname && pathname.includes("acoustic-glass-walls")) {
    currentImages = acousticImages;
  } else if (pathname && pathname.includes("frameless-glass-walls")) {
    currentImages = framelessImages;
  } else if (pathname && pathname.includes("weather-resistant-glass-walls")) {
    currentImages = weatherResistantImages;
  }

  return (
    <section className={styles.smartGlassSection}>
      <div className={styles.smartGlassContainer}>
        <h2 className={styles.sectionHeading}>
          <span className={styles.red}>Smart Glass</span> Technology
        </h2>

        <p className={styles.sectionDescription}>
          Experience the future of privacy with our innovative smart glass
          technology. With the simple click of a button, transform transparent
          glass into a private, opaque surface instantly.
        </p>

        <div className={styles.smartGlassContent}>
          {/* Left Column - Remote Control */}
          <div className={styles.remoteColumn}>
            <motion.div
              className={styles.remoteControl}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.remoteTop}>
                <div className={styles.remoteIndicator}>
                  <div
                    className={`${styles.indicatorLight} ${
                      isOpaque ? styles.active : ""
                    }`}
                  ></div>
                  <span>Power</span>
                </div>
              </div>

              <div className={styles.remoteDisplay}>
                <div className={styles.remoteStatus}>
                  <span>GLASS MODE</span>
                  <div className={styles.statusValue}>
                    {isOpaque ? "OPAQUE" : "CLEAR"}
                  </div>
                </div>
              </div>

              <div className={styles.remoteButtons}>
                <motion.button
                  className={styles.remoteButton}
                  onClick={() => setIsOpaque(false)}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(0,150,255,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.buttonIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12H4M12 2V4M20 12H22M12 20V22M6.34 6.34L4.93 4.93M19.07 4.93L17.66 6.34"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  CLEAR
                </motion.button>

                <motion.button
                  className={`${styles.remoteButton} ${styles.redButton}`}
                  onClick={() => setIsOpaque(true)}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(215,32,39,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.buttonIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.875 18.825C13.2565 19.0617 12.5948 19.1575 11.9349 19.1057C11.275 19.0539 10.6354 18.8558 10.0658 18.5272C9.49612 18.1986 9.01216 17.7489 8.65291 17.2149C8.29366 16.6809 8.06901 16.0773 8.00001 15.45"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.125 5.17501C10.7435 4.93831 11.4052 4.84248 12.0651 4.8943C12.725 4.94612 13.3646 5.14422 13.9342 5.47281C14.5039 5.8014 14.9878 6.25112 15.3471 6.78513C15.7063 7.31914 15.931 7.92275 16 8.55001"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19.5 19.5L4.5 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  PRIVATE
                </motion.button>
              </div>

              <div className={styles.remoteBottom}>
                <div className={styles.brandLogo}>Hufcor</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Glass Images */}
          <div className={styles.glassColumn}>
            <div className={styles.glassImagesContainer}>
              <div
                className={styles.glassImageWrapper}
                style={{ display: isOpaque ? "none" : "block" }}
              >
                <Image
                  src={currentImages.transparent}
                  alt="Transparent Smart Glass"
                  fill
                  className={styles.glassImage}
                />
              </div>

              <div
                className={styles.glassImageWrapper}
                style={{ display: isOpaque ? "block" : "none" }}
              >
                <Image
                  src={currentImages.opaque}
                  alt="Opaque Smart Glass"
                  fill
                  className={styles.glassImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartGlassSection;
