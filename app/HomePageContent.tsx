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
import NewsBanner from './components/NewsBanner';
import ImageLayout from './components/ImageLayout';
import ResourcesSection from './components/ResourcesSection';
import OurClientsSection from './components/OurClientsSection';
import TestimonialSlider from './components/TestimonialSlider';
import GetInTouchSection from './components/GetInTouchSection';
// import './globals.css';

type ProductImage = {
  sourceUrl: string;
  altText: string;
};

type Product = {
  title: string;
  image: ProductImage;
  link: string;
};

export default function HomePageContent({ fields }: { fields: any }) {
  const [showSplash, setShowSplash] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        setShowSplash(false);
      } else {
        setShowSplash(true);
      }
    }

    window.addEventListener('pageshow', handlePageShow);

    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navEntry?.type === 'back_forward') {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }

    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const onSplashFinish = () => {
    setShowSplash(false);
    setPageLoaded(true);
  };

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

  // Normalize image data: handle if image is string or object
  const normalizeImage = (img: any): ProductImage => {
    if (!img) return { sourceUrl: '', altText: '' };
    if (typeof img === 'string') return { sourceUrl: img, altText: '' };
    return {
      sourceUrl: img.sourceUrl || img.url || '',
      altText: img.altText || img.alt || '',
    };
  };

  const products: Product[] = Array.from({ length: 7 }, (_, i) => {
    const title = fields[`product${i + 1}Title`];
    const rawImage = fields[`product${i + 1}Image`];
    const link = fields[`product${i + 1}Link`] || '#'; // fallback to '#'

    const image = normalizeImage(rawImage);

    return title && image.sourceUrl && link ? { title, image, link } : null;
  }).filter((p): p is Product => p !== null);

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

        <AnimatedSection animation="fadeUp" delay={0.4}>
          <NewsBanner
            heading={fields.newsHeading}
            image={{
              sourceUrl: fields.newsBannerImage?.sourceUrl || '',
              altText: fields.newsBannerImage?.altText || '',
            }}
            slug={fields.newsPost?.slug}
          />
        </AnimatedSection>

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
            
              <ImageLayout data={{ page: { landingPageFields: fields } }} />
              <ResourcesSection/>
              <OurClientsSection/>
              <TestimonialSlider/>
              <GetInTouchSection/>

        <ContactUs />
      </main>
    </>
  );
}
