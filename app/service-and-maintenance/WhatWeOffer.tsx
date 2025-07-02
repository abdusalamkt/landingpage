'use client';

import { motion } from 'framer-motion';
import './whatweoffer.css';

type Offer = {
  title: string;
  description: string;
};

type Props = {
  offers: Offer[];
  heading: string;
};

export default function WhatWeOffer({ offers, heading }: Props) {
  const getAnimation = (index: number) => {
    const column = index % 3;
    switch (column) {
      case 0:
        return { initial: { x: -80, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 1:
        return { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 } };
      case 2:
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
>
  {(() => {
    const words = heading.trim().split(' ');
    const last = words.pop();
    return (
      <>
        {words.join(' ')}{' '}
        <span className="highlight">{last}</span>
      </>
    );
  })()}
</motion.h2>


        <div className="offer-grid">
          {offers?.map((item, index) => {
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
