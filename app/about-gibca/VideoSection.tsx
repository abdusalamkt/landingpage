'use client';
import './VideoSection.css';

export default function VideoSection() {
  return (
    <section className="video-section">
      <video
        className="video-bg"
        autoPlay
        loop
        muted
        playsInline
        src="/videos/about-gibca.mp4" // Make sure this file is in public/videos/
        poster="/images/video-poster.jpg" // Optional fallback
      />

      <div className="video-overlay">
        <h2 className="video-heading">
          EXPERIENCE INNOVATION IN EVERY FRAME
        </h2>
        <p className="video-subtext">
          Discover how GIBCA transforms spaces across the Middle East and beyond.
        </p>
      </div>
    </section>
  );
}
