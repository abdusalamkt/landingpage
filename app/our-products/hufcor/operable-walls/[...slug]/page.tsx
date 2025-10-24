// ✅ Enable static generation with long revalidation
export const revalidate = 86400; // Revalidate once per day (24 hours)
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import HufcorProductLayout from "../hufcorproduct/HufcorProductLayout";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

// ✅ Combined query for product fields + SEO
const GET_HUFCOR_PRODUCT = gql`
  query GetHufcorProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      hufcorSeriesFields {
        heroTitle
        heroHighlight
        heroDescription
        heroImage {
          sourceUrl
          altText
        }
        heroButton1Label
        heroButton1Url
        heroButton2Label
        heroButton2Url
        features {
          featureTitle
          featureContent
        }
        description
        imagebanner1 {
          sourceUrl
          altText
        }
        imagebanner1Title
        customizationOptionsDescription
        panelConfig {
          label
          description
          image {
            sourceUrl
            altText
          }
        }
        finishes {
          label
          thumbnail {
            sourceUrl
            altText
          }
          panel {
            sourceUrl
            altText
          }
        }
        doorType {
          title
          subTitle
          image {
            sourceUrl
            altText
          }
        }
        imagebanner2 {
          sourceUrl
          altText
        }
        imagebanner2Title
        choices {
          choiceTitle
          choicePoints {
            point
          }
        }
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

const GET_FAQS = gql`
  query GetFaqs {
    fAQs(first: 100) {
      nodes {
        title
        faqItems {
          faqItems {
            question
            answer
          }
          relatedProductPage {
            ... on Page {
              id
              title
              slug
              uri
            }
          }
        }
      }
    }
  }
`;

const GET_DOWNLOADS = gql`
  query GetDownloads {
    downloads(first: 100) {
      nodes {
        title
        downloadFields {
          productdownloads {
            filetype
            filetitle
            filepdf {
              sourceUrl
              title
            }
            gated
          }
          product {
            ... on Page {
              id
              title
              slug
              uri
            }
          }
        }
      }
    }
  }
`;

// ✅ Generate static params for all product pages
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          pages(where: { parent: 575 }) {
            nodes {
              uri
            }
          }
        }
      `,
    });

    return data.pages.nodes.map((page: any) => ({
      slug: page.uri.replace(/\/$/, "").split("/").filter(Boolean),
    }));
  } catch (error) {
    console.error("❌ Error generating static params:", error);
    return [];
  }
}

// ✅ Fetch product data with SEO
async function fetchHufcorProductData(slugPath: string) {
  try {
    // ✅ Run all queries in parallel for faster loading
    const [productResult, faqResult, downloadResult] = await Promise.all([
      client.query({
        query: GET_HUFCOR_PRODUCT,
        variables: { uri: `/${slugPath}/` },
        context: {
          fetchOptions: {
            next: { revalidate: 86400 }, // Cache for 24 hours
          },
        },
      }),
      client.query({
        query: GET_FAQS,
        context: {
          fetchOptions: {
            next: { revalidate: 86400 },
          },
        },
      }),
      client.query({
        query: GET_DOWNLOADS,
        context: {
          fetchOptions: {
            next: { revalidate: 86400 },
          },
        },
      }),
    ]);

    const page = productResult.data?.page;
    const fields = page?.hufcorSeriesFields;
    const pageSlug = page?.slug;
    const pageId = page?.id;
    const pageUri = page?.uri;
    const pageTitle = page?.title;
    const seo = page?.seo;

    if (!fields) {
      return null;
    }

    // Process FAQ data
    let relatedFaqs: any[] = [];
    if (faqResult.data?.fAQs?.nodes) {
      faqResult.data.fAQs.nodes.forEach((faqNode: any) => {
        const faqItemsArray = faqNode?.faqItems?.faqItems ?? [];
        const relatedPage = faqNode?.faqItems?.relatedProductPage;

        if (Array.isArray(faqItemsArray) && relatedPage) {
          const isMatch =
            relatedPage?.slug === pageSlug ||
            relatedPage?.id === pageId ||
            relatedPage?.uri === pageUri;

          if (isMatch) {
            faqItemsArray.forEach((item: any) => {
              if (item?.question && item?.answer) {
                relatedFaqs.push({
                  question: item.question,
                  answer: item.answer,
                });
              }
            });
          }
        }
      });
    }

    // Process Download data
    let relatedDownloads: any[] = [];
    if (downloadResult.data?.downloads?.nodes) {
      downloadResult.data.downloads.nodes.forEach((downloadNode: any) => {
        const relatedPage = downloadNode.downloadFields?.product;
        const downloads = downloadNode.downloadFields?.productdownloads;

        if (relatedPage && downloads?.length) {
          const isMatch =
            relatedPage?.slug === pageSlug ||
            relatedPage?.id === pageId ||
            relatedPage?.uri === pageUri;

          if (isMatch) {
            downloads.forEach((download: any) => {
              relatedDownloads.push({
                fileType: download.filetype,
                fileTitle: download.filetitle,
                filePdf: download.filepdf,
                gated: download.gated,
              });
            });
          }
        }
      });
    }

    return {
      fields,
      faqData: relatedFaqs,
      downloadData: relatedDownloads,
      seo,
      pageTitle,
      pageUri,
    };
  } catch (error) {
    console.error("❌ Error fetching Hufcor product data:", error);
    return null;
  }
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");
  const fallbackUrl = `https://gfiuae.com/${slugPath}`;

  try {
    const data = await fetchHufcorProductData(slugPath);

    if (data?.seo) {
      console.log(`✅ SEO found for ${slugPath}`);
      return mapSEOtoMetadata(data.seo, fallbackUrl);
    }

    // ✅ Generate fallback metadata from product data
    if (data?.fields) {
      const { heroTitle, heroHighlight, heroDescription, heroImage } = data.fields;
      const title = `${heroTitle} ${heroHighlight || ""} | Hufcor | GFI UAE`;
      const description = heroDescription || `Explore ${heroTitle} by Hufcor. Premium architectural solutions from GFI UAE.`;

      return {
        title,
        description,
        alternates: { canonical: fallbackUrl },
        openGraph: {
          title,
          description,
          url: fallbackUrl,
          type: "website",
          siteName: "GFI UAE",
          images: heroImage?.sourceUrl
            ? [
                {
                  url: heroImage.sourceUrl,
                  width: 1200,
                  height: 630,
                  alt: heroImage.altText || heroTitle,
                },
              ]
            : [],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: heroImage?.sourceUrl ? [heroImage.sourceUrl] : [],
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    console.warn(`⚠️ No SEO or product data found for ${slugPath}, using generic fallback`);
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // ✅ Generic fallback
  return {
    title: "Hufcor Product | GFI UAE",
    description: "Explore premium Hufcor architectural solutions from GFI UAE.",
    alternates: { canonical: fallbackUrl },
  };
}

export default async function HufcorProduct({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const data = await fetchHufcorProductData(slugPath);

  if (!data) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Product not found</h1>
        <p>The requested product page could not be loaded.</p>
      </div>
    );
  }

  const { fields, faqData, downloadData } = data;

  return (
    <HufcorProductLayout
      fields={fields}
      faqData={faqData}
      downloadData={downloadData}
    />
  );
}