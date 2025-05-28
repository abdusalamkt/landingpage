import type { NextApiRequest, NextApiResponse } from 'next';

const WORDPRESS_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = `
    query {
      projects(first: 100) {
        nodes {
          title
          featuredImage {
            node {
              sourceUrl
            }
          }
          products {
            nodes {
              name
            }
          }
          sectors {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const response = await fetch(WORDPRESS_GRAPHQL_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();

  const projects = data.projects.nodes.map((p: any) => ({
    title: p.title,
    image: p.featuredImage?.node.sourceUrl || '',
    products: p.products.nodes.map((n: any) => n.name),
    sectors: p.sectors.nodes.map((n: any) => n.name),
  }));

  res.status(200).json(projects);
}
