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

async function fetchContactPage() {
  const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
    cache: 'force-cache', // static generation with caching
  });
  const json = await res.json();
  return json.data.page.contactUsPageFields;
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
