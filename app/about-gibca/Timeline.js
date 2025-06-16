"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Timeline.module.css";

const events = [
  {
    year: "1998",
    title: "Foundation of GIBCA Furniture",
    desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration...",
    image: "/gallery/img1.jpg",
  },
  {
    year: "2002",
    title: "Development of New Product",
    desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration...",
    image: "/gallery/img2.jpg",
  },
  {
    year: "2005",
    title: "Introduction to Operable Walls",
    desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration...",
    image: "/gallery/img4.png",
  },
  {
    year: "2006",
    title: "Introduction to Operable Walls",
    desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration...",
    image: "/gallery/img3.jpg",
  },
];

export default function Timeline() {
  const timelineRef = useRef(null);
  const fillLineRef = useRef(null);

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

  return (
    <section className={styles.timelineSection}>
      <h2 className={styles.title}>
        Take a look at GIBCA’s <span>History!</span>
      </h2>
      <p className={styles.intro}>
        There are many variations of passages of Lorem Ipsum available, but the
        majority have suffered alteration...
      </p>

      <div className={styles.timelineContainer} ref={timelineRef}>
        <div className={styles.timelineLine}>
          <div className={styles.fillLine} ref={fillLineRef}></div>
        </div>

        {events.map((event, idx) => (
          <div className={styles.timelineItem} key={event.year}>
            <div className={styles.timelineDot}></div>

            {idx % 2 === 0 ? (
              <>
                <div className={styles.timelineContent}>
                  <Image
                    src={event.image}
                    alt={event.year}
                    width={500}
                    height={300}
                  />
                </div>
                <div className={styles.timelinePoint}>
                  <h3>{event.year}</h3>
                  <h4>{event.title}</h4>
                  <p>{event.desc}</p>
                </div>
              </>
            ) : (
              <>
                <div className={styles.timelinePoint}>
                  <h3>{event.year}</h3>
                  <h4>{event.title}</h4>
                  <p>{event.desc}</p>
                </div>
                <div className={styles.timelineContent}>
                  <Image
                    src={event.image}
                    alt={event.year}
                    width={500}
                    height={300}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
