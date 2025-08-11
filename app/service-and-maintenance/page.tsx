// app/service-maintenance/page.tsx
import Header from '../components/Header';
import Hero from './Hero';
import WhyService from './WhyService';
import WhatWeOffer from './WhatWeOffer';
import ServiceProgram from './ServiceProgram';
// import ContactUs from '../components/ContactUs';
import FloatingSidebar from '../components/FloatingSidebar';
import { GET_SERVICE_PAGE_FIELDS } from './graphql/queries';

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

async function getServicePageFields() {
  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_SERVICE_PAGE_FIELDS }),
    next: { revalidate: 10 },
  });

  const json = await res.json();
  return json?.data?.page?.serviceandMaintenanceFields;
}

export default async function ServicePage() {
  const fields = await getServicePageFields();

  return (
    <main>
      {/* <Header /> */}
      <Hero
        title={fields?.heroTitle}
        highlight={fields?.heroHighlight}
        description={fields?.heroDescription}
        bgImage={fields?.heroBgImage?.sourceUrl}
      />
      <WhyService fields={fields}/>
      <WhatWeOffer 
  offers={fields?.whatWeOfferItems} 
  heading={fields?.whatWeOfferHeading}
/>

      <ServiceProgram />
      {/* <ContactUs /> */}
      <FloatingSidebar />
    </main>
  );
}
