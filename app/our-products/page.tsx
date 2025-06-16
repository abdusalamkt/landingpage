'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/app/components/Header';
import './our-products.css';

const sections = [
  {
    title: 'hufcor',
    description: 'Operable Walls and Moving Glasswalls',
    defaultBg: '/hufcor/hufcor.PNG',
    items: [
      { name: 'Series 600™ Operable Walls', hoverBg: '/hufcor/7000.jpg' },
      { name: 'Series 7000™ Operable Walls', hoverBg: '/hufcor/600.jpg' },
      { name: 'Acoustic Movable Glass Walls', hoverBg: '/hufcor/def.jpg' },
      { name: 'Frameless Movable Glass Walls', hoverBg: '/hufcor/7000.jpg' },
      { name: 'Weather Resistant Movable Glass Walls', hoverBg: '/hufcor/600.jpg' },
    ],
  },
  {
    title: 'hpl',
    description: 'High-Pressure Laminate Systems',
    defaultBg: '/hpl/expression.png',
    items: [
      { name: 'HPL Option 1', hoverBg: '/hpl/GIBCA-HIGH-PRESSURE-COMPACT-LAMINATE-LOCKER-SYSTEMS.png' },
      { name: 'HPL Option 2', hoverBg: '/hpl/Gibca-High-Pressure-Laminate-Internal-wall-Cladding-Panels.jpg' },
      { name: 'HPL Option 3', hoverBg: '/hpl/horizon.png' },
    ],
  },
  {
    title: 'hufcor',
    description: 'Reinforced Acoustic and Glass Walls',
    defaultBg: '/hufcor/hufcor.png',
    items: [
      { name: 'Series 600™ Operable Walls', hoverBg: '/hufcor/7000.jpg' },
      { name: 'Series 7000™ Operable Walls', hoverBg: '/hufcor/600.jpg' },
      { name: 'Acoustic Movable Glass Walls', hoverBg: '/hufcor/def.jpg' },
      { name: 'Frameless Movable Glass Walls', hoverBg: '/hufcor/7000.jpg' },
      { name: 'Weather Resistant Movable Glass Walls', hoverBg: '/hufcor/600.jpg' },
    ],
  },
  {
    title: 'hpl',
    description: 'High-Pressure Laminate Systems',
    defaultBg: '/hpl/expression.png',
    items: [],
  },
];

export default function OurProductsPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentBgImages, setCurrentBgImages] = useState<string[]>(
    sections.map((section) => section.defaultBg)
  );
  const [targetBgImages, setTargetBgImages] = useState<string[]>(
    sections.map((section) => section.defaultBg)
  );
  const [isZoomed, setIsZoomed] = useState<boolean[]>(
    sections.map(() => false)
  );

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImages((prev) =>
        prev.map((bg, i) => (bg !== targetBgImages[i] ? targetBgImages[i] : bg))
      );
    }, 100);
    return () => clearInterval(interval);
  }, [targetBgImages]);

  const handleHover = (sectionIdx: number, newBg: string) => {
    setTargetBgImages((prev) =>
      prev.map((bg, i) => (i === sectionIdx ? newBg : bg))
    );
    setIsZoomed((prev) =>
      prev.map((zoom, i) => (i === sectionIdx ? true : zoom))
    );
  };

  const handleSectionLeave = (sectionIdx: number) => {
    setTargetBgImages((prev) =>
      prev.map((bg, i) => (i === sectionIdx ? sections[i].defaultBg : bg))
    );
    setIsZoomed((prev) =>
      prev.map((zoom, i) => (i === sectionIdx ? false : zoom))
    );
  };

  const handleKnowMoreClick = (sectionTitle: string) => {
    // You can customize this function to handle the "Know More" button click
    console.log(`Know more about ${sectionTitle}`);
    // For example: router.push(`/products/${sectionTitle}`);
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection?.target) {
          const idx = sectionRefs.current.findIndex((el) => el === visibleSection.target);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      {
        threshold: 0.6,
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <div className="snap-container">
        {sections.map((section, i) => (
          <section
            key={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="products-wrapper"
            id={`section-${i}`}
            style={{
              backgroundImage: `url(${currentBgImages[i]})`,
              backgroundSize: isZoomed[i] ? 'cover' : 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="section-content">
              <div className="products-heading">{section.title}</div>
              <p className="products-description">{section.description}</p>

              <div
                className="products-section"
                onMouseLeave={() => handleSectionLeave(i)}
              >
                {section.items.length > 0 ? (
                  section.items.map((item, j) => (
                    <div key={j} className="item-container">
                      <div
                        className="products-item"
                        onMouseEnter={() => handleHover(i, item.hoverBg)}
                      >
                        {item.name}
                        <span className="arrow">→</span>
                      </div>
                      <div className="divider" />
                    </div>
                  ))
                ) : (
                  <div className="divider full-width" />
                )}
                
                <button
                  className="cta-button"
                  onClick={() => handleKnowMoreClick(section.title)}
                >
                  Know More
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <nav
        aria-label="Section navigation"
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
      >
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            aria-current={activeIndex === i ? 'true' : undefined}
            aria-label={`Go to ${sections[i].title} section`}
            className={`w-5 h-1.5 rounded-full border-2 transition-all duration-300 ${
              i === activeIndex
                ? 'bg-white border-white opacity-100 scale-150'
                : 'bg-white/30 border-white/30 opacity-50 hover:opacity-70'
            }`}
            type="button"
          />
        ))}
      </nav>
    </>
  );
}