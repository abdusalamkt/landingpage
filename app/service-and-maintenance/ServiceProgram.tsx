'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import './serviceProgram.css';
import RequestServiceModal from "@/app/components/RequestServiceModal";

const services = [
  {
    number: 3,
    title: 'TRIANNUAL SERVICE',
    subtitle: '3 Maintenance Service Annually',
    recommended: true
  },
  {
    number: 2,
    title: 'HALF YEARLY SERVICE',
    subtitle: '2 Maintenance Service Annually',
    recommended: false
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
    <section className="service-program-wrapper">
      <motion.h2
        className="service-program-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        SERVICE AND MAINTENANCE <span className="highlight">PROGRAM!</span>
      </motion.h2>

      <motion.p
        className="service-program-description"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        We're here for you beyond installation, offering customizable Service and Maintenance packages to suit your needs. <br />
        Whether it's emergency support, part replacements, or aesthetic repairs, we've got you covered.
      </motion.p>

      <div className="service-card-container">
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
              className="service-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              variants={variants}
            >
              {item.recommended && (
                <div className="ribbon">
                  <span>RECOMMENDED</span>
                </div>
              )}
              <div className="program-number">{item.number}</div>
              <div className="service-card-content">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="service-button-group"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <button className="cta-button service-button" onClick={() => setModalOpen(true)}>
          REQUEST SERVICE
        </button>
        <button className="cta-button service-button">DOWNLOAD BROCHURE</button>
      </motion.div>

      {/* Render Modal */}
      <RequestServiceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}