import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomCelebrationsCTA() {
  return (
    <section className="py-20 md:py-28 px-[4vw] bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto rounded-[36px] md:rounded-[48px] bg-[#112229] text-white p-8 sm:p-12 md:p-16 lg:p-20 overflow-hidden relative shadow-2xl">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFA7EE_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#FFA7EE]">
              CUSTOM CELEBRATIONS
            </span>

            <h2 className="font-title text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05] text-[#F8F8F2]">
              Make every celebration a little sweeter with a cake made just for you.
            </h2>

            <p className="text-base md:text-lg text-[#F8F8F2]/80 leading-relaxed font-normal max-w-xl">
              Whether it is an intimate birthday, grand wedding, or corporate milestone in Hyderabad, our master bakers create bespoke multi-tiered celebration cakes tailored to your exact flavor and aesthetic desires.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/contact?inquiry=custom-celebration"
                className="px-8 py-4 rounded-pill bg-[#FFA7EE] hover:bg-white text-[#112229] font-title font-bold text-sm uppercase tracking-wider transition-all duration-500 shadow-lg hover:shadow-xl inline-flex items-center gap-2.5"
              >
                <span>TALK TO US</span>
                <span>→</span>
              </Link>

              <a
                href="https://wa.me/917098322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20discuss%20a%20custom%20celebration%20cake."
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-pill bg-transparent border-2 border-[#FFA7EE]/50 hover:border-[#FFA7EE] text-[#F8F8F2] font-title font-bold text-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <span>WhatsApp Baker</span>
                <span>💬</span>
              </a>
            </div>
          </div>

          {/* Right Arched Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] aspect-[3/4] window-arch overflow-hidden border-4 border-[#FFA7EE]/40 bg-[#FFDAED]/20 shadow-2xl relative group">
              <img
                src="/images/products/cakes/white-forest-cake.webp"
                alt="Custom Celebration Cake"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(.28,_.71,_0,_.98)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 inset-x-6 text-center text-white">
                <span className="font-title text-xs uppercase font-bold tracking-widest text-[#FFA7EE]">
                  Bespoke Creations
                </span>
                <p className="text-sm font-bold mt-1">Multi-Tiered & Sugar Florals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
