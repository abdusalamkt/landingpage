import { Metadata } from 'next';
import Header from '../components/Header';
import ContactUsClient from './ContactUsClient';
import './contact.css';
import { mapSEOtoMetadata } from '../../lib/seo';

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;

// ✅ Combined GraphQL query (page fields + SEO)
const GET_CONTACT_PAGE = `
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
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
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

async function fetchContactPage() {
  if (!WORDPRESS_API_URL) {
    throw new Error('WORDPRESS_GRAPHQL_ENDPOINT is not set');
  }

  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_CONTACT_PAGE }),
      next: { revalidate: 10 },
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('GraphQL query failed');
    }

    const page = json.data?.page;
    return {
      fields: page?.contactUsPageFields || getFallbackData(),
      seo: page?.seo || null,
    };
  } catch (error) {
    console.error('❌ Failed to fetch contact page:', error);
    return {
      fields: getFallbackData(),
      seo: null,
    };
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
      { productName: 'Support' },
    ],
    address: 'Address not available',
    phone: 'Phone not available',
    email: 'contact@example.com',
  };
}

// ✅ Generate dynamic SEO metadata like About Us
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await fetchContactPage();
  const fallbackUrl = 'https://gfiuae.com/contact-us';

  return mapSEOtoMetadata(
    seo || {
      title: 'Contact Us | GFI UAE',
      metaDesc:
        'Get in touch with GFI UAE for inquiries, support, or project discussions. Our team is ready to assist you.',
      canonical: fallbackUrl,
    },
    fallbackUrl
  );
}

export default async function ContactUsPage() {
  const { fields } = await fetchContactPage();

  return (
    <div className="contact-page-wrapper">
      {/* Static Header - only for contact page */}
      <div className="contact-header-static">
        <Header />
      </div>

      {/* Client-side component handles form & slideshow */}
      <ContactUsClient data={fields} />
    </div>
  );
}
