'use client';
import { motion } from 'framer-motion';

export default function SuccessAnimation() {
  return (
    <motion.div
      className="success-animation"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#109C5D"
          strokeWidth="10"
          fill="none"
        />
        <motion.path
          d="M30 52 L45 67 L70 37"
          stroke="#109C5D"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  );
}
