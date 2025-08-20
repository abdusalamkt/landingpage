'use client';
import { useState, useEffect, useRef } from 'react';
import './Header.css';
import ContactUsModal from './ContactUsModal';
import { usePathname } from 'next/navigation';
import AppointmentModal from './AppointmentModal';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  const logoUrl = '/Logo.PNG';

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    setActiveSubmenu(null); // Reset submenu when changing main dropdown
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setActiveDropdown(null);
    setActiveSubmenu(null);
  };

  const handleSubmenuEnter = (submenu) => {
    setActiveSubmenu(submenu);
  };

  const handleSubmenuLeave = () => {
    setActiveSubmenu(null);
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
      {
        name: 'HUFCOR movable walls',
        link: '/our-products/hufcor',
        submenu: [
          {
            name: 'Operable Walls',
            items: [
              { name: '600 Series', link: '/our-products/hufcor/operable-walls/600-series-operable-walls' },
              { name: '7000 Series', link: '/our-products/hufcor/operable-walls/7000-series-operable-walls' },
            ]
          },
          {
            name: 'Glass Walls',
            items: [
              { name: 'ACOUSTIC GLASSWALLS', link: '/our-products/hufcor/movable-glass-walls/acoustic-glass-walls' },
              { name: 'FRAMELESS GLASSWALLS', link: '/our-products/hufcor/movable-glass-walls/frameless-glass-walls' },
              { name: 'WEATHER RESISTANT GLASSWALLS', link: '/our-products/hufcor/movable-glass-walls/weather-resistant-glass-walls' },
            ]
          }
        ]
      },
      {
  name: 'HPL solutions',
  link: '/our-products/gibca-compact-laminate-solutions',
  submenu: [
    {
      items: [
        { name: 'Washroom cubicles', link: '/our-products/gibca-compact-laminate-solutions/washroom-cubicles' },
        { name: 'LOCKER SYSTEMS', link: '/our-products/hpl/decorative' },
        { name: 'WALL CLADDING', link: '/our-products/hpl/fire-retardant' },
        { name: 'INTEGRATED PANEL SYSTEMS', link: '/our-products/gibca-compact-laminate-solutions/integrated-panel-systems' },
        { name: 'OUTDOOR FURNITURES', link: '/our-products/hpl/weather-resistant' },
      ]
    }
  ]
},
      {
        name: 'Office Partitions & doors',
        link: '#',
        // submenu: [
        //   {
        //     name: 'Operable Partitions',
        //     items: [
        //       { name: 'Single Panel Systems', link: '/our-products/ops/single-panel' },
        //       { name: 'Multi-Panel Systems', link: '/our-products/ops/multi-panel' },
        //       { name: 'Bi-Fold Systems', link: '/our-products/ops/bi-fold' },
        //       { name: 'Top Hung Systems', link: '/our-products/ops/top-hung' },
        //     ]
        //   },
        //   {
        //     name: 'Specialty Systems',
        //     items: [
        //       { name: 'Soundproof Partitions', link: '/our-products/ops/soundproof' },
        //       { name: 'Fire Rated Systems', link: '/our-products/ops/fire-rated' },
        //       { name: 'Curved Partitions', link: '/our-products/ops/curved' },
        //       { name: 'Automated Systems', link: '/our-products/ops/automated' },
        //     ]
        //   }
        // ]
      },
      {
        name: 'terrace solutions',
        link: '/our-products/terrace-solutions',
        
      },
      {
        name: 'hydraulic doors',
        link: '/our-products/crown',
        submenu: [
          {
           
            items: [
              { name: 'SST-II Bi-Fold', link: '/our-products/crown/wall-panels' },
              { name: 'SINGLE SWING', link: '/our-products/crown/ceiling-systems' },
              { name: '50/50', link: '/our-products/crown/moldings' },
            ]
          }
        ]
      },
      {
        name: 'Pivot Doors',
        link: '/our-products/pivot-doors',
        // submenu: [
        //   {
        //     name: 'Residential Doors',
        //     items: [
        //       { name: 'Entry Doors', link: '/our-products/pivot-doors/entry' },
        //       { name: 'Interior Doors', link: '/our-products/pivot-doors/interior' },
        //       { name: 'Patio Doors', link: '/our-products/pivot-doors/patio' },
        //       { name: 'Security Doors', link: '/our-products/pivot-doors/security' },
        //     ]
        //   },
        //   {
        //     name: 'Commercial Doors',
        //     items: [
        //       { name: 'Office Entry Systems', link: '/our-products/pivot-doors/office-entry' },
        //       { name: 'Hotel Lobby Doors', link: '/our-products/pivot-doors/hotel-lobby' },
        //       { name: 'Retail Store Fronts', link: '/our-products/pivot-doors/retail' },
        //       { name: 'Restaurant Entrances', link: '/our-products/pivot-doors/restaurant' },
        //     ]
        //   }
        // ]
      }
    ],
    resources: [
      { name: 'Blogs', link: '/blogs' },
      { name: 'Case Studies', link: '/case-study' },
      { name: 'Downloads', link: '/downloads' },
    ],
  };

  return (
    <>
      <header className={`site-header ${isHeaderHidden ? 'hide' : ''}`}>
        <div className="logo" id="headerLogo">
          <a href="/">
            <img src={logoUrl} alt="Logo" />
          </a>
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li>
              <a href="/about-gibca" className={pathname === '/about-gibca' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>
                ABOUT US
              </a>
            </li>
            <li
              className="dropdown-parent"
              onMouseEnter={() => !isMobileMenuOpen && toggleDropdown('products')}
              onMouseLeave={() => !isMobileMenuOpen && toggleDropdown(null)}
            >
              <div className="dropdown-trigger" onClick={() => isMobileMenuOpen && toggleDropdown('products')}>
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
                  <div
                    key={index}
                    className="dropdown-item-with-submenu"
                    onMouseEnter={() => handleSubmenuEnter(item.name)}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <a 
                      href={item.link} 
                      className="main-dropdown-link"
                      onClick={() => setIsMobileMenuOpen(false)} 
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      {item.name}
                      <span className="submenu-arrow">
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                          <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </a>
                    {item.submenu && (
                      <div className={`submenu ${activeSubmenu === item.name ? 'active' : ''}`}>
                        {item.submenu.map((subCategory, subIndex) => (
                          <div key={subIndex} className="submenu-category">
                            <h4 className="submenu-title">{subCategory.name}</h4>
                            <div className="submenu-items">
                              {subCategory.items.map((subItem, itemIndex) => (
                                <a
                                  key={itemIndex}
                                  href={subItem.link}
                                  className="submenu-item"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  style={{ transitionDelay: `${itemIndex * 0.05}s` }}
                                >
                                  {subItem.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </li>
            <li><a href="/service-and-maintenance" className={pathname === '/service-and-maintenance' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>SERVICE & MAINTENANCE</a></li>
            <li>
              <a href="/projects" className={pathname === '/projects' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>
                PROJECTS
              </a>
            </li>
            <li
              className="dropdown-parent"
              onMouseEnter={() => !isMobileMenuOpen && toggleDropdown('resources')}
              onMouseLeave={() => !isMobileMenuOpen && toggleDropdown(null)}
            >
              <div className="dropdown-trigger" onClick={() => isMobileMenuOpen && toggleDropdown('resources')}>
                <a href="#">RESOURCES</a>
                <span className={`dropdown-arrow ${activeDropdown === 'resources' ? 'active' : ''}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className={`dropdown-menu ${activeDropdown === 'resources' ? 'active' : ''}`}>
                {dropdownItems.resources.map((item, index) => (
                  <a href={item.link} key={index} onClick={() => setIsMobileMenuOpen(false)} style={{ transitionDelay: `${index * 0.1}s` }}>
                    {item.name}
                  </a>
                ))}
              </div>
            </li>
            <li>
              <a href="/contact-us" className={pathname === '/contact-us' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>
                CONTACT US
              </a>
            </li>
            <li>
              <button className="flashing-arrow-btn" onClick={() => { setShowQuoteModal(true); setIsMobileMenuOpen(false); }}>
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
                BOOK AN APPOINTMENT
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {showQuoteModal && (
        <AppointmentModal isOpen={true} onClose={() => setShowQuoteModal(false)} />
      )}
    </>
  );
}