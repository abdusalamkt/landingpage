import styles from './FloatingSidebar.module.css';
import { FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const FloatingSidebar = () => {
  return (
    
    <div className={styles.sidebar}>
      <ul>
        <li>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <span className={styles.tooltip}>LinkedIn</span>
            <FaLinkedinIn className={styles.icon} />
          </a>
        </li>
        <li>
          <a href="tel:+1234567890">
            <span className={styles.tooltip}>Call</span>
            <FaPhoneAlt className={styles.icon} />
          </a>
        </li>
        <li>
          <a href="mailto:someone@example.com">
            <span className={styles.tooltip}>Email</span>
            <FaEnvelope className={styles.icon} />
          </a>
        </li>
        <li>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <span className={styles.tooltip}>WhatsApp</span>
            <FaWhatsapp className={styles.icon} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default FloatingSidebar;
