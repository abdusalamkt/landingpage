import { Metadata } from 'next';
import HeroSection from './HeroSection';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import VideoSection from './VideoSection';
import Timeline from './Timeline';
import VisionMission from './VisionMission';
import IsoSection from './IsoSection';
import ContactUs from '../components/ContactUs';
import FloatingSidebar from '../components/FloatingSidebar';

// import MissionSection from './MissionSection';
// import TeamSection from './TeamSection';

export const metadata: Metadata = {
  title: 'About Us – GIBCA',
  description: 'Learn about GIBCA’s vision, team, and space management solutions.',
};

export default function AboutUsPage() {
  return (
    <>
    
        <Header />
        <FloatingSidebar />
        {/* Hero Section */}
      <HeroSection />
      <VideoSection />
      <Timeline />
      <VisionMission/>
      <IsoSection/>
      <ContactUs />
      {/* <MissionSection /> */}
      {/* <TeamSection /> */}
      {/* Add more sections as components */}
    </>
  );
}
