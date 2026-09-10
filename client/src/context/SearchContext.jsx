import React, { createContext, useContext, useState, useMemo } from 'react';
import { allProducts } from '../data/productsData';
import { useBakery } from './BakeryContext';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  let liveProducts = allProducts;
  try {
    const bakery = useBakery();
    if (bakery && bakery.products && bakery.products.length > 0) {
      liveProducts = bakery.products;
    }
  } catch {
    // fallback if outside provider
  }

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return (liveProducts || []).filter(p =>
      p.isAvailable !== false && (
        p.name?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (Array.isArray(p.ingredients) && p.ingredients.some(ing => ing.toLowerCase().includes(q)))
      )
    );
  }, [searchQuery, liveProducts]);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        searchResults
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
