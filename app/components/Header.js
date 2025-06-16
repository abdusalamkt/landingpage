'use client';
import { useState, useEffect, useRef } from 'react';
import './Header.css';
import ContactUsModal from './ContactUsModal';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  // Hardcoded static logo URL - replace with your actual logo path
  const logoUrl = '/Logo.PNG';  // or '/images/logo.png' or an absolute URL

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderHidden(currentScrollY > lastScrollY.current && currentScrollY > 100);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dropdownItems = {
    products: [
      { name: 'CROWN', link: '#' },
      { name: 'HUFCOR', link: '#' },
      { name: 'HPL', link: '#' },
      { name: 'OPS', link: '#' },
    ],
    resources: [
      { name: 'Blogs', link: '#' },
      { name: 'Case Studies', link: '#' },
      { name: 'Downloads', link: '/downloads' },
    ],
  };

  return (
    <>
      <header className={`site-header ${isHeaderHidden ? 'hide' : ''}`}>
        <div className="logo" id="headerLogo">
          <a href="./#">
            <img src={logoUrl} alt="Logo" />
          </a>
        </div>
        <nav className="nav-menu">
          <ul>
            <li>
              <a href="/about-gibca" className={pathname === '/about-gibca' ? 'active' : ''}>
                ABOUT US
              </a>
            </li>
            <li
              className="dropdown-parent"
              onMouseEnter={() => toggleDropdown('products')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <div className="dropdown-trigger">
                <a href="/our-products" className={pathname === '/our-products' ? 'active' : ''}>
                  PRODUCTS
                </a>
                <span className={`dropdown-arrow ${activeDropdown === 'products' ? 'active' : ''}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className={`dropdown-menu ${activeDropdown === 'products' ? 'active' : ''}`}>
                {dropdownItems.products.map((item, index) => (
                  <a href={item.link} key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                    {item.name}
                  </a>
                ))}
              </div>
            </li>
            <li><a href="#">SERVICE & MAINTENANCE</a></li>
            <li>
              <a href="/projects" className={pathname === '/projects' ? 'active' : ''}>
                PROJECTS
              </a>
            </li>
            <li
              className="dropdown-parent"
              onMouseEnter={() => toggleDropdown('resources')}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <div className="dropdown-trigger">
                <a href="#">RESOURCES</a>
                <span className={`dropdown-arrow ${activeDropdown === 'resources' ? 'active' : ''}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className={`dropdown-menu ${activeDropdown === 'resources' ? 'active' : ''}`}>
                {dropdownItems.resources.map((item, index) => (
                  <a href={item.link} key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                    {item.name}
                  </a>
                ))}
              </div>
            </li>
            <li>
              <a href="/contact-us" className={pathname === '/contact-us' ? 'active' : ''}>
                CONTACT US
              </a>
            </li>
            <li>
              <button className="flashing-arrow-btn" onClick={() => setShowQuoteModal(true)}>
                <span className="flashing-arrow-btn__img">
                  <svg width="34" height="24" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#000" />
                        <stop offset="100%" stopColor="#000" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="url(#arrow-gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                GET A FREE QUOTE
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {showQuoteModal && <ContactUsModal onClose={() => setShowQuoteModal(false)} />}
    </>
  );
}
