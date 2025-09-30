'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import './projects.css';
import Header from '../components/Header';
import FloatingSidebar from '../components/FloatingSidebar';

// Types
type WordPressImage = { sourceUrl: string; altText: string };
type WordPressSector = { name: string };
type GallerySection = { sector: WordPressSector[]; images: WordPressImage[] };
type WordPressProject = {
  title: string;
  projectGalleryFields: { gallerySections: GallerySection[] };
};
type GraphQLResponse = { data: { projects: { nodes: WordPressProject[] } } };

type Project = {
  id: string;
  title: string;
  image: string;
  sectors: string[];
  product: string;
  sizeClass?: string;
  altText?: string;
  loaded?: boolean;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  // Changed to arrays for multi-select
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [filterProducts, setFilterProducts] = useState<string[]>([]);
  const [filterSectors, setFilterSectors] = useState<string[]>([]);

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, projectId: '' });

  const [displayedCount, setDisplayedCount] = useState(18);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);

  const productDropdownRef = useRef<HTMLDivElement | null>(null);
  const sectorDropdownRef = useRef<HTMLDivElement | null>(null);

  const GRAPHQL_QUERY = `
    query GetAllProjectImages {
      projects(first: 100) {
        nodes {
          title
          projectGalleryFields {
            gallerySections {
              sector {
                name
              }
              images {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  `;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProductDropdown(false);
      }
      if (
        sectorDropdownRef.current &&
        !sectorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSectorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: GRAPHQL_QUERY }),
        });

        const result: GraphQLResponse = await response.json();
        if (!result.data?.projects?.nodes) throw new Error('No data returned');
        const transformed = transformWordPressData(result.data.projects.nodes);
        setProjects(transformed);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Modal functionality
  const openModal = (src: string, alt: string, title: string) => {
    setModalImage({ src, alt, title });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalImage) {
        closeModal();
      }
    };

    if (modalImage) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [modalImage]);

  const transformWordPressData = (wpProjects: WordPressProject[]): Project[] => {
    const transformed: Project[] = [];

    wpProjects.forEach((wpProject, projectIndex) => {
      const title = wpProject.title;
      const sections = wpProject.projectGalleryFields?.gallerySections || [];

      sections.forEach((section, sectionIndex) => {
        const sectorNames = section.sector?.map(s => s.name) || [];

        section.images?.forEach((image, imageIndex) => {
          const uniqueId = `${title}-${projectIndex}-${sectionIndex}-${imageIndex}`;
          transformed.push({
            id: uniqueId,
            title,
            image: image.sourceUrl,
            sectors: sectorNames,
            product: title,
            altText: image.altText || title,
            loaded: false
          });
        });
      });
    });

    return transformed;
  };

  const allProducts = useMemo(() => {
    return [...new Set(projects.map(p => p.product))];
  }, [projects]);

  const filteredSectors = useMemo(() => {
    if (!selectedProducts.length) {
      return [...new Set(projects.flatMap(p => p.sectors))];
    }
    return [...new Set(
      projects
        .filter(p => selectedProducts.includes(p.product))
        .flatMap(p => p.sectors)
    )];
  }, [selectedProducts, projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const productMatch = filterProducts.length === 0 || filterProducts.includes(p.product);
      const sectorMatch = filterSectors.length === 0 || p.sectors.some(sector => filterSectors.includes(sector));
      return productMatch && sectorMatch;
    });
  }, [projects, filterProducts, filterSectors]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, displayedCount);
  }, [filteredProjects, displayedCount]);

  const hasMore = displayedCount < filteredProjects.length;

  const loadMore = () => {
    setDisplayedCount(prev => prev + 18);
  };

  const handleMouseMove = (e: React.MouseEvent, projectId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top + 20,
      projectId,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, projectId: '' });
  };

  // Enhanced dropdown handlers
  const handleProductDropdownToggle = () => {
    setShowProductDropdown(!showProductDropdown);
    setShowSectorDropdown(false); // Close sector dropdown when opening product dropdown
  };

  const handleSectorDropdownToggle = () => {
    setShowSectorDropdown(!showSectorDropdown);
    setShowProductDropdown(false); // Close product dropdown when opening sector dropdown
  };

  const handleProductSelect = (product: string) => {
    if (product === '') {
      // "All Products" selected
      setSelectedProducts([]);
    } else {
      setSelectedProducts(prev => {
        if (prev.includes(product)) {
          return prev.filter(p => p !== product);
        } else {
          return [...prev, product];
        }
      });
    }
    // Don't close dropdown for multi-select
  };

  const handleSectorSelect = (sector: string) => {
    if (sector === '') {
      // "All Sectors" selected
      setSelectedSectors([]);
    } else {
      setSelectedSectors(prev => {
        if (prev.includes(sector)) {
          return prev.filter(s => s !== sector);
        } else {
          return [...prev, sector];
        }
      });
    }
    // Don't close dropdown for multi-select
  };

  const handleApply = () => {
    setFilterProducts(selectedProducts);
    setFilterSectors(selectedSectors);
    setDisplayedCount(18);
    // Close both dropdowns after applying
    setShowProductDropdown(false);
    setShowSectorDropdown(false);
  };

  const handleClearFilters = () => {
    setSelectedProducts([]);
    setSelectedSectors([]);
    setFilterProducts([]);
    setFilterSectors([]);
    setDisplayedCount(18);
    // Close both dropdowns after clearing
    setShowProductDropdown(false);
    setShowSectorDropdown(false);
  };

  const handleImageLoad = (id: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, loaded: true } : project
      )
    );
  };

  const handleImageClick = (project: Project) => {
    openModal(project.image, project.altText || project.title, project.title);
  };

