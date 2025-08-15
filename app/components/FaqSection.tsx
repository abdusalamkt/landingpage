'use client';

import { useState } from 'react';
import styles from './FaqSection.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqData {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqData?: FaqData[];
  theme?: 'hufcor' | 'acristalia' | 'default' | 'crown' | 'gibca';
}

const defaultFaqData = [
  { question: 'Where is Gibca Furniture Main Office?', answer: 'Hufcor\'s pocket doors conceal operable wall storage areas...' },
  { question: 'What is the difference between 7000 series and 600 series?', answer: 'Hufcor\'s pocket doors conceal operable wall storage areas...' },
  { question: 'What is a pocket door?', answer: 'Hufcor\'s pocket doors conceal operable wall storage areas...' },
  { question: 'Do you have another walls aside from operable walls?', answer: 'Hufcor\'s pocket doors conceal operable wall storage areas...' },
  { question: 'What is the difference between 7000 series and 600 series?', answer: 'Hufcor\'s pocket doors conceal operable wall storage areas...' },
  { question: 'Extra Question 1', answer: 'Extra answer...' },
  { question: 'Extra Question 2', answer: 'Extra answer...' },
];

export default function FaqSection({ faqData, theme = 'default' }: FaqSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const displayFaqData = faqData && faqData.length > 0 ? faqData : defaultFaqData;

  const toggleIndex = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'hufcor': return styles.hufcorTheme;
      case 'acristalia': return styles.acristaliaTheme;
      case 'crown': return styles.crownTheme;
      case 'gibca': return styles.gibcaTheme;
      default: return styles.defaultTheme;
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case 'hufcor': return '#e63946';
      case 'acristalia': return '#1898D3';
      case 'crown': return '#77471c';
      case 'gibca': return '#109c5d';
      default: return '#e63946';
    }
  };

  const itemsToShow = showAll ? displayFaqData : displayFaqData.slice(0, 5);

  return (
    <section className={`${styles.faqSection} ${getThemeClass()}`}>
      <div className={styles.left}>
        <h2 className={styles.title}>
          FREQUENTLY ASKED <br /> QUESTIONS
        </h2>
        <p className={styles.subtitle}>
          For any questions that are not mentioned, kindly contact us and we'll get you back shortly
        </p>
        <div className={styles.contact}>
          <div>
            <span>Email to | </span>
            <a href="mailto:marketing@gfiuae.com">marketing@gfiuae.com</a>
          </div>
          <div>
            <span>WhatsApp | </span>
            <a href="https://wa.me/97167436888">971-6-7436888</a>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {itemsToShow.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={index}
              className={`${styles.faqItem} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.question} onClick={() => toggleIndex(index)}>
                <h4>{item.question}</h4>
                <motion.span
                  className={styles.icon}
                  animate={{ rotate: isActive ? 180 : 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isActive ? '−' : '+'}
                </motion.span>
              </div>

              <AnimatePresence initial={false}>
                {isActive && item.answer && (
                  <motion.div
                    className={styles.answer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <div>{item.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Read More/Less button */}
         {displayFaqData.length > 5 && (
        <div className={styles.readMoreWrapper}>
          <motion.button
            className={styles.readMoreBtn}
            onClick={() => setShowAll(!showAll)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: getThemeColor(), borderColor: getThemeColor() }}
          >
            {showAll ? (
              <>
                <span>Read Less</span>
                <motion.span
                  animate={{ rotate: 180, y: [0, -3, 0] }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 1, ease: "easeInOut" },
                    rotate: { duration: 0.3 }
                  }}
                  className={styles.arrowIcon}
                >
                  <ArrowIcon color={getThemeColor()} />
                </motion.span>
              </>
            ) : (
              <>
                <span>Read More</span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                  }}
                  className={styles.arrowIcon}
                >
                  <ArrowIcon color={getThemeColor()} />
                </motion.span>
              </>
            )}
          </motion.button>
        </div>
      )}
      </div>
    </section>
  );
}

const ArrowIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 5V19M12 19L19 12M12 19L5 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);