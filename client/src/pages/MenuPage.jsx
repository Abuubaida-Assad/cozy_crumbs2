import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBakery, defaultProductImages } from '../context/BakeryContext';
import { useCart, getProductId } from '../context/CartContext';
import DietaryBadge from '../components/DietaryBadge';
import AnimatedButton from '../components/animations/AnimatedButton';
import Reveal from '../components/animations/Reveal';

export default function MenuPage() {
  const { products, categories: liveCategories } = useBakery();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  // Sync selectedCategory when URL search parameter changes
  React.useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) {
      setSelectedCategory(urlCat);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const handleAddToCart = (product, qty = 1, e) => {
    if (e) e.stopPropagation();
    const pid = getProductId(product);
    addToCart(product, qty, true); // true opens drawer for immediate confirmation
    setRecentlyAddedId(pid);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === pid ? null : curr));
    }, 1800);
  };

  const categories = useMemo(() => {
    const list = (liveCategories || []).filter(c => c.isActive !== false).map((c) => c.name);
    const prodCats = (products || []).map((p) => p.categoryName || p.category?.name).filter(Boolean);
    const set = new Set(['All', ...list, ...prodCats]);
    return Array.from(set);
  }, [liveCategories, products]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => {
      if (p.isAvailable === false) return false;
      const catName = p.categoryName || p.category?.name || (typeof p.category === 'string' ? p.category : '');
      const catSlug = p.categorySlug || p.category?.slug || '';
      
      if (
        selectedCategory !== 'All' &&
        catName.trim().toLowerCase() !== selectedCategory.trim().toLowerCase() &&
        catSlug.trim().toLowerCase() !== selectedCategory.trim().toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          catName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="pt-28 md:pt-36 pb-24 px-[4vw] bg-[#F8F8F2] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Title with Viewport Reveal */}
        <Reveal y={40} className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-hero font-extrabold text-4xl sm:text-6xl uppercase text-[#112229] tracking-tight">
            Our Bakery Catalog
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#112229]/80 font-medium max-w-xl mx-auto">
            Fresh celebration cakes, morning sourdough loaves, and tea-time specials. To place an order, call our bakery desk directly at <a href="tel:+917093322796" className="font-bold underline text-[#147C98]">+91 7093322796</a>.
          </p>
        </Reveal>

        {/* Filter Navigation with Smooth Layout Tabs */}
        <Reveal y={30} delay={0.1} className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 mb-10 border-b border-[#112229]/15">
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat === 'All') {
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    } else {
                      setSearchParams({ category: cat });
                    }
                  }}
                  className={`relative font-title uppercase text-xs sm:text-sm font-bold tracking-wider px-4 sm:px-5 py-2 sm:py-2.5 rounded-pill border transition-colors ${
                    isActive
                      ? 'bg-[#112229] text-[#F8F8F2] border-[#112229]'
                      : 'bg-transparent text-[#112229] border-[#112229]/20 hover:border-[#112229]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH CREATION..."
              className="w-full px-4 py-2.5 rounded-pill bg-white border border-[#112229]/20 text-xs uppercase font-bold text-[#112229] outline-none focus:border-[#147C98] transition-colors"
            />
          </div>
        </Reveal>

        {/* Products Grid with Viewport-Triggered Stagger & AnimatePresence */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => {
              const fallbackImg = defaultProductImages[product.slug] || '/images/products/cakes/chocolate-cake.webp';

              return (
                <motion.div
                  key={product.id || product._id || product.slug || `prod-${index}`}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min((index % 4) * 0.08, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col justify-between p-6 bg-white border border-[#112229]/15 rounded-3xl hover:border-[#147C98] hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <div
                      className="aspect-square rounded-2xl overflow-hidden bg-[#FFDAED]/20 cursor-pointer relative mb-4 group"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.image || fallbackImg}
                        alt={product.name}
                        className="w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-105"
                        onError={(e) => {
                          if (e.target.src !== fallbackImg) {
                            e.target.src = fallbackImg;
                          }
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <DietaryBadge isVeg={product.isVeg} isEggless={product.isEggless} />
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-emerald-800 border border-emerald-300 font-title font-bold text-[10px] uppercase tracking-wider shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          In Stock
                        </span>
                      </div>
                    </div>

                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#147C98] mb-1">
                    <span>{product.categoryName}</span>
                    <span className="text-base font-black text-[#112229]">
                      ₹{product.price || 0}
                    </span>
                  </div>

                  <h3
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalQty(1);
                    }}
                    className="font-title text-xl font-bold uppercase text-[#112229] leading-tight cursor-pointer hover:text-[#147C98] transition-colors"
                  >
                    {product.name}
                  </h3>

                  <p className="mt-2 text-xs text-[#112229]/70 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Card Actions: +- (Add / Stepper) & INFO Button */}
                <div className="mt-6 pt-4 border-t border-[#112229]/10 flex items-center gap-2.5">
                  {(() => {
                    const pid = product._id || product.id;
                    const itemQty = getItemQuantity(pid);
                    const isRecentlyAdded = recentlyAddedId === pid;

                    if (itemQty > 0) {
                      return (
                        <div className="flex-1 flex items-center justify-between rounded-pill bg-[#112229] text-white px-3 py-1.5 shadow-sm">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(pid, itemQty - 1);
                            }}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 font-black text-sm transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-hero font-extrabold text-xs text-[#FFA7EE] px-1 select-none">
                            {itemQty} in cart
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(pid, itemQty + 1);
                            }}
                            aria-label="Increase quantity"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 font-black text-sm transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product, 1, e)}
                        className={`flex-1 py-2.5 px-4 rounded-pill font-title font-extrabold text-xs uppercase tracking-wider text-center transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                          isRecentlyAdded
                            ? 'bg-emerald-600 text-white scale-[1.02]'
                            : 'bg-[#112229] hover:bg-[#FFA7EE] text-white hover:text-[#112229]'
                        }`}
                      >
                        {isRecentlyAdded ? 'Added' : '+ Add to Cart'}
                      </button>
                    );
                  })()}

                  {/* Info Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalQty(1);
                    }}
                    className="py-2.5 px-4 rounded-pill border border-[#112229]/20 hover:border-[#112229] text-[#112229] font-title font-bold text-xs uppercase tracking-wider text-center transition-colors hover:bg-black/5 cursor-pointer"
                  >
                    Info
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

        {/* Detailed Product Modal with AnimatePresence */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-[#112229]/75 backdrop-blur-md"
                onClick={() => setSelectedProduct(null)}
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[30001] w-full max-w-4xl bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto border border-[#112229]/15"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                  {/* Left Column: Image with Dietary Badge */}
                  <div className="md:col-span-6 relative bg-[#F8F8F2] p-4 sm:p-6 flex items-center justify-center">
                    <div className="relative w-full h-full min-h-[300px] md:min-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-white">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover select-none"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <DietaryBadge isVeg={selectedProduct.isVeg} isEggless={selectedProduct.isEggless} />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="md:col-span-6 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
                    <div>
                      {/* Top Category & Close Button */}
                      <div className="flex items-center justify-between pb-2">
                        <span className="font-title text-xs font-bold uppercase tracking-[0.2em] text-[#112229]/60">
                          {selectedProduct.categoryName}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setSelectedProduct(null)}
                          aria-label="Close dialog"
                          className="w-10 h-10 rounded-full bg-[#F8F8F2] hover:bg-[#FFA7EE] text-[#112229] flex items-center justify-center transition-colors shadow-sm font-bold text-sm"
                        >
                          ✕
                        </motion.button>
                      </div>

                      {/* Product Title */}
                      <h2 className="font-hero font-extrabold text-3xl sm:text-4xl uppercase text-[#112229] leading-tight tracking-tight mt-1 mb-4">
                        {selectedProduct.name}
                      </h2>

                      {/* Meta Badges Row */}
                      <div className="flex flex-wrap items-baseline gap-3 mb-6">
                        <span className="font-hero font-extrabold text-3xl text-[#112229]">
                          ₹{selectedProduct.price || 0}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-[#F8F8F2] text-[#112229] font-bold text-xs">
                          {selectedProduct.weight || 'Freshly Baked'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs">
                          Available
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#112229]/80 font-medium leading-relaxed mb-6">
                        {selectedProduct.description}
                      </p>

                      {/* Specs / Nutritional Info Card */}
                      {selectedProduct.nutritionalInfo && (
                        <div className="bg-[#F8F8F2] rounded-2xl p-4 mb-6 border border-[#112229]/10">
                          <div className="grid grid-cols-3 text-center divide-x divide-[#112229]/15">
                            <div className="px-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#112229]/60 block mb-1">
                                CALORIES
                              </span>
                              <span className="font-hero font-extrabold text-xs sm:text-sm text-[#112229]">
                                {selectedProduct.nutritionalInfo.calories}
                              </span>
                            </div>
                            <div className="px-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#112229]/60 block mb-1">
                                SERVINGS
                              </span>
                              <span className="font-hero font-extrabold text-xs sm:text-sm text-[#112229]">
                                {selectedProduct.nutritionalInfo.servings}
                              </span>
                            </div>
                            <div className="px-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#112229]/60 block mb-1">
                                SHELF LIFE
                              </span>
                              <span className="font-hero font-extrabold text-xs sm:text-sm text-[#112229]">
                                {selectedProduct.nutritionalInfo.shelfLife}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Ingredients */}
                      {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                        <div className="mb-6 space-y-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#112229] block">
                            KEY INGREDIENTS:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.ingredients.map((ing, idx) => (
                              <span
                                key={idx}
                                className="px-3.5 py-1.5 rounded-full bg-white border border-[#112229]/15 text-xs font-semibold text-[#112229]"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Area: Add to Cart + WhatsApp */}
                    <div className="pt-4 border-t border-[#112229]/10 space-y-3">
                      {/* Quantity Selector + Add to Cart */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-pill bg-[#F8F8F2] border border-[#112229]/20 overflow-hidden shadow-sm p-1">
                          <button
                            type="button"
                            onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                            aria-label="Decrease quantity"
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[#112229] hover:bg-white font-bold text-base transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-hero font-extrabold text-sm text-[#112229]">
                            {modalQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setModalQty((q) => q + 1)}
                            aria-label="Increase quantity"
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[#112229] hover:bg-white font-bold text-base transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleAddToCart(selectedProduct, modalQty);
                            setSelectedProduct(null);
                          }}
                          className="flex-1 py-3.5 px-6 rounded-pill bg-[#112229] hover:bg-[#FFA7EE] text-white hover:text-[#112229] font-title font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>+ ADD TO CART</span>
                          <span>•</span>
                          <span>₹{(Number(selectedProduct.price) || 0) * modalQty}</span>
                        </button>
                      </div>

                      <AnimatedButton
                        as="a"
                        href={`https://wa.me/917093322796?text=${encodeURIComponent(
                          `Hi Cozy Crumbs! I would like to inquire about/order the "${selectedProduct.name}".`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 rounded-pill bg-[#F8F8F2] hover:bg-[#112229] hover:text-white text-[#112229] font-title font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-[#112229]/20"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        </svg>
                        <span>INQUIRE / CUSTOM REQUEST</span>
                      </AnimatedButton>
                      <p className="text-[11px] text-center text-[#112229]/60 font-medium">
                        Freshly handcrafted by Cozy Crumbs master bakers.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
