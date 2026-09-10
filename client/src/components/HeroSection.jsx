import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../animations/transitions';

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-end bg-[#112229] overflow-hidden">
      {/* 1. Hero Background Flatlay Image Entrance: scale 1.08 -> 1, opacity 0.85 -> 1 */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { scale: 1.08, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={transitions.hero}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <img
          src="/bernice/BERNICE_HeroCakeImage.jpg"
          alt="Cozy Crumbs Artisanal Bakery"
          className="w-full h-full object-cover select-none"
        />
        {/* Overlay fade smoothly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-t from-[#112229]/85 via-[#112229]/35 to-[#112229]/65 pointer-events-none"
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full px-[4vw] pb-12 md:pb-20 pt-40 flex flex-col justify-end">
        <div className="relative w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Giant Hero Title - Line by line animation */}
          <div className="w-full max-w-5xl">
            <h1 className="font-hero font-extrabold text-[#F8F8F2] uppercase text-[15vw] sm:text-[13vw] md:text-[12vw] leading-[0.78] tracking-[-0.03em] m-0 select-none drop-shadow-lg overflow-hidden">
              <span className="block overflow-hidden">
                <motion.span
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.2, ease: transitions.editorial.ease }}
                  className="block will-change-transform"
                >
                  A BAKING
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.35, ease: transitions.editorial.ease }}
                  className="block will-change-transform"
                >
                  LOVE AFFAIR
                </motion.span>
              </span>
            </h1>

            {/* Supporting text: opacity 0, y: 25 -> opacity: 1, y: 0 */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: transitions.editorial.ease }}
              className="font-title text-xs sm:text-sm md:text-base font-bold uppercase text-[#FFA7EE] tracking-widest mt-4"
            >
              Fresh Daily in Hyderabad • Egg & Eggless Options Available
            </motion.p>
          </div>

          {/* Tilted Pink Circle Badge: scale 0.7, opacity 0, rotate -10deg -> scale 1, opacity 1, rotate 30deg */}
          <div className="flex-shrink-0 self-end md:self-auto mb-4 md:mb-6">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.7, rotate: -10 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1 }
                  : {
                      opacity: 1,
                      scale: 1,
                      rotate: 30,
                      y: [0, -6, 0], // Subtle floating loop after entering
                    }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: { duration: 0.8, delay: 0.6, ease: transitions.editorial.ease },
                      scale: { duration: 0.8, delay: 0.6, ease: transitions.editorial.ease },
                      rotate: { duration: 0.9, delay: 0.6, ease: transitions.editorial.ease },
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: 1.5,
                      },
                    }
              }
            >
              <Link
                to="/menu"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-[#FFA7EE] text-[#112229] font-hero font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider flex items-center justify-center hover:scale-95 transition-transform duration-300 shadow-2xl cursor-pointer select-none text-center p-4 leading-tight border-4 border-white/30"
              >
                SEE MENU
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
