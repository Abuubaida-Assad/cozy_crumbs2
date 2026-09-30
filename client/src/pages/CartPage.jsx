import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, getProductId, getProductPrice } from '../context/CartContext';
import Reveal from '../components/animations/Reveal';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, deliveryCharge, total, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="pt-28 md:pt-36 pb-24 px-[4vw] bg-[#F8F8F2] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <Reveal y={20} className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#112229]/60 tracking-wider mb-2">
            <Link to="/" className="hover:text-[#112229]">Home</Link>
            <span>/</span>
            <Link to="/menu" className="hover:text-[#112229]">Menu</Link>
            <span>/</span>
            <span className="text-[#147C98]">Shopping Bag</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#112229]/15 pb-6">
            <div>
              <h1 className="font-hero font-extrabold text-3xl sm:text-5xl uppercase text-[#112229] tracking-tight">
                Shopping Bag
              </h1>
              <p className="text-xs sm:text-sm text-[#112229]/70 font-medium mt-1">
                Review your selections before proceeding to WhatsApp checkout.
              </p>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 underline self-start sm:self-auto"
              >
                Clear Cart
              </button>
            )}
          </div>
        </Reveal>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-5 bg-white rounded-3xl p-8 border border-[#112229]/10 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-[#FFDAED] flex items-center justify-center text-4xl shadow-inner">
              🥐
            </div>
            <div className="space-y-2">
              <h2 className="font-hero font-extrabold text-2xl sm:text-3xl uppercase text-[#112229]">
                Your cart is empty.
              </h2>
              <p className="text-sm text-[#112229]/70 max-w-md mx-auto">
                Looks like you haven't added anything yet. Explore our handcrafted celebration cakes, morning sourdough, and bakery bites!
              </p>
            </div>
            <Link
              to="/menu"
              className="mt-4 px-8 py-3.5 rounded-pill bg-[#112229] text-[#F8F8F2] hover:bg-[#147C98] font-title font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md inline-flex items-center gap-2"
            >
              <span>Explore the menu</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          /* Cart Items and Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List (Left Column) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#112229]/10 shadow-sm divide-y divide-[#112229]/10">
                {cart.map((item) => {
                  const pid = getProductId(item.product);
                  const unitPrice = getProductPrice(item.product);
                  const itemSubtotal = Math.round(unitPrice * item.quantity);
                  const img = item.product?.image || '/images/products/cakes/chocolate-cake.webp';

                  return (
                    <div key={pid} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F8F8F2] border border-[#112229]/10 flex-shrink-0">
                          <img
                            src={img}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/products/cakes/chocolate-cake.webp';
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#147C98] block">
                            {item.product?.categoryName || 'Fresh Bake'}
                          </span>
                          <h3 className="font-title font-extrabold text-base sm:text-lg uppercase text-[#112229] truncate">
                            {item.product?.name}
                          </h3>
                          <div className="text-xs text-[#112229]/70 font-semibold mt-0.5">
                            ₹{unitPrice} each
                          </div>
                        </div>
                      </div>

                      {/* Quantity Selector & Item Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center rounded-pill bg-[#F8F8F2] border border-[#112229]/20 overflow-hidden shadow-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(pid, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#112229] hover:bg-[#FFA7EE] font-bold text-base transition-colors cursor-pointer"
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
                            className="w-8 h-8 flex items-center justify-center text-[#112229] hover:bg-[#FFA7EE] font-bold text-base transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="font-title font-extrabold text-base text-[#112229] block">
                            ₹{itemSubtotal}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(pid)}
                          aria-label={`Remove ${item.product?.name}`}
                          className="text-[#112229]/40 hover:text-red-600 transition-colors p-1"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 text-xs font-title font-bold uppercase tracking-wider text-[#112229] hover:text-[#147C98] transition-colors"
                >
                  <span>←</span>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Card (Right Column) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#112229]/10 shadow-sm space-y-6 sticky top-28">
                <h2 className="font-hero font-extrabold text-xl uppercase tracking-tight text-[#112229] border-b border-[#112229]/10 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between text-[#112229]/70">
                    <span>Total Items:</span>
                    <span className="font-bold text-[#112229]">{cartCount} items</span>
                  </div>

                  <div className="flex justify-between text-[#112229]/70">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-[#112229]">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-[#112229]/70">
                    <span>Delivery Charge:</span>
                    <span className="font-bold text-emerald-700">
                      {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  {subtotal < 500 && (
                    <p className="text-[11px] text-[#147C98] font-medium bg-[#147C98]/10 p-2.5 rounded-xl">
                      Add ₹{500 - subtotal} more to qualify for Free Delivery across Hyderabad!
                    </p>
                  )}

                  <div className="pt-4 border-t border-[#112229]/10 flex items-baseline justify-between">
                    <span className="font-title font-black text-base uppercase text-[#112229]">
                      Total Amount
                    </span>
                    <span className="font-hero font-extrabold text-2xl text-[#112229]">
                      ₹{total}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="w-full py-4 px-6 rounded-pill bg-[#112229] hover:bg-[#147C98] active:scale-[0.98] text-[#F8F8F2] font-title font-extrabold text-xs uppercase tracking-wider text-center block transition-all shadow-md cursor-pointer"
                  >
                    Proceed to Checkout →
                  </button>

                  <p className="text-[11px] text-center text-[#112229]/60 font-medium">
                    Order confirmed via WhatsApp with Cozy Crumbs desk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
