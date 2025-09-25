// contact-us/page.tsx

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

import Header from '../components/Header';
import ContactUsClient from './ContactUsClient';
import './contact.css';

const QUERY = `
  query GetContactPage {
    page(id: "contact-us", idType: URI) {
      contactUsPageFields {
        heading
        subtitle
        formHeading
        slideshowImages {
          sourceUrl
        }
        products {
          productName
        }
        address
        phone
        email
      }
    }
  }
`;

interface Product {
  productName: string;
}

interface SlideshowImage {
  sourceUrl: string;
}

interface ContactUsData {
  heading: string;
  subtitle: string;
  formHeading: string;
  slideshowImages: SlideshowImage[];
  products: Product[];
  address: string;
  phone: string;
  email: string;
}

async function fetchContactPage(): Promise<ContactUsData> {
  if (!process.env.WORDPRESS_GRAPHQL_ENDPOINT) {
    throw new Error('WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set');
  }

  try {
    const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY }),
      cache: 'force-cache',
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('GraphQL query failed');
    }

    return json.data?.page?.contactUsPageFields || getFallbackData();
  } catch (error) {
    console.error('Failed to fetch contact page:', error);
    return getFallbackData();
  }
}

function getFallbackData(): ContactUsData {
  return {
    heading: 'Contact Us',
    subtitle: 'Get in touch',
    formHeading: 'Contact Form',
    slideshowImages: [],
    products: [
      { productName: 'General Inquiry' },
      { productName: 'Product Information' },
      { productName: 'Support' }
    ],
    address: 'Address not available',
    phone: 'Phone not available',
    email: 'contact@example.com'
  };
}

export default async function ContactUsPage() {
  const data = await fetchContactPage();

  return (
    <div className="contact-page-wrapper">
      {/* Static Header - only for contact page */}
      <div className="contact-header-static">
        <Header />
      </div>

      {/* Client-side component handles all document/window interactions */}
      <ContactUsClient data={data} />
    </div>
  );
}
