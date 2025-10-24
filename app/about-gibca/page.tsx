import { Metadata } from 'next';
import HeroSection from './HeroSection';
import VideoSection from './VideoSection';
import Timeline from './Timeline';
import Header from '../components/Header';
import SustainabilitySection from './SustainabilitySection';
import Footer from '../components/Footer';

import { GET_ABOUT_US_PAGE_FIELDS } from './graphql/queries';
import { mapSEOtoMetadata } from '../../lib/seo';

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

export const revalidate = false; 

async function getPageFields() {
  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_ABOUT_US_PAGE_FIELDS }),
    next: { revalidate: false },
  });

  const json = await res.json();
  return json?.data?.page;
}

export default async function AboutUsPage() {
  const page = await getPageFields();
  const fields = page?.aboutUsPageFields;
  const seo = page?.seo;

  // Dynamically generate metadata from Yoast SEO
  const metadata: Metadata = mapSEOtoMetadata(seo, 'https://gfiuae.com/about-us');

  return (
    <>
      <Header />
      <HeroSection fields={fields} />
      <VideoSection fields={fields} />
      <SustainabilitySection fields={fields} />
      <Timeline events={fields?.timelineEvents} />
      {/* <Footer /> */}
    </>
  );
}

// Export metadata for Next.js 13+ App Router
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageFields();
  return mapSEOtoMetadata(page?.seo, 'https://gfiuae.com/about-us');
}
