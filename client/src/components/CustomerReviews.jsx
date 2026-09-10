import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './animations/Reveal';
import AnimatedButton from './animations/AnimatedButton';

export const customerReviews = [
  {
    id: 1,
    name: 'PAWAN REDDY',
    location: 'JUBILEE HILLS, HYDERABAD',
    review:
      'Ordered a chocolate truffle cake for my parents’ anniversary. It was so fresh, moist, and honestly one of the best cakes we’ve had in Hyderabad. Everyone in the family loved it!',
    dietary: '100% EGGLESS',
    color: '#147C98', // Teal card from reference photo
  },
  {
    id: 2,
    name: 'NARASIMHA KUMAR',
    location: 'GACHIBOWLI, HYDERABAD',
    review:
      'I was looking for a completely eggless butterscotch cake for my son’s birthday and Cozy Crumbs delivered beyond expectations. The crunch and cream balance was spot on.',
    dietary: '100% EGGLESS',
    color: '#112229', // Dark card from reference photo
  },
  {
    id: 3,
    name: 'HYDER SHAREEF',
    location: 'BANJARA HILLS, HYDERABAD',
    review:
      'Super quick response on WhatsApp and they customized the design exactly the way we wanted. The cake arrived right on time and tasted absolutely heavenly.',
    dietary: 'CUSTOM ORDER',
    color: '#147C98', // Teal card
  },
  {
    id: 4,
    name: 'SNEHA GANESH',
    location: 'HITEC CITY, HYDERABAD',
    review:
      'The seasonal strawberry fresh cream cake was a huge hit at our family dinner. Not overly sweet, beautifully decorated, and you can tell the ingredients are top notch.',
    dietary: '100% EGGLESS',
    color: '#112229', // Dark card
  },
  {
    id: 5,
    name: 'SUDEEKSHA KUMARI',
    location: 'KONDAPUR, HYDERABAD',
    review:
      'Their morning sourdough and tea-time bakes are unmatched. Always warm, crisp, and freshly baked. Ordering directly through WhatsApp is so easy and personalized.',
    dietary: 'ARTISANAL BAKES',
    color: '#147C98', // Teal card
  },
  {
    id: 6,
    name: 'SARA KHAN',
    location: 'MADHAPUR, HYDERABAD',
    review:
      'Had a last-minute celebration order and they handled it seamlessly. The brownies and celebration cake were devoured in minutes. Truly our go-to bakery in Hyderabad!',
    dietary: 'EGG & EGGLESS',
    color: '#112229', // Dark card
  },
];

export default function CustomerReviews({
  title = "What Hyderabad Is Saying",
  showViewAll = true,
}) {
  const [isReversed, setIsReversed] = useState(false);

  // Seamless infinite loop by quadrupling the review list
  const loopedReviews = [
    ...customerReviews,
    ...customerReviews,
    ...customerReviews,
    ...customerReviews,
  ];

  return (
    <section className="py-20 md:py-32 bg-[#F8F8F2] overflow-hidden border-t border-[#112229]/10">
      <div className="max-w-7xl mx-auto px-[4vw]">
        {/* Top Controls Row matching exact reference photo */}
        <Reveal y={30} once={false} amount={0.2} className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between">
            {/* Left circular navigation arrows to control continuous movement direction */}
            <div className="flex items-center gap-3">
              <AnimatedButton
                onClick={() => setIsReversed(true)}
                aria-label="Scroll Reviews Left / Reverse"
                className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isReversed
                    ? 'bg-[#FFA7EE] text-[#112229]'
                    : 'bg-[#112229] text-[#F8F8F2] hover:bg-[#FFA7EE] hover:text-[#112229]'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setIsReversed(false)}
                aria-label="Scroll Reviews Right / Forward"
                className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-md ${
                  !isReversed
                    ? 'bg-[#FFA7EE] text-[#112229]'
                    : 'bg-[#112229] text-[#F8F8F2] hover:bg-[#FFA7EE] hover:text-[#112229]'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </AnimatedButton>
            </div>

            {/* Right VIEW ALL Link matching reference photo (hidden on About page) */}
            {showViewAll && (
              <div>
                <Link
                  to="/about"
                  className="font-hero font-extrabold text-sm sm:text-base md:text-lg uppercase tracking-wider text-[#112229] hover:text-[#FFA7EE] transition-colors inline-flex items-center gap-2 group"
                >
                  <span>VIEW ALL</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Continuously Moving Carousel Track (Moves continuously like cake arches, never static) */}
      <div className="relative w-full overflow-hidden py-4">
        <div
          className="animate-reviews-scroll flex items-stretch gap-5 sm:gap-7 md:gap-8 px-4 will-change-transform select-none"
          style={{
            animationDirection: isReversed ? 'reverse' : 'normal',
          }}
        >
          {loopedReviews.map((item, index) => {
            const isTeal = index % 2 === 0;
            const bgColor = isTeal ? 'bg-[#147C98]' : 'bg-[#112229]';

            return (
              <div
                key={`${item.id}-${index}`}
                className="w-[84vw] sm:w-[50vw] md:w-[380px] lg:w-[420px] flex-shrink-0"
              >
                <div
                  className={`${bgColor} text-white rounded-[32px] sm:rounded-[40px] md:rounded-[44px] p-7 sm:p-9 md:p-11 min-h-[350px] sm:min-h-[390px] md:min-h-[420px] flex flex-col justify-between shadow-xl relative select-none hover:-translate-y-2 transition-transform duration-300 border border-white/10`}
                >
                  <div>
                    {/* Large Quotation Mark Icon */}
                    <div className="mb-5 sm:mb-6">
                      <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 fill-white opacity-95"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/95 font-medium">
                      {item.review}
                    </p>
                  </div>

                  {/* Bottom Author / Source matching bold typography in photo */}
                  <div className="pt-6 sm:pt-8 border-t border-white/20">
                    <h3 className="font-hero font-black text-lg sm:text-xl md:text-2xl tracking-tight text-white uppercase leading-tight">
                      {item.name}
                    </h3>
                    <p className="font-title text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FFA7EE] mt-1">
                      {item.location} • {item.dietary}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
