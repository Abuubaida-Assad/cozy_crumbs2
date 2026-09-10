import React from 'react';
import CustomerReviews from '../components/CustomerReviews';
import Reveal from '../components/animations/Reveal';
import RevealImage from '../components/animations/RevealImage';
import StaggerContainer from '../components/animations/StaggerContainer';
import StaggerItem from '../components/animations/StaggerItem';
import AnimatedButton from '../components/animations/AnimatedButton';

export default function AboutPage() {
  const pillars = [
    {
      title: 'Pure Honest Ingredients',
      desc: 'Pure churned dairy butter, single-origin Belgian dark chocolate, unbleached flours, and farm-fresh dairy. We never use hydrogenated oils, premixed powders, or artificial substitutes.',
    },
    {
      title: 'Dawn Baking Guarantee',
      desc: 'Our bakery cycles commence each day before sunrise. Loaves, viennoiserie, and celebration cakes arrive on your table with the radiant warmth of oven-fresh baking.',
    },
    {
      title: '100% In-House Production',
      desc: 'Every layer of sponge, every batch of ganache, and every flaky lamination is executed entirely inside our Hyderabad bakery studio by dedicated pastry artisans.',
    },
    {
      title: 'Celebration Centric',
      desc: 'From spontaneous afternoon tea-time cravings to milestone wedding anniversaries, every treat is designed to evoke nostalgia, joy, and sweet memories.',
    },
  ];

  const storyChapters = [
    {
      stage: 'Chapter One',
      title: 'The Spark & The Promise',
      description:
        'Started in a boutique kitchen in Hyderabad with a single stone deck oven and a fundamental conviction: real ingredients, slow artisan methods, and zero artificial shortcuts.',
    },
    {
      stage: 'Chapter Two',
      title: 'Slow Fermentation & Craft',
      description:
        'We mastered European slow-fermentation techniques alongside traditional Indian tea-time baking, allowing natural doughs to develop rich, complex flavor profiles.',
    },
    {
      stage: 'Chapter Three',
      title: 'The Custom Celebration Studio',
      description:
        'From milestone birthdays to lavish multi-tiered weddings, our custom studio creates unforgettable cakes tailored precisely to your family’s dietary preferences.',
    },
    {
      stage: 'Chapter Four',
      title: 'Baking Fresh Daily for Hyderabad',
      description:
        'Every morning begins before sunrise, ensuring every celebration cake, pastry slice, and sourdough loaf reaches your table fresh from the oven.',
    },
  ];

  return (
    <div className="pt-28 md:pt-36 pb-24 px-[4vw] bg-[#F8F8F2]">
      <div className="max-w-6xl mx-auto space-y-20 md:space-y-24">
        {/* Title with Viewport Reveal */}
        <Reveal y={40} className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#147C98]">
            OUR HERITAGE & CRAFTSMANSHIP
          </span>
          <h1 className="font-hero font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase text-[#112229] leading-tight tracking-tight">
            Born from a Passion for Honest Baking
          </h1>
          <p className="text-base md:text-lg text-[#112229]/80 font-medium leading-relaxed">
            "From a small kitchen to a place where every celebration gets a little sweeter."
          </p>
        </Reveal>

        {/* Narrative Split with RevealImage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal y={30} className="lg:col-span-6 space-y-6">
            <h2 className="font-hero font-extrabold text-3xl sm:text-4xl uppercase text-[#112229] tracking-tight">
              Nourishing Both Heart and Memory
            </h2>
            <p className="text-sm md:text-base text-[#112229]/80 leading-relaxed font-medium">
              Cozy Crumbs began with a simple observation: modern commercial baking had lost its soul to chemical preservatives, premixes, and industrial shortcuts.
            </p>
            <p className="text-sm md:text-base text-[#112229]/80 leading-relaxed font-medium">
              We set out to revive European slow-fermentation traditions coupled with authentic Indian tea-time heritage. Our sourdough ferments patiently for 36 hours; our chocolate cakes use only Belgian 70% dark chocolate; our butter biscuits honor the historic royal tea traditions of Hyderabad.
            </p>
            <div className="pt-2">
              <AnimatedButton
                as="a"
                href="https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20know%20more%20about%20your%20custom%20cakes."
                target="_blank"
                rel="noreferrer"
                className="font-title text-sm font-bold uppercase text-[#147C98] hover:underline"
              >
                CONNECT WITH OUR MASTER BAKER: +91 7093322796 →
              </AnimatedButton>
            </div>
          </Reveal>

          <Reveal y={40} delay={0.15} className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md aspect-[4/5] rounded-tl-[500px] rounded-tr-[500px] rounded-br-[80px] rounded-bl-[80px] overflow-hidden bg-[#FFDAED]/30 border-2 border-[#147C98] shadow-xl">
              <RevealImage
                src="/bernice/Two_Food_Photograhers-168.jpg"
                alt="Baking Craft"
                aspectRatio="aspect-[4/5]"
                imageClassName="hover:scale-105 transition-transform duration-700"
              />
            </div>
          </Reveal>
        </div>

        {/* 4 Pillars with Stagger */}
        <div className="space-y-8">
          <Reveal y={30} className="text-center">
            <h2 className="font-hero font-extrabold text-3xl sm:text-4xl uppercase text-[#112229] tracking-tight">
              Our Four Core Pillars
            </h2>
          </Reveal>

          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {pillars.map((p, idx) => (
              <StaggerItem key={idx}>
                <div className="p-8 rounded-3xl bg-white border border-[#112229]/15 space-y-3 shadow-sm hover:border-[#147C98] transition-all hover:shadow-md duration-300">
                  <h3 className="font-title text-xl font-bold uppercase text-[#112229]">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[#112229]/75 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Our Journey Narrative with Stagger */}
        <div className="space-y-8">
          <Reveal y={30} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#147C98]">
              THE COZY CRUMBS STORY
            </span>
            <h2 className="font-hero font-extrabold text-3xl sm:text-4xl uppercase text-[#112229] tracking-tight">
              Our Baking Journey
            </h2>
          </Reveal>

          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {storyChapters.map((item, index) => (
              <StaggerItem key={index}>
                <div className="p-7 rounded-3xl bg-white border border-[#112229]/15 space-y-3 shadow-sm hover:border-[#147C98] transition-all hover:shadow-md duration-300 h-full">
                  <span className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98] block">
                    {item.stage}
                  </span>
                  <h3 className="font-title text-base font-bold uppercase text-[#112229]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#112229]/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Customer Reviews Carousel (View All hidden on About Page) */}
        <CustomerReviews title="Customer Stories & Sweet Celebrations" showViewAll={false} />
      </div>
    </div>
  );
}
