'use client';
import './VideoSection.css';

export default function VideoSection({ fields }: { fields: { videoUrl?: string } }) {
  if (!fields?.videoUrl) return null;

  return (
    <section className="video-section">
      <video
        className="video-bg"
        autoPlay
        loop
        muted
        playsInline
        src={fields.videoUrl}
      />
    </section>
  );
}
