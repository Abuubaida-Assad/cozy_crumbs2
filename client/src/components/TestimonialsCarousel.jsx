import React, { useState } from 'react';
import { testimonialsData } from '../data/siteData';

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const current = testimonialsData[currentIndex];

  return (
    <section className="py-20 md:py-28 px-[4vw] bg-[#FAF8F5] border-t border-[#112229]/10">
      <div className="max-w-5xl mx-auto text-center">
        <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#147C98]">
          TESTIMONIALS
        </span>
        <h2 className="font-title text-3xl sm:text-5xl font-black uppercase text-[#112229] mt-2 mb-12 tracking-tight">
          Loved By Our Patrons
        </h2>

        {/* Editorial Quote Card */}
        <div className="relative bg-white rounded-3xl md:rounded-[40px] p-8 sm:p-12 md:p-16 border border-[#112229]/10 shadow-lg">
          {/* Big Pink Quote Mark */}
          <div className="text-6xl md:text-8xl font-serif text-[#FFA7EE] leading-none mb-4 select-none opacity-80">
            “
          </div>

          <p className="font-title text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#112229] leading-snug tracking-tight max-w-3xl mx-auto">
            {current.quote}
          </p>

          <div className="mt-8 pt-6 border-t border-[#112229]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="font-title text-sm font-bold uppercase text-[#112229] block">
                {current.author}
              </span>
              <span className="text-xs text-[#147C98] font-semibold">
                {current.role} • Ordered {current.cakeOrdered}
              </span>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="w-11 h-11 rounded-full border-2 border-[#112229] bg-transparent hover:bg-[#112229] hover:text-[#FFA7EE] text-[#112229] flex items-center justify-center font-bold text-lg transition-all"
              >
                ←
              </button>
              <div className="px-3 font-title text-xs font-bold text-[#112229]">
                {currentIndex + 1} / {testimonialsData.length}
              </div>
              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="w-11 h-11 rounded-full border-2 border-[#112229] bg-transparent hover:bg-[#112229] hover:text-[#FFA7EE] text-[#112229] flex items-center justify-center font-bold text-lg transition-all"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
