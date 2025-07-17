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

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterSector, setFilterSector] = useState('');

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, projectId: '' });

  const [displayedCount, setDisplayedCount] = useState(18);

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
    if (!selectedProduct) {
      return [...new Set(projects.flatMap(p => p.sectors))];
    }
    return [...new Set(
      projects
        .filter(p => p.product === selectedProduct)
        .flatMap(p => p.sectors)
    )];
  }, [selectedProduct, projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const productMatch = filterProduct ? p.product === filterProduct : true;
      const sectorMatch = filterSector ? p.sectors.includes(filterSector) : true;
      return productMatch && sectorMatch;
    });
  }, [projects, filterProduct, filterSector]);

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

  const handleApply = () => {
    setFilterProduct(selectedProduct);
    setFilterSector(selectedSector);
    setDisplayedCount(18);
  };

  const handleClearFilters = () => {
    setSelectedProduct('');
    setSelectedSector('');
    setFilterProduct('');
    setFilterSector('');
    setDisplayedCount(18);
  };

  const handleImageLoad = (id: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, loaded: true } : project
      )
    );
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
        <div className="description">Gibca Furniture Industry Co. Ltd. (L.L.C) offers operable partitions including walls and doors, upholding global standards. Regular maintenance ensures optimal performance and safety, keeping your partitions functional and secure.</div>

        {/* Filter UI */}
        <div className="filter-bar">
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="filter-select">
            <option value="">All Products</option>
            {allProducts.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} className="filter-select">
            <option value="">All Sectors</option>
            {filteredSectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button onClick={handleApply} className="filter-apply-btn">APPLY</button>
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
      </div>
    </>
  );
}