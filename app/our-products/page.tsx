"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Header from "@/app/components/Header";
import "./our-products.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

// GraphQL Query
const GET_OUR_PRODUCTS_PAGE = gql`
  query GetOurProductsPage {
    page(id: "our-products", idType: URI) {
      ourProducts {
        productSections {
          sectionTitle
          sectionDescription
          sectionDefaultBg {
            sourceUrl
          }
          knowMoreUrl
          sectionCategories {
            categoryName
            categoriesUrl
            categoryHoverImage {
              sourceUrl
            }
            categoryProducts {
              productName
              productHoverBg {
                sourceUrl
              }
              productsUrl
            }
          }
        }
      }
    }
  }
`;

// Types for WordPress data
interface ProductItem {
  productName: string;
  productHoverBg: {
    sourceUrl: string;
  } | null;
  productsUrl: string;
}

interface Category {
  categoryName: string;
  categoriesUrl: string;
  categoryHoverImage: {
    sourceUrl: string;
  } | null;
  categoryProducts: ProductItem[];
}

interface Section {
  sectionTitle: string;
  sectionDescription: string;
  sectionDefaultBg: {
    sourceUrl: string;
  } | null;
  knowMoreUrl: string;
  sectionCategories: Category[];
}

interface WordPressData {
  page: {
    ourProducts: {
      productSections: Section[];
    };
  } | null;
}

// Transformed data types for component state
interface TransformedItem {
  name: string;
  hoverBg: string;
  url?: string;
}

interface TransformedCategory {
  name: string;
  items: TransformedItem[];
  hoverBg: string;
  url?: string;
}

interface TransformedSection {
  title: string;
  description: string;
  defaultBg: string;
  knowMoreUrl?: string;
  categories?: TransformedCategory[];
  items?: TransformedItem[];
}

