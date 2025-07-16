
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { gql } from '@apollo/client';
import client from '@/lib/apolloClient'; // adjust path
import './projects.css';
import Header from '../components/Header';
import FloatingSidebar from '../components/FloatingSidebar';

const GET_ALL_PROJECTS_GALLERY = gql`
  query GetAllProjectsGallery {
    projects {
      nodes {
        title
        projectGalleryFields {
          gallerySections {
            product {
              ... on TermNode {
                id
                name
                slug
              }
            }
            sector {
              ... on TermNode {
                id
                name
                slug
              }
            }
            images {
              id
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

type GalleryItem = {
  id: string;
  projectTitle: string;
  productNames: string[];
  sectorNames: string[];
  imageUrl: string;
  imageAlt: string;
};

export default function ProjectsPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters selected (controlled inputs)
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  // Filters applied (actually filtering the gallery)
  const [filterProduct, setFilterProduct] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // Tooltip state: which image id is hovered and coordinates
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; id: string | null }>({
    visible: false,
    x: 0,
    y: 0,
    id: null,
  });

  // Pagination
  const [displayedCount, setDisplayedCount] = useState(18);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    setLoading(true);
    client
      .query({ query: GET_ALL_PROJECTS_GALLERY })
      .then(({ data }) => {
        const nodes = data.projects?.nodes || [];

        const items: GalleryItem[] = [];

        nodes.forEach((node: any) => {
          const projectTitle = node.title || 'Untitled';

          node.projectGalleryFields?.gallerySections?.forEach((section: any) => {
            const products = Array.isArray(section.product)
              ? section.product.map((p: any) => p?.name).filter(Boolean)
              : section.product?.name
              ? [section.product.name]
              : [];
            const sectors = Array.isArray(section.sector)
              ? section.sector.map((s: any) => s?.name).filter(Boolean)
              : section.sector?.name
              ? [section.sector.name]
              : [];

            section.images?.forEach((img: any) => {
              if (img?.sourceUrl) {
                items.push({
                  id: img.id,
                  projectTitle,
                  productNames: products,
                  sectorNames: sectors,
                  imageUrl: img.sourceUrl,
                  imageAlt: img.altText || projectTitle,
                });
              }
            });
          });
        });

        setGalleryItems(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load projects');
        setLoading(false);
      });
  }, []);

  // Unique products and sectors for filters
  const allProducts = useMemo(() => {
    const setP = new Set<string>();
    galleryItems.forEach((item) => item.productNames.forEach((p) => setP.add(p)));
    return Array.from(setP).sort();
  }, [galleryItems]);

  const allSectors = useMemo(() => {
    const setS = new Set<string>();
    galleryItems.forEach((item) => item.sectorNames.forEach((s) => setS.add(s)));
    return Array.from(setS).sort();
  }, [galleryItems]);

  // Filter gallery items by applied filters
  const filteredGalleryItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesProduct = filterProduct ? item.productNames.includes(filterProduct) : true;
      const matchesSector = filterSector ? item.sectorNames.includes(filterSector) : true;
      return matchesProduct && matchesSector;
    });
  }, [galleryItems, filterProduct, filterSector]);

  // Pagination slice
  const displayedGalleryItems = useMemo(() => {
    return filteredGalleryItems.slice(0, displayedCount);
  }, [filteredGalleryItems, displayedCount]);

  const hasMore = displayedCount < filteredGalleryItems.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((c) => c + 18);
      setIsLoadingMore(false);
    }, 800);
  };

  // Tooltip handlers
  const handleMouseMove = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({ visible: true, x, y: y + 20, id });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, id: null });
  };

  const handleApply = () => {
    setFilterProduct(selectedProduct);
    setFilterSector(selectedSector);
    setDisplayedCount(18); // reset pagination on filter change
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <FloatingSidebar />

      <div className="projects-gallery-container">
        <h1 className="gallery-title">GALLERY</h1>
        <p className="gallery-subtitle">
          Gibca Furniture Industry Co. Ltd. (LLC) offers operable partitions including walls and doors, upholding global
          standards.
          <br />
          Regular maintenance ensures optimal performance and safety, keeping your partitions functional and secure.
        </p>

        {/* Filter Section */}
        <div className="filter-bar">
          <select
            onChange={(e) => setSelectedProduct(e.target.value)}
            value={selectedProduct}
            className="filter-select"
          >
            <option value="">Select Product</option>
            {allProducts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setSelectedSector(e.target.value)}
            value={selectedSector}
            className="filter-select"
          >
            <option value="">Select Sector</option>
            {allSectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button className="filter-apply-btn" onClick={handleApply}>
            APPLY
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {displayedGalleryItems.length > 0 ? (
            displayedGalleryItems.map((item, i) => {
              const sizeVariants = ['wide', 'tall', 'big', ''];
              const sizeClass = sizeVariants[i % sizeVariants.length];

              const isTooltipVisible = tooltip.visible && tooltip.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`gallery-card ${sizeClass}`}
                  onMouseMove={(e) => handleMouseMove(e, item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="image-wrapper">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={i < 4}
                      quality={80}
                    />
                  </div>

                  {isTooltipVisible && (
                    <div
                      className="cursor-tooltip"
                      style={{
                        left: tooltip.x - 60,
                        top: tooltip.y,
                      }}
                    >
                      <div className="tooltip-content">
                        <h3 className="tooltip-title">{item.projectTitle}</h3>
                        <p className="tooltip-category">
                          <strong>Products:</strong> {item.productNames.join(', ') || 'N/A'}
                        </p>
                        <p className="tooltip-category">
                          <strong>Sectors:</strong> {item.sectorNames.join(', ') || 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="no-results">No projects match your filters.</p>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="load-more-container">
            <button
              className={`load-more-btn ${isLoadingMore ? 'loading' : ''}`}
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <span className="spinner" />
              ) : (
                <>
                  Load More
                  <svg
                    className="load-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14m7-7H5" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
