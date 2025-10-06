'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./ServiceProgram.module.css";
import RequestServiceModal from "@/app/components/RequestServiceModal";

const services = [
  {
    number: 3,
    title: 'QUARTERLY SERVICE',
    subtitle: '3 Maintenance Service Annually',
    recommended: false
  },
  {
    number: 2,
    title: 'HALF YEARLY SERVICE',
    subtitle: '2 Maintenance Service Annually',
    recommended: true
  },
  {
    number: 1,
    title: 'ANNUAL SERVICE',
    subtitle: '1 Maintenance Service Annually',
    recommended: false
  }
];

export default function ServiceProgram() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className={styles.serviceProgramWrapper}>
      <motion.h2
        className={styles.serviceProgramTitle}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        SERVICE AND MAINTENANCE <span className="highlight">PROGRAM!</span>
      </motion.h2>

      <motion.p
        className={styles.serviceProgramDescription}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Get expert care of your partitions to get maximum performance and longevity with our Service and Maintenance packages! Whether it's emergency support, part replacements, or aesthetic repairs, Gibca has got you covered. 
      </motion.p>

      <div className={styles.serviceCardContainer}>
        {services.map((item, index) => {
          const variants = {
            hidden:
              index === 0
                ? { opacity: 0, x: -80 }
                : index === 1
                ? { opacity: 0, scale: 0.8 }
                : { opacity: 0, x: 80 },
            visible:
              index === 1
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, x: 0 }
          };

          return (
            <motion.div
              key={index}
              className={styles.serviceCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              variants={variants}
            >
              {item.recommended && (
                <div className={styles.ribbon}>
                  <span>RECOMMENDED</span>
                </div>
              )}
              <div className={styles.programNumber}>{item.number}</div>
              <div className={styles.serviceCardContent}>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className={styles.serviceButtonGroup}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <button className="cta-button serviceButton" onClick={() => setModalOpen(true)}>
          REQUEST SERVICE
        </button>
        <button
  className="cta-button serviceButton"
  onClick={() => window.location.href = '/contact-us'}
>
  SEND INQUIRY
</button>
      </motion.div>

      {/* Render Modal */}
      <RequestServiceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}