import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../data/siteData';

export default function MobileDrawer({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { name: 'HOME', path: '/' },
    { name: 'MENU', path: '/menu' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[25000] flex justify-end">
          {/* Smooth Backdrop Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#112229]/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[25001] w-full max-w-[360px] h-full bg-[#F8F8F2] p-8 flex flex-col justify-between shadow-2xl"
          >
            {/* Top */}
            <div className="flex items-center justify-between pb-6 border-b border-[#112229]/15">
              <div>
                <span className="font-hero text-2xl font-extrabold uppercase text-[#112229] block leading-none">
                  COZY CRUMBS
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-[#112229]/5 flex items-center justify-center text-[#112229] font-bold text-base transition-colors hover:bg-[#FFA7EE]"
              >
                ✕
              </motion.button>
            </div>

            {/* Links with Staggered Entrance */}
            <nav className="my-8">
              <ul className="space-y-6 list-none p-0 m-0">
                {links.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.1 + index * 0.08,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={link.path}
                        onClick={onClose}
                        className={`block font-hero text-3xl uppercase font-extrabold tracking-tight transition-colors ${
                          isActive ? 'text-[#147C98]' : 'text-[#112229] hover:text-[#FFA7EE]'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom Contact */}
            <div className="pt-6 border-t border-[#112229]/15 space-y-4">
              <a
                href="tel:+917098322796"
                className="w-full py-4 rounded-pill bg-[#FFA7EE] text-[#112229] font-title font-extrabold text-sm uppercase tracking-wider block text-center shadow-md hover:bg-[#112229] hover:text-white transition-colors"
              >
                CALL: +91 7098322796
              </a>

              <div className="text-xs font-semibold text-[#112229]/80 space-y-1">
                <p>{siteConfig.address}</p>
                <p>{siteConfig.email}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
