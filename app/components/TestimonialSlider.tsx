'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Testimonial = {
  image: {
    sourceUrl: string;
    altText?: string;
  };
  name: string;
  designation: string;
  quote: string;
  starRating?: number;
};

type TestimonialSliderProps = {
  testimonials: Testimonial[];
};

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials.length) {
    return <p className="text-center py-8">No testimonials available.</p>;
  }

  const current = testimonials[currentIndex];

  return (
    <section className="w-full py-12 bg-white">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-normal text-[#3d3d3d]">
          What they say <span className="text-[#109c5d]">about us!</span>
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 min-h-[280px]">
          {/* Left - Photo */}
          <div className="flex-shrink-0">
            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <Image
                src={current.image.sourceUrl}
                alt={current.image.altText || current.name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right - Text */}
          <div className="flex-1 text-center md:text-left">
            {/* Stars */}
            <div className="text-yellow-400 text-4xl mb-2">
              {'★'.repeat(current.starRating || 5)}
              {'☆'.repeat(5 - (current.starRating || 5))}
            </div>

            {/* Name */}
            <h3 className="text-[#109c5d] text-3xl font-normal uppercase tracking-wide mb-1">
              {current.name}
            </h3>

            {/* Designation */}
            <p className="text-gray-700 font-medium mb-4">{current.designation}</p>

            {/* Quote */}
            <blockquote className="italic text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">
              “{current.quote}”
            </blockquote>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="flex justify-self-center md:justify-start mt-0 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full focus:outline-none transition-all duration-300 ${
                idx === currentIndex ? 'bg-gray-900 w-7' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
