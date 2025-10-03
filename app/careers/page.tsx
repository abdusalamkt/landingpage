import CareerPageClient from './careerPageClient';

type Detail = { detailTitle: string; detailPoints: string };
type Job = { title: string; type: string; experience: string; location: string; description: string; details: Detail[] };
type HeroBanner = { id: string; sourceUrl: string; altText: string };

async function fetchCareers() {
  const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetCareers {
          careers {
            nodes {
              careerPageFields {
                heroHeading
                heroDescription
                heroBanner { id sourceUrl altText }
                sectionHeading
                sectionDescription
                jobs {
                  jobTitle
                  jobType
                  yearsOfExperience
                  location
                  jobDescription
                  details { detailTitle detailPoints }
                }
              }
            }
          }
        }
      `,
    }),
  });

  const json = await res.json();
  const careerData = json?.data?.careers?.nodes[0]?.careerPageFields;

  const jobs: Job[] = careerData.jobs.map((job: any) => ({
    title: job.jobTitle,
    type: job.jobType,
    experience: job.yearsOfExperience,
    location: job.location,
    description: job.jobDescription,
    details: job.details || [],
  }));

  return {
    heroHeading: careerData.heroHeading,
    heroDescription: careerData.heroDescription,
    heroBanner: careerData.heroBanner || null,
    sectionHeading: careerData.sectionHeading,
    sectionDescription: careerData.sectionDescription,
    jobs,
  };
}

export default async function CareerPage() {
  const data = await fetchCareers();
  return <CareerPageClient data={data} />;
}
