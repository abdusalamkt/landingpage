'use client';

import WhyService from './WhyService';
import Hero from './Hero';
import Header from '../components/Header';
import WhatWeOffer from './WhatWeOffer';
import ServiceProgram from './ServiceProgram';
import ContactUs from '../components/ContactUs';
import FloatingSidebar from '../components/FloatingSidebar';

export default function ServicePage() {
  return (
    <main>
        <Header/>
        <Hero/>
        <WhyService />
        <WhatWeOffer />
        <ServiceProgram/>
        <ContactUs />
        <FloatingSidebar/>
      
    </main>
  );
}
