export const revalidate = false;
export const dynamicParams = true;

import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import AcristaliaProductLayout from "../acristaliaproduct/acristaliaproductlayout";
import { Metadata } from "next";
import { mapSEOtoMetadata } from "@/lib/seo";

const GET_ACRISTALIA_PRODUCT = gql`
  query GetAcristaliaProductPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      slug
      acristaliaSeriesFields {
        logo { sourceUrl altText }
        heroTitle
        heroHighlight
        heroDescription
        heroImage { sourceUrl altText }
        heroButton1Label
        heroButton2Label
        heroButton1Url
        heroButton2Url
        videoLink
        videoDescription
        features {
          featureTitle
          featureContent
        }
        description
        keyFeatures {
          imageBanner { sourceUrl altText }
          features {
            icon { sourceUrl altText }
            title
            description
          }
        }
        choices {
          choiceTitle
          choicePoints {
            point
          }
        }
        glasscurtainproductoptionstitle
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
    downloads (first: 100){
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

export async function generateStaticParams() {
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
    slug: page.uri.replace(/\/$/, "").split("/"),
  }));
}

// ✅ Generate dynamic SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");
  const fallbackUrl = `https://gfiuae.com/${slugPath}`;

  try {
    const { data: productData } = await client.query({
      query: GET_ACRISTALIA_PRODUCT,
      variables: {
        uri: `/${slugPath}/`,
      },
    });

    const page = productData?.page;
    const fields = page?.acristaliaSeriesFields;
    const seo = page?.seo;

    // Use WordPress SEO if available
    if (seo) {
      console.log("✅ SEO found for Acristalia product:", page?.title);
      return mapSEOtoMetadata(seo, fallbackUrl);
    }

    // Generate from page fields if SEO not available
    if (fields) {
      const { heroTitle, heroHighlight, heroDescription, heroImage, description } = fields;
      const title = `${heroTitle} ${heroHighlight || ""} | Acristalia | GFI UAE`;
      const metaDescription =
        heroDescription || 
        description ||
        `Discover ${heroTitle} ${heroHighlight} from Acristalia. Premium glass solutions from GFI UAE.`;

      return {
        title,
        description: metaDescription,
        alternates: { canonical: fallbackUrl },
        openGraph: {
          title,
          description: metaDescription,
          url: fallbackUrl,
          type: "website",
          siteName: "GFI UAE",
          images: heroImage?.sourceUrl
            ? [
                {
                  url: heroImage.sourceUrl,
                  width: 1200,
                  height: 630,
                  alt: heroImage.altText || `${heroTitle} ${heroHighlight}`,
                },
              ]
            : [],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description: metaDescription,
          images: heroImage?.sourceUrl ? [heroImage.sourceUrl] : [],
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    console.warn("⚠️ No SEO or page data found for Acristalia product, using fallback");
  } catch (error) {
    console.error("❌ Error in generateMetadata:", error);
  }

  // ✅ Comprehensive fallback metadata
  return {
    title: "Acristalia Product | Premium Glass Solutions | GFI UAE",
    description:
      "Explore premium Acristalia glass products and architectural solutions from GFI UAE.",
    keywords:
      "Acristalia, glass products, architectural glass, premium solutions, GFI UAE, Dubai",
    alternates: {
      canonical: fallbackUrl,
    },
    openGraph: {
      title: "Acristalia Product | Premium Glass Solutions | GFI UAE",
      description:
        "Explore premium Acristalia glass products and architectural solutions.",
      url: fallbackUrl,
      type: "website",
      siteName: "GFI UAE",
      images: [
        {
          url: `${fallbackUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Acristalia Product by GFI UAE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Acristalia Product | Premium Glass Solutions | GFI UAE",
      description:
        "Explore premium Acristalia glass products and architectural solutions.",
      images: [`${fallbackUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function AcristaliaProduct({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join("/");

  const { data: productData } = await client.query({
    query: GET_ACRISTALIA_PRODUCT,
    variables: {
      uri: `/${slugPath}/`,
    },
  });

  const { data: faqData } = await client.query({ query: GET_FAQS });
  const { data: downloadData } = await client.query({ query: GET_DOWNLOADS });

  const fields = productData?.page?.acristaliaSeriesFields;
  const pageSlug = productData?.page?.slug;
  const pageId = productData?.page?.id;

  if (!fields) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          fontSize: "18px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div>
          <h1>Product Not Found</h1>
          <p>The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  // Filter FAQ
  let relatedFaqs: any[] = [];
  if (faqData?.fAQs?.nodes) {
    faqData.fAQs.nodes.forEach((faqNode: any) => {
      const relatedPage = faqNode.faqItems?.relatedProductPage;
      const items = faqNode.faqItems?.faqItems;
      if (relatedPage && items?.length) {
        const isMatch =
          relatedPage.slug === pageSlug ||
          relatedPage.id === pageId ||
          relatedPage.uri === productData?.page?.uri;

        if (isMatch) {
          items.forEach((item: any) => {
            relatedFaqs.push({
              question: item.question,
              answer: item.answer,
            });
          });
        }
      }
    });
  }

  // Filter Downloads
  let relatedDownloads: any[] = [];
  if (downloadData?.downloads?.nodes) {
    downloadData.downloads.nodes.forEach((downloadNode: any) => {
      const relatedPage = downloadNode.downloadFields?.product;
      const downloads = downloadNode.downloadFields?.productdownloads;

      if (relatedPage && downloads?.length) {
        const isMatch =
          relatedPage.slug === pageSlug ||
          relatedPage.id === pageId ||
          relatedPage.uri === productData?.page?.uri;

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

  return (
    <AcristaliaProductLayout
      fields={fields}
      faqData={relatedFaqs}
      downloadData={relatedDownloads}
    />
  );
}