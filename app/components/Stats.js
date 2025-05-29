'use client';
import { useEffect, useRef } from 'react';
import './Stats.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Stats({ experience, clients, totalworkforce, totalprojects }) {
  const statsRef = useRef([]);
  const plusRef = useRef([]);

  useEffect(() => {
    statsRef.current.forEach((el, index) => {
      if (!el) return;

      const finalValue = parseInt(el.dataset.value || '0', 10);

      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: finalValue,
          duration: 2,
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
              plusRef.current[index].style.display = 'inline';
            }
          },
        }
      );
    });
  }, []);

  return (
    <section className="stats-section">
      <h1 className="products-heading">
        GIBCA BY THE<span className="Highlight_Header"> NUMBERS</span>
      </h1>
      <div className="stats-container">
        {[
          { label: 'Projects', value: totalprojects, icon: '/ribbon.png' },
          { label: 'Years of Experience', value: experience, icon: '/ribbon.png' },
          { label: 'Happy Clients', value: clients, icon: '/ribbon.png' },
          { label: 'Workforce', value: totalworkforce, icon: '/ribbon.png' },
        ].map((item, index) => (
          <div className="stat-item" key={index}>
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
                style={{ display: 'none' }}
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
