"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Header from "@/app/components/Header";
import "./our-products.css";
import { ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    title: "hufcor",
    description: "Operable Walls and Moving Glasswalls",
    defaultBg: "/hufcor/hufcor.PNG",
    categories: [
      {
        name: "Operable Walls",
        items: [
          { name: "Series 600™ Operable Walls", hoverBg: "/hufcor/7000.jpg" },
          { name: "Series 7000™ Operable Walls", hoverBg: "/hufcor/600.jpg" },
        ],
        hoverBg: "/hufcor/7000.jpg",
      },
      {
        name: "Operable Glass Walls",
        items: [
          { name: "Acoustic Movable Glass Walls", hoverBg: "/hufcor/def.jpg" },
          {
            name: "Frameless Movable Glass Walls",
            hoverBg: "/hufcor/7000.jpg",
          },
        ],
        hoverBg: "/hufcor/def.jpg",
      },
      {
        name: "Other Products",
        items: [
          {
            name: "Weather Resistant Movable Glass Walls",
            hoverBg: "/hufcor/600.jpg",
          },
        ],
        hoverBg: "/hufcor/600.jpg",
      },
    ],
  },
  {
    title: "hpl",
    description: "High-Pressure Laminate Systems",
    defaultBg: "/hpl/expression.png",
    items: [
      {
        name: "HPL Option 1",
        hoverBg: "/hpl/GIBCA-HIGH-PRESSURE-COMPACT-LAMINATE-LOCKER-SYSTEMS.png",
      },
      {
        name: "HPL Option 2",
        hoverBg:
          "/hpl/Gibca-High-Pressure-Laminate-Internal-wall-Cladding-Panels.jpg",
      },
      { name: "HPL Option 3", hoverBg: "/hpl/horizon.png" },
    ],
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

  const [expandedCategories, setExpandedCategories] = useState<
    (number | null)[]
  >(sections.map(() => null));

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImages((prev) =>
        prev.map((bg, i) => (bg !== targetBgImages[i] ? targetBgImages[i] : bg))
      );
    }, 80);
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
    console.log(`Know more about ${sectionTitle}`);
  };

  const toggleCategory = (
    sectionIdx: number,
    catIdx: number,
    hoverBg: string
  ) => {
    setExpandedCategories((prev) =>
      prev.map((val, i) =>
        i === sectionIdx ? (val === catIdx ? null : catIdx) : val
      )
    );
    handleHover(sectionIdx, hoverBg);
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries.find((entry) => entry.isIntersecting);
    if (visibleSection?.target) {
      const idx = sectionRefs.current.findIndex(
        (el) => el === visibleSection.target
      );
      if (idx !== -1) setActiveIndex(idx);
    }
  },
  { threshold: 0.4 } // Try 0.3 to 0.5 depending on layout
);

    sectionRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const allImages = new Set(
      sections.flatMap((section) => {
        const base = [section.defaultBg];
        if ("categories" in section && section.categories) {
          return base.concat(
            section.categories.flatMap((cat) =>
              cat.items.map((item) => item.hoverBg)
            )
          );
        } else if ("items" in section && section.items) {
          return base.concat(section.items.map((item) => item.hoverBg));
        }
        return base;
      })
    );

    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const allUniqueImages = Array.from(
    new Set(
      sections.flatMap((section) => {
        const base = [section.defaultBg];
        if ("categories" in section && section.categories) {
          return base.concat(
            section.categories.flatMap((cat) =>
              cat.items.map((item) => item.hoverBg)
            )
          );
        } else if ("items" in section && section.items) {
          return base.concat(section.items.map((item) => item.hoverBg));
        }
        return base;
      })
    )
  );

  return (
    <>
      <Head>
        {allUniqueImages.map((src, i) => (
          <link key={i} rel="preload" as="image" href={src} />
        ))}
      </Head>

      <Header />
      <div className="scroll-navigation">
  {[
    { label: "Hufcor", index: 0 },
    { label: "HPL Solutions", index: 1 },
    { label: "Pivot Doors" },
    { label: "Nown Ceiling & Wall Design" },
    { label: "GIBCA Glazed & Solid Partitions" },
    { label: "Crown Hydraulic Doors & Windows" },
    { label: "Acristalia Terrace Solutions" },
  ].map((item, idx, arr) => (
    <div key={idx} className="scroll-nav-item">
      <button
        onClick={() => {
          if (typeof item.index === "number") {
            scrollToSection(item.index);
          } else {
            console.log(`${item.label} clicked`);
            // Optionally scroll to a placeholder or do nothing
          }
        }}
      >
        {item.label}
      </button>
      {idx < arr.length - 1 && <div className="vertical-divider" />}
    </div>
  ))}
</div>

      <div>
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
              backgroundSize: isZoomed[i] ? "100%" : "105%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transition: "background-size 1s ease-in-out",
            }}
          >
            <div className="section-content">
              <div className="products-heading">{section.title}</div>
              <p className="products-description">{section.description}</p>

              <div
                className="products-section"
                onMouseLeave={() => handleSectionLeave(i)}
              >
                {"categories" in section && section.categories ? (
  <>
    {section.categories.map((cat, catIdx) => (
      <div key={catIdx} className="category-container">
        <div
          className="category-name products-item"
          onClick={() => toggleCategory(i, catIdx, cat.hoverBg)}
          onMouseEnter={() => handleHover(i, cat.hoverBg)}
        >
          {cat.name}
          <span
            style={{
              marginLeft: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              className={`toggle-icon ${
                expandedCategories[i] === catIdx ? "expanded" : ""
              }`}
            >
              {expandedCategories[i] === catIdx ? "–" : "+"}
            </span>
          </span>
        </div>

        <div
          className={`category-items ${
            expandedCategories[i] === catIdx ? "open" : ""
          }`}
        >
          {cat.items.map((item, itemIdx) => (
  <div key={itemIdx} className="item-container">
    <div
      className="products-item"
      onMouseEnter={() => handleHover(i, item.hoverBg)}
    >
      {item.name}
      <span className="arrow">→</span>
    </div>
    <div className="divider" />
  </div>
))}

        </div>
        <div className="divider" />
      </div>
    ))}
    {/* Divider shown after all categories */}
    
  </>
) : section.items && section.items.length > 0 ? (
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
            aria-current={activeIndex === i ? "true" : undefined}
            aria-label={`Go to ${sections[i].title} section`}
            className={`w-5 h-1.5 rounded-full border-2 transition-all duration-300 ${
              i === activeIndex
                ? "bg-white border-white opacity-100 scale-150"
                : "bg-white/30 border-white/30 opacity-50 hover:opacity-70"
            }`}
            type="button"
          />
        ))}
      </nav>
    </>
  );
}
