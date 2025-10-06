'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useRef, useEffect } from 'react';
import './sandwich.css';

type sandwichItem = {
  title: string;
  description: string;
  position: string;
  level: number;
};

// Hardcoded data
const hardcodedFields = {
  heroTitle: "sandwich Header",
  heroHighlight: "Highlight",
  heroDescription: "Hero description",
  heroBgImage: {
    sourceUrl: "/placeholder-hero.jpg",
    altText: "Hero background"
  },
  whysandwichTitle: "why sandwich panels are an ideal choice for your space?",
  whysandwichDescription: "Our sandwich panels open up new possibilities, giving architects, designers, and clients a stronger and smarter choice that 13mm panels cannot match. ",
  whysandwichImageBefore: {
    sourceUrl: "/finishes/SANDWHICH.png", 
    altText: "Before sandwich"
  },
  whysandwichItems: [
    {
      title: "BUILT FOR HEIGHT",
      description: "Unlike 13mm panels, sandwich panels are strong enough for true floor-to-ceiling cubicles without additional bracing. This delivers privacy, a solid feel, and a more complete enclosure.",
      position: "top-center",
      level: 1
    },
    {
      title: "enhanced privacy",
      description: "The extra thickness means better visuals and privacy, making them ideal for spaces where silence and discretion matter.",
      position: "left-top", 
      level: 1
    },
    {
      title: "refined aesthetics",
      description: "With concealed fixings and no exposed brackets, the cubicle takes on a clean look that elevates the entire space.",
      position: "right-top",
      level: 1
    },
    {
      title: "premium appearance",
      description: "The thicker profile creates a more solid, high-end finish that stands apart from standard systems.",
      position: "left-center",
      level: 2
    },
    {
      title: "Stronger & More Durable",
      description: "Heavier traffic? No problem. These panels offer greater resistance to impact, scratches, and wear, ensuring they hold up better over time.",
      position: "right-center",
      level: 2
    },
    {
      title: "Flexible Hardware Integration",
      description: "From hidden hinges to flush locks and privacy indicators, the structure makes it easier to integrate smarter hardware without compromising design.",
      position: "left-bottom",
      level: 3
    },
    {
      title: "Custom Thickness Options",
      description: "Available in 20mm to 50mm, giving designers freedom to match the project’s exact requirements.",
      position: "right-bottom",
      level: 3
    },
    {
      title: "Quick & Clean Installation",
      description: "Even with the added strength, the system is designed for efficiency. Panels install faster with fewer visible joints, keeping projects on track.",
      position: "bottom-center",
      level: 3
    }
    
  ]
};

export default function SandwichPanelsComparison() {
  const items = hardcodedFields.whysandwichItems.map((item, index) => ({
    number: `${index + 1}`,
    title: item.title,
    description: item.description,
    position: item.position,
    level: item.level,
  }));

  const beforeImage = {
    sourceUrl: hardcodedFields.whysandwichImageBefore.sourceUrl,
    altText: hardcodedFields.whysandwichImageBefore.altText || "Before sandwich"
  };


  return (
    <div className="sandwich-page">
      {/* Header Section */}
      <div className="sandwich-header">
        <motion.div 
          className="sandwich-heading-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="sandwich-heading">
            {hardcodedFields.whysandwichTitle}{' '}
          </h1>
          <p className="sandwich-subheading">
            {hardcodedFields.whysandwichDescription}
          </p>
        </motion.div>
      </div>

      {/* sandwich Diagram Section */}
      <div className="sandwich-container">
        <div className="sandwich-center">
          <svg className="sandwich-connection-lines" viewBox="0 0 1200 1000">
            <line x1="600" y1="240" x2="600" y2="-0" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="240" x2="100" y2="240" stroke="#000" strokeWidth="2" />
            <line x1="100" y1="240" x2="100" y2="160" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="240" x2="1100" y2="240" stroke="#000" strokeWidth="2" />
            <line x1="1100" y1="240" x2="1100" y2="160" stroke="#000" strokeWidth="2" />
            <line x1="200" y1="400" x2="300" y2="400" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="400" x2="1000" y2="400" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="640" x2="100" y2="640" stroke="#000" strokeWidth="2" />
            <line x1="100" y1="640" x2="100" y2="720" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="640" x2="1100" y2="640" stroke="#000" strokeWidth="2" />
            <line x1="1100" y1="640" x2="1100" y2="720" stroke="#000" strokeWidth="2" />
            <line x1="600" y1="640" x2="600" y2="900" stroke="#000" strokeWidth="2" />
          </svg>

          {/* Using hardcoded images for the reveal slider */}
          <ImageRevealSlider
            beforeImage={beforeImage}
          />

          {items.map((item, index) => (
            <AnimatedsandwichItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageRevealSlider({ beforeImage }: { 
  beforeImage: { sourceUrl: string; altText: string };
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, x)));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, x)));
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="sandwich-image-reveal-container"
      onMouseDown={handleMouseDown}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* BEFORE IMAGE on left side */}
      <div className="sandwich-image-layer">
        <Image
          src={beforeImage.sourceUrl}
          alt={beforeImage.altText}
          fill
          draggable={false} 
          onDragStart={(e) => e.preventDefault()}
          className="sandwich-image-fill"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

function AnimatedsandwichItem({ item, index }: { item: any; index: number }) {
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold: 0.1,
    rootMargin: '-50px 0px'
  });

  return (
    <motion.div
      ref={ref}
      className={`sandwich-item ${item.position} level-${item.level}`}
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
      <div className="sandwich-number">{item.number}</div>
      <div className="sandwich-content">
        <div className="sandwich-title">{item.title}</div>
        <div className="sandwich-description">{item.description}</div>
      </div>
    </motion.div>
  );
}