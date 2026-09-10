import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './animations/Reveal';
import AnimatedButton from './animations/AnimatedButton';
import { transitions } from '../animations/transitions';

export default function CelebrateSection() {
  const sectionRef = useRef(null);
  const [targetOffset, setTargetOffset] = useState(35);
  const [currentOffset, setCurrentOffset] = useState(35);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate smooth progress through the viewport
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));

      // Move offset smoothly along the SVG path (from 15% to 75%)
      const calculatedOffset = 15 + progress * 55;
      setTargetOffset(calculatedOffset);
    };

    // Smooth lerp loop for ultra-fluid 60fps text rotation
    const smoothLoop = () => {
      setCurrentOffset((prev) => {
        const diff = targetOffset - prev;
        if (Math.abs(diff) < 0.05) return targetOffset;
        return prev + diff * 0.12; // Buttery smooth easing
      });
      animationFrameId = requestAnimationFrame(smoothLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animationFrameId = requestAnimationFrame(smoothLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetOffset]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-36 px-[4vw] bg-[#F8F8F2] flex flex-col items-center overflow-hidden"
    >
      {/* Curved Text and Arched Cake Container from Photo 3 */}
      <Reveal y={40} amount={0.2} className="relative my-8 sm:my-16 flex justify-center items-center">
        {/* The Arch Window with Cake */}
        <motion.div
          initial={shouldReduceMotion ? {} : { scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={transitions.editorial}
          className="w-[70vw] sm:w-[45vw] md:w-[32vw] max-w-[430px] aspect-[3/4] rounded-tl-[500px] rounded-tr-[500px] rounded-br-[80px] rounded-bl-[80px] overflow-hidden bg-[#FFDAED]/20 relative shadow-2xl border-2 border-[#112229]/10 will-change-transform"
        >
          <img
            src="/bernice/celebrationscake2.jpg"
            alt="Celebrate with Cozy Crumbs Cake"
            className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
          />
        </motion.div>

        {/* Dynamic Smooth Scroll-Animated Text Path Arching Around the Cake Shape */}
        <svg
          viewBox="0 0 221.66 283.6"
          className="absolute inset-0 w-[128%] h-[128%] -left-[14%] -top-[14%] pointer-events-none select-none overflow-visible"
        >
          <path
            fill="none"
            id="Celebrate_Text_Path"
            d="M 0.5 283.6 V 106 C 0.5 48.7 48.7 5 106 5 H 111.6 C 171.1 5 219.4 48.8 219.4 108.3 V 283.6"
          />
          <text className="font-hero font-extrabold uppercase text-[24px] sm:text-[27px] fill-[#112229] tracking-[0.14em]">
            <textPath
              href="#Celebrate_Text_Path"
              startOffset={`${currentOffset}%`}
              textAnchor="middle"
            >
              CELEBRATE WITH CAKE • COZY CRUMBS
            </textPath>
          </text>
        </svg>

        {/* Pink Circle Order Button with Micro-Interaction */}
        <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 z-10">
          <AnimatedButton
            as="a"
            href="https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20order%20a%20custom%20celebration%20cake."
            target="_blank"
            rel="noreferrer"
            scaleHover={1.06}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#FFA7EE] hover:bg-[#112229] hover:text-[#F8F8F2] text-[#112229] font-hero font-black text-base sm:text-lg uppercase tracking-wider flex items-center justify-center transition-colors duration-300 shadow-2xl cursor-pointer select-none border-4 border-white"
          >
            ORDER
          </AnimatedButton>
        </div>
      </Reveal>

      {/* Editorial Text Below Arch */}
      <Reveal y={30} delay={0.15} amount={0.2} className="mt-14 sm:mt-16 text-center max-w-3xl mx-auto space-y-4 px-4">
        <h3 className="font-hero font-extrabold text-xl sm:text-2xl md:text-3xl text-[#112229] leading-snug uppercase tracking-tight">
          ORDERING A CUSTOM CAKE AT COZY CRUMBS IS A SEAMLESS AND PERSONALIZED EXPERIENCE.
        </h3>
        <div>
          <a
            href="https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20order%20a%20custom%20cake."
            target="_blank"
            rel="noreferrer"
            className="inline-block font-title font-extrabold text-sm sm:text-lg md:text-xl uppercase text-[#147C98] hover:text-[#112229] tracking-wider transition-colors hover:scale-102 transform duration-200"
          >
            EGGLESS & REGULAR CAKE CREATIONS • WHATSAPP: +91 7093322796
          </a>
        </div>
      </Reveal>
    </section>
  );
}
