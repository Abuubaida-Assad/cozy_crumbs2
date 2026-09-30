import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, getProductId, getProductPrice } from '../context/CartContext';
import Reveal from '../components/animations/Reveal';

export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    deliveryCharge,
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

  // Time slot options
  const timeSlots = [
    'Morning (09:00 AM – 12:00 PM)',
    'Afternoon (12:00 PM – 03:00 PM)',
    'Evening (03:00 PM – 07:00 PM)',
    'Night (07:00 PM – 10:00 PM)',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!customerDetails.name || !customerDetails.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!customerDetails.phone || !customerDetails.phone.trim()) {
      newErrors.phone = 'Mobile / WhatsApp number is required';
    } else {
      const clean = customerDetails.phone.replace(/[^0-9]/g, '');
      if (clean.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (orderType === 'delivery') {
      if (!customerDetails.address || !customerDetails.address.trim()) {
        newErrors.address = 'Delivery address is required for doorstep delivery';
      }
    }

    if (!customerDetails.date) {
      newErrors.date = 'Please select a preferred date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderOnWhatsApp = () => {
    if (cart.length === 0) {
      navigate('/menu');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsOpeningWhatsApp(true);

    try {
      const url = getWhatsAppOrderUrl();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = url;
      } else {
        const newWin = window.open(url, '_blank', 'noopener,noreferrer');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          window.location.href = url;
        }
      }
    } catch (err) {
      console.error('Failed to open WhatsApp', err);
    } finally {
      setTimeout(() => {
        setIsOpeningWhatsApp(false);
      }, 1500);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 px-[4vw] bg-[#F8F8F2] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-[#112229]/10 space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#FFDAED] flex items-center justify-center text-[#112229] mx-auto">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
          <h2 className="font-hero font-extrabold text-2xl uppercase text-[#112229]">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-[#112229]/70">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/menu"
            className="inline-block px-6 py-3 rounded-pill bg-[#112229] text-white font-title font-bold text-xs uppercase tracking-wider hover:bg-[#147C98] transition-colors"
          >
            Browse Bakery Menu →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-24 px-[4vw] bg-[#F8F8F2] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Header */}
        <Reveal y={20} className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#112229]/60 tracking-wider mb-2">
            <Link to="/" className="hover:text-[#112229]">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-[#112229]">Cart</Link>
            <span>/</span>
            <span className="text-[#147C98]">Checkout</span>
          </div>

          <h1 className="font-hero font-extrabold text-3xl sm:text-5xl uppercase text-[#112229] tracking-tight">
            Checkout & WhatsApp Order
          </h1>
          <p className="text-xs sm:text-sm text-[#112229]/70 font-medium mt-1">
            Fill in your details below. We'll generate a complete WhatsApp message for direct bakery confirmation.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer Form & Options */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Fulfillment Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#112229]/10 shadow-sm space-y-4">
              <span className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98] block">
                1. Order Fulfillment
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOrderType('delivery');
                    if (errors.address) {
                      setErrors((prev) => ({ ...prev, address: '' }));
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 text-left flex items-start justify-between transition-all ${
                    orderType === 'delivery'
                      ? 'bg-[#112229] border-[#112229] text-white shadow-md'
                      : 'bg-[#F8F8F2] border-[#112229]/15 text-[#112229] hover:border-[#112229]'
                  }`}
                >
                  <div>
                    <span className="font-title font-extrabold text-sm uppercase block">
                      Doorstep Delivery
                    </span>
                    <span className={`text-[11px] block mt-1 ${orderType === 'delivery' ? 'text-[#FFA7EE]' : 'text-[#112229]/60'}`}>
                      Delivered fresh across Hyderabad
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${orderType === 'delivery' ? 'border-[#FFA7EE] bg-[#FFA7EE]' : 'border-[#112229]/30'}`}>
                    {orderType === 'delivery' && <div className="w-2 h-2 rounded-full bg-[#112229]" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderType('pickup');
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.address;
                      return copy;
                    });
                  }}
                  className={`p-4 rounded-2xl border-2 text-left flex items-start justify-between transition-all ${
                    orderType === 'pickup'
                      ? 'bg-[#112229] border-[#112229] text-white shadow-md'
                      : 'bg-[#F8F8F2] border-[#112229]/15 text-[#112229] hover:border-[#112229]'
                  }`}
                >
                  <div>
                    <span className="font-title font-extrabold text-sm uppercase block">
                      Bakery Pickup
                    </span>
                    <span className={`text-[11px] block mt-1 ${orderType === 'pickup' ? 'text-[#FFA7EE]' : 'text-[#112229]/60'}`}>
                      Gachibowli TNGOS Colony Desk
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${orderType === 'pickup' ? 'border-[#FFA7EE] bg-[#FFA7EE]' : 'border-[#112229]/30'}`}>
                    {orderType === 'pickup' && <div className="w-2 h-2 rounded-full bg-[#112229]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Customer Information Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#112229]/10 shadow-sm space-y-5">
              <span className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98] block">
                2. Customer Information
              </span>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#112229] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerDetails.name || ''}
                  onChange={(e) => {
                    updateCustomerDetails('name', e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. Hyder Ali"
                  className={`w-full px-4 py-3 rounded-xl bg-[#F8F8F2] border text-xs font-semibold text-[#112229] outline-none transition-colors ${
                    errors.name ? 'border-red-500 bg-red-50/50' : 'border-[#112229]/20 focus:border-[#147C98]'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.name}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#112229] mb-1.5">
                  WhatsApp / Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerDetails.phone || ''}
                  onChange={(e) => {
                    updateCustomerDetails('phone', e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-3 rounded-xl bg-[#F8F8F2] border text-xs font-semibold text-[#112229] outline-none transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50/50' : 'border-[#112229]/20 focus:border-[#147C98]'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.phone}</p>}
              </div>

              {/* Delivery Address (only if delivery is selected) */}
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customerDetails.address || ''}
                    onChange={(e) => {
                      updateCustomerDetails('address', e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder="House/Flat No, Apartment/Street, Area, Hyderabad"
                    className={`w-full px-4 py-3 rounded-xl bg-[#F8F8F2] border text-xs font-semibold text-[#112229] outline-none transition-colors resize-none ${
                      errors.address ? 'border-red-500 bg-red-50/50' : 'border-[#112229]/20 focus:border-[#147C98]'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.address}</p>}
                </div>
              )}

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1.5">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={customerDetails.date || ''}
                    onChange={(e) => {
                      updateCustomerDetails('date', e.target.value);
                      if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold text-[#112229] outline-none focus:border-[#147C98] transition-colors"
                  />
                  {errors.date && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={customerDetails.timeSlot || timeSlots[2]}
                    onChange={(e) => updateCustomerDetails('timeSlot', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold text-[#112229] outline-none focus:border-[#147C98] transition-colors"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#112229] mb-1.5">
                  Special Instructions / Cake Inscription <span className="text-[#112229]/50 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={customerDetails.instructions || ''}
                  onChange={(e) => updateCustomerDetails('instructions', e.target.value)}
                  placeholder="e.g. Write 'Happy Birthday Rahul' on cake, less sweet, or delivery instructions"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold text-[#112229] outline-none focus:border-[#147C98] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place WhatsApp Order */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#112229]/10 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-[#112229]/10 pb-4">
                <h2 className="font-hero font-extrabold text-xl uppercase tracking-tight text-[#112229]">
                  Order Items ({cartCount})
                </h2>
                <Link to="/cart" className="text-xs font-bold uppercase text-[#147C98] hover:underline">
                  Edit Bag
                </Link>
              </div>

              {/* Items Breakdown */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-[#112229]/10">
                {cart.map((item) => {
                  const pid = getProductId(item.product);
                  const price = getProductPrice(item.product);
                  const itemSubtotal = Math.round(price * item.quantity);
                  const img = item.product?.image || '/images/products/cakes/chocolate-cake.webp';

                  return (
                    <div key={pid} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={img}
                          alt={item.product?.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#112229]/10 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/images/products/cakes/chocolate-cake.webp';
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#112229] uppercase truncate">
                            {item.product?.name}
                          </h4>
                          <span className="text-[#112229]/60 font-medium">
                            ₹{price} × {item.quantity}
                          </span>
                        </div>
                      </div>

                      <span className="font-title font-black text-sm text-[#112229] flex-shrink-0">
                        ₹{itemSubtotal}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Calculation Summary */}
              <div className="border-t border-[#112229]/10 pt-4 space-y-2 text-xs font-semibold">
                <div className="flex justify-between text-[#112229]/70">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#112229]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-[#112229]/70">
                  <span>Delivery Charge:</span>
                  <span className="font-bold text-emerald-700">
                    {orderType === 'pickup' ? 'Free (Pickup)' : deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                  </span>
                </div>

                <div className="flex justify-between text-[#112229]/70">
                  <span>Order Type:</span>
                  <span className="font-bold text-[#112229] uppercase">{orderType}</span>
                </div>

                <div className="pt-3 border-t border-[#112229]/10 flex items-baseline justify-between">
                  <span className="font-title font-black text-base uppercase text-[#112229]">
                    Total Payable
                  </span>
                  <span className="font-hero font-extrabold text-2xl text-[#112229]">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Primary Order on WhatsApp Action */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleOrderOnWhatsApp}
                  disabled={isOpeningWhatsApp}
                  className="w-full py-4 px-6 rounded-pill bg-[#25D366] hover:bg-[#1ebd5a] active:scale-[0.98] text-white font-title font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
                >
                  {isOpeningWhatsApp ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Opening WhatsApp…
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 2C6.496 2 2 6.502 2 12.046c0 1.77.464 3.498 1.346 5.029L2 22l5.081-1.332a9.99 9.99 0 004.95 1.306h.004c5.534 0 10.03-4.502 10.03-10.046 0-2.684-1.045-5.207-2.943-7.106A9.98 9.98 0 0012.031 2zm0 18.29h-.003a8.318 8.318 0 01-4.24-1.157l-.304-.18-3.153.827.842-3.076-.198-.315a8.316 8.316 0 01-1.278-4.342c0-4.595 3.738-8.336 8.337-8.336 2.227 0 4.321.868 5.895 2.443a8.307 8.307 0 012.44 5.894c0 4.596-3.738 8.342-8.341 8.342zm4.567-6.241c-.25-.125-1.478-.73-1.707-.813-.23-.083-.396-.125-.562.125-.167.25-.646.813-.792.98-.146.166-.292.187-.542.062-.25-.125-1.055-.389-2.01-1.24-.743-.663-1.245-1.482-1.391-1.732-.146-.25-.015-.385.11-.51.112-.113.25-.292.375-.438.125-.146.167-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.562-1.354-.77-1.854-.203-.487-.41-.421-.563-.429l-.48-.008c-.166 0-.437.062-.666.312-.23.25-.875.854-.875 2.083s.896 2.417 1.021 2.583c.125.167 1.762 2.69 4.268 3.773.596.257 1.062.41 1.425.526.598.19 1.143.163 1.573.099.48-.072 1.478-.604 1.687-1.188.209-.583.209-1.083.146-1.188-.062-.104-.229-.166-.479-.291z" />
                      </svg>
                      <span>Order on WhatsApp</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#112229]/60 font-medium">
                  Your complete order message will be pre-filled automatically on WhatsApp (+91 7093322796).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
