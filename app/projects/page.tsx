'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import './projects.css';
import Header from '../components/Header';
import FloatingSidebar from '../components/FloatingSidebar';

type Project = {
  title: string;
  image: string;
  products: string[];
  sectors: string[];
  sizeClass?: string;
};

export default function ProjectsPage() {
  
  const [projects] = useState<Project[]>([ {
      title: 'Project 1', image: '/5677.jpg', products: ['Partitions', 'Doors'], sectors: ['Commercial', 'Education'] },
    {
      title: 'Project 2', image: '/896.jpg', products: ['Walls'], sectors: ['Healthcare'] },
    {
      title: 'Project 3', image: '/5677.jpg', products: ['Doors'], sectors: ['Residential'] },
    {
      title: 'Project 4', image: '/896.jpg', products: ['Partitions'], sectors: ['Commercial'] },
    {
      title: 'Project 5', image: '/5677.jpg', products: ['Walls', 'Doors'], sectors: ['Education'] },
    {
      title: 'Project 6', image: '/896.jpg', products: ['Partitions'], sectors: ['Healthcare'] },
    {
      title: 'Project 7', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 8', image: '/896.jpg', products: ['Doors'], sectors: ['Commercial'] },
    {
      title: 'Project 9', image: '/5677.jpg', products: ['Partitions', 'Doors'], sectors: ['Commercial', 'Education'] },
    {
      title: 'Project 10', image: '/5677.jpg', products: ['Walls'], sectors: ['Healthcare'] },
    {
      title: 'Project 11', image: '/5677.jpg', products: ['Doors'], sectors: ['Residential'] },
    {
      title: 'Project 12', image: '/5677.jpg', products: ['Partitions'], sectors: ['Commercial'] },
    {
      title: 'Project 13', image: '/5677.jpg', products: ['Walls', 'Doors'], sectors: ['Education'] },
    {
      title: 'Project 14', image: '/5677.jpg', products: ['Partitions'], sectors: ['Healthcare'] },
    {
      title: 'Project 15', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 16', image: '/5677.jpg', products: ['Doors'], sectors: ['Commercial'] },
    {
      title: 'Project 17', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 18', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 19', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 20', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 21', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 22', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 23', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] },
    {
      title: 'Project 24', image: '/5677.jpg', products: ['Walls'], sectors: ['Residential'] }]);

  // Filter state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // Tooltip state
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: '' });

  // Pagination state
  const [displayedCount, setDisplayedCount] = useState(18);
  const [isLoading, setIsLoading] = useState(false);

  // Compute available products from full project list
  const allProducts = useMemo(() => [...new Set(projects.flatMap(p => p.products))], [projects]);

  // Compute sectors based on selected product
  const filteredSectors = useMemo(() => {
    if (!selectedProduct) {
      return [...new Set(projects.flatMap(p => p.sectors))];
    }

    return [
      ...new Set(
        projects
          .filter(p => p.products.includes(selectedProduct))
          .flatMap(p => p.sectors)
      )
    ];
  }, [selectedProduct, projects]);

  // Apply filters only after clicking "Apply"
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const productMatch = filterProduct ? p.products.includes(filterProduct) : true;
      const sectorMatch = filterSector ? p.sectors.includes(filterSector) : true;
      return productMatch && sectorMatch;
    });
  }, [projects, filterProduct, filterSector]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, displayedCount);
  }, [filteredProjects, displayedCount]);

  const hasMore = displayedCount < filteredProjects.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedCount(prev => prev + 18);
      setIsLoading(false);
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent, title: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({ visible: true, x, y: y + 20, title });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, title: '' });
  };

  const handleApply = () => {
    setFilterProduct(selectedProduct);
    setFilterSector(selectedSector);
    setDisplayedCount(18); // reset pagination on filter
  };

  return (
    <>
      <Header />
      <FloatingSidebar />

      <div className="projects-gallery-container">
        <h1 className="gallery-title">GALLERY</h1>
        <p className="gallery-subtitle">
          Gibca Furniture Industry Co. Ltd. (LLC) offers operable partitions including walls and doors, upholding global standards.
          <br />
          Regular maintenance ensures optimal performance and safety, keeping your partitions functional and secure.
        </p>

        {/* Filter Section */}
        <div className="filter-bar">
          <select
            onChange={e => setSelectedProduct(e.target.value)}
            value={selectedProduct}
            className="filter-select"
          >
            <option value="">Select Product</option>
            {allProducts.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            onChange={e => setSelectedSector(e.target.value)}
            value={selectedSector}
            className="filter-select"
          >
            <option value="">Select Sector</option>
            {filteredSectors.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <button className="filter-apply-btn" onClick={handleApply}>
            APPLY
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {displayedProjects.length > 0 ? (
            displayedProjects.map((p, i) => {
              const sizeVariants = ['wide', 'tall', 'big', ''];
              const sizeClass = p.sizeClass || sizeVariants[i % sizeVariants.length];

              return (
                <div
                  key={i}
                  className={`gallery-card ${sizeClass}`}
                  onMouseMove={(e) => handleMouseMove(e, p.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="image-wrapper">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={i < 4}
                      quality={80}
                    />
                  </div>

                  {tooltip.visible && tooltip.title === p.title && (
                    <div
                      className="cursor-tooltip"
                      style={{
                        left: tooltip.x - 60,
                        top: tooltip.y
                      }}
                    >
                      <div className="tooltip-content">
                        <h3 className="tooltip-title">{p.title}</h3>
                        <p className="tooltip-category">Project</p>
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
              className={`load-more-btn ${isLoading ? 'loading' : ''}`}
              onClick={loadMore}
              disabled={isLoading}
            >
              {isLoading ? (
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
