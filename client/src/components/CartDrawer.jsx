import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, getProductId, getProductPrice } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    cartCount,
    orderType,
    setOrderType,
    customerDetails,
    updateCustomerDetails,
    getWhatsAppOrderUrl,
  } = useCart();

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);

  if (!isCartOpen) return null;

  const validateDeliveryDetails = () => {
    if (orderType === 'dine-in') return true;

    const newErrors = {};
    if (!customerDetails.name || !customerDetails.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!customerDetails.phone || !customerDetails.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else {
      const cleanPhone = customerDetails.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    if (!customerDetails.address || !customerDetails.address.trim()) {
      newErrors.address = 'Please enter your delivery address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!validateDeliveryDetails()) {
      return;
    }

    setIsOpeningWhatsApp(true);

    try {
      const whatsappUrl = getWhatsAppOrderUrl();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = whatsappUrl;
      } else {
        const newWin = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          window.location.href = whatsappUrl;
        }
      }
    } catch (err) {
      console.error('Error generating WhatsApp order URL', err);
    } finally {
      setTimeout(() => {
        setIsOpeningWhatsApp(false);
      }, 1500);
    }
  };

  const handleBrowseMenu = () => {
    setIsCartOpen(false);
    navigate('/menu');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[25000] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#112229]/70 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[25001] w-full max-w-[480px] h-full bg-[#F8F8F2] flex flex-col shadow-2xl overflow-hidden border-l border-[#112229]/15"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#112229]/15 bg-white">
              <div className="flex items-center gap-3">
                <span className="font-hero font-extrabold text-2xl uppercase tracking-tight text-[#112229]">
                  Your Order
                </span>
                {cartCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFA7EE] text-[#112229] font-title font-black text-xs">
                    {cartCount}
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart drawer"
                className="w-9 h-9 rounded-full bg-[#112229]/5 hover:bg-[#FFA7EE] text-[#112229] flex items-center justify-center transition-colors font-bold text-sm"
              >
                ✕
              </motion.button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                /* Empty Cart State */
                <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-[#FFDAED] flex items-center justify-center text-3xl shadow-inner">
                    🥐
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-title font-bold text-xl uppercase text-[#112229]">
                      Your cart is empty.
                    </h3>
                    <p className="text-sm text-[#112229]/70 max-w-xs mx-auto">
                      Looks like you haven't added anything yet.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBrowseMenu}
                    className="mt-4 px-6 py-3 rounded-pill bg-[#112229] text-[#F8F8F2] hover:bg-[#147C98] font-title font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
                  >
                    <span>Browse the menu</span>
                    <span>→</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    <span className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98] block">
                      Ordered Items ({cart.length})
                    </span>

                    <div className="divide-y divide-[#112229]/10">
                      {cart.map((item) => {
                        const pid = getProductId(item.product);
                        const unitPrice = getProductPrice(item.product);
                        const itemSubtotal = Math.round(unitPrice * item.quantity);
                        const img =
                          item.product?.image || '/images/products/cakes/chocolate-cake.webp';

                        return (
                          <div
                            key={pid}
                            className="py-4 flex items-center gap-4 first:pt-0 last:pb-0"
                          >
                            {/* Product Image */}
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border border-[#112229]/10 flex-shrink-0 relative">
                              <img
                                src={img}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/images/products/cakes/chocolate-cake.webp';
                                }}
                              />
                            </div>

                            {/* Details & Controls */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-title font-bold text-sm sm:text-base uppercase text-[#112229] truncate">
                                  {item.product?.name}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(pid)}
                                  aria-label={`Remove ${item.product?.name}`}
                                  className="text-[#112229]/40 hover:text-red-600 transition-colors p-1"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>

                              <div className="text-xs text-[#112229]/70 font-semibold mt-0.5">
                                ₹{unitPrice} each
                              </div>

                              {/* Quantity Selector & Item Subtotal */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center rounded-pill bg-[#F8F8F2] border border-[#112229]/20 overflow-hidden shadow-sm">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(pid, item.quantity - 1)}
                                    aria-label="Decrease quantity"
                                    className="w-8 h-8 flex items-center justify-center text-[#112229] hover:bg-[#FFA7EE] font-bold text-base transition-colors cursor-pointer active:scale-95"
                                  >
                                    -
                                  </button>
                                  <span className="w-9 text-center font-hero font-extrabold text-xs text-[#112229] select-none">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(pid, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                    className="w-8 h-8 flex items-center justify-center text-[#112229] hover:bg-[#FFA7EE] font-bold text-base transition-colors cursor-pointer active:scale-95"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="font-title font-extrabold text-sm sm:text-base text-[#112229]">
                                    ₹{itemSubtotal}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section Divider */}
                  <hr className="border-[#112229]/15" />

                  {/* Order Type Selection */}
                  <div className="space-y-3">
                    <label className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98] block">
                      How would you like your order?
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Dine-In Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType('dine-in');
                          setErrors({});
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                          orderType === 'dine-in'
                            ? 'bg-[#112229] border-[#112229] text-[#F8F8F2] shadow-md'
                            : 'bg-white border-[#112229]/15 text-[#112229] hover:border-[#112229]'
                        }`}
                      >
                        <div className="text-left">
                          <span className="font-title font-extrabold text-sm uppercase block">
                            Dine-In
                          </span>
                          <span
                            className={`text-[11px] block mt-0.5 ${
                              orderType === 'dine-in' ? 'text-[#FFA7EE]' : 'text-[#112229]/60'
                            }`}
                          >
                            At the Bakery Desk
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            orderType === 'dine-in'
                              ? 'border-[#FFA7EE] bg-[#FFA7EE]'
                              : 'border-[#112229]/30'
                          }`}
                        >
                          {orderType === 'dine-in' && (
                            <div className="w-2 h-2 rounded-full bg-[#112229]" />
                          )}
                        </div>
                      </button>

                      {/* Delivery Option */}
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                          orderType === 'delivery'
                            ? 'bg-[#112229] border-[#112229] text-[#F8F8F2] shadow-md'
                            : 'bg-white border-[#112229]/15 text-[#112229] hover:border-[#112229]'
                        }`}
                      >
                        <div className="text-left">
                          <span className="font-title font-extrabold text-sm uppercase block">
                            Delivery
                          </span>
                          <span
                            className={`text-[11px] block mt-0.5 ${
                              orderType === 'delivery' ? 'text-[#FFA7EE]' : 'text-[#112229]/60'
                            }`}
                          >
                            Direct to Your Door
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            orderType === 'delivery'
                              ? 'border-[#FFA7EE] bg-[#FFA7EE]'
                              : 'border-[#112229]/30'
                          }`}
                        >
                          {orderType === 'delivery' && (
                            <div className="w-2 h-2 rounded-full bg-[#112229]" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Delivery Information Form (Only if Delivery is selected) */}
                  {orderType === 'delivery' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#112229]/15 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-title text-xs font-bold uppercase tracking-widest text-[#112229]">
                          Delivery Details
                        </span>
                        <span className="text-[10px] uppercase font-bold text-red-500">
                          * Required fields
                        </span>
                      </div>

                      {/* Customer Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                          Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customerDetails.name || ''}
                          onChange={(e) => {
                            updateCustomerDetails('name', e.target.value);
                            if (errors.name) {
                              setErrors((prev) => ({ ...prev, name: '' }));
                            }
                          }}
                          placeholder="e.g. Hyder"
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F2] border text-xs font-semibold text-[#112229] outline-none transition-colors ${
                            errors.name
                              ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                              : 'border-[#112229]/20 focus:border-[#147C98]'
                          }`}
                        />
                        {errors.name && (
                          <p className="text-[11px] text-red-600 font-semibold mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={customerDetails.phone || ''}
                          onChange={(e) => {
                            updateCustomerDetails('phone', e.target.value);
                            if (errors.phone) {
                              setErrors((prev) => ({ ...prev, phone: '' }));
                            }
                          }}
                          placeholder="e.g. 98XXXXXXXX"
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F2] border text-xs font-semibold text-[#112229] outline-none transition-colors ${
                            errors.phone
                              ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                              : 'border-[#112229]/20 focus:border-[#147C98]'
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-red-600 font-semibold mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                          Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={2}
                          value={customerDetails.address || ''}
                          onChange={(e) => {
                            updateCustomerDetails('address', e.target.value);
                            if (errors.address) {
                              setErrors((prev) => ({ ...prev, address: '' }));
                            }
                          }}
                          placeholder="Street, Building, Flat / House No."
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F2] border text-xs font-semibold text-[#112229] outline-none transition-colors resize-none ${
                            errors.address
                              ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                              : 'border-[#112229]/20 focus:border-[#147C98]'
                          }`}
                        />
                        {errors.address && (
                          <p className="text-[11px] text-red-600 font-semibold mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Landmark (Optional) */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                          Landmark <span className="text-[#112229]/50 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={customerDetails.landmark || ''}
                          onChange={(e) => updateCustomerDetails('landmark', e.target.value)}
                          placeholder="e.g. Near ABC School / Metro Pillar"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold text-[#112229] outline-none focus:border-[#147C98] transition-colors"
                        />
                      </div>

                      {/* Delivery Instructions (Optional) */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                          Instructions{' '}
                          <span className="text-[#112229]/50 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={customerDetails.instructions || ''}
                          onChange={(e) => updateCustomerDetails('instructions', e.target.value)}
                          placeholder="e.g. Please ring doorbell twice"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold text-[#112229] outline-none focus:border-[#147C98] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dine-In Note */}
                  {orderType === 'dine-in' && (
                    <div className="p-4 rounded-2xl bg-white border border-[#112229]/15 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFA7EE]/40 flex items-center justify-center text-sm flex-shrink-0">
                        ☕
                      </div>
                      <div className="text-xs text-[#112229]/80 font-medium">
                        <span className="font-bold text-[#112229] block">
                          Bakery Dine-In Selected
                        </span>
                        Your order will be prepared fresh for dining at our Gachibowli bakery desk.
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer / Summary & Checkout Area */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#112229]/15 bg-white space-y-4">
                {/* Order Summary */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#112229]/70 font-semibold">
                    <span>Order Type:</span>
                    <span className="font-bold text-[#112229] uppercase">
                      {orderType === 'delivery' ? 'Delivery' : 'Dine-In'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#112229]/70 font-semibold">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-[#112229]">₹{subtotal}</span>
                  </div>

                  <div className="pt-2 border-t border-[#112229]/10 flex items-baseline justify-between">
                    <span className="font-title font-black text-base uppercase text-[#112229]">
                      Total
                    </span>
                    <span className="font-hero font-extrabold text-2xl text-[#112229]">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full py-3.5 px-6 rounded-pill bg-[#112229] hover:bg-[#147C98] active:scale-[0.98] text-[#F8F8F2] font-title font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <span>→</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isOpeningWhatsApp}
                    className="w-full py-3.5 px-6 rounded-pill bg-[#25D366] hover:bg-[#1ebd5a] active:scale-[0.98] text-white font-title font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isOpeningWhatsApp ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Opening WhatsApp…
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 2C6.496 2 2 6.502 2 12.046c0 1.77.464 3.498 1.346 5.029L2 22l5.081-1.332a9.99 9.99 0 004.95 1.306h.004c5.534 0 10.03-4.502 10.03-10.046 0-2.684-1.045-5.207-2.943-7.106A9.98 9.98 0 0012.031 2zm0 18.29h-.003a8.318 8.318 0 01-4.24-1.157l-.304-.18-3.153.827.842-3.076-.198-.315a8.316 8.316 0 01-1.278-4.342c0-4.595 3.738-8.336 8.337-8.336 2.227 0 4.321.868 5.895 2.443a8.307 8.307 0 012.44 5.894c0 4.596-3.738 8.342-8.341 8.342zm4.567-6.241c-.25-.125-1.478-.73-1.707-.813-.23-.083-.396-.125-.562.125-.167.25-.646.813-.792.98-.146.166-.292.187-.542.062-.25-.125-1.055-.389-2.01-1.24-.743-.663-1.245-1.482-1.391-1.732-.146-.25-.015-.385.11-.51.112-.113.25-.292.375-.438.125-.146.167-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.562-1.354-.77-1.854-.203-.487-.41-.421-.563-.429l-.48-.008c-.166 0-.437.062-.666.312-.23.25-.875.854-.875 2.083s.896 2.417 1.021 2.583c.125.167 1.762 2.69 4.268 3.773.596.257 1.062.41 1.425.526.598.19 1.143.163 1.573.099.48-.072 1.478-.604 1.687-1.188.209-.583.209-1.083.146-1.188-.062-.104-.229-.166-.479-.291z" />
                        </svg>
                        <span>Direct WhatsApp Order</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/cart');
                      }}
                      className="text-xs font-bold uppercase text-[#147C98] hover:underline"
                    >
                      View Full Bag Details
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs font-bold uppercase text-[#112229]/60 hover:text-[#112229]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
