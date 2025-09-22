'use client';

import { useState, useEffect } from 'react';
import styles from './career.module.css';

type Detail = {
  detailTitle: string;
  detailPoints: string; // HTML content
};

type Job = {
  title: string;
  type: string;
  experience: string;
  location: string;
  description: string; // HTML content
  details: Detail[];
};

type HeroBanner = {
  id: string;
  sourceUrl: string;
  altText: string;
};

export default function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [heroHeading, setHeroHeading] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [sectionHeading, setSectionHeading] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCareers() {
      try {
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
                      heroBanner {
                        id
                        sourceUrl
                        altText
                      }
                      sectionHeading
                      sectionDescription
                      jobs {
                        jobTitle
                        jobType
                        yearsOfExperience
                        location
                        jobDescription
                        details {
                          detailTitle
                          detailPoints
                        }
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

        if (careerData) {
          setHeroHeading(careerData.heroHeading || '');
          setHeroDescription(careerData.heroDescription || '');
          setSectionHeading(careerData.sectionHeading || '');
          setSectionDescription(careerData.sectionDescription || '');
          setHeroBanner(careerData.heroBanner || null);

          const mappedJobs: Job[] = careerData.jobs.map((job: any) => ({
            title: job.jobTitle,
            type: job.jobType,
            experience: job.yearsOfExperience,
            location: job.location,
            description: job.jobDescription,
            details: job.details || [],
          }));
          setJobs(mappedJobs);
        }
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    }

    fetchCareers();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <main className={styles.container}>
      {/* Meet Our Team Section */}
      <section className={styles.teamSection}>
        <h1 className={styles.heading} dangerouslySetInnerHTML={{ __html: heroHeading }} />
        <p className={styles.subtext} dangerouslySetInnerHTML={{ __html: heroDescription }} />
        {heroBanner ? (
          <img
            className={styles.imagePlaceholder}
            src={heroBanner.sourceUrl}
            alt={heroBanner.altText || 'Hero Banner'}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </section>

      {/* Careers Section */}
      <section className={styles.openingsSection}>
        <h2 className={styles.openingsHeading} dangerouslySetInnerHTML={{ __html: sectionHeading }} />
        <p className={styles.subtext} dangerouslySetInnerHTML={{ __html: sectionDescription }} />
        <hr className={styles.divider} />

        {jobs.map((job, index) => (
          <div key={index} className={styles.jobItem}>
            <div className={styles.jobInfo}>
              <h3>{job.title}</h3>
              <div className={styles.tags}>
                <span className={styles.tag}>{job.type}</span>
                <span className={styles.tag}>{job.experience}</span>
                <span className={styles.tag}>{job.location}</span>
              </div>
            </div>

            <div className={styles.jobActions}>
              <a className={styles.applyButton} href="#">APPLY</a>
              <button
                className={styles.viewDetails}
                onClick={() => toggleExpand(index)}
              >
                {expandedIndex === index ? 'Hide Details' : 'View Full Details'}
              </button>
            </div>

            {expandedIndex === index && (
              <div className={styles.jobDetails}>
                {/* Job Description */}
                <div dangerouslySetInnerHTML={{ __html: job.description }} />

                {/* Job Details from repeater */}
                {job.details.map((detail, i) => (
                  <div key={i}>
                    <h4>{detail.detailTitle}</h4>
                    <div dangerouslySetInnerHTML={{ __html: detail.detailPoints }} />
                  </div>
                ))}

                <button className={styles.closeButton} onClick={() => setExpandedIndex(null)}>
                  Close
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
