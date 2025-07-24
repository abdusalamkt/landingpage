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
}

// Default FAQ data as fallback
const defaultFaqData = [
  {
    question: 'Where is Gibca Furniture Main Office?',
    answer: 'Hufcor\'s pocket doors conceal operable wall storage areas for a clean, refined look. They can match or complement surrounding finishe',
  },
  {
    question: 'What is the difference between 7000 series and 600 series?',
    answer: 'Hufcor\'s pocket doors conceal operable wall storage areas for a clean, refined look. They can match or complement surrounding finishe',
  },
  {
    question: 'What is a pocket door?',
    answer:
      'Hufcor\'s pocket doors conceal operable wall storage areas for a clean, refined look. They can match or complement surrounding finishe',
  },
  {
    question: 'Do you have another walls aside from operable walls?',
    answer: 'Hufcor\'s pocket doors conceal operable wall storage areas for a clean, refined look. They can match or complement surrounding finishe',
  },
  {
    question: 'What is the difference between 7000 series and 600 series?',
    answer: 'Hufcor\'s pocket doors conceal operable wall storage areas for a clean, refined look. They can match or complement surrounding finishe',
  },
];

export default function FaqSection({ faqData }: FaqSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // default first item open
  
  // Use provided faqData or fallback to default
  const displayFaqData = faqData && faqData.length > 0 ? faqData : defaultFaqData;
  
  console.log('FaqSection received faqData:', faqData);
  console.log('FaqSection using displayFaqData:', displayFaqData);

  const toggleIndex = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.left}>
        <h2 className={styles.title}>
          FREQUENTLY ASKED <br /> QUESTIONS
        </h2>
        <p className={styles.subtitle}>
          For any questions that are not mentioned, kindly contact us and we'll
          get you back shortly
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
       
        {displayFaqData.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className={`${styles.faqItem} ${isActive ? styles.active : ''}`}
            >
              <div
                className={styles.question}
                onClick={() => toggleIndex(index)}
              >
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
      </div>
    </section>
  );
}