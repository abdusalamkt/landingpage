'use client';
import { useState, useEffect, useRef } from 'react';
import './Header.css';
import ContactUsModal from './ContactUsModal';
import { usePathname, useRouter } from 'next/navigation';
import AppointmentModal from './AppointmentModal';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState({});
  const pathname = usePathname();
  const router = useRouter();
  const lastScrollY = useRef(0);

  const logoUrl = '/logos/2025 GIBCA LOGO BLACK.png';

  const toggleDropdown = (dropdown) => {
    if (window.innerWidth <= 1280) {
      // Mobile behavior
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    } else {
      // Desktop behavior
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
      setActiveSubmenu(null);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMobileMenuOpen) {
      setActiveDropdown(null);
      setActiveSubmenu(null);
      setMobileSubmenuOpen({});
      document.body.classList.remove('mobile-menu-open');
    } else {
      document.body.classList.add('mobile-menu-open');
    }
  };

  const toggleMobileSubmenu = (itemName) => {
    setMobileSubmenuOpen(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleSubmenuEnter = (submenu) => {
    if (window.innerWidth > 1280) {
      setActiveSubmenu(submenu);
    }
  };

  const handleSubmenuLeave = () => {
    if (window.innerWidth > 1280) {
      setActiveSubmenu(null);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveSubmenu(null);
    setMobileSubmenuOpen({});
    document.body.classList.remove('mobile-menu-open');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY > 100 && scrollDelta > 0) {
        setIsHeaderHidden(true);
      } else if (scrollDelta < -30) { 
        setIsHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

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
              { name: 'LOCKER SYSTEMS', link: '/our-products/gibca-compact-laminate-solutions/locker-systems' },
              { name: 'WALL CLADDING', link: '/our-products/gibca-compact-laminate-solutions/internal-wall-cladding' },
              { name: 'INTEGRATED PANEL SYSTEMS', link: '/our-products/gibca-compact-laminate-solutions/integrated-panel-systems' },
              { name: 'OUTDOOR FURNITURES', link: '/our-products/gibca-compact-laminate-solutions/outdoor-furniture' },
            ]
          }
        ]
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
              { name: 'SST-II Bi-Fold', link: '/our-products/crown/sst-ii-hydraulic-bi-fold' },
              { name: 'SINGLE SWING', link: '/our-products/crown/single-swing' },
              { name: '50/50', link: '/our-products/crown/50-50' },
            ]
          }
        ]
      },
      {
        name: 'Pivot Doors',
        link: '/our-products/pivot-doors',
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
      {/* Fixed Media Buttons */}
      <div className={`media-career-buttons ${isHeaderHidden ? 'hide' : ''}`}>
        <button className="media-btn" onClick={() => window.open('/careers', '_blank')}>
          <span>CAREERS</span>
        </button>
        <button className="media-btn" onClick={() => window.open('/media', '_blank')}>
          <span>MEDIA</span>
        </button>
      </div>

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
              <a href="/about-gibca" className={pathname === '/about-gibca' ? 'active' : ''} onClick={closeMobileMenu}>
                ABOUT US
              </a>
            </li>
            <li
              className="dropdown-parent"
              onMouseEnter={() => window.innerWidth > 1280 && toggleDropdown('products')}
              onMouseLeave={() => window.innerWidth > 1280 && toggleDropdown(null)}
            >
              <div className="dropdown-trigger" onClick={() => toggleDropdown('products')}>
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
                    className={`dropdown-item-with-submenu ${mobileSubmenuOpen[item.name] ? 'submenu-open' : ''}`}
                    onMouseEnter={() => handleSubmenuEnter(item.name)}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <a 
                      href={item.link} 
                      className="main-dropdown-link"
                      onClick={(e) => {
                        if (window.innerWidth <= 1280 && item.submenu) {
                          e.preventDefault();
                          toggleMobileSubmenu(item.name);
                        } else {
                          closeMobileMenu();
                        }
                      }}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      {item.name}
                      {item.submenu && (
                        <span className="submenu-arrow">
                          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </span>
                      )}
                    </a>
                    {item.submenu && (
                      <div className={`submenu ${window.innerWidth <= 1280 ? (mobileSubmenuOpen[item.name] ? 'active' : '') : (activeSubmenu === item.name ? 'active' : '')}`}>
                        {item.submenu.map((subCategory, subIndex) => (
                          <div key={subIndex} className="submenu-category">
                            {subCategory.name && <h4 className="submenu-title">{subCategory.name}</h4>}
                            <div className="submenu-items">
                              {subCategory.items.map((subItem, itemIndex) => (
                                <a
                                  key={itemIndex}
                                  href={subItem.link}
                                  className="submenu-item"
                                  onClick={closeMobileMenu}
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
            <li><a href="/service-and-maintenance" className={pathname === '/service-and-maintenance' ? 'active' : ''} onClick={closeMobileMenu}>SERVICE & MAINTENANCE</a></li>
            <li>
              <a href="/projects" className={pathname === '/projects' ? 'active' : ''} onClick={closeMobileMenu}>
                PROJECTS
              </a>
            </li>
            <li
              className="dropdown-parent"
              onMouseEnter={() => window.innerWidth > 1280 && toggleDropdown('resources')}
              onMouseLeave={() => window.innerWidth > 1280 && toggleDropdown(null)}
            >
              <div className="dropdown-trigger" onClick={() => toggleDropdown('resources')}>
                <a href="#">RESOURCES</a>
                <span className={`dropdown-arrow ${activeDropdown === 'resources' ? 'active' : ''}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className={`dropdown-menu ${activeDropdown === 'resources' ? 'active' : ''}`}>
                {dropdownItems.resources.map((item, index) => (
                  <a href={item.link} key={index} onClick={closeMobileMenu} style={{ transitionDelay: `${index * 0.1}s` }}>
                    {item.name}
                  </a>
                ))}
              </div>
            </li>
            <li>
              <a href="/contact-us" className={pathname === '/contact-us' ? 'active' : ''} onClick={closeMobileMenu}>
                CONTACT US
              </a>
            </li>
            <li>
              <button className="flashing-arrow-btn" onClick={() => { setShowQuoteModal(true); closeMobileMenu(); }}>
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

      {/* Back Button - Integrated with Header */}
      {pathname !== '/' && (
        <div className={`back-button-container ${isHeaderHidden ? 'header-hidden' : ''}`}>
          <button 
            className="glass-back-button"
            onClick={handleGoBack}
            aria-label="Go back"
          >
            <svg 
              className="back-button-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M19 12H5M5 12L12 19M5 12L12 5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="back-tooltip">back</span>
          </button>
        </div>
      )}

      {showQuoteModal && (
        <AppointmentModal isOpen={true} onClose={() => setShowQuoteModal(false)} />
      )}
    </>
  );
}