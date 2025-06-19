'use client';

import { motion } from 'framer-motion';
import './whatweoffer.css';

const offers = [
  {
    title: 'Free Partition Inspection',
    description: 'Start with a no-cost evaluation to assess the condition and performance of your movable partitions.'
  },
  {
    title: 'Maintenance & Repair Services',
    description: 'Complete maintenance and repair services for movable partitions to ensure optimal performance.'
  },
  {
    title: 'Panel & Finish Assessment',
    description: 'Thorough checks for alignment, leveling, and surface finishes to keep your partitions looking and functioning their best.'
  },
  {
    title: 'Partition or Track Replacement',
    description: 'Replace worn-out partitions or tracks with precision-fitted components tailored to your space.'
  },
  {
    title: 'Retrofit Solutions',
    description: 'Upgrade existing systems with retrofitting services to extend usability and modernize functionality.'
  },
  {
    title: 'Priority Scheduling',
    description: 'Enjoy fast-track service appointments to minimize disruption to your operations.'
  },
  {
    title: 'Seal Optimization',
    description: 'Adjust and secure operable seals, acoustic seals, and trims to ensure effective sound control.'
  },
  {
    title: 'Track & Trolley Maintenance',
    description: 'Clean and lubricate tracks, trolleys, and hinges to enhance mobility and reduce wear.'
  },
  {
    title: 'Component Adjustments',
    description: 'Fine-tune carrier bolts, seals, and other mechanical parts for smooth, safe operation.'
  }
];

export default function WhatWeOffer() {
  const getAnimation = (index: number) => {
    const column = index % 3;
    switch (column) {
      case 0: // Left column
        return { initial: { x: -80, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 1: // Center column
        return { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 } };
      case 2: // Right column
        return { initial: { x: 80, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      default:
        return {};
    }
  };

  return (
    <section className="offer-wrapper">
      <div className="offer-overlay" />

      <div className="offer-content">
        <motion.h2
          className="offer-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >What We
         <span className='highlight'> Offer!</span>  
        </motion.h2>

        <div className="offer-grid">
          {offers.map((item, index) => {
            const anim = getAnimation(index);
            return (
              <motion.div
                key={index}
                className="offer-card"
                initial={anim.initial}
                whileInView={anim.animate}
                transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.1 }, cursor: 'pointer' , boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 }, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'  }}
              >
                <h3 className="offer-card-title">{item.title}</h3>
                <p className="offer-card-description">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="offer-button-wrapper"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <button className="cta-button">Request Service</button>
        </motion.div>
      </div>
    </section>
  );
}
