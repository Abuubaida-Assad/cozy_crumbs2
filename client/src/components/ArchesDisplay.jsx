import React from 'react';
import Reveal from './animations/Reveal';
import RevealText from './animations/RevealText';

export default function ArchesDisplay() {
  const arches = [
    { src: '/bernice/Two_Food_Photograhers-11.jpg', alt: 'Cozy Crumbs Artisan Cake Slice' },
    { src: '/bernice/Two_Food_Photograhers-50.jpg', alt: 'Cozy Crumbs Barista Specialty Espresso' },
    { src: '/bernice/Two_Food_Photograhers-168.jpg', alt: 'Cozy Crumbs Celebration Cake Crafting' },
    { src: '/bernice/Two_Food_Photograhers-40.jpg', alt: 'Cozy Crumbs Chilled Latte' },
    { src: '/bernice/Two_Food_Photograhers-6.jpg', alt: 'Cozy Crumbs Fresh Berry Pastry' },
    { src: '/bernice/Two_Food_Photograhers-59.jpg', alt: 'Cozy Crumbs Morning Deck Oven Baking' },
  ];

  return (
    <section className="py-20 md:py-32 bg-[#F8F8F2] overflow-hidden">
      {/* Title with Editorial Line-by-Line Reveal */}
      <div className="text-center px-[4vw] mb-14 md:mb-20">
        <RevealText
          as="h2"
          lines={['THE BEST THINGS IN LIFE', 'ARE SWEET']}
          className="font-hero font-extrabold text-4xl sm:text-6xl md:text-8xl uppercase text-[#112229] leading-[0.9] tracking-tight m-0"
          once={false}
          amount={0.2}
        />
        <Reveal y={20} delay={0.2} amount={0.2}>
          <p className="font-title text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#147C98] mt-4">
            100% Eggless & Egg Options Crafted Fresh Daily in Hyderabad
          </p>
        </Reveal>
      </div>

      {/* Horizontal Arched Windows Gallery from Photo 1 (Continuous Infinite Scroll, Never Pauses) */}
      <Reveal y={40} amount={0.15} className="relative w-full overflow-hidden">
        <div className="animate-arches-scroll flex items-end gap-6 md:gap-8 px-4">
          {[...arches, ...arches, ...arches].map((arch, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-shrink-0 w-[55vw] sm:w-[35vw] md:w-[24vw] aspect-[2/3] rounded-tl-[500px] rounded-tr-[500px] rounded-br-[80px] rounded-bl-[80px] overflow-hidden bg-[#FFDAED]/20 shadow-md">
                <img
                  src={arch.src}
                  alt={arch.alt}
                  className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Hand-Drawn Cake Slice Illustration from Photo 1 */}
              {idx % 3 === 2 && (
                <div className="flex-shrink-0 w-20 md:w-28 self-end mb-4 select-none">
                  <img
                    src="/bernice/cake_full.svg"
                    alt="Cozy Crumbs Handcrafted Cake"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
