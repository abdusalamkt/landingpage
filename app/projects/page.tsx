'use client';
import { useEffect, useState } from 'react';
import './projects.css';  // Import the CSS file
import Header from '../components/Header';

type Project = {
  title: string;
  image: string;
  products: string[];
  sectors: string[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data || []);
      });
  }, []);

  const allProducts = Array.from(new Set(projects.flatMap(p => p.products)));
  const allSectors = Array.from(new Set(projects.flatMap(p => p.sectors)));

  useEffect(() => {
    let result = [...projects];
    if (selectedProduct) {
      result = result.filter(p => p.products.includes(selectedProduct));
    }
    if (selectedSector) {
      result = result.filter(p => p.sectors.includes(selectedSector));
    }
    setFiltered(result);
  }, [selectedProduct, selectedSector, projects]);

  return (
    <>
    <Header/>
    <div className="container">
      <h1 className="page-title">Projects</h1>

      <div className="filters">
        <select onChange={e => setSelectedProduct(e.target.value || null)} className="select-filter">
          <option value="">All Products</option>
          {allProducts.map(tag => <option key={tag}>{tag}</option>)}
        </select>

        <select onChange={e => setSelectedSector(e.target.value || null)} className="select-filter">
          <option value="">All Sectors</option>
          {allSectors.map(tag => <option key={tag}>{tag}</option>)}
        </select>
      </div>

      <div className="grid">
  {filtered.map((p, i) => (
    <div
      key={i}
      className={`item ${p.sizeClass || ''}`}  /* e.g. item--medium, item--large, item--full */
      style={{ backgroundImage: `url(${p.image})` }}
    >
      <div className="item__details">{p.title}</div>
    </div>
  ))}
</div>
    </div>
    </>
  );
}
