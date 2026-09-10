import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './animations/Reveal';
import StaggerContainer from './animations/StaggerContainer';
import StaggerItem from './animations/StaggerItem';
import AnimatedButton from './animations/AnimatedButton';
import { transitions } from '../animations/transitions';

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="relative bg-[#147C98] text-[#F8F8F2] pt-20 pb-12 overflow-hidden">
      {/* Top Wave Cutout from Photo 2 */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          className="w-full h-12 sm:h-16 md:h-20 fill-[#F8F8F2]"
          viewBox="-30 0 1000 90"
          preserveAspectRatio="none"
        >
          <path d="M 0 0 C 300 90, 700 90, 1000 0 L 1000 0 L 0 0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-[4vw]">
        {/* Three Columns with Viewport Reveal */}
        <StaggerContainer
          staggerDelay={0.1}
          amount={0.15}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start pb-12"
        >
          {/* Left Column: Address, Email, Phone, Social */}
          <StaggerItem className="md:col-span-4 space-y-3">
            <h3 className="font-hero font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#F8F8F2] m-0">
              COZY CRUMBS
            </h3>
            <p className="text-sm font-medium leading-tight text-[#F8F8F2]/90">
              Cozy Crumbs Artisanal Bakery<br />
              Gachibowli TNGOS Colony, Hyderabad
            </p>
            <div className="space-y-1 text-sm font-semibold">
              <p>
                <a href="mailto:cozycrumbs6767@gmail.com" className="hover:text-[#FFA7EE] transition-colors">
                  cozycrumbs6767@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20place%20an%20order."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFA7EE] transition-colors underline font-bold"
                >
                  +91 7093322796 (Call / WhatsApp)
                </a>
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase font-bold tracking-wider text-[#F8F8F2] hover:text-[#FFA7EE] transition-colors"
              >
                Follow us on Instagram
              </a>
            </div>
          </StaggerItem>

          {/* Center Column: Navigation */}
          <StaggerItem className="md:col-span-4 space-y-3">
            <h4 className="font-hero font-extrabold uppercase text-sm tracking-widest text-[#FFA7EE]">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 font-hero font-bold uppercase text-lg sm:text-xl tracking-tight list-none p-0 m-0">
              <li>
                <Link to="/" className="hover:text-[#FFA7EE] transition-colors inline-block hover:translate-x-1 duration-200">
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#FFA7EE] transition-colors inline-block hover:translate-x-1 duration-200">
                  MENU
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FFA7EE] transition-colors inline-block hover:translate-x-1 duration-200">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFA7EE] transition-colors inline-block hover:translate-x-1 duration-200">
                  CONTACT
                </Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Right Column: Bakery Hours & Service */}
          <StaggerItem className="md:col-span-4 space-y-3">
            <h4 className="font-hero font-extrabold uppercase text-sm tracking-widest text-[#FFA7EE]">
              HOURS & ORDERING
            </h4>
            <div className="space-y-1.5 text-sm font-semibold text-[#F8F8F2]/90">
              <p className="font-bold text-[#F8F8F2]">Monday – Sunday: 7:30 AM – 10:30 PM</p>
              <p>Fresh Bakes Prepared Daily at Dawn</p>
              <p className="text-xs text-[#FFA7EE] font-bold uppercase tracking-wider pt-1">
                100% Eggless & Regular Options Available
              </p>
            </div>
            <div className="pt-3">
              <AnimatedButton
                as="a"
                href="https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center font-title font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-pill bg-[#FFA7EE] text-[#112229] hover:bg-white transition-colors shadow-md"
              >
                WHATSAPP US TO ORDER
              </AnimatedButton>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Fully Visible Giant Brand Typography with Viewport Reveal - Scaled SVG for 100% Visibility on all screens */}
        <div className="w-full pt-8 pb-3 text-center select-none flex justify-center items-center">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={transitions.editorial}
            className="w-full max-w-7xl mx-auto flex justify-center items-center px-1"
          >
            <svg
              className="w-full h-auto max-h-24 sm:max-h-36 md:max-h-48 lg:max-h-60 select-none overflow-visible"
              viewBox="0 0 1100 135"
              preserveAspectRatio="xMidYMid meet"
              aria-label="COZY CRUMBS"
            >
              <text
                x="50%"
                y="52%"
                dominantBaseline="central"
                textAnchor="middle"
                className="font-hero font-black uppercase fill-[#F8F8F2]"
                fontSize="122"
                letterSpacing="-0.01em"
              >
                COZY CRUMBS
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Copyright and Legal Line - No line in phone view */}
        <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8F8F2]/80 font-semibold border-t-0 sm:border-t sm:border-white/10">
          <p>© 2026 Cozy Crumbs Artisanal Bakery. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0 items-center">
            <a
              href="https://wa.me/917093322796"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white font-bold"
            >
              Order Desk: +91 7093322796
            </a>
            <span className="text-white/40">•</span>
            <Link to="/admin" className="hover:text-[#FFA7EE] transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
