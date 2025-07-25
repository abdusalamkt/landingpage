export const dynamicParams = true;
export const revalidate = 3600; // Regenerate the page every hour (optional)
import { notFound } from "next/navigation";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import DynamicCaseStudyClient from "./DynamicCaseStudyClient";


// Fetch the slug list for static generation
export async function generateStaticParams() {
  const { data } = await client.query({
    query: gql`
      query {
        caseStudies(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  return data.caseStudies.nodes.map((study: any) => ({
    slug: study.slug,
  }));
}

const GET_CASE_STUDY = gql`
  query GetCaseStudyBySlug($slug: ID!) {
    caseStudy(id: $slug, idType: SLUG) {
      title
      caseStudyFields {
        herohighlight
        herodescription
        herobutton1label
        herobutton1url
        herobutton2label
        herobutton2url
        heroimage {
          sourceUrl
          altText
        }
        location
        introductionheading
        introductioncontent
        challengeheading
        challengecontent
        solutionheading
        solutioncontent
        infosectionbg {
          sourceUrl
          altText
        }
        infoboxes {
          title
          content
          iconurl {
            sourceUrl
            altText
          }
        }
        galleryimages {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;  // params is a Promise now
}) {
  const resolvedParams = await params;  // await it first

  const { data } = await client.query({
    query: GET_CASE_STUDY,
    variables: { slug: resolvedParams.slug }, // now safe to use
  });

  if (!data?.caseStudy) return notFound();

  return (
    <DynamicCaseStudyClient
      title={data.caseStudy.title}
      fields={data.caseStudy.caseStudyFields}
    />
  );
}
