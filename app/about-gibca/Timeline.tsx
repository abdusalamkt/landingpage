'use client';

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Timeline.module.css";

type TimelineEvent = {
  year?: string;
  title?: string;
  description?: string;
  image?: { sourceUrl?: string };
};

type TimelineProps = {
  events?: TimelineEvent[];
};

export default function Timeline({ events }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !fillLineRef.current) return;

      const timelineTop = timelineRef.current.getBoundingClientRect().top + window.scrollY;
      const windowBottom = window.scrollY + window.innerHeight;
      const distanceScrolled = windowBottom - timelineTop;
      const totalHeight = timelineRef.current.offsetHeight;

      const fillHeight = Math.min(Math.max(distanceScrolled, 0), totalHeight);
      fillLineRef.current.style.height = `${fillHeight}px`;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!events || events.length === 0) return null;

  return (
    <section className={styles.timelineSection}>
      <h2 className={styles.title}>
        Take a look at GIBCA’s <span>History!</span>
      </h2>
      <p className={styles.intro}>
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration...
      </p>

      <div className={styles.timelineContainer} ref={timelineRef}>
        <div className={styles.timelineLine}>
          <div className={styles.fillLine} ref={fillLineRef}></div>
        </div>

        {events.map((event, idx) => (
          <div className={styles.timelineItem} key={`${event.year}-${idx}`}>
            <div className={styles.timelineDot}></div>

            {idx % 2 === 0 ? (
              <>
                <div className={styles.timelineContent}>
                  {event.image?.sourceUrl && (
                    <Image
                      src={event.image.sourceUrl}
                      alt={event.year || "Timeline image"}
                      width={500}
                      height={300}
                    />
                  )}
                </div>
                <div className={styles.timelinePoint}>
                  <h3>{event.year}</h3>
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                </div>
              </>
            ) : (
              <>
                <div className={styles.timelinePoint}>
                  <h3>{event.year}</h3>
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                </div>
                <div className={styles.timelineContent}>
                  {event.image?.sourceUrl && (
                    <Image
                      src={event.image.sourceUrl}
                      alt={event.year || "Timeline image"}
                      width={500}
                      height={300}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
