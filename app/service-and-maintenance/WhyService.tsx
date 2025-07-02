'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './service.css';

type ServiceItem = {
  title: string;
  description: string;
  position: string;
  level: number;
};

type ServicePageProps = {
  fields: {
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    heroBgImage: {
      sourceUrl: string;
      altText: string;
    };
    whyServiceTitle: string;
    whyServiceDescription: string;
    whyServiceImage: {
      sourceUrl: string;
      altText: string;
    };
    whyServiceItems: ServiceItem[];
  };
};

export default function ServicePage({ fields }: ServicePageProps) {
  const items = fields.whyServiceItems.map((item, index) => ({
    number: `${index + 1}`,
    title: item.title,
    description: item.description,
    position: item.position,
    level: item.level,
  }));

  return (
    <div className="service-page">
      {/* Header Section */}
      <div className="service-header">
        <motion.div 
          className="service-heading-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="service-heading">
            {fields.whyServiceTitle}{' '}
            <span className="highlight-green">{fields.heroHighlight}</span>
          </h1>
          <p className="service-subheading">
            {fields.whyServiceDescription}
          </p>
        </motion.div>
      </div>

      {/* Service Diagram Section */}
      <div className="service-container">
        <div className="service-center">
          <svg className="connection-lines" viewBox="0 0 1200 1000">
            {/* SVG lines unchanged */}
            <line x1="600" y1="240" x2="600" y2="-0" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="240" x2="100" y2="240" stroke="#000" strokeWidth="2" />
            <line x1="100" y1="240" x2="100" y2="160" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="240" x2="1100" y2="240" stroke="#000" strokeWidth="2" />
            <line x1="1100" y1="240" x2="1100" y2="160" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="400" x2="300" y2="400" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="400" x2="900" y2="400" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="640" x2="100" y2="640" stroke="#000" strokeWidth="2" />
            <line x1="100" y1="640" x2="100" y2="720" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="640" x2="1100" y2="640" stroke="#000" strokeWidth="2" />
            <line x1="1100" y1="640" x2="1100" y2="720" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="640" x2="600" y2="1000" stroke="#000" strokeWidth="2" />
          </svg>

          <Image
            src={fields.whyServiceImage?.sourceUrl || "/fallback.jpg"}
            alt={fields.whyServiceImage?.altText || "Service Image"}
            width={300}
            height={600}
            className="service-image"
          />

          {items.map((item, index) => (
            <AnimatedServiceItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedServiceItem({ item, index }: { item: any; index: number }) {
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold: 0.1,
    rootMargin: '-50px 0px'
  });

  return (
    <motion.div
      ref={ref}
      className={`service-item ${item.position} level-${item.level}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.1,
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { 
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
    >
      <div className="service-number">{item.number}</div>
      <div className="service-content">
        <div className="service-title">{item.title}</div>
        <div className="service-description">{item.description}</div>
      </div>
    </motion.div>
  );
}
