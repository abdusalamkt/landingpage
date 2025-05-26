'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScrollWrapper({ children }) {
  const wrapper = useRef(null);
  const content = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollSmoother.create({
        wrapper: wrapper.current,
        content: content.current,
        smooth: 1.2,         // speed factor (1 = normal, higher = smoother)
        effects: true,
      });
    }
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
