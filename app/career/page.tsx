'use client';

import { useState } from 'react';
import styles from './career.module.css';

type Job = {
  title: string;
  type: string;
  experience: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
};

const jobs: Job[] = [
  {
    title: 'Procurement Manager',
    type: 'Full-time',
    experience: '5–6 years EXP',
    location: 'Ajman, UAE',
    description:
      'We are seeking a highly motivated and detail-oriented Procurement Manager with a strong engineering background...',
    responsibilities: [
      'Develop and implement comprehensive procurement strategies.',
      'Collaborate with technical teams to understand requirements.',
      'Ensure adherence to company and client procurement policies.',
      'Evaluate suppliers and conduct risk assessments.',
      'Negotiate contracts and pricing.',
      'Monitor procurement costs and stay within budget.',
      'Coordinate with departments for procurement timelines.',
      'Ensure on-time delivery of materials and equipment.',
      'Manage supply risks and disruptions.',
      'Ensure compliance with legal and industry standards.',
    ],
    requirements: [
      'Strong understanding of vendor sourcing practices.',
      'Familiarity with supply chain management software.',
      'Knowledge of procedures and shipment regulations.',
      'Excellent communication and collaboration skills.',
      'Problem-solving and risk assessment ability.',
    ],
    qualifications: [
      'Bachelor’s in Engineering or Supply Chain Management.',
      '4–6 years of relevant experience.',
      'Certifications in procurement are a plus.',
    ],
  },
  {
    title: 'Digital Designer',
    type: 'Full-time',
    experience: '2–3 years EXP',
    location: 'Dubai, UAE',
    description:
      'We are looking for a creative and skilled Digital Designer to join our team...',
    responsibilities: ['Design digital campaigns', 'Work with marketing', 'Ensure UI/UX consistency'],
    requirements: ['Figma, Adobe Suite skills', 'Communication skills'],
    qualifications: ['Bachelor in Design or related field'],
  },
];

export default function CareerPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <main className={styles.container}>
      {/* Meet Our Team Section */}
      <section className={styles.teamSection}>
        <h1 className={styles.heading}>MEET OUR TEAM</h1>
        <p className={styles.subtext}>
          Get to know the passionate people behind our work, a team of dedicated professionals driven by creativity,
          collaboration, and a shared commitment to excellence.
        </p>
        <div className={styles.imagePlaceholder} />
      </section>

      {/* Careers Section */}
      <section className={styles.openingsSection}>
        <h2 className={styles.openingsHeading}>BE PART OF OUR SUCCESS</h2>
        <p className={styles.subtext}>
          Get to know the passionate people behind our work, a team of dedicated professionals driven by creativity,
          collaboration, and a shared commitment to excellence.
        </p>
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
                <p>{job.description}</p>

                <h4>Responsibilities:</h4>
                <ul>
                  {job.responsibilities.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>

                <h4>Requirements:</h4>
                <ul>
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>

                <h4>Qualifications & Education:</h4>
                <ul>
                  {job.qualifications.map((qual, i) => (
                    <li key={i}>{qual}</li>
                  ))}
                </ul>

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
