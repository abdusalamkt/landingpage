// app/case-study/[slug]/page.tsx
import { notFound } from "next/navigation";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import CaseStudyClient from "./DynamicCaseStudyClient";

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

export default async function CaseStudyDetail({ params }: { params: { slug: string } }) {
  const { data } = await client.query({
    query: GET_CASE_STUDY,
    variables: { slug: params.slug },
  });

  if (!data?.caseStudy) return notFound();

  return <CaseStudyClient title={data.caseStudy.title} fields={data.caseStudy.caseStudyFields} />;
}
