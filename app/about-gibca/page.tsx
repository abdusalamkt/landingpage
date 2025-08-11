import { Metadata } from 'next';
// import Header from '../components/Header';
import FloatingSidebar from '../components/FloatingSidebar';
import HeroSection from './HeroSection';
import VideoSection from './VideoSection';
import Timeline from './Timeline';

// import ContactUs from '../components/ContactUs';
import SustainabilitySection from './SustainabilitySection';
import Footer from '../components/Footer';


import { GET_ABOUT_US_PAGE_FIELDS } from './graphql/queries';  // Adjust path as needed

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

export const metadata: Metadata = {
  title: 'About Us – GIBCA',
  description: 'Learn about GIBCA’s vision, team, and space management solutions.',
};

export const revalidate = 10; 

async function getPageFields() {
  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_ABOUT_US_PAGE_FIELDS }),
    next: { revalidate: 10 },
  });

  const json = await res.json();
  return json?.data?.page?.aboutUsPageFields;
}

export default async function AboutUsPage() {
  const fields = await getPageFields();

  return (
    <>
      {/* <Header /> */}
      <FloatingSidebar />
      <HeroSection fields={fields} />
      <VideoSection fields={fields} />

      <SustainabilitySection fields={fields} />

      <Timeline events={fields?.timelineEvents} />
      {/* <ContactUs /> */}
      {/* <Footer /> */}
    </>
  );
}