// Fallback data for development/testing
const fallbackData: TransformedSection[] = [
  {
    title: "hucor",
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

// Transform WordPress data to component format
function transformWordPressData(wpData: WordPressData): TransformedSection[] {
  if (!wpData?.page?.ourProducts?.productSections) {
    return [];
  }

  return wpData.page.ourProducts.productSections.map(section => {
    const transformedSection: TransformedSection = {
      title: section.sectionTitle,
      description: section.sectionDescription,
      defaultBg: section.sectionDefaultBg?.sourceUrl || '/default-bg.jpg',
      knowMoreUrl: section.knowMoreUrl,
    };

    if (section.sectionCategories && section.sectionCategories.length > 0) {
      // Check if this section has categories with products
      const hasCategories = section.sectionCategories.some(cat => 
        cat.categoryProducts && cat.categoryProducts.length > 0
      );

      if (hasCategories) {
        // Structure with categories
        transformedSection.categories = section.sectionCategories.map(category => ({
          name: category.categoryName,
          url: category.categoriesUrl,
          hoverBg: category.categoryHoverImage?.sourceUrl || transformedSection.defaultBg,
          items: category.categoryProducts?.map(product => ({
            name: product.productName,
            hoverBg: product.productHoverBg?.sourceUrl || transformedSection.defaultBg,
            url: product.productsUrl,
          })) || [],
        }));
      } else {
        // Structure with direct items (no subcategories)
        transformedSection.items = section.sectionCategories.map(category => ({
          name: category.categoryName,
          hoverBg: category.categoryHoverImage?.sourceUrl || transformedSection.defaultBg,
          url: category.categoriesUrl,
        }));
      }
    }

    return transformedSection;
  });
}

// Generate navigation items from sections
function generateNavigationItems(sections: TransformedSection[]) {
  return sections.map((section, index) => ({
    label: section.title,
    index: index,
  }));
}

function OurProductsContent() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sections, setSections] = useState<TransformedSection[]>([]);
  const [navigationItems, setNavigationItems] = useState<{ label: string; index: number }[]>([]);
  const [currentBgImages, setCurrentBgImages] = useState<string[]>([]);
  const [targetBgImages, setTargetBgImages] = useState<string[]>([]);
  const [isZoomed, setIsZoomed] = useState<boolean[]>([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<(number | null)[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Use Apollo Client hook
  const { loading, error, data } = useQuery<WordPressData>(GET_OUR_PRODUCTS_PAGE, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Process data when it loads
  useEffect(() => {
    let sectionsToUse: TransformedSection[] = [];
    let shouldShowWarning = false;
    let warningText = '';

    if (error) {
      console.error('GraphQL Error:', error);
      sectionsToUse = fallbackData;
      shouldShowWarning = true;
      warningText = `WordPress connection failed: ${error.message}. Using demo data.`;
    } else if (data) {
      const transformedSections = transformWordPressData(data);
      if (transformedSections.length === 0) {
        sectionsToUse = fallbackData;
        shouldShowWarning = true;
      } else {
        sectionsToUse = transformedSections;
        
      }
    } else if (!loading) {
      // No data and not loading - use fallback
      sectionsToUse = fallbackData;
      shouldShowWarning = true;
      warningText = 'No data received from WordPress. Using demo data.';
    }

    if (sectionsToUse.length > 0) {
      setSections(sectionsToUse);
      setNavigationItems(generateNavigationItems(sectionsToUse));
      
      // Initialize state arrays based on data
      const defaultBgs = sectionsToUse.map(section => section.defaultBg);
      setCurrentBgImages(defaultBgs);
      setTargetBgImages(defaultBgs);
      setIsZoomed(sectionsToUse.map(() => false));
      setExpandedCategories(sectionsToUse.map(() => null));
    }

    if (shouldShowWarning) {
      setWarningMessage(warningText);
      // Clear warning after 5 seconds
      setTimeout(() => setWarningMessage(null), 5000);
    }
  }, [data, error, loading]);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (!header) return;

      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.classList.add('header-hidden');
        setIsHeaderVisible(false);
      } else {
        header.classList.remove('header-hidden');
        setIsHeaderVisible(true);
      }
      
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      prev.map((bg, i) => (i === sectionIdx ? sections[i]?.defaultBg || bg : bg))
    );
    setIsZoomed((prev) =>
      prev.map((zoom, i) => (i === sectionIdx ? false : zoom))
    );
  };

  const handleKnowMoreClick = (section: TransformedSection) => {
    if (section.knowMoreUrl) {
      window.open(section.knowMoreUrl, '_blank');
    } else {
      console.log(`Know more about ${section.title}`);
    }
  };

  const handleItemClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
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
      { threshold: 0.4 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections]);

  // Preload images
  useEffect(() => {
    if (sections.length === 0) return;

    const allImages = new Set(
      sections.flatMap((section) => {
        const base = [section.defaultBg];
        if (section.categories) {
          return base.concat(
            section.categories.flatMap((cat) =>
              [cat.hoverBg, ...cat.items.map((item) => item.hoverBg)]
            )
          );
        } else if (section.items) {
          return base.concat(section.items.map((item) => item.hoverBg));
        }
        return base;
      })
    );

    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [sections]);

  const allUniqueImages = sections.length > 0 ? Array.from(
    new Set(
      sections.flatMap((section) => {
        const base = [section.defaultBg];
        if (section.categories) {
          return base.concat(
            section.categories.flatMap((cat) =>
              [cat.hoverBg, ...cat.items.map((item) => item.hoverBg)]
            )
          );
        } else if (section.items) {
          return base.concat(section.items.map((item) => item.hoverBg));
        }
        return base;
      })
    )
  ) : [];

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg">Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  if (sections.length === 0 && !loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        {allUniqueImages.map((src, i) => (
          <link key={i} rel="preload" as="image" href={src} />
        ))}
      </Head>

      <Header />
      
      {/* Warning Toast */}
      {warningMessage && (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md z-50 rounded shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Warning</p>
              <p className="text-sm">{warningMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setWarningMessage(null)}
                className="text-yellow-500 hover:text-yellow-700"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`scroll-navigation ${isHeaderVisible ? 'with-header' : 'without-header'}`}>
        {navigationItems.map((item, idx, arr) => (
          <div key={idx} className="scroll-nav-item">
            <button
              className={activeIndex === item.index ? 'active' : ''}
              onClick={() => scrollToSection(item.index)}
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
                {section.categories ? (
                  <>
                    {section.categories.map((cat, catIdx) => (
                      <div key={catIdx} className="category-container">
                        <div
                          className="category-name products-item"
                          onClick={() => {
                            toggleCategory(i, catIdx, cat.hoverBg);
                            if (cat.url) handleItemClick(cat.url);
                          }}
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
                                onClick={() => handleItemClick(item.url)}
                                style={{ cursor: item.url ? 'pointer' : 'default' }}
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
                  </>
                ) : section.items && section.items.length > 0 ? (
                  section.items.map((item, j) => (
                    <div key={j} className="item-container">
                      <div
                        className="products-item"
                        onMouseEnter={() => handleHover(i, item.hoverBg)}
                        onClick={() => handleItemClick(item.url)}
                        style={{ cursor: item.url ? 'pointer' : 'default' }}
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
                  onClick={() => handleKnowMoreClick(section)}
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

export default function OurProductsPage() {
  return (
    <ApolloProvider client={client}>
      <OurProductsContent />
    </ApolloProvider>
  );
}