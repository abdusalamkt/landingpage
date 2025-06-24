// app/case-studies/page.tsx
"use client";

import { useEffect, useState } from "react";
import './casestudies.css';
import Header from "@/app/components/Header";

const productsList = ["Hufcor", "Crown", "Arktura", "Acristalia", "Pivot Doors", "Office Partitions", "HPL Solutions"];
const sectorsList = ["Airport", "Sports Facilities", "Education", "Healthcare", "Government", "Mall", "Convention Center"];

const allCaseStudies = [
  { title: "Abrahamic Family House", image: "http://test.shopgfiuae.com/wp-content/uploads/2025/06/2-2.jpg", product: "Hufcor", sector: "Government" },
  { title: "Al Thuraya Tower", image: "http://test.shopgfiuae.com/wp-content/uploads/2025/05/GIBCA-HIGH-PRESSURE-COMPACT-LAMINATE-LOCKER-SYSTEMS.png", product: "Pivot Doors", sector: "Mall" },
  { title: "Dubai Mall", image: "http://test.shopgfiuae.com/wp-content/uploads/2025/05/GFI_Museum-of-the-future5-1.webp", product: "Crown", sector: "Mall" },
  { title: "Office Project", image: "http://test.shopgfiuae.com/wp-content/uploads/2018/11/robot-2589090_1920-1.webp", product: "Office Partitions", sector: "Education" },
  { title: "City Office", image: "http://test.shopgfiuae.com/wp-content/uploads/2018/10/port-3109757_1920-1.webp", product: "Acristalia", sector: "Healthcare" },
  { title: "Tech Hub", image: "http://test.shopgfiuae.com/wp-content/uploads/2018/10/hallway-1245845_1920-1.webp", product: "HPL Solutions", sector: "Education" },
  { title: "Skyview Center", image: "http://test.shopgfiuae.com/wp-content/uploads/2018/10/hall-1929422_1920-1.webp", product: "Arktura", sector: "Government" },
  { title: "Business Bay", image: "http://test.shopgfiuae.com/wp-content/uploads/2025/06/2-2.jpg", product: "Crown", sector: "Mall" },
  { title: "Innovation Lab", image: "http://test.shopgfiuae.com/wp-content/uploads/2018/10/port-3109757_1920-1.webp", product: "Pivot Doors", sector: "Airport" },
  { title: "Exhibition Hall", image: "http://test.shopgfiuae.com/wp-content/uploads/2018/10/hallway-1245845_1920-1.webp", product: "Hufcor", sector: "Convention Center" },
  { title: "Library Project", image: "/case-studies/11.jpg", product: "Office Partitions", sector: "Education" },
  { title: "VIP Lounge", image: "/case-studies/12.jpg", product: "Acristalia", sector: "Airport" },
];

export default function CaseStudies() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [filteredStudies, setFilteredStudies] = useState(allCaseStudies);
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const [showSectors, setShowSectors] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

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
    
    // Set initial state based on window size
    handleResize();
    
    // Simulate loading delay
    const loadingTimeout = setTimeout(() => setIsLoading(false), 1000);
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(loadingTimeout);
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
    setFilteredStudies(allCaseStudies);
  };

  const applyFilters = () => {
    const filtered = allCaseStudies.filter((item) => {
      const matchesProduct = selectedProducts.length ? selectedProducts.includes(item.product) : true;
      const matchesSector = selectedSectors.length ? selectedSectors.includes(item.sector) : true;
      return matchesProduct && matchesSector;
    });
    setFilteredStudies(filtered);
  };

  return (
    <>
      <Header />
      <div className="case-study-container">
        <aside className="filter-panel">
          <div className="filter-header">
            <div className="header-left">
              <span className="filter-icon">⚙</span>
              <span>FILTER CASE STUDY</span>
            </div>
            <button className="reset-btn" onClick={resetFilters}>Reset</button>
          </div>

          <div className="filter-group">
            <div className="filter-heading-box" onClick={() => setShowProducts(!showProducts)}>
              <h4>PRODUCT</h4>
              <span className="toggle-icon">{showProducts ? "-" : "+"}</span>
            </div>
            <div className={`collapsible ${showProducts ? 'open' : ''}`}>
              {productsList.map((prod) => (
                <label key={prod}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(prod)}
                    onChange={() => toggleCheckbox(prod, setSelectedProducts, selectedProducts)}
                  /> {prod}
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
            <div className={`collapsible ${showSectors ? 'open' : ''}`}>
              {sectorsList.map((sector) => (
                <label key={sector}>
                  <input
                    type="checkbox"
                    checked={selectedSectors.includes(sector)}
                    onChange={() => toggleCheckbox(sector, setSelectedSectors, selectedSectors)}
                  /> {sector}
                  <hr />
                </label>
              ))}
            </div>
          </div>

          <button className="apply-btn" onClick={applyFilters}>APPLY</button>
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
            filteredStudies.map((item, idx) => (
              <div
                key={idx}
                className="case-card"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="case-title">
                  <span>{item.title}</span>
                  <hr />
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}