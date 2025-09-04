"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CaseStudiesClient({ allStudies }: { allStudies: any[] }) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [filteredStudies, setFilteredStudies] = useState(allStudies);
  const [showProducts, setShowProducts] = useState<boolean>(true);
  const [showSectors, setShowSectors] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  const productsList = Array.from(
    new Set(
      allStudies.flatMap((study) => study.productsCaseStudy.nodes.map((p: any) => p.name))
    )
  );

  const sectorsList = Array.from(
    new Set(
      allStudies.flatMap((study) => study.sectorsCaseStudy.nodes.map((s: any) => s.name))
    )
  );

  const filteredSectors = selectedProducts.length
    ? Array.from(
        new Set(
          allStudies
            .filter((study) =>
              study.productsCaseStudy.nodes.some((p: any) => selectedProducts.includes(p.name))
            )
            .flatMap((study) => study.sectorsCaseStudy.nodes.map((s: any) => s.name))
        )
      )
    : sectorsList;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowProducts(false);
        setShowSectors(false);
      } else {
        setShowProducts(true);
        setShowSectors(true);
      }
    };

    handleResize();
    const timeout = setTimeout(() => setIsLoading(false), 800);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const toggleCheckbox = (value: string, setList: any, list: string[]) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const resetFilters = () => {
    setSelectedProducts([]);
    setSelectedSectors([]);
    setFilteredStudies(allStudies);
  };

  const applyFilters = () => {
    const filtered = allStudies.filter((item) => {
      const itemProducts = item.productsCaseStudy.nodes.map((p: any) => p.name);
      const itemSectors = item.sectorsCaseStudy.nodes.map((s: any) => s.name);
      const matchProduct =
        selectedProducts.length === 0 || selectedProducts.some((p) => itemProducts.includes(p));
      const matchSector =
        selectedSectors.length === 0 || selectedSectors.some((s) => itemSectors.includes(s));
      return matchProduct && matchSector;
    });

    setFilteredStudies(filtered);
  };

  return (
    <div className="case-study-container">
      <aside className="filter-panel">
        <div className="filter-header">
          <div className="header-left">
            <span className="filter-icon">⚙</span>
            <span>FILTER CASE STUDY</span>
          </div>
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>

        <div className="filter-group">
          <div className="filter-heading-box" onClick={() => setShowProducts(!showProducts)}>
            <h4>PRODUCT</h4>
            <span className="toggle-icon">{showProducts ? "-" : "+"}</span>
          </div>
          <div className={`collapsible ${showProducts ? "open" : ""}`}>
            {productsList.map((prod) => (
              <label key={prod}>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(prod)}
                  onChange={() => toggleCheckbox(prod, setSelectedProducts, selectedProducts)}
                />
                {prod}
                <hr />
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-heading-box" onClick={() => setShowSectors(!showSectors)}>
            <h4>SECTOR</h4>
            <span className="toggle-icon">{showSectors ? "-" : "+"}</span>
          </div>
          <div className={`collapsible ${showSectors ? "open" : ""}`}>
            {filteredSectors.length ? (
              filteredSectors.map((sector) => (
                <label key={sector}>
                  <input
                    type="checkbox"
                    checked={selectedSectors.includes(sector)}
                    onChange={() => toggleCheckbox(sector, setSelectedSectors, selectedSectors)}
                  />
                  {sector}
                  <hr />
                </label>
              ))
            ) : (
              <p style={{ paddingLeft: "10px", fontStyle: "italic" }}>No sectors available</p>
            )}
          </div>
        </div>

        <button className="apply-btn" onClick={applyFilters}>
          APPLY
        </button>
      </aside>

      <section className="card-grid">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-animation">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading Case Studies</div>
              <div className="loading-dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            </div>
          </div>
        ) : (
          filteredStudies.map((item: any, idx: number) => (
            <Link key={idx} href={`/case-study/${item.slug}`} className="case-card"
              style={{
                backgroundImage: `url(${item.caseStudyFields?.thumbnailImage?.sourceUrl})`,
              }}
            >
              <div className="case-title">
                <div className={`scrolling-text ${item.title.length > 25 ? 'long-title' : ''}`}>
                  <span className="title-text">{item.title}</span>
                </div>
                <hr />
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}