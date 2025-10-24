// app/case-study/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import DynamicCaseStudyClient from "./DynamicCaseStudyClient";

export const dynamicParams = true;
export const revalidate = false;

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
// Dynamic SEO for each single case study
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;  // ✅ await it
  const slug = resolvedParams.slug;

  const { data } = await client.query({
    query: GET_CASE_STUDY,
    variables: { slug },
  });

  if (!data?.caseStudy) return { title: "Case Study Not Found" };

  const fields = data.caseStudy.caseStudyFields;

  return {
    title: `${data.caseStudy.title} | GFI UAE`,
    description: fields?.herodescription || "Discover this case study by GFI UAE.",
    openGraph: {
      title: `${data.caseStudy.title} | GFI UAE`,
      description: fields?.herodescription || "Discover this case study by GFI UAE.",
      images: fields?.heroimage?.sourceUrl
        ? [{ url: fields.heroimage.sourceUrl, alt: fields.heroimage.altText || data.caseStudy.title }]
        : [],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.caseStudy.title} | GFI UAE`,
      description: fields?.herodescription || "Discover this case study by GFI UAE.",
      images: fields?.heroimage?.sourceUrl ? [fields.heroimage.sourceUrl] : []
    }
  };
}


export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>; // ✅ mark as Promise
}) {
  const resolvedParams = await params; // ✅ await it
  const slug = resolvedParams.slug;

  const { data } = await client.query({
    query: GET_CASE_STUDY,
    variables: { slug },
  });

  if (!data?.caseStudy) return notFound();

  return (
    <DynamicCaseStudyClient
      title={data.caseStudy.title}
      fields={data.caseStudy.caseStudyFields}
    />
  );
}
