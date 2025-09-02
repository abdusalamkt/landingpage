// components/AnimatedSection.tsx
'use client';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedSection({
  children,
  animation = 'fadeUp', // fadeUp | slideLeft | slideRight |fadeIn
  delay = 0.2,
}: {
  children: React.ReactNode;
  animation?: 'fadeUp' | 'slideLeft' | 'slideRight' | 'fadeIn';
  delay?: number;
}) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  const variants = {
    hidden: {
      opacity: 0,
      y: animation === 'fadeUp' ? 40 : 0,
      x: animation === 'slideLeft' ? -40 : animation === 'slideRight' ? 40 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
