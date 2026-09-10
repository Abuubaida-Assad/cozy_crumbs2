import React, { useRef, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import DietaryBadge from './DietaryBadge';

export default function SearchDrawer() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, searchResults } = useSearch();
  const { openProductModal, addToCart } = useCart();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isSearchOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#112229]/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Top Search Drawer Panel */}
      <div className="relative z-[10001] w-full bg-[#FAF8F5] border-b border-[#112229]/10 shadow-2xl py-6 md:py-8 px-[4vw] transition-transform duration-700 ease-[cubic-bezier(.28,_.71,_0,_.98)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="font-title text-xs uppercase tracking-widest font-bold text-[#147C98]">
              DISCOVER ARTISANAL BAKES
            </span>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
              className="p-2 text-[#112229] hover:text-[#FFA7EE] transition-colors rounded-full"
            >
              <svg className="w-6 h-6" viewBox="0 0 16 14" stroke="currentColor" fill="none">
                <path d="M15 0L1 14m14 0L1 0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Search Input in Vibrant Pink Pill */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH CAKES, PASTRIES, SOURDOUGH, PUFFS..."
                className="w-full rounded-pill bg-[#FFA7EE] text-[#112229] placeholder-[#112229]/60 font-title font-semibold text-base md:text-lg uppercase px-6 py-4 outline-none border-2 border-transparent focus:border-[#112229] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase font-bold text-[#112229]/70 hover:text-[#112229] bg-white/40 px-2.5 py-1 rounded-pill"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="rounded-pill px-8 py-4 bg-[#112229] text-[#F8F8F2] font-title font-bold text-sm uppercase tracking-wider hover:bg-[#147C98] transition-colors"
            >
              Done
            </button>
          </div>

          {/* Live Search Results Container */}
          <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
            {searchQuery.trim() === '' ? (
              <div className="py-6 text-center">
                <p className="text-xs uppercase tracking-widest font-semibold text-[#112229]/60 mb-3">
                  POPULAR SEARCHES
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Chocolate Cake', 'Sourdough Bread', 'Veg Puff', 'Pastries', 'Vanilla', 'Brownies'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-1.5 rounded-pill text-xs font-semibold bg-white border border-[#112229]/10 hover:border-[#112229] hover:bg-[#FFDAED] transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-title text-xl text-[#112229] font-bold mb-2">No matching bakery treats found</p>
                <p className="text-sm text-[#112229]/60">
                  Try searching for ingredients like "Belgian Chocolate", "Strawberry", "Sourdough", or "Osmania".
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-[#147C98] uppercase tracking-wider mb-4">
                  {searchResults.length} {searchResults.length === 1 ? 'RESULT' : 'RESULTS'} FOUND
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl p-3.5 border border-[#112229]/10 hover:border-[#147C98] transition-all duration-300 flex items-center gap-4 cursor-pointer hover:shadow-md"
                      onClick={() => {
                        openProductModal(product);
                        setIsSearchOpen(false);
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#FFDAED]/30 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src = '/images/products/cakes/chocolate-cake.webp';
                        }}
                      />
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#147C98] truncate">
                            {product.categoryName}
                          </span>
                          <DietaryBadge isVeg={product.isVeg} isEggless={product.isEggless} />
                        </div>
                        <h4 className="font-title font-bold text-sm text-[#112229] truncate group-hover:text-[#147C98] transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-[#112229]">{product.formattedPrice}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, 1);
                              setIsSearchOpen(false);
                            }}
                            className="text-[10px] uppercase font-bold text-[#147C98] hover:text-[#112229] hover:underline"
                          >
                            + Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
