'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './service.css';

const items = [
  {
    number: '1',
    title: 'EXTEND LIFESPAN',
    description:
      'Routine servicing preserves the integrity and performance of your partitions, adding years to their usability.',
    position: 'top-center',
    level: 1
  },
  {
    number: '2',
    title: 'ENSURE SAFETY',
    description:
      'Well-maintained systems protect your staff, clients, and visitors from mechanical failure or injury.',
    position: 'left-top',
    level: 1
  },
  {
    number: '3',
    title: 'BOOST EFFICIENCY',
    description:
      'Regular maintenance ensures smooth, hassle-free operation for daily use and quick transitions.',
    position: 'right-top',
    level: 1
  },
  {
    number: '4',
    title: 'CATCH ISSUES EARLY',
    description:
      'Identifying minor damages early prevents costly repairs and unexpected downtime later on.',
    position: 'left-center',
    level: 2
  },
  {
    number: '5',
    title: 'MONITOR CONDITION',
    description:
      "Scheduled checks track wear and usage, giving insight into your partition's long-term health.",
    position: 'right-center',
    level: 2
  },
  {
    number: '6',
    title: 'PREVENT EMERGENCIES',
    description:
      'Proactive care drastically reduces the chance of sudden malfunctions or disruptions.',
    position: 'left-bottom',
    level: 3
  },
  {
    number: '7',
    title: 'MAINTAIN ACOUSTICS',
    description:
      'Proper servicing safeguards sound insulation levels, keeping spaces quiet and productive.',
    position: 'right-bottom',
    level: 3
  },
  {
    number: '8',
    title: 'PROTECT YOUR INVESTMENT',
    description:
      'Regular servicing maximizes the return on your partition systems by maintaining quality and performance over time.',
    position: 'bottom-center',
    level: 3
  }
];

export default function ServicePage() {
  return (
    <div className="service-container">
      <div className="service-center">
        <svg className="connection-lines" viewBox="0 0 1200 1000">
          {/* Level 1 */}
          <line x1="600" y1="240" x2="600" y2="-0" stroke="#000" strokeWidth="2" />
          <line x1="600" y1="240" x2="100" y2="240" stroke="#000" strokeWidth="2" />
          <line x1="100" y1="240" x2="100" y2="100" stroke="#000" strokeWidth="2" />
          <line x1="600" y1="240" x2="1100" y2="240" stroke="#000" strokeWidth="2" />
          <line x1="1100" y1="240" x2="1100" y2="100" stroke="#000" strokeWidth="2" />

          {/* Level 2 */}
          <line x1="600" y1="400" x2="200" y2="400" stroke="#000" strokeWidth="2" />
          <line x1="600" y1="400" x2="1000" y2="400" stroke="#000" strokeWidth="2" />

          {/* Level 3 */}
          <line x1="600" y1="640" x2="100" y2="640" stroke="#000" strokeWidth="2" />
          <line x1="100" y1="640" x2="100" y2="720" stroke="#000" strokeWidth="2" />
          <line x1="600" y1="640" x2="1100" y2="640" stroke="#000" strokeWidth="2" />
          <line x1="1100" y1="640" x2="1100" y2="720" stroke="#000" strokeWidth="2" />
          <line x1="600" y1="640" x2="600" y2="1000" stroke="#000" strokeWidth="2" />
        </svg>

        <Image
          src="/service.PNG"
          alt="Partition Image"
          width={300}
          height={600}
          className="service-image"
        />

        {items.map((item, index) => (
          <AnimatedServiceItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function AnimatedServiceItem({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={`service-item ${item.position} level-${item.level}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.1,
        ease: 'easeOut',
        delay: index * 0.2, 
      }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{
        scale: 1.08,
        transition: { duration: .1 }, 
        color:'#109c5d',
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
