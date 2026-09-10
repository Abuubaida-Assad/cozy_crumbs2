import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedButton from './animations/AnimatedButton';
import ScrollProgress from './animations/ScrollProgress';

export default function Header({ onOpenMobileMenu }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'MENU', path: '/menu' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Subtle Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Top Banner Notice for Egg & Eggless Options */}
      <div className="fixed top-0 left-0 w-full z-[101] bg-[#112229] text-[#FFA7EE] py-1 px-4 text-center font-title text-[11px] font-extrabold uppercase tracking-widest border-b border-white/10">
        <span>Handcrafted Daily in Hyderabad • 100% Eggless & Egg Options Available</span>
      </div>

      {/* Navigation Header */}
      <header
        id="section-header"
        className={`fixed top-6 left-0 w-full z-[100] flex items-center justify-between px-[4vw] transition-all duration-300 ease-[cubic-bezier(.28,_.71,_0,_.98)] ${
          isHomePage && !isScrolled
            ? 'py-6 md:py-7 bg-transparent border-none text-white'
            : 'py-4 bg-[#112229]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white'
        }`}
      >
        {/* Brand Logo - Apfel Grotezk Dual Flip */}
        <Link
          to="/"
          className="group relative block w-[200px] h-10 overflow-hidden select-none"
          aria-label="Cozy Crumbs"
        >
          <div className="absolute top-1/2 left-0 w-full transition-all duration-500 ease-[cubic-bezier(.28,_.71,_0,_.98)] translate-y-[-50%] group-hover:translate-y-[-160%]">
            <span className="font-hero font-extrabold text-2xl md:text-3xl uppercase tracking-[-0.03em] leading-none text-white drop-shadow-md">
              COZY CRUMBS
            </span>
          </div>

          <div className="absolute top-1/2 left-0 w-full transition-all duration-500 ease-[cubic-bezier(.28,_.71,_0,_.98)] translate-y-[150%] group-hover:translate-y-[-50%]">
            <span className="font-hero font-extrabold text-2xl md:text-3xl uppercase tracking-[-0.03em] leading-none text-[#FFA7EE] drop-shadow-md">
              COZY CRUMBS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Thick, Bold White with Pink on Hover/Click */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center gap-8 xl:gap-10 m-0 p-0 list-none">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`group relative inline-block font-hero uppercase font-black text-[19px] tracking-tight transition-colors duration-200 drop-shadow-sm ${
                      isActive ? 'text-[#FFA7EE]' : 'text-white hover:text-[#FFA7EE]'
                    }`}
                  >
                    <span className="inline-block overflow-hidden">
                      {link.name.split('').map((letter, index) => (
                        <span key={index} className="nav-letter inline-block font-extrabold">
                          {letter}
                        </span>
                      ))}
                    </span>
                    {/* Premium underline effect using scaleX */}
                    <motion.span
                      className={`absolute left-0 bottom-[-3px] h-[2.5px] w-full origin-left bg-[#FFA7EE] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right WhatsApp Order Button with Micro-Interaction */}
        <div className="flex items-center gap-4">
          <AnimatedButton
            as="a"
            href="https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noreferrer"
            className="font-title font-bold text-xs uppercase px-5 py-2.5 rounded-pill bg-[#FFA7EE] text-[#112229] hover:bg-[#112229] hover:text-[#F8F8F2] transition-colors shadow-sm"
          >
            ORDER: +91 7093322796
          </AnimatedButton>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open Mobile Menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:text-[#FFA7EE] transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 20 14" fill="currentColor">
              <path d="M0 14v-1h20v1H0zm0-7.5h20v1H0v-1zM0 0h20v1H0V0z" />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
