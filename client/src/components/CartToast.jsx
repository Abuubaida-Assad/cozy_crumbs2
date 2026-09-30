import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CartToast() {
  const { toast, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-20 right-4 sm:right-6 z-[26000] max-w-sm bg-[#112229] text-white p-4 rounded-2xl shadow-2xl border border-[#FFA7EE]/40 flex items-center justify-between gap-3 pointer-events-auto"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm flex-shrink-0">
              ✓
            </span>
            <p className="font-title font-bold text-xs uppercase tracking-wide text-[#F8F8F2] line-clamp-2">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-3 py-1.5 rounded-pill bg-[#FFA7EE] hover:bg-white text-[#112229] font-title font-extrabold text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            View Cart
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
