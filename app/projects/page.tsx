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
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data || []);
      });
  }, []);

  const allProducts = useMemo(
    () => Array.from(new Set(projects.flatMap(p => p.products))),
    [projects]
  );
  const allSectors = useMemo(
    () => Array.from(new Set(projects.flatMap(p => p.sectors))),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const productMatch = selectedProduct ? p.products.includes(selectedProduct) : true;
      const sectorMatch = selectedSector ? p.sectors.includes(selectedSector) : true;
      return productMatch && sectorMatch;
    });
  }, [projects, selectedProduct, selectedSector]);

  return (
    <>
      <Header />
      <FloatingSidebar />
      <div className="container">
        <h1 className="page-title">Projects</h1>

        <div className="filters">
          <label>
            <span>Product:</span>
            <select
              onChange={e => setSelectedProduct(e.target.value)}
              value={selectedProduct}
              className="select-filter"
            >
              <option value="">All Products</option>
              {allProducts.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Sector:</span>
            <select
              onChange={e => setSelectedSector(e.target.value)}
              value={selectedSector}
              className="select-filter"
            >
              <option value="">All Sectors</option>
              {allSectors.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p, i) => (
              <div key={i} className={`item ${p.sizeClass || ''}`}>
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
  <div className="item__details">{p.title}</div>
</div>

            ))
          ) : (
            <p className="no-results">No projects match your filters.</p>
          )}
        </div>
      </div>
    </>
  );
}
