import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { allStores } from '../data/productsData';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
    fulfillmentType,
    setFulfillmentType,
    postalCode,
    setPostalCode,
    postalVerified,
    setPostalVerified,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    orderNotes,
    setOrderNotes,
    selectedStore,
    setSelectedStore,
  } = useCart();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = current month, 1 = next month
  const [postalError, setPostalError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Generate calendar days for current and next month
  const calendarData = useMemo(() => {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + currentMonthIndex, 1);
    const monthName = targetMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDayIndex = targetMonth.getDay();
    const daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), d);
      const dateStr = dateObj.toISOString().split('T')[0];
      const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      days.push({ day: d, dateStr, isPast });
    }

    return { monthName, days };
  }, [currentMonthIndex]);

  const handlePostalSubmit = (e) => {
    e.preventDefault();
    if (!postalCode || postalCode.trim().length < 5) {
      setPostalError('Please enter a valid 6-digit postal code (e.g. 500032)');
      setPostalVerified(false);
      return;
    }
    setPostalError('');
    setPostalVerified(true);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFA7EE', '#147C98', '#112229', '#FFDAED']
    });

    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
    }, 800);
  };

  const handleWhatsAppOrder = () => {
    const itemsList = cart.map(i => `• ${i.product.name} (x${i.quantity}) - ₹${i.product.price * i.quantity}`).join('%0A');
    const msg = `*New Order Inquiry — Cozy Crumbs*%0A%0A*Fulfillment:* ${fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}%0A*Date:* ${selectedDate}%0A*Time:* ${selectedTime}%0A${fulfillmentType === 'delivery' ? `*Postal Code:* ${postalCode}%0A` : `*Store:* ${selectedStore}%0A`}*Items:*%0A${itemsList}%0A%0A*Subtotal:* ₹${subtotal}%0A*Notes:* ${encodeURIComponent(orderNotes || 'None')}`;
    window.open(`https://wa.me/917093322796?text=${msg}`, '_blank');
  };

  const freeDeliveryThreshold = 800;
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#112229]/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <aside className="relative z-[20001] w-full max-w-[560px] h-full bg-white flex flex-col justify-between shadow-2xl transition-transform duration-700 ease-[cubic-bezier(.28,_.71,_0,_.98)]">
        {/* Drawer Header */}
        <div className="p-6 md:p-8 border-b-2 border-[#147C98] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h2 className="font-title text-2xl font-black uppercase text-[#112229] tracking-tight">
              YOUR BAG
            </h2>
            <p className="text-xs uppercase font-semibold tracking-wider text-[#147C98] mt-0.5">
              {cartCount} {cartCount === 1 ? 'Handcrafted Item' : 'Handcrafted Items'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Bag"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#112229] hover:bg-[#112229] hover:text-[#FFA7EE] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 16 14" stroke="currentColor" fill="none">
              <path d="M15 0L1 14m14 0L1 0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Free Delivery Bar */}
        {cart.length > 0 && (
          <div className="bg-[#FFDAED] px-6 py-2.5 border-b border-[#FFA7EE]/50 text-xs font-semibold text-[#112229] flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>
                {subtotal >= freeDeliveryThreshold
                  ? '🎉 You unlocked FREE bakery delivery across Hyderabad!'
                  : `Add ₹${freeDeliveryThreshold - subtotal} more for FREE delivery`}
              </span>
              <span className="font-bold">{deliveryProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#147C98] rounded-full transition-all duration-500"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">
          {checkoutSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#FFDAED] text-[#147C98] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="font-title text-2xl font-bold text-[#112229]">Order Inquiry Received!</h3>
              <p className="text-sm text-[#112229]/70 max-w-sm mx-auto">
                Thank you! Our master bakery team will confirm oven availability for your selected date: <span className="font-bold">{selectedDate} ({selectedTime})</span>.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-4 rounded-pill bg-[#25D366] text-white font-title font-bold text-sm uppercase tracking-wider hover:opacity-95 transition-opacity"
                >
                  Confirm on WhatsApp →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutSuccess(false);
                    setIsCartOpen(false);
                  }}
                  className="text-xs uppercase font-bold text-[#147C98] hover:underline"
                >
                  Continue Browsing Menu
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFDAED] flex items-center justify-center mx-auto text-[#147C98]">
                <svg className="w-8 h-8" viewBox="0 0 17 20" fill="currentColor">
                  <path d="M0 20V4.995l1 .006v.015l4-.002V4c0-2.484 1.274-4 3.5-4C10.518 0 12 1.48 12 4v1.012l5-.003v.985H1V19h15V6.005h1V20H0zM11 4.49C11 2.267 10.507 1 8.5 1 6.5 1 6 2.27 6 4.49V5l5-.002V4.49z" />
                </svg>
              </div>
              <h3 className="font-title text-xl font-bold text-[#112229]">Your bag is currently empty</h3>
              <p className="text-sm text-[#112229]/60 max-w-xs mx-auto">
                Fresh celebration cakes, morning sourdough loaves, and flaky tea-time puffs are waiting to be baked.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="inline-block mt-2 px-8 py-3.5 rounded-pill bg-[#112229] text-[#F8F8F2] font-title font-bold text-xs uppercase tracking-wider hover:bg-[#147C98] transition-colors"
              >
                Start Exploring Menu
              </button>
            </div>
          ) : (
            <>
              {/* Line Items List */}
              <div className="space-y-4 divide-y divide-[#112229]/10">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-[#FFDAED]/40 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = '/images/products/cakes/chocolate-cake.webp';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-title font-bold text-base text-[#112229] uppercase leading-tight truncate">
                          {product.name}
                        </h4>
                        <span className="font-title font-bold text-sm text-[#112229] flex-shrink-0">
                          ₹{product.price * quantity}
                        </span>
                      </div>
                      <p className="text-xs text-[#147C98] font-semibold mt-0.5">
                        {product.weight || product.categoryName}
                      </p>

                      {/* Quantity Modifier */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#112229]/20 rounded-pill bg-[#FAF8F5] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#112229] hover:bg-[#FFA7EE] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-title text-[#112229]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#112229] hover:bg-[#FFA7EE] transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-xs font-semibold text-[#C52828] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bernice Fulfillment & Calendar Scheduling Section */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#112229]/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-title text-xs font-bold uppercase tracking-wider text-[#147C98]">
                    1. FULFILLMENT METHOD
                  </span>
                  <div className="flex bg-white rounded-pill p-1 border border-[#112229]/15">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('delivery')}
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-pill transition-all ${
                        fulfillmentType === 'delivery'
                          ? 'bg-[#112229] text-white shadow-sm'
                          : 'text-[#112229] hover:text-[#147C98]'
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-pill transition-all ${
                        fulfillmentType === 'pickup'
                          ? 'bg-[#112229] text-white shadow-sm'
                          : 'text-[#112229] hover:text-[#147C98]'
                      }`}
                    >
                      Pickup
                    </button>
                  </div>
                </div>

                {fulfillmentType === 'delivery' ? (
                  <form onSubmit={handlePostalSubmit} className="space-y-2">
                    <label className="block text-xs font-semibold text-[#112229]">
                      Enter Hyderabad Postal Code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          setPostalVerified(false);
                        }}
                        placeholder="e.g. 500032"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-[#112229]/20 text-xs font-mono uppercase focus:border-[#147C98] outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-[#FFA7EE] text-[#112229] font-title font-bold text-xs uppercase hover:bg-[#112229] hover:text-white transition-all"
                      >
                        Check
                      </button>
                    </div>
                    {postalError && <p className="text-[11px] font-semibold text-[#C52828]">{postalError}</p>}
                    {postalVerified && (
                      <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        ✓ Delivery available to this location from Gachibowli central kitchen.
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#112229]">Select Bakery Outlet:</label>
                    <select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#112229]/20 text-xs font-medium focus:border-[#147C98] outline-none bg-white"
                    >
                      {allStores.map((s) => (
                        <option key={s.name} value={s.address}>
                          {s.name} ({s.locationName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Interactive 2-Month Calendar Date Picker (Exact Bernice Feature) */}
                <div className="pt-2 border-t border-[#112229]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-title text-xs font-bold uppercase tracking-wider text-[#147C98]">
                      2. SELECT BAKING DATE
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentMonthIndex === 0}
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold border border-[#112229]/15 disabled:opacity-30"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentMonthIndex((prev) => Math.min(1, prev + 1))}
                        disabled={currentMonthIndex === 1}
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold border border-[#112229]/15 disabled:opacity-30"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <p className="text-center text-xs font-bold text-[#147C98] mb-2">{calendarData.monthName}</p>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#112229]/60 mb-1">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {calendarData.days.map((item, idx) => {
                      if (!item) return <div key={`empty-${idx}`} className="h-7" />;
                      const isSelected = selectedDate === item.dateStr;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          disabled={item.isPast}
                          onClick={() => setSelectedDate(item.dateStr)}
                          className={`h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#112229] text-white font-bold'
                              : item.isPast
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:bg-[#FFDAED] text-[#112229]'
                          }`}
                        >
                          {item.day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Slot Selector */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#112229]">Slot:</span>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-[#112229]/20 text-xs font-semibold bg-white focus:border-[#147C98] outline-none"
                    >
                      <option value="10:00 - 12:00">10:00 AM – 12:00 PM (Morning)</option>
                      <option value="12:00 - 14:00">12:00 PM – 02:00 PM (Midday)</option>
                      <option value="14:00 - 17:00">02:00 PM – 05:00 PM (Afternoon)</option>
                      <option value="17:00 - 20:00">05:00 PM – 08:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="pt-2 border-t border-[#112229]/10">
                  <label className="block text-xs font-semibold text-[#112229] mb-1">
                    Special Inscription or Delivery Instructions:
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. 'Happy Birthday Rohan!' written in chocolate on cake..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-[#112229]/20 text-xs focus:border-[#147C98] outline-none bg-white resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Bottom Bar: Subtotal & Checkout */}
        {cart.length > 0 && !checkoutSuccess && (
          <div className="p-6 md:p-8 border-t border-[#112229]/10 bg-[#FAF8F5] space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-[#112229]/70">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-[#112229]/70">
                <span>Estimated Taxes & Packaging</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-base font-black font-title text-[#112229] pt-2 border-t border-[#112229]/10">
                <span>ESTIMATED TOTAL</span>
                <span>₹{subtotal}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-pill bg-[#FFA7EE] hover:bg-[#112229] hover:text-[#F8F8F2] text-[#112229] font-title font-black text-base uppercase tracking-wider transition-all duration-500 ease-[cubic-bezier(.28,_.71,_0,_.98)] shadow-lg flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <span>SCHEDULING BAKE...</span>
                ) : (
                  <>
                    <span>PROCEED TO ORDER</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>₹{subtotal}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-3 rounded-pill bg-white border-2 border-[#112229] hover:bg-[#112229] hover:text-white text-[#112229] font-title font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <span>Quick WhatsApp Inquiry</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