// Helper functions for display tags
const getProductDisplayTags = () => {
  if (selectedProducts.length === 0) {
    return <span className="placeholder-text">All Products</span>;
  }
  return (
    <div className="selected-tags">
      {selectedProducts.map((p) => (
        <span key={p} className="tag">
          {p}
          <button
            type="button"
            className="tag-remove"
            onClick={(e) => {
              e.stopPropagation(); // prevent dropdown toggle
              handleProductSelect(p); // removes it
            }}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
};

  const getSectorDisplayText = () => {
    if (selectedSectors.length === 0) return 'All Sectors';
    if (selectedSectors.length === 1) return selectedSectors[0];
    return `${selectedSectors.length} Sectors Selected`;
  };

  // Skeleton loader component
  const SkeletonLoader = ({ count = 18 }: { count?: number }) => {
    return (
      <div className="gallery-grid">
        {Array.from({ length: count }).map((_, index) => {
          const sizeVariants = ['wide', 'tall', 'big', ''];
          const sizeClass = sizeVariants[index % sizeVariants.length];
          
          return (
            <div key={`skeleton-${index}`} className={`gallery-card ${sizeClass} skeleton-card`}>
              <div className="skeleton-animation"></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Header />
      <FloatingSidebar />
      <div className="projects-gallery-container">
        <h1 className="gallery-title">GALLERY</h1>
        <div className="description"></div>

        {/* Filter UI */}
        <div className="filter-bar">
          <div className="filter-dropdown-wrapper" ref={productDropdownRef}>
            <div
  className={`filter-dropdown ${showProductDropdown ? 'open' : ''}`}
  onClick={handleProductDropdownToggle}
>
  {getProductDisplayTags()}
  <span className="filter-dropdown-arrow">{showProductDropdown ? '▲' : '▼'}</span>
</div>


            {showProductDropdown && (
              <ul className="filter-dropdown-options">
                <li
                  className={selectedProducts.length === 0 ? 'selected' : ''}
                  onClick={() => handleProductSelect('')}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.length === 0}
                    onChange={() => {}}
                  />
                  All Products
                </li>
                {allProducts.map(p => (
                  <li
                    key={p}
                    className={selectedProducts.includes(p) ? 'selected' : ''}
                    onClick={() => handleProductSelect(p)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(p)}
                      onChange={() => {}}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="filter-dropdown-wrapper" ref={sectorDropdownRef}>
            <div
              className={`filter-dropdown ${showSectorDropdown ? 'open' : ''}`}
              onClick={handleSectorDropdownToggle}
            >
              {getSectorDisplayText()}
              <span className="filter-dropdown-arrow">{showSectorDropdown ? '▲' : '▼'}</span>
            </div>

            {showSectorDropdown && (
              <ul className="filter-dropdown-options">
                <li
                  className={selectedSectors.length === 0 ? 'selected' : ''}
                  onClick={() => handleSectorSelect('')}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedSectors.length === 0}
                    onChange={() => {}}
                  />
                  All Sectors
                </li>
                {filteredSectors.map(s => (
                  <li
                    key={s}
                    className={selectedSectors.includes(s) ? 'selected' : ''}
                    onClick={() => handleSectorSelect(s)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedSectors.includes(s)}
                      onChange={() => {}}
                    />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={handleApply} className="filter-apply-btn">APPLY</button>
          {/* <button onClick={handleClearFilters} className="filter-clear-btn">↺</button> */}
        </div>

        {/* Loading state */}
        {loading && <SkeletonLoader />}

        {/* Gallery Grid */}
        {!loading && (
          <div className="gallery-grid">
            {displayedProjects.length ? (
              displayedProjects.map((project, index) => {
                const sizeVariants = ['wide', 'tall', 'big', ''];
                const sizeClass = sizeVariants[index % sizeVariants.length];

                return (
                  <div
                    key={project.id}
                    className={`gallery-card ${sizeClass} ${project.loaded ? 'loaded' : 'loading'}`}
                    onMouseMove={e => handleMouseMove(e, project.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleImageClick(project)}
                  >
                    {!project.loaded && (
                      <div className="image-loading-overlay">
                      
                      </div>
                    )}
                    <div className="image-wrapper">
                      <Image
                        src={project.image}
                        alt={project.altText || project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={80}
                        onLoadingComplete={() => handleImageLoad(project.id)}
                        priority={index < 6} // Prioritize loading first few images
                      />
                    </div>

                    {/* Tooltip */}
                    {tooltip.visible && tooltip.projectId === project.id && (
                      <div
                        className="cursor-tooltip"
                        style={{ left: tooltip.x - 60, top: tooltip.y, position: 'absolute', zIndex: 1000 }}
                      >
                        <div className="tooltip-content">
                          <h3 className="tooltip-title">{project.title}</h3>
                          <p>{project.sectors.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No projects match your filters.</p>
            )}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="load-more-container">
            <button onClick={loadMore} className="load-more-btn">
              Load More
            </button>
          </div>
        )}

        {/* Fullscreen Modal */}
        {modalImage && (
          <div className="fullscreen-modal active">
            <div className="modal-backdrop" onClick={closeModal}></div>
            <button className="modal-close" onClick={closeModal} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal-image-wrapper">
              <Image
                src={modalImage.src}
                alt={modalImage.alt}
                fill
                style={{ objectFit: 'contain' }}
                quality={100}
                priority
              />
            </div>
            <div className="modal-info">
              <h3 className="modal-title">{modalImage.title}</h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
}