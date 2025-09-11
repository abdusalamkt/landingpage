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
  try {
    if (!process.env.WORDPRESS_GRAPHQL_ENDPOINT) {
      throw new Error('WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set');
    }

    const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY }),
      cache: 'force-cache', // static generation with caching
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('GraphQL query failed');
    }
    
    // Return the contact page fields or provide fallback data
    return json.data?.page?.contactUsPageFields || {
      heading: 'Contact Us',
      subtitle: 'Get in touch',
      formHeading: 'Contact Form',
      slideshowImages: [],
      products: [],
      address: 'Address not available',
      phone: 'Phone not available',
      email: 'contact@example.com'
    };
  } catch (error) {
    console.error('Failed to fetch contact page:', error);
    
    // Return fallback data in case of error
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
}

export default async function ContactUsPage() {
  const data = await fetchContactPage();

  return (
    <>
      <Header />
      <ContactUsClient data={data} />
    </>
  );
}