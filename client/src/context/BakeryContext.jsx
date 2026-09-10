import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { seedCategories, seedProductsData, allProducts as fallbackProducts, allCategories as fallbackCategories } from '../data/productsData';

const BakeryContext = createContext();

const STORAGE_KEYS = {
  PRODUCTS: 'cozy_crumbs_live_products',
  CATEGORIES: 'cozy_crumbs_live_categories',
  INQUIRIES: 'cozy_crumbs_live_inquiries',
};

// Normalize raw product from either seed or API
export const normalizeProduct = (p) => {
  const id = p._id || p.id || p.slug || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const categoryName = p.category?.name || p.categoryName || (typeof p.category === 'string' && !p.category.match(/^[0-9a-fA-F]{24}$/) ? p.category : 'Cakes');
  const categorySlug = p.category?.slug || p.categorySlug || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  return {
    _id: id,
    id: id,
    name: p.name || 'Artisanal Bake',
    slug: p.slug || (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: p.category || categoryName,
    categoryName,
    categorySlug,
    description: p.description || '',
    price: Number(p.price) || 0,
    weight: p.weight || '500g',
    image: p.image || '/images/products/cakes/chocolate-cake.webp',
    isVeg: p.isVeg !== undefined ? Boolean(p.isVeg) : true,
    isEggless: p.isEggless !== undefined ? Boolean(p.isEggless) : true,
    isFeatured: p.isFeatured !== undefined ? Boolean(p.isFeatured) : false,
    isAvailable: p.isAvailable !== undefined ? Boolean(p.isAvailable) : true,
    isSeasonal: p.isSeasonal !== undefined ? Boolean(p.isSeasonal) : false,
    displayOrder: p.displayOrder !== undefined ? Number(p.displayOrder) : 0,
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : (typeof p.ingredients === 'string' ? p.ingredients.split(',').map(s => s.trim()).filter(Boolean) : []),
    nutritionalInfo: p.nutritionalInfo || { calories: '300 kcal', servings: '4-6', shelfLife: '3 Days' },
    createdAt: p.createdAt || new Date().toISOString(),
  };
};

export const normalizeCategory = (c, products = []) => {
  const id = c._id || c.id || c.slug || `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const name = c.name || 'Bakery Section';
  const slug = c.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Calculate product count for this category
  const count = products.filter(p => {
    const pCatId = p.category?._id || p.category;
    const pCatName = p.category?.name || p.categoryName;
    return pCatId === id || pCatName?.toLowerCase() === name.toLowerCase() || p.categorySlug === slug;
  }).length;

  return {
    _id: id,
    id: id,
    name,
    slug,
    description: c.description || `Freshly baked ${name.toLowerCase()} prepared daily at Cozy Crumbs.`,
    icon: c.icon || 'Cake',
    image: c.image || '/images/products/cakes/chocolate-cake.webp',
    displayOrder: c.displayOrder !== undefined ? Number(c.displayOrder) : 1,
    isActive: c.isActive !== undefined ? Boolean(c.isActive) : true,
    productCount: c.productCount !== undefined ? c.productCount : count,
  };
};

export const BakeryProvider = ({ children }) => {
  // Initialize state with localStorage or seed data for instantaneous render
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeProduct);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved products:', e);
    }
    return (fallbackProducts || seedProductsData).map(normalizeProduct);
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved categories:', e);
    }
    return (fallbackCategories || seedCategories).map((c) => normalizeCategory(c, fallbackProducts || seedProductsData));
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved inquiries:', e);
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Recalculate product counts for categories whenever products or categories change
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => {
      const pCatId = p.category?._id || p.category;
      const pCatName = p.category?.name || p.categoryName;
      return pCatId === cat._id || pCatName?.toLowerCase() === cat.name?.toLowerCase() || p.categorySlug === cat.slug;
    }).length,
  }));

  // Helper to persist and notify across tabs and components
  const persistProducts = (newProducts) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
      window.dispatchEvent(new CustomEvent('cozy_crumbs_data_sync', { detail: { type: 'products' } }));
    } catch (e) {
      console.error(e);
    }
  };

  const persistCategories = (newCategories) => {
    setCategories(newCategories);
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
      window.dispatchEvent(new CustomEvent('cozy_crumbs_data_sync', { detail: { type: 'categories' } }));
    } catch (e) {
      console.error(e);
    }
  };

  const persistInquiries = (newInquiries) => {
    setInquiries(newInquiries);
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(newInquiries));
      window.dispatchEvent(new CustomEvent('cozy_crumbs_data_sync', { detail: { type: 'inquiries' } }));
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch live from REST API if available
  const refreshFromAPI = useCallback(async () => {
    const token = localStorage.getItem('cozy_crumbs_admin_token');
    try {
      // 1. Fetch Categories
      const catRes = await fetch('/api/categories?all=true').catch(() => null);
      if (catRes && catRes.ok) {
        const catData = await catRes.json();
        if (catData.success && Array.isArray(catData.data) && catData.data.length > 0) {
          const normCats = catData.data.map(c => normalizeCategory(c, products));
          const apiCatIds = new Set(normCats.map(c => String(c._id)));
          setCategories((prev) => {
            const localOnly = (prev || []).filter(c => !apiCatIds.has(String(c._id)) && !apiCatIds.has(String(c.id)) && String(c._id).startsWith('cat_'));
            const merged = [...normCats, ...localOnly];
            try {
              localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      }

      // 2. Fetch Products
      const prodRes = await fetch('/api/products?all=true&limit=200').catch(() => null);
      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          const normProds = prodData.data.map(normalizeProduct);
          const apiIds = new Set(normProds.map(p => String(p._id)));
          setProducts((prev) => {
            const localOnly = (prev || []).filter(p => !apiIds.has(String(p._id)) && !apiIds.has(String(p.id)) && String(p._id).startsWith('prod_'));
            const merged = [...normProds, ...localOnly];
            try {
              localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      }

      // 3. Fetch Inquiries (if token present)
      if (token) {
        const inqRes = await fetch('/api/contact', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null);
        if (inqRes && inqRes.ok) {
          const inqData = await inqRes.json();
          if (inqData.success && Array.isArray(inqData.data)) {
            setInquiries(inqData.data);
            localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inqData.data));
          }
        }
      }
      setIsOnline(true);
    } catch (err) {
      console.warn('API sync warning (operating with local state):', err);
    }
  }, [products]);

  // Initial fetch and synchronization listener
  useEffect(() => {
    refreshFromAPI();

    const handleSync = (e) => {
      try {
        const p = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (p) setProducts(JSON.parse(p).map(normalizeProduct));
        const c = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (c) setCategories(JSON.parse(c));
        const i = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
        if (i) setInquiries(JSON.parse(i));
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('cozy_crumbs_data_sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('cozy_crumbs_data_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // ================= Product Operations =================
  const addProduct = async (productData) => {
    const token = localStorage.getItem('cozy_crumbs_admin_token');
    let savedFromBackend = null;

    if (token) {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          savedFromBackend = normalizeProduct(data.data);
        }
      } catch (e) {
        console.warn('Product POST network issue, falling back to local storage:', e);
      }
    }

    const newProd = savedFromBackend || normalizeProduct({
      ...productData,
      _id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });

    setProducts((prev) => {
      const updated = [newProd, ...prev.filter(p => p._id !== newProd._id && p.id !== newProd.id)];
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('cozy_crumbs_data_sync', { detail: { type: 'products' } }));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });

    return { success: true, product: newProd };
  };

  const updateProduct = async (id, productData) => {
    const token = localStorage.getItem('cozy_crumbs_admin_token');
    const updated = products.map(p => (p._id === id || p.id === id) ? normalizeProduct({ ...p, ...productData, _id: id }) : p);
    persistProducts(updated);

    if (token) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      } catch (e) {
        console.warn('Product PUT failed, saved to local store:', e);
      }
    }
    return { success: true };
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('cozy_crumbs_admin_token');
    const updated = products.filter(p => p._id !== id && p.id !== id);
    persistProducts(updated);

    if (token) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('Product DELETE failed, saved to local store:', e);
      }
    }
    return { success: true };
  };

  const toggleProductAvailability = async (id) => {
    const target = products.find(p => p._id === id || p.id === id);
    if (!target) return;
    const newAvail = !target.isAvailable;
    const updated = products.map(p => (p._id === id || p.id === id) ? { ...p, isAvailable: newAvail } : p);
    persistProducts(updated);

    const token = localStorage.getItem('cozy_crumbs_admin_token');
    if (token) {
      try {
        await fetch(`/api/products/${id}/toggle-availability`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {
          fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isAvailable: newAvail }),
          });
        });
      } catch (e) {
        console.warn('Toggle availability sync error:', e);
      }
    }
  };

  const toggleProductFeatured = async (id) => {
    const target = products.find(p => p._id === id || p.id === id);
    if (!target) return;
    const newFeatured = !target.isFeatured;
    const updated = products.map(p => (p._id === id || p.id === id) ? { ...p, isFeatured: newFeatured } : p);
    persistProducts(updated);

    const token = localStorage.getItem('cozy_crumbs_admin_token');
    if (token) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ isFeatured: newFeatured }),
        });
      } catch (e) {
        console.warn('Toggle featured sync error:', e);
      }
    }
  };

  // ================= Category Operations =================
  const addCategory = async (categoryData) => {
    const token = localStorage.getItem('cozy_crumbs_admin_token');
    const newCat = normalizeCategory({
      ...categoryData,
      _id: `cat_${Date.now()}`,
      displayOrder: categoryData.displayOrder || categories.length + 1,
    }, products);

    const updated = [...categories, newCat];
    persistCategories(updated);

    if (token) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          const finalCats = updated.map(c => c._id === newCat._id ? normalizeCategory(data.data, products) : c);
          persistCategories(finalCats);
        }
      } catch (e) {
        console.warn('Category POST error, saved locally:', e);
      }
    }
    return { success: true, category: newCat };
  };

  const updateCategory = async (id, categoryData) => {
    const token = localStorage.getItem('cozy_crumbs_admin_token');
    const updated = categories.map(c => (c._id === id || c.id === id) ? normalizeCategory({ ...c, ...categoryData, _id: id }, products) : c);
    persistCategories(updated);

    if (token) {
      try {
        await fetch(`/api/categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });
      } catch (e) {
        console.warn('Category PUT error, saved locally:', e);
      }
    }
    return { success: true };
  };

  const deleteCategory = async (id) => {
    const token = localStorage.getItem('cozy_crumbs_admin_token');
    const updated = categories.filter(c => c._id !== id && c.id !== id);
    persistCategories(updated);

    if (token) {
      try {
        await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('Category DELETE error, saved locally:', e);
      }
    }
    return { success: true };
  };

  // ================= Inquiry Operations =================
  const submitInquiry = async (inquiryData) => {
    const newInquiry = {
      _id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone || '',
      subject: inquiryData.subject || inquiryData.inquiryType || 'General Inquiry',
      message: inquiryData.message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...inquiries];
    persistInquiries(updated);

    // Call API
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const finalInquiries = updated.map(i => i._id === newInquiry._id ? data.data : i);
        persistInquiries(finalInquiries);
      }
    } catch (e) {
      console.warn('Contact inquiry saved locally, network offline:', e);
    }

    return { success: true };
  };

  const updateInquiryStatus = async (id, status) => {
    const updated = inquiries.map(i => (i._id === id || i.id === id) ? { ...i, status } : i);
    persistInquiries(updated);

    const token = localStorage.getItem('cozy_crumbs_admin_token');
    if (token) {
      try {
        await fetch(`/api/contact/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
      } catch (e) {
        console.warn('Status update sync error:', e);
      }
    }
  };

  const deleteInquiry = async (id) => {
    const updated = inquiries.filter(i => i._id !== id && i.id !== id);
    persistInquiries(updated);

    const token = localStorage.getItem('cozy_crumbs_admin_token');
    if (token) {
      try {
        await fetch(`/api/contact/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('Delete inquiry sync error:', e);
      }
    }
  };

  return (
    <BakeryContext.Provider
      value={{
        products,
        categories: categoriesWithCounts,
        inquiries,
        loading,
        isOnline,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        toggleProductFeatured,
        addCategory,
        updateCategory,
        deleteCategory,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        refreshData: refreshFromAPI,
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
