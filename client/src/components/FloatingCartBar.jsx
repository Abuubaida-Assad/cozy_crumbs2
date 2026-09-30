import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function FloatingCartBar() {
  const { cart, cartCount, total, isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();
  const isCartOrCheckout = location.pathname === '/cart' || location.pathname === '/checkout';

  if (cartCount === 0 || isCartOpen || isCartOrCheckout) return null;

  return (
    <AnimatePresence>
      {cartCount > 0 && !isCartOpen && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[92%] max-w-lg pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-6 rounded-pill bg-[#112229] hover:bg-[#147C98] text-[#F8F8F2] shadow-2xl border-2 border-[#FFA7EE]/40 flex items-center justify-between transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#FFA7EE] text-[#112229] font-black text-sm flex items-center justify-center">
                {cartCount}
              </span>
              <div className="text-left">
                <span className="font-title font-extrabold text-sm uppercase block tracking-wider text-white">
                  Your Cart
                </span>
                <span className="text-[11px] text-[#FFA7EE] font-medium block">
                  {cart.length} item{cart.length > 1 ? 's' : ''} • Tap to view order
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-hero font-extrabold text-lg text-white">
                ₹{total}
              </span>
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm text-[#FFA7EE]">
                →
              </span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
