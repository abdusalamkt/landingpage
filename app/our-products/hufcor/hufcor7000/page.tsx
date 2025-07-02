"use client";

import styles from "./hufcor7000.module.css";
import Header from "@/app/components/Header";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import DownloadSection from "@/app/components/DownloadSection";
import ContactUs from "@/app/components/ContactUs";

const featureList = [
  {
    title: "QUICK-SET™ FEATURES",
    content:
      "Retractable top and bottom seals require just a half turn of an operable handle for fast setup, eliminating partially activated seals.",
  },
  {
    title: "FRAME AND TRACK SYSTEM",
    content:
      "Anodized aluminum alloy 6063-T6 frames fully capture and protect the edges of the face material.\nTrack system tested for up to 100 miles (161 km) or about 10 years of use.",
  },
  {
    title: "PANEL AND TRACK CONFIGURATIONS",
    content:
      "Retractable seals and available in a wide array of decorative surfaces/finishes.\nAcoustic ratings up to STC 56 per ASTM E90.\nPanel configurations: Omni-directional, paired.\nTrack system options: Omni-directional, paired, manual trolleys, and electric continuously hinged.",
  },
  {
    title: "ADDITIONAL OPTIONS AND WARRANTY",
    content:
      "Variety of automation, safety, and accessory options.\nComplete system warranty for two years.",
  },
];

const choicesList = [
  {
    title: "PASS DOOR INCLUSION OPTIONS ",
    points: [
      "Wide range of colors and finishes",
      "Laminates",
      "wood veneers",
      "glass",
      "fabric","wood veneers",
      "glass",
      "fabric",
    ],
  },
  {
    title: "PANEL HEIGHTS",
    points: [
      "Custom heights up to 15ft",
      "Adjustable for ceiling constraints",
    ],
  },
  {
    title: "TRACK MOUNTING",
    points: [
      "Ceiling-suspended or floor-supported",
      "Flexible track routing configurations",
    ],
  },
];


export default function Hufcor7000Page() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContent}>
          <h1 className={styles.series}>
            7000 <span className={styles.red}>SERIES™</span>
          </h1>
          <p className={styles.description}>
            The Hufcor 7000 Series™ operable partitions is easy to operate and guarantees a high level of durability.
            With numerous choices in aesthetic and acoustic, this product will enhance your space to meet your functional
            and visual needs, while giving the flexibility to change it tomorrow. Architects and engineers in hotels,
            conference rooms, corporate offices and schools have trusted these.
          </p>
          <div className={styles.buttons}>
            <button className={styles.outline}>Download Catalog</button>
            <button className={styles.primary}>Send Inquiry</button>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src="/hufcor/600.jpg" alt="7000 Series Wall" />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionHeading}>
          <img src="/workforce1.png" alt="icon" className={styles.icon} />
          KEY <span className={styles.red}> FEATURES</span>
        </h2>

        {featureList.map((feature, index) => {
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
          {feature.title}
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
        {feature.content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </motion.div>
    </motion.div>
  );
})}

      </section>

      {/* Customization Section */}
      <section className={styles.customization}>
        <h2 className={styles.sectionHeading}>
          <img src="/workforce1.png" alt="icon" className={styles.icon} />
          customization <span className={styles.red}> options</span>
        </h2>
        <p className={styles.customText}>
          We offer a wide range of customization options for our Operable Walls 7000 Series™. Our technical team will
          help you incorporate these features in creating an end product that suits your needs.
        </p>

        <div className={styles.table}>
          <div className={styles.row}>
            <span>PANEL CONFIGURATION</span>
            <span className={styles.red}>OMNI | PAIRED</span>
          </div>
          <div className={styles.row}>
            <span>ACOUSTIC RATINGS</span>
            <span className={styles.red}>UP TO STC 56</span>
          </div>
          <div className={styles.row}>
            <span>ADA COMPLIANT PASS DOOR</span>
            <span className={styles.red}>SINGLE | DOUBLE</span>
          </div>
          <div className={styles.row}>
            <span>TRACK SYSTEMS</span>
            <span className={styles.red}>OMNI, MANUAL, ELECTRIC</span>
          </div>
          <div className={styles.row}>
            <span>TRACK SYSTEMS</span>
            <span className={styles.red}>OMNI, MANUAL, ELECTRIC</span>
          </div>
          <div className={styles.row}>
            <span>TRACK SYSTEMS</span>
            <span className={styles.red}>OMNI, MANUAL, ELECTRIC</span>
          </div>
        </div>
      </section>
      <section className={styles.panelConfig}>
  <h2 className={styles.panelConfigHeading}>
    PANEL <span>CONFIGURATION</span>
  </h2>

  <div className={styles.configGrid}>
    <div className={styles.configItem}>
      <div className={styles.mediaWrapper}>
        <img
          src="/idk-rock1.gif"
          alt="Omni-directional"
          className={styles.gif}
        />
        <div className={styles.overlay}>
          <h4>Omni-directional</h4>
        </div>
      </div>
    </div>

    <div className={styles.configItem}>
      <div className={styles.mediaWrapper}>
        <img
          src="/idk-rock1.gif"
          alt="Paired Panels"
          className={styles.gif}
        />
        <div className={styles.overlay}>
          <h4>Paired Panels</h4>
        </div>
      </div>
    </div>

    <div className={styles.configItem}>
      <div className={styles.mediaWrapper}>
        <img
          src="/idk-rock1.gif"
          alt="Electric Continuous"
          className={styles.gif}
        />
        <div className={styles.overlay}>
          <h4>Electric Continuous</h4>
        </div>
      </div>
    </div>
  </div>
</section>

<section className={styles.choices}>
  <h2 className={styles.sectionHeading}>
    <img src="/workforce1.png" alt="icon" className={styles.icon} />
    a choice to <span className={styles.red}>add</span>
  </h2>

 {choicesList.map((choice, index) => {
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
          {choice.title}
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
        {choice.points.map((point, i) => (
          <div key={i} className={styles.choicePoint}>
            {point}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
})}

</section>

<DownloadSection />
<ContactUs/>

    </div>
  );
}
