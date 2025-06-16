import client from '@/lib/apolloClient';
import { GET_LANDING_PAGE } from '@/graphql/queries';
import HomePageContent from './HomePageContent';

export default async function HomePage() {
  const { data } = await client.query({ query: GET_LANDING_PAGE });
  const fields = data.page.landingPageFields;

  return <HomePageContent fields={fields} />;
}
export const revalidate = 60; // revalidate every 60 secs
