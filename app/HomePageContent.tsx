'use client'; // ⬅️ this must be the very first line
import { useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Banner from './components/Banner';
import Stats from './components/Stats';
import Products from './components/Products';

export default function HomePageContent({ fields }: { fields: any }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const products = Array.from({ length: 7 }, (_, i) => {
    const title = fields[`product${i + 1}Title`];
    const image = fields[`product${i + 1}Image`];
    return title && image ? { title, image } : null;
  }).filter(Boolean);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <main style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
        <Header />
        <Banner
          heading={fields.bannerHeading}
          images={[fields.bannerImage1, fields.bannerImage2, fields.bannerImage3]}
        />
        <Stats
          experience={fields.yearsOfExperience}
          clients={fields.numberOfClients}
          totalworkforce={fields.workforce}
          totalprojects={fields.projectsCompleted}
        />
        <Products description={fields.productsDescription} products={products} />
      </main>
    </>
  );
}
