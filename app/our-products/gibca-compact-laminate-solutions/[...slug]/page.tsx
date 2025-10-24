export const revalidate = false; 
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import HplProductLayout from "../hplproduct/hplproductlayout";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

// ✅ Combined query for product fields + SEO
const GET_HPL_PRODUCT = gql`
  query GetHplProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      hplSeriesFields {
        logo { sourceUrl altText }
        heroTitle
        heroHighlight
        heroDescription
        heroImage { sourceUrl altText }
        heroButton1Label
        heroButton2Label
        heroButton1Url
        heroButton2Url
        description
        features {
          featureTitle
          featureContent
        }
        modelsHeading
        models {
          title
          image { sourceUrl altText }
          description
          button {
            buttonLabel
            buttonUrl
          }
        }
        customizationHeading
        customizationDescription
        finishes {
          title
          image { sourceUrl altText }
        }
        designOptions {
          icon { sourceUrl altText }
          title
          description
        }
        outdoorProductOptionsTitle
        carousel {
          title
          image { sourceUrl altText }
          description
          points {
            point
          }
          buttonLabel
          buttonUrl
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
    fAQs (first: 100) {
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
    downloads (first: 100) {
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

// ✅ Generate static params
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          pages(where: { parent: 946 }) {
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

// ✅ Fetch all product data
async function fetchHplProductData(slugPath: string) {
  try {
    // Run all queries in parallel
    const [productResult, faqResult, downloadResult] = await Promise.all([
      client.query({
        query: GET_HPL_PRODUCT,
        variables: { uri: `/${slugPath}/` },
        context: {
          fetchOptions: {
            next: { revalidate: false },
          },
        },
      }),
      client.query({
        query: GET_FAQS,
        context: {
          fetchOptions: {
            next: { revalidate: false },
          },
        },
      }),
      client.query({
        query: GET_DOWNLOADS,
        context: {
          fetchOptions: {
            next: { revalidate: false },
          },
        },
      }),
    ]);

    const page = productResult.data?.page;
    const fields = page?.hplSeriesFields;
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
        const relatedPage = faqNode.faqItems?.relatedProductPage;
        const items = faqNode.faqItems?.faqItems;

        if (relatedPage && items?.length) {
          const isMatch =
            relatedPage.slug === pageSlug ||
            relatedPage.id === pageId ||
            relatedPage.uri === pageUri;

          if (isMatch) {
            items.forEach((item: any) => {
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
            relatedPage.slug === pageSlug ||
            relatedPage.id === pageId ||
            relatedPage.uri === pageUri;

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
    console.error("❌ Error fetching HPL product data:", error);
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
    const data = await fetchHplProductData(slugPath);

    // Use WordPress SEO if available
    if (data?.seo) {
      console.log(`✅ SEO found for HPL product: ${slugPath}`);
      return mapSEOtoMetadata(data.seo, fallbackUrl);
    }

    // Generate from product fields if SEO not available
    if (data?.fields) {
      const { heroTitle, heroHighlight, heroDescription, heroImage } = data.fields;
      const title = `${heroTitle} ${heroHighlight || ""} | HPL | GFI UAE`;
      const description =
        heroDescription ||
        `Explore ${heroTitle} by HPL. Premium architectural solutions from GFI UAE.`;

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

    console.warn(`⚠️ No SEO or product data found for ${slugPath}, using fallback`);
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // Generic fallback
  return {
    title: "HPL Product | GFI UAE",
    description: "Explore premium HPL architectural solutions from GFI UAE.",
    alternates: { canonical: fallbackUrl },
  };
}

export default async function HplProduct({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const data = await fetchHplProductData(slugPath);

  if (!data) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Product not found</h1>
        <p>The requested HPL product page could not be loaded.</p>
      </div>
    );
  }

  const { fields, faqData, downloadData } = data;

  return (
    <HplProductLayout
      fields={fields}
      faqData={faqData}
      downloadData={downloadData}
      currentSlug={data.pageUri}
    />
  );
}