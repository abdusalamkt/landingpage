// app/page.tsx
import client from "@/lib/apolloClient";
import { GET_LANDING_PAGE } from "@/graphql/queries";
import HomePageContent from "./HomePageContent";
import { mapSEOtoMetadata } from "@/lib/seo";

export const revalidate = 60; // ISR every 60s

// ✅ SEO metadata
export async function generateMetadata() {
  const { data } = await client.query({ query: GET_LANDING_PAGE });
  const seo = data?.page?.seo;

  return mapSEOtoMetadata(seo, "https://gfiuae.com/");
}

// ✅ Page component
export default async function HomePage() {
  const { data } = await client.query({ query: GET_LANDING_PAGE });
  const fields = data.page.landingPageFields;

  return <HomePageContent fields={fields} />;
}
