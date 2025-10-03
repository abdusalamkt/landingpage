'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './projects.module.css';

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
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string; index: number } | null>(null);

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

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

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
      return [];
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

  // Modal functionality
  const openModal = (src: string, alt: string, title: string, index: number) => {
    setModalImage({ src, alt, title, index });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigatePrevious = () => {
    if (modalImage && modalImage.index > 0) {
      const prevIndex = modalImage.index - 1;
      const prevProject = displayedProjects[prevIndex];
      setModalImage({
        src: prevProject.image,
        alt: prevProject.altText || prevProject.title,
        title: prevProject.title,
        index: prevIndex
      });
    }
  };

  const navigateNext = () => {
    if (modalImage && modalImage.index < displayedProjects.length - 1) {
      const nextIndex = modalImage.index + 1;
      const nextProject = displayedProjects[nextIndex];
      setModalImage({
        src: nextProject.image,
        alt: nextProject.altText || nextProject.title,
        title: nextProject.title,
        index: nextIndex
      });
    }
  };

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
        const transformed = shuffleArray(transformWordPressData(result.data.projects.nodes));
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!modalImage) return;

      if (event.key === 'Escape') {
        closeModal();
      } else if (event.key === 'ArrowLeft') {
        navigatePrevious();
      } else if (event.key === 'ArrowRight') {
        navigateNext();
      }
    };

    if (modalImage) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [modalImage, displayedProjects]);

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

  const handleProductDropdownToggle = () => {
    setShowProductDropdown(!showProductDropdown);
    setShowSectorDropdown(false);
  };

  const handleSectorDropdownToggle = () => {
    if (selectedProducts.length > 0) {
      setShowSectorDropdown(!showSectorDropdown);
      setShowProductDropdown(false);
    }
  };

  const handleProductSelect = (product: string) => {
    if (product === '') {
      setSelectedProducts([]);
      setSelectedSectors([]);
    } else {
      setSelectedProducts(prev => {
        if (prev.includes(product)) {
          const newProducts = prev.filter(p => p !== product);
          if (newProducts.length === 0) {
            setSelectedSectors([]);
          }
          return newProducts;
        } else {
          return [...prev, product];
        }
      });
    }
  };

  const handleSectorSelect = (sector: string) => {
    if (sector === '') {
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
  };

  const handleApply = () => {
    setFilterProducts(selectedProducts);
    setFilterSectors(selectedSectors);
    setDisplayedCount(18);
    setShowProductDropdown(false);
    setShowSectorDropdown(false);
  };

  const handleClearFilters = () => {
    setSelectedProducts([]);
    setSelectedSectors([]);
    setFilterProducts([]);
    setFilterSectors([]);
    setDisplayedCount(18);
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

  const handleImageClick = (project: Project, index: number) => {
    openModal(project.image, project.altText || project.title, project.title, index);
  };

  const getProductDisplayTags = () => {
    if (selectedProducts.length === 0) {
      return <span className={styles['placeholder-text']}>All Products</span>;
    }
    return (
      <div className={styles['selected-tags']}>
        {selectedProducts.map((p) => (
          <span key={p} className={styles.tag}>
            {p}
            <button
              type="button"
              className={styles['tag-remove']}
              onClick={(e) => {
                e.stopPropagation();
                handleProductSelect(p);
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
    if (selectedProducts.length === 0) {
      return 'Select Product First';
    }
    if (selectedSectors.length === 0) return 'All Sub Products';
    if (selectedSectors.length === 1) return selectedSectors[0];
    return `${selectedSectors.length} Sectors Selected`;
  };

  const SkeletonLoader = ({ count = 18 }: { count?: number }) => {
    return (
      <div className={styles['gallery-grid']}>
        {Array.from({ length: count }).map((_, index) => {
          const sizeVariants = ['wide', 'tall', 'big', ''];
          const sizeClass = sizeVariants[index % sizeVariants.length];
          
          return (
            <div key={`skeleton-${index}`} className={`${styles['gallery-card']} ${styles[sizeClass]} ${styles['skeleton-card']}`}>
              <div className={styles['skeleton-animation']}></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className={styles['projects-gallery-container']}>
        <h1 className={styles['gallery-title']}>GALLERY</h1>
        <div className={styles.description}></div>

        {/* Filter UI */}
        <div className={styles['filter-bar']}>
          <div className={styles['filter-dropdown-wrapper']} ref={productDropdownRef}>
            <div
              className={`${styles['filter-dropdown']} ${showProductDropdown ? styles.open : ''}`}
              onClick={handleProductDropdownToggle}
            >
              {getProductDisplayTags()}
              <span className={styles['filter-dropdown-arrow']}>{showProductDropdown ? '▲' : '▼'}</span>
            </div>

            {showProductDropdown && (
              <ul className={styles['filter-dropdown-options']}>
                <li
                  className={selectedProducts.length === 0 ? styles.selected : ''}
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
                    className={selectedProducts.includes(p) ? styles.selected : ''}
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

          <div className={styles['filter-dropdown-wrapper']} ref={sectorDropdownRef}>
            <div
              className={`${styles['filter-dropdown']} ${showSectorDropdown ? styles.open : ''} ${
                selectedProducts.length === 0 ? styles.disabled : ''
              }`}
              onClick={handleSectorDropdownToggle}
            >
              {getSectorDisplayText()}
              <span className={styles['filter-dropdown-arrow']}>
                {selectedProducts.length > 0 ? (showSectorDropdown ? '▲' : '▼') : '▼'}
              </span>
            </div>

            {showSectorDropdown && selectedProducts.length > 0 && (
              <ul className={styles['filter-dropdown-options']}>
                <li
                  className={selectedSectors.length === 0 ? styles.selected : ''}
                  onClick={() => handleSectorSelect('')}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedSectors.length === 0}
                    onChange={() => {}}
                  />
                  All Sub Products
                </li>
                {filteredSectors.map(s => (
                  <li
                    key={s}
                    className={selectedSectors.includes(s) ? styles.selected : ''}
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

          <button onClick={handleApply} className={styles['filter-apply-btn']}>APPLY</button>
          <button onClick={handleClearFilters} className={styles['filter-clear-btn']}>↺</button>
        </div>

        {/* Loading state */}
        {loading && <SkeletonLoader />}

        {/* Gallery Grid */}
        {!loading && (
          <div className={styles['gallery-grid']}>
            {displayedProjects.length ? (
              displayedProjects.map((project, index) => {
                const sizeVariants = ['wide', 'tall', 'big', ''];
                const sizeClass = sizeVariants[index % sizeVariants.length];

                return (
                  <div
                    key={project.id}
                    className={`${styles['gallery-card']} ${styles[sizeClass]} ${project.loaded ? styles.loaded : styles.loading}`}
                    onMouseMove={e => handleMouseMove(e, project.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleImageClick(project, index)}
                  >
                    {!project.loaded && (
                      <div className={styles['image-loading-overlay']}></div>
                    )}
                    <div className={styles['image-wrapper']}>
                      <Image
                        src={project.image}
                        alt={project.altText || project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={80}
                        onLoadingComplete={() => handleImageLoad(project.id)}
                        priority={index < 6}
                      />
                    </div>

                    {/* Tooltip */}
                    {tooltip.visible && tooltip.projectId === project.id && (
                      <div
                        className={styles['cursor-tooltip']}
                        style={{ left: tooltip.x - 60, top: tooltip.y, position: 'absolute', zIndex: 1000 }}
                      >
                        <div className={styles['tooltip-content']}>
                          <h3 className={styles['tooltip-title']}>{project.title}</h3>
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
          <div className={styles['load-more-container']}>
            <button onClick={loadMore} className={styles['load-more-btn']}>
              Load More
            </button>
          </div>
        )}

        {/* Fullscreen Modal with Navigation */}
        {modalImage && (
          <div className={`${styles['fullscreen-modal']} ${styles.active}`}>
            <div className={styles['modal-backdrop']} onClick={closeModal}></div>
            
            <button className={styles['modal-close']} onClick={closeModal} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Previous Button */}
            {modalImage.index > 0 && (
              <button 
                className={`${styles['modal-nav-btn']} ${styles['modal-prev-btn']}`} 
                onClick={navigatePrevious}
                aria-label="Previous image"
              >
                ❮
              </button>
            )}

            {/* Next Button */}
            {modalImage.index < displayedProjects.length - 1 && (
              <button 
                className={`${styles['modal-nav-btn']} ${styles['modal-next-btn']}`} 
                onClick={navigateNext}
                aria-label="Next image"
              >
                ❯
              </button>
            )}

            <div className={styles['modal-content']}>
              <Image
                src={modalImage.src}
                alt={modalImage.alt}
                fill
                style={{ objectFit: 'contain' }}
                quality={90}
                sizes="90vw"
              />
              <div className={styles['modal-caption']}>
                <h3>{modalImage.title}</h3>
                <p>{modalImage.alt}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
