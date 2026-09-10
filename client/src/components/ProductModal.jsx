import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import DietaryBadge from './DietaryBadge';

export default function ProductModal() {
  const { selectedProductModal, closeProductModal, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setQuantity(1);
  }, [selectedProductModal]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProductModal) {
        closeProductModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProductModal, closeProductModal]);

  if (!selectedProductModal) return null;

  const product = selectedProductModal;

  const handleCustomOrder = () => {
    closeProductModal();
    navigate(`/contact?item=${encodeURIComponent(product.name)}`);
  };

  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#112229]/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeProductModal}
      />

      {/* Modal Dialog */}
      <div className="relative z-[30001] w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FAF8F5] rounded-3xl md:rounded-[36px] shadow-2xl border border-[#112229]/10 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeProductModal}
          aria-label="Close product modal"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white border border-[#112229]/15 flex items-center justify-center text-[#112229] hover:bg-[#112229] hover:text-[#FFA7EE] transition-all z-10"
        >
          <svg className="w-5 h-5" viewBox="0 0 16 14" stroke="currentColor" fill="none">
            <path d="M15 0L1 14m14 0L1 0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Left: Big Product Image Showcase */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#FFDAED]/30 border border-[#112229]/10 shadow-inner relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(.28,_.71,_0,_.98)]"
              onError={(e) => {
                e.target.src = '/images/products/cakes/chocolate-cake.webp';
              }}
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-pill bg-[#112229] text-white font-title text-[10px] font-bold uppercase tracking-wider">
                Chef's Signature
              </span>
            )}
          </div>

          <div className="w-full mt-4 p-3.5 rounded-2xl bg-white border border-[#112229]/10 flex items-center justify-around text-center">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#112229]/60">Freshness</span>
              <span className="font-bold text-xs text-[#112229]">Baked at Dawn</span>
            </div>
            <div className="w-px h-6 bg-[#112229]/10" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#112229]/60">Portion</span>
              <span className="font-bold text-xs text-[#112229]">{product.weight || 'Standard'}</span>
            </div>
            <div className="w-px h-6 bg-[#112229]/10" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#112229]/60">Quality</span>
              <span className="font-bold text-xs text-[#147C98]">100% In-House</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98]">
                {product.categoryName}
              </span>
              <DietaryBadge isVeg={product.isVeg} isEggless={product.isEggless} />
            </div>

            <h2 className="font-title text-2xl sm:text-3xl font-black text-[#112229] uppercase leading-tight tracking-tight">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="font-title text-2xl font-black text-[#112229]">
                {product.formattedPrice}
              </span>
              <span className="text-xs text-[#112229]/60 font-semibold">
                Taxes included • Handcrafted in Hyderabad
              </span>
            </div>

            <p className="mt-4 text-sm text-[#112229]/80 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Ingredients Chips */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-5">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#147C98] mb-2">
                  Pure Ingredients
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-pill bg-white border border-[#112229]/10 text-xs font-semibold text-[#112229]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional & Storage Block */}
            {product.nutritionalInfo && (
              <div className="mt-5 p-4 rounded-2xl bg-[#FFDAED]/40 border border-[#FFA7EE]/50 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#112229]/70 font-medium">Nutritional Energy:</span>
                  <span className="font-bold text-[#112229]">{product.nutritionalInfo.calories || '320 kcal'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#112229]/70 font-medium">Recommended Servings:</span>
                  <span className="font-bold text-[#112229]">{product.nutritionalInfo.servings || '4-6 persons'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#112229]/70 font-medium">Shelf Life:</span>
                  <span className="font-bold text-[#147C98]">{product.nutritionalInfo.shelfLife || '3 Days'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-[#112229]/10">
            <a
              href={`https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20order%20the%20${encodeURIComponent(product.name)}.`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-pill bg-[#FFA7EE] hover:bg-[#112229] hover:text-[#F8F8F2] text-[#112229] font-title font-extrabold text-sm uppercase tracking-wider transition-colors duration-300 shadow-md flex items-center justify-center gap-2"
            >
              ORDER VIA WHATSAPP (+91 7093322796)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
