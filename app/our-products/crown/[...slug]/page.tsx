export const revalidate = false; // 24 hours
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import CrownProductPage from "../crownproduct/crownproductlayout";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

// ✅ Combined query for product fields + SEO
const GET_CROWN_PRODUCT = gql`
  query GetCrownProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      crownSeriesFields {
        logo {
          sourceUrl
          altText
        }
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
        description
        features {
          featureTitle
          featureContent
        }
        imagebanner1 {
          sourceUrl
          altText
        }
        imagebanner1Title
        customizationOptionHeading
        customizationOptionPoints {
          title
          points {
            points
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

// ✅ Generate static params
export async function generateStaticParams() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          pages(where: { parent: 1234 }) {
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
async function fetchCrownProductData(slugPath: string) {
  try {
    // Run all queries in parallel
    const [productResult, faqResult, downloadResult] = await Promise.all([
      client.query({
        query: GET_CROWN_PRODUCT,
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
    const fields = page?.crownSeriesFields;
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
    console.error("❌ Error fetching Crown product data:", error);
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
    const data = await fetchCrownProductData(slugPath);

    // Use WordPress SEO if available
    if (data?.seo) {
      console.log(`✅ SEO found for Crown product: ${slugPath}`);
      return mapSEOtoMetadata(data.seo, fallbackUrl);
    }

    // Generate from product fields if SEO not available
    if (data?.fields) {
      const { heroTitle, heroHighlight, heroDescription, heroImage } = data.fields;
      const title = `${heroTitle} ${heroHighlight || ""} | Crown | GFI UAE`;
      const description =
        heroDescription ||
        `Explore ${heroTitle} by Crown. Premium architectural solutions from GFI UAE.`;

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
    title: "Crown Product | GFI UAE",
    description: "Explore premium Crown architectural solutions from GFI UAE.",
    alternates: { canonical: fallbackUrl },
  };
}

export default async function CrownProduct({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const data = await fetchCrownProductData(slugPath);

  if (!data) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Product not found</h1>
        <p>The requested Crown product page could not be loaded.</p>
      </div>
    );
  }

  const { fields, faqData, downloadData } = data;

  return (
    <CrownProductPage
      fields={{
        logo: fields.logo,
        hero_title: fields.heroTitle,
        hero_highlight: fields.heroHighlight,
        hero_description: fields.heroDescription,
        hero_image: fields.heroImage,
        hero_button_1_label: fields.heroButton1Label,
        hero_button_1_url: fields.heroButton1Url,
        hero_button_2_label: fields.heroButton2Label,
        hero_button_2_url: fields.heroButton2Url,
        description: fields.description,
        features: fields.features || [],
        customization_heading: fields.customizationOptionHeading,
        customization_options: fields.customizationOptionPoints || [],
        imagebanner1: fields.imagebanner1,
        imagebanner1Title: fields.imagebanner1Title,
      }}
      faqData={faqData}
      downloadData={downloadData}
    />
  );
}