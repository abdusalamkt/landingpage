'use client';
import client from '@/lib/apolloClient';
import { GET_LANDING_PAGE } from '@/graphql/queries';
import HomePageContent from './HomePageContent';

export default async function HomePage() {
  const { data } = await client.query({ query: GET_LANDING_PAGE });
  const fields = data.page.landingPageFields;

  return <HomePageContent fields={fields} />;
}

