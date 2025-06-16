'use client';

import Image from 'next/image';
import './HeroSection.css';
import {motion} from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* LEFT */}
        <div className="hero-text">
          <h2 className="hero-heading">
            <span className="green-text">THINK GIBCA!</span><br />
            THINK SPACE MANAGEMENT
          </h2>
          <p>
            A leading manufacturer of premium contract furniture throughout the Middle East, Central Asia, and Africa.
            By fostering the culture of innovation and creativity we’ve established ourselves as the region’s leading space management solution providers.
          </p>
          <p>
            Since our inception in the 1990s, we’ve been the driving force behind over 90,000+ successful installations
            across the Middle East, Central Asia, and Africa. Our commitment to innovation and quality shines through,
            making us the go-to space management solution provider in the region.
          </p>

          <a
  href="/brochures/gibca-profile.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="cta-button"
>
  <span>Company Profile</span>
  <svg
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
</svg>

</a>

        </div>

        {/* RIGHT */}
        <div className="hero-image">
          <Image
            src="/giba.PNG"
            alt="Think Gibca"
            width={800}
            height={600}
            className="image"
          />
        </div>
      </div>
    </section>
  );
}
