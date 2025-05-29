'use client';
import { useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Banner from './components/Banner';
import Stats from './components/Stats';
import Products from './components/Products';
import AnimatedSection from './components/AnimatedSection';
import ContactUs from './components/ContactUs';
import FloatingSidebar from './components/FloatingSidebar';

export default function HomePageContent({ fields }: { fields: any }) {
  const [showSplash, setShowSplash] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Helper: determine if splash should be shown based on page navigation type
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        // Page loaded from bfcache (back/forward), skip splash immediately
        setShowSplash(false);
      } else {
        // Normal fresh load or reload, show splash
        setShowSplash(true);
      }
    }

    // Add pageshow listener for bfcache detection
    window.addEventListener('pageshow', handlePageShow);

    // Check on initial mount using PerformanceNavigationTiming
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navEntry?.type === 'back_forward') {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }

    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  // When splash finishes, mark page loaded to show main content
  const onSplashFinish = () => {
    setShowSplash(false);
    setPageLoaded(true);
  };

  // Scroll reset on mount and before unload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Prepare products list from fields
  const products = Array.from({ length: 7 }, (_, i) => {
    const title = fields[`product${i + 1}Title`];
    const image = fields[`product${i + 1}Image`];
    return title && image ? { title, image } : null;
  }).filter(Boolean);

  return (
    <>
      {showSplash && <SplashScreen onFinish={onSplashFinish} />}

      <main style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
        <Header />
        <FloatingSidebar />

        <Banner
          heading={fields.bannerHeading}
          images={[fields.bannerImage1, fields.bannerImage2, fields.bannerImage3]}
        />

        <AnimatedSection animation="fadeUp" delay={0.6}>
          <Stats
            experience={fields.yearsOfExperience}
            clients={fields.numberOfClients}
            totalworkforce={fields.workforce}
            totalprojects={fields.projectsCompleted}
            key={pageLoaded ? 'loaded' : 'loading'}
          />
        </AnimatedSection>

        <AnimatedSection animation="slideRight" delay={0.1}>
          <Products description={fields.productsDescription} products={products} />
        </AnimatedSection>

        <ContactUs />
      </main>
    </>
  );
}
