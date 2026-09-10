import React, { useState, useMemo } from 'react';
import { useBakery } from '../context/BakeryContext';
import { useCart } from '../context/CartContext';
import DietaryBadge from './DietaryBadge';

export default function CollectionBrowser({ initialCategory = 'All', showHeader = true, limit = null }) {
  const { products, categories: liveCategories } = useBakery();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { openProductModal, addToCart } = useCart();

  const categories = useMemo(() => {
    const list = (liveCategories || []).filter(c => c.isActive !== false).map(c => c.name);
    return ['All', ...list];
  }, [liveCategories]);

  const filteredProducts = useMemo(() => {
    let list = (products || []).filter(p => p.isAvailable !== false);
    if (activeCategory !== 'All') {
      list = list.filter(p => p.categoryName?.toLowerCase() === activeCategory.toLowerCase());
    }
    if (limit) {
      return list.slice(0, limit);
    }
    return list;
  }, [products, activeCategory, limit]);

  return (
    <section className="py-20 md:py-28 px-[4vw] bg-white">
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#147C98]">
                EXPLORE OUR BAKES
              </span>
              <h2 className="font-title text-3xl sm:text-5xl font-black uppercase text-[#112229] mt-2 tracking-tight">
                Handcrafted Daily with Love
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#112229]/70 leading-relaxed">
              From decadent celebration cakes to morning sourdough loaves and savory Indian tea-time pastries.
            </p>
          </div>
        )}

        {/* Bernice Rotating Blob Tab Buttons */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`Collection_Browser_Tab_Button ${isSelected ? 'active' : ''}`}
              >
                <div className="Back" />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-[#FAF8F5] rounded-3xl p-4 border border-[#112229]/10 hover:border-[#147C98] hover:shadow-xl transition-all duration-500"
            >
              {/* Image Container with Dual Reveal and Arch Top */}
              <div
                className="relative w-full aspect-square product-card-arch overflow-hidden bg-[#FFDAED]/30 cursor-pointer image-swap-container"
                onClick={() => openProductModal(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="image-primary w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/products/cakes/chocolate-cake.webp';
                  }}
                />
                <img
                  src={product.hoverImage || product.image}
                  alt={`${product.name} alternate view`}
                  className="image-secondary absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = product.image;
                  }}
                />

                {/* Dietary Badge on Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <DietaryBadge isVeg={product.isVeg} isEggless={product.isEggless} />
                </div>

                {/* Quick View Button Hover Overlay */}
                <div className="absolute inset-x-4 bottom-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductModal(product);
                    }}
                    className="flex-1 py-2.5 rounded-pill bg-white/95 backdrop-blur-sm text-[#112229] font-title text-xs font-bold uppercase tracking-wider hover:bg-[#112229] hover:text-white transition-colors shadow-sm"
                  >
                    Quick View
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                    aria-label={`Add ${product.name} to bag`}
                    className="w-10 h-10 rounded-full bg-[#112229] text-[#FFA7EE] flex items-center justify-center hover:bg-[#147C98] hover:text-white transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product Info Block */}
              <div className="pt-4 pb-2 px-1 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#147C98] mb-1">
                    <span>{product.categoryName}</span>
                    <span className="text-[#112229]/50 font-medium">{product.weight || 'Fresh'}</span>
                  </div>

                  <h3
                    onClick={() => openProductModal(product)}
                    className="font-title text-base sm:text-lg font-bold uppercase text-[#112229] group-hover:text-[#147C98] transition-colors leading-snug cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-[#112229]/70 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Bottom Price and Add Action */}
                <div className="mt-4 pt-3 border-t border-[#112229]/10 flex items-center justify-between">
                  <span className="font-title text-lg font-black text-[#112229]">
                    {product.formattedPrice}
                  </span>

                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="px-4 py-1.5 rounded-pill bg-transparent border-2 border-[#112229] group-hover:bg-[#112229] group-hover:text-white text-[#112229] font-title text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
