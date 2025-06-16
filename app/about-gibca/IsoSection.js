import styles from './IsoSection.module.css';

const IsoSection = () => {
  return (
    <div className={styles.section}>
<h2 className={styles.heading}>
        GIBCA’S <span className={styles.green}>COMMITMENT</span> TO NATURE
      </h2>      <p className={styles.description}>
        In today’s pursuit of innovation and excellence, we as manufacturers work in collaboration with designers to create revolutionary structures that enhance our environment for today and for the future generations. We are socially-conscious not to detract from energy consumption or resource depletion. We have worked diligently over the years and continue to do so when selecting our suppliers, production process and products so that they meet our standard of sustainability and leave a smaller footprint on the world.</p>

      <div className={styles.imageRow}>
        <img src="/896.jpg" alt="Sample 1" className={styles.image} />
        <img src="/5677.jpg" alt="Sample 2" className={styles.image} />
      </div>

      <a
  href="/brochures/gibca-profile.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="cta-button"
>Company Profile<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
  />
</svg></a>
    </div>
  );
};

export default IsoSection;
