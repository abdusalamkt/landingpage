'use client';
import { useEffect, useRef } from 'react';
import './Stats.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Stats({ experience, clients, totalworkforce, totalprojects }) {
  const statsRef = useRef([]);
  const plusRef = useRef([]);
  const itemRefs = useRef([]);

  useEffect(() => {
    // Animate each stat-item on scroll
    itemRefs.current.forEach((el) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.8, rotation: -15 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Animate numbers counting
    statsRef.current.forEach((el, index) => {
      if (!el) return;

      const finalValue = parseInt(el.dataset.value || '0', 10);

      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: finalValue,
          duration: 1.5,
          ease: 'power1.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el,
            start: 'top 98%',
          },
          onUpdate: function () {
            el.innerText = Math.floor(Number(el.innerText)).toString();
          },
          onComplete: function () {
            if (plusRef.current[index]) {
              // Fade in plus sign
              gsap.to(plusRef.current[index], {
                opacity: 1,
                display: 'inline',
                duration: 0.5,
                ease: 'power1.out',
              });
              // Bounce effect on number
              gsap.fromTo(
                el,
                { scale: 1 },
                { scale: 1.2, yoyo: true, repeat: 1, duration: 0.3, ease: 'power1.inOut' }
              );
            }
          },
        }
      );
    });
  }, []);

  return (
    <section className="stats-section">
      <h1 className="stats-heading">
        GIBCA BY THE<span className="Highlight_Header"> NUMBERS</span>
      </h1>
      <div className="stats-container">
        {[
          { label: 'Projects', value: totalprojects, icon: '/projects1.png' },
          { label: 'Years of Experience', value: experience, icon: '/Exp1.png' },
          { label: 'Happy Clients', value: clients, icon: '/clients1.png' },
          { label: 'Workforce', value: totalworkforce, icon: '/workforce1.png' },
        ].map((item, index) => (
          <div
            className="stat-item"
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <div className="stat-image">
              <img src={item.icon} alt={item.label} />
            </div>
            <span className="stat-number">
              <span
                className="stat-value"
                data-value={item.value}
                ref={(el) => (statsRef.current[index] = el)}
              ></span>
              <span
                className="plus-sign"
                ref={(el) => (plusRef.current[index] = el)}
                style={{ opacity: 0, display: 'inline' }} // start hidden but take space for smooth fade in
              >
                +
              </span>
            </span>
            <span className="stat-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
