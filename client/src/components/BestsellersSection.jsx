import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from './animations/Reveal';
import StaggerContainer from './animations/StaggerContainer';
import StaggerItem from './animations/StaggerItem';
import AnimatedButton from './animations/AnimatedButton';

export default function BestsellersSection() {
  const bestsellers = [
    {
      title: 'BELGIAN CHOCOLATE TRUFFLE',
      subtitle: '70% Dark Ganache • Eggless & Egg Available',
      img1: '/images/products/cakes/chocolate-cake.webp',
      img2: '/bernice/celebrationscake2.jpg',
      waText: 'Hi Cozy Crumbs! I would like to order the Belgian Chocolate Truffle Cake.',
    },
    {
      title: 'BUTTERSCOTCH CRUNCH CAKE',
      subtitle: 'Golden Praline Cream • Eggless & Egg Available',
      img1: '/images/products/cakes/butterscotch-cake.webp',
      img2: '/images/products/cakes/vanilla-cake.webp',
      waText: 'Hi Cozy Crumbs! I would like to order the Butterscotch Crunch Cake.',
    },
    {
      title: 'STRAWBERRY FRESH CREAM CAKE',
      subtitle: 'Fresh Berry Coulis • Eggless & Egg Available',
      img1: '/images/products/cakes/strawberry-cake.webp',
      img2: '/images/products/cakes/white-forest-cake.webp',
      waText: 'Hi Cozy Crumbs! I would like to order the Strawberry Fresh Cream Cake.',
    },
  ];

  return (
    <section className="relative py-20 md:py-32 px-[4vw] bg-[#F8F8F2] overflow-hidden">
      {/* Repeated Background Outline Marquee */}
      <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-25 select-none overflow-hidden">
        <div className="animate-marquee-scroll whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="font-hero text-8xl md:text-9xl font-black uppercase text-transparent tracking-tighter mr-8"
              style={{ WebkitTextStroke: '2px #147C98' }}
            >
              BEST SELLERS •
            </span>
          ))}
        </div>
        <div className="animate-marquee-reverse whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="font-hero text-8xl md:text-9xl font-black uppercase text-[#147C98] tracking-tighter mr-8"
            >
              BEST SELLERS •
            </span>
          ))}
        </div>
      </div>

      {/* 3 Arched Cake Cards with Staggered Viewport Entrance */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <StaggerContainer
          staggerDelay={0.12}
          amount={0.15}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
        >
          {bestsellers.map((item, idx) => (
            <StaggerItem key={idx}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-between p-6 sm:p-8 bg-[#F8F8F2] border-2 border-[#147C98] rounded-tl-[500px] rounded-tr-[500px] rounded-br-[80px] rounded-bl-[80px] shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
              >
                {/* Top Product Image Container with Dual Image Hover & scale(1.03) */}
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-inner dual-img-container mb-6 group">
                  <img
                    src={item.img1}
                    alt={item.title}
                    className="img-primary absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <img
                    src={item.img2}
                    alt={`${item.title} alternate view`}
                    className="img-secondary absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Cake Meta */}
                <div className="space-y-2 mb-6">
                  <h3 className="font-title text-xl sm:text-2xl font-black uppercase text-[#112229] leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs uppercase font-bold text-[#147C98] tracking-wide">
                    {item.subtitle}
                  </p>
                </div>

                {/* Direct WhatsApp Order Button with Micro-Interaction */}
                <div className="pt-2">
                  <AnimatedButton
                    as="a"
                    href={`https://wa.me/917093322796?text=${encodeURIComponent(item.waText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 px-6 rounded-pill bg-[#FFA7EE] text-[#112229] font-title font-extrabold text-sm uppercase tracking-wider text-center block hover:bg-[#112229] hover:text-[#F8F8F2] transition-colors duration-300"
                  >
                    ORDER ON WHATSAPP
                  </AnimatedButton>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Button Side / Bottom with Viewport Reveal */}
        <Reveal y={20} amount={0.2} className="mt-12 flex justify-end">
          <AnimatedButton
            as={Link}
            to="/menu"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-pill bg-[#112229] text-[#F8F8F2] hover:bg-[#FFA7EE] hover:text-[#112229] font-title font-extrabold text-sm uppercase tracking-wider transition-colors duration-300 shadow-md group"
          >
            <span>VIEW ALL CREATIONS</span>
            <span className="transform group-hover:translate-x-1.5 transition-transform">→</span>
          </AnimatedButton>
        </Reveal>
      </div>
    </section>
  );
}
