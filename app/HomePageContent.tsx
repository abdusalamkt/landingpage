'use client';
import { useEffect } from 'react';
// import Header from './components/Header';
import Banner from './components/Banner';
import Stats from './components/Stats';
import Products from './components/Products';
import AnimatedSection from './components/AnimatedSection';
// import ContactUs from './components/ContactUs';
import FloatingSidebar from './components/FloatingSidebar';
import NewsBanner from './components/NewsBanner';
import ImageLayout from './components/ImageLayout';
import ResourcesSection from './components/ResourcesSection';
import OurClientsSection from './components/OurClientsSection';
import TestimonialSlider from './components/TestimonialSlider';
import GetInTouchSection from './components/GetInTouchSection';
import NewsNav from './components/NewsNav';

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
 useEffect(() => {
  if (typeof window !== 'undefined') {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }
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

  // Use the repeater products field directly
  const products: Product[] = (fields.products ?? []).map((prod: any) => ({
    title: prod.title,
    image: normalizeImage(prod.image),
    link: prod.link || '#',
  }));

  return (
    <main>
      {/* <Header /> */}
      <FloatingSidebar />

      <AnimatedSection animation="fadeUp" delay={0.2}>
        <Banner heading={fields.bannerHeading} images={fields.bannerImages} />
      </AnimatedSection>

      {/* Uncomment if you want to use NewsBanner */}
      {/* <AnimatedSection animation="fadeUp" delay={0.4}>
        <NewsBanner
          heading={fields.newsHeading}
          image={{
            sourceUrl: fields.newsBannerImage?.sourceUrl || '',
            altText: fields.newsBannerImage?.altText || '',
          }}
          slug={fields.newsPost?.slug}
        />
      </AnimatedSection> */}

      <NewsNav
        heading={fields.newsHeading || 'Latest Update'}
        image={{
          sourceUrl: fields.newsBannerImage?.sourceUrl || '',
          altText: fields.newsBannerImage?.altText || '',
        }}
        url={fields.newsUrl || '#'}
      />

      <AnimatedSection animation="fadeUp" delay={0.6}>
        <Stats
          experience={fields.yearsOfExperience}
          clients={fields.numberOfClients}
          totalworkforce={fields.workforce}
          totalprojects={fields.projectsCompleted}
        />
      </AnimatedSection>

      <AnimatedSection animation="slideRight" delay={0.1}>
        <Products description={fields.productsDescription} products={products} />
      </AnimatedSection>

      <AnimatedSection animation="fadeUp" delay={0.6}>
        <ImageLayout data={{ page: { landingPageFields: fields } }} />
      </AnimatedSection>

      <AnimatedSection animation="slideRight" delay={0.3}>
        <ResourcesSection />
      </AnimatedSection>

      <AnimatedSection animation="fadeUp" delay={0.4}>
        <OurClientsSection logos={fields.clientLogos || []} />
      </AnimatedSection>

      {/* <AnimatedSection animation="fadeUp" delay={0.5}>
        <TestimonialSlider testimonials={fields.testimonials || []} />
      </AnimatedSection> */}

      <GetInTouchSection />

      {/* <ContactUs /> */}
    </main>
  );
}
