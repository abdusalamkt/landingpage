import styles from './IsoSection.module.css';

interface IsoImage {
  sourceUrl: string;
  altText?: string;
}

interface IsoSectionProps {
  fields: {
    isoHeading: string;
    isoHighlight: string;
    isoDescription: string;
    isoGallery: IsoImage[];
  };
}

const IsoSection = ({ fields }: IsoSectionProps) => {
  if (!fields?.isoHeading) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>
        {fields.isoHeading.split(fields.isoHighlight)[0]}
        <span className={styles.green}>{fields.isoHighlight}</span>
        {fields.isoHeading.split(fields.isoHighlight)[1]}
      </h2>

      <p className={styles.description}>{fields.isoDescription}</p>

      <div className={styles.imageRow}>
        {fields.isoGallery?.map((img, i) => (
          <img
            key={i}
            src={img.sourceUrl}
            alt={img.altText || `ISO Image ${i + 1}`}
            className={styles.image}
          />
        ))}
      </div>

      <a
        href="/brochures/gibca-profile.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button"
      >
        Company Profile
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
        </svg>
      </a>
    </div>
  );
};

export default IsoSection;
