import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab: 'products' | 'categories' | 'inquiries'
  const [activeTab, setActiveTab] = useState('products');

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Filters for Products
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states for Product
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    weight: '500g',
    image: '',
    isVeg: true,
    isEggless: true,
    isAvailable: true,
    isSeasonal: false,
    isFeatured: false,
    ingredients: '',
  });

  // Form states for Category
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    displayOrder: 0,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Flash status message helper
  const showToast = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
  };

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      // 1. Products (fetch all, including unavailable)
      const prodRes = await fetch('/api/products?all=true&limit=200');
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.data || []);
      }

      // 2. Categories
      const catRes = await fetch('/api/categories?all=true');
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.data || []);
      }

      // 3. Contact Inquiries
      const inqRes = await fetch('/api/contact', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const inqData = await inqRes.json();
      if (inqData.success) {
        setInquiries(inqData.data || []);
      }
    } catch (err) {
      showToast('Error loading database data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= Product Actions =================
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category) {
      showToast('Name and Category are required', 'error');
      return;
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...productForm,
        image: productForm.image || '/images/products/cakes/chocolate-cake.webp',
        price: Number(productForm.price) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save product');
      }

      showToast(editingProduct ? 'Product updated successfully!' : 'New bake added to database!');
      setIsAddProductOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the database?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product');
      }
      showToast(`Removed "${name}" from catalog`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Instant Switch Toggles
  const handleToggleAvailability = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isAvailable: data.isAvailable } : p))
        );
        showToast(data.message);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleSeasonal = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}/toggle-seasonal`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isSeasonal: data.isSeasonal } : p))
        );
        showToast(data.message);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleDietary = async (id, field, currentValue) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, [field]: !currentValue } : p))
        );
        showToast(`Updated ${field}`);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Open Edit Product
  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category?._id || prod.category || '',
      description: prod.description || '',
      price: prod.price || 0,
      weight: prod.weight || '500g',
      image: prod.image || '',
      isVeg: prod.isVeg !== undefined ? prod.isVeg : true,
      isEggless: prod.isEggless !== undefined ? prod.isEggless : true,
      isAvailable: prod.isAvailable !== undefined ? prod.isAvailable : true,
      isSeasonal: prod.isSeasonal || false,
      isFeatured: prod.isFeatured || false,
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : '',
    });
    setIsAddProductOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories[0]?._id || '',
      description: '',
      price: 0,
      weight: '500g',
      image: '/images/products/cakes/chocolate-cake.webp',
      isVeg: true,
      isEggless: true,
      isAvailable: true,
      isSeasonal: false,
      isFeatured: false,
      ingredients: '',
    });
    setIsAddProductOpen(true);
  };

  // ================= Category Actions =================
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save category');
      }

      showToast(editingCategory ? 'Category updated!' : 'Category created in database!');
      setIsAddCategoryOpen(false);
      setEditingCategory(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Existing products in this category may be affected.`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete category');
      }
      showToast(`Category "${name}" deleted`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // ================= Inquiry Actions =================
  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/contact/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status } : m))
        );
        showToast(`Inquiry marked as ${status}`);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Filtered Products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const catId = p.category?._id || p.category;
    const matchesCategory =
      selectedCatFilter === 'all' ||
      catId === selectedCatFilter ||
      p.category?.name?.toLowerCase() === selectedCatFilter.toLowerCase();

    const matchesDietary =
      dietaryFilter === 'all' ||
      (dietaryFilter === 'veg' && p.isVeg && p.isEggless) ||
      (dietaryFilter === 'nonveg' && (!p.isVeg || !p.isEggless)) ||
      (dietaryFilter === 'seasonal' && p.isSeasonal) ||
      (dietaryFilter === 'available' && p.isAvailable) ||
      (dietaryFilter === 'unavailable' && !p.isAvailable);

    return matchesSearch && matchesCategory && matchesDietary;
  });

  const seasonalCount = products.filter((p) => p.isSeasonal).length;
  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'unread').length;

  return (
    <div className="min-h-screen bg-[#F8F8F2] text-[#112229] flex flex-col font-title">
      {/* Top Admin Banner */}
      <header className="bg-[#112229] text-[#F8F8F2] border-b border-white/10 sticky top-0 z-40 px-[4vw] py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Atlas DB Status */}
          <div className="flex items-center gap-4">
            <Link to="/" className="group block select-none">
              <span className="font-hero font-extrabold text-2xl uppercase tracking-tight text-white group-hover:text-[#FFA7EE] transition-colors">
                COZY CRUMBS
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFA7EE] block">
                ADMIN STUDIO
              </span>
            </Link>

            {/* Live MongoDB Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse block" />
              <span>MongoDB Atlas: Connected (cozy_crumbs)</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-pill bg-[#147C98] hover:bg-[#1891b2] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              View Website ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-pill bg-white/10 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-[4vw] py-8 space-y-8">
        {/* Toast Notification */}
        <AnimatePresence>
          {statusMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-2xl shadow-lg font-bold text-xs flex items-center justify-between ${
                statusMessage.type === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#112229] text-[#FFA7EE] border border-[#FFA7EE]/30'
              }`}
            >
              <span>{statusMessage.text}</span>
              <button
                type="button"
                onClick={() => setStatusMessage({ text: '', type: '' })}
                className="ml-4 font-bold text-base"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Metric Cards with Cozy Crumbs Brand Colors */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#112229] text-[#F8F8F2] rounded-3xl p-6 shadow-md border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFA7EE]">
              TOTAL BAKES
            </span>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-hero font-extrabold text-4xl sm:text-5xl text-white">
                {products.length}
              </span>
              <span className="text-xs text-white/70 font-semibold">In Catalog</span>
            </div>
          </div>

          <div className="bg-[#147C98] text-[#F8F8F2] rounded-3xl p-6 shadow-md flex flex-col justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-white/90">
              CATEGORIES
            </span>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-hero font-extrabold text-4xl sm:text-5xl text-white">
                {categories.length}
              </span>
              <span className="text-xs text-white/80 font-semibold">Active Types</span>
            </div>
          </div>

          <div className="bg-[#FFDAED] text-[#112229] rounded-3xl p-6 shadow-md border border-[#FFA7EE]/60 flex flex-col justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#112229]">
              SEASONAL EDITIONS
            </span>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-hero font-extrabold text-4xl sm:text-5xl text-[#112229]">
                {seasonalCount}
              </span>
              <span className="text-xs text-[#112229]/80 font-bold">Featured Specials</span>
            </div>
          </div>

          <div className="bg-white text-[#112229] rounded-3xl p-6 shadow-md border border-[#112229]/15 flex flex-col justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#147C98]">
              CUSTOMER INQUIRIES
            </span>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-hero font-extrabold text-4xl sm:text-5xl text-[#112229]">
                {inquiries.length}
              </span>
              {unreadInquiriesCount > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-pulse">
                  {unreadInquiriesCount} New
                </span>
              ) : (
                <span className="text-xs text-[#112229]/60 font-semibold">All Read</span>
              )}
            </div>
          </div>
        </div>

        {/* Master Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#112229]/15 pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-5 sm:px-6 py-3 rounded-pill font-hero font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#112229] text-[#F8F8F2] shadow-md'
                  : 'bg-white text-[#112229] hover:bg-[#147C98] hover:text-white border border-[#112229]/15'
              }`}
            >
              🍰 Products ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-5 sm:px-6 py-3 rounded-pill font-hero font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#112229] text-[#F8F8F2] shadow-md'
                  : 'bg-white text-[#112229] hover:bg-[#147C98] hover:text-white border border-[#112229]/15'
              }`}
            >
              📁 Categories ({categories.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-5 sm:px-6 py-3 rounded-pill font-hero font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-[#112229] text-[#F8F8F2] shadow-md'
                  : 'bg-white text-[#112229] hover:bg-[#147C98] hover:text-white border border-[#112229]/15'
              }`}
            >
              <span>💌 Inquiries</span>
              {unreadInquiriesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FFA7EE] text-[#112229] font-black text-[10px] flex items-center justify-center">
                  {unreadInquiriesCount}
                </span>
              )}
            </button>
          </div>

          {/* Action Button depending on Tab */}
          {activeTab === 'products' && (
            <button
              type="button"
              onClick={openNewProduct}
              className="px-6 py-3 rounded-pill bg-[#FFA7EE] hover:bg-[#112229] hover:text-white text-[#112229] font-title font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>+ Add New Bake</span>
            </button>
          )}

          {activeTab === 'categories' && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '', displayOrder: categories.length + 1 });
                setIsAddCategoryOpen(true);
              }}
              className="px-6 py-3 rounded-pill bg-[#147C98] hover:bg-[#112229] text-white font-title font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>+ Add Category</span>
            </button>
          )}
        </div>

        {/* ================= TAB 1: PRODUCTS ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-3xl p-5 border border-[#112229]/15 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bake name, description..."
                  className="w-full px-4 py-2.5 rounded-pill bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedCatFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                    selectedCatFilter === 'all'
                      ? 'bg-[#112229] text-white'
                      : 'bg-[#F8F8F2] text-[#112229] hover:bg-[#112229]/10'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setSelectedCatFilter(cat._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                      selectedCatFilter === cat._id
                        ? 'bg-[#147C98] text-white'
                        : 'bg-[#F8F8F2] text-[#112229] hover:bg-[#112229]/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Dietary & Status Dropdown Filter */}
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-pill bg-[#F8F8F2] border border-[#112229]/20 text-xs font-bold text-[#112229] outline-none cursor-pointer"
              >
                <option value="all">Filter: All Items</option>
                <option value="veg">100% Pure Veg (Eggless)</option>
                <option value="nonveg">Contains Egg / Non-Veg</option>
                <option value="seasonal">Seasonal Edition</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            {/* Products Table / Cards */}
            {loading ? (
              <div className="py-20 text-center text-sm font-bold text-[#112229]/60">
                Loading live catalog from MongoDB Atlas...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#112229]/15 space-y-3">
                <p className="font-hero text-xl font-bold uppercase text-[#112229]">
                  No bakes match your filter
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCatFilter('all');
                    setDietaryFilter('all');
                  }}
                  className="px-5 py-2 rounded-pill bg-[#112229] text-white text-xs font-bold uppercase"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isPureVeg = product.isVeg && product.isEggless;
                  return (
                    <div
                      key={product._id}
                      className={`bg-white rounded-3xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                        !product.isAvailable ? 'opacity-70 border-amber-300' : 'border-[#112229]/15'
                      }`}
                    >
                      <div>
                        {/* Top Image & Dietary Badges */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FFDAED]/20 mb-4 group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/products/cakes/chocolate-cake.webp';
                            }}
                          />

                          {/* Seasonal Badge */}
                          {product.isSeasonal && (
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-pill bg-[#FFA7EE] text-[#112229] font-title text-[10px] font-black uppercase tracking-wider shadow-md">
                              ✨ Seasonal Edition
                            </div>
                          )}

                          {/* Dietary indicator top right */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                            {isPureVeg ? (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                                <rect x="1" y="1" width="14" height="14" rx="2" stroke="#16A34A" strokeWidth="1.8" />
                                <circle cx="8" cy="8" r="3.5" fill="#16A34A" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                                <rect x="1" y="1" width="14" height="14" rx="2" stroke="#DC2626" strokeWidth="1.8" />
                                <circle cx="8" cy="8" r="3.5" fill="#DC2626" />
                              </svg>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#112229]">
                              {isPureVeg ? 'Veg' : 'Egg / Non-Veg'}
                            </span>
                          </div>
                        </div>

                        {/* Title & Category */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#147C98]">
                            {product.category?.name || 'Artisanal'}
                          </span>
                          <span className="text-xs text-[#112229]/60 font-bold">
                            {product.weight || '500g'}
                          </span>
                        </div>

                        <h3 className="font-hero font-extrabold text-xl uppercase text-[#112229] leading-tight mt-1 mb-2">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#112229]/75 font-medium line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Quick Interactive Toggles (Available, Veg, Eggless, Seasonal) */}
                      <div className="pt-3 border-t border-[#112229]/10 space-y-2.5">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Availability Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(product._id)}
                            className={`px-3 py-1.5 rounded-pill font-bold uppercase text-[10px] tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                              product.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            <span>{product.isAvailable ? 'Available' : 'Unavailable'}</span>
                          </button>

                          {/* Seasonal Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleSeasonal(product._id)}
                            className={`px-3 py-1.5 rounded-pill font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer ${
                              product.isSeasonal
                                ? 'bg-[#FFA7EE] text-[#112229] shadow-xs'
                                : 'bg-[#F8F8F2] text-[#112229]/70 hover:bg-[#112229]/10'
                            }`}
                          >
                            {product.isSeasonal ? '★ Seasonal' : 'Standard'}
                          </button>
                        </div>

                        {/* Dietary switches row */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
                          <button
                            type="button"
                            onClick={() => handleToggleDietary(product._id, 'isVeg', product.isVeg)}
                            className={`py-1 rounded-lg border transition-colors ${
                              product.isVeg ? 'border-emerald-600 text-emerald-800 bg-emerald-50' : 'border-rose-600 text-rose-800 bg-rose-50'
                            }`}
                          >
                            {product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleDietary(product._id, 'isEggless', product.isEggless)}
                            className={`py-1 rounded-lg border transition-colors ${
                              product.isEggless ? 'border-emerald-600 text-emerald-800 bg-emerald-50' : 'border-amber-600 text-amber-900 bg-amber-50'
                            }`}
                          >
                            {product.isEggless ? 'Eggless' : 'Contains Egg'}
                          </button>
                        </div>

                        {/* Edit & Delete Actions */}
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => openEditProduct(product)}
                            className="flex-1 py-2 rounded-pill bg-[#112229] hover:bg-[#147C98] text-white font-title font-bold text-xs uppercase tracking-wider transition-colors"
                          >
                            Edit Bake
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="px-4 py-2 rounded-pill bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-xs uppercase tracking-wider transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: CATEGORIES ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-3xl p-6 border border-[#112229]/15 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-title text-[10px] font-black uppercase tracking-widest text-[#147C98] bg-[#147C98]/10 px-3 py-1 rounded-full">
                        SLUG: {cat.slug}
                      </span>
                      <span className="text-xs font-bold text-[#112229]/60">
                        {cat.productCount || 0} Products
                      </span>
                    </div>

                    <h3 className="font-hero font-extrabold text-2xl uppercase text-[#112229]">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-[#112229]/75 font-medium leading-relaxed mt-2">
                      {cat.description || 'Artisanal category handcrafted daily in Hyderabad studio.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#112229]/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryForm({
                          name: cat.name,
                          description: cat.description || '',
                          displayOrder: cat.displayOrder || 0,
                        });
                        setIsAddCategoryOpen(true);
                      }}
                      className="flex-1 py-2 rounded-pill bg-[#112229] hover:bg-[#147C98] text-white font-title font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat._id, cat.name)}
                      className="px-4 py-2 rounded-pill bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CUSTOMER INQUIRIES (CONTACT MESSAGES) ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#112229]/15 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="font-hero font-extrabold text-2xl uppercase text-[#112229]">
                  Live Customer Inquiries Inbox
                </h2>
                <p className="text-xs text-[#112229]/75 font-medium">
                  Direct inquiries received from your website contact form. Reply directly via WhatsApp or Email.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchData}
                className="px-4 py-2 rounded-pill bg-[#F8F8F2] hover:bg-[#112229] hover:text-white text-[#112229] text-xs font-bold uppercase transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-[#112229]/15 space-y-3">
                <p className="font-hero text-2xl font-bold uppercase text-[#112229]">
                  No customer messages yet
                </p>
                <p className="text-xs text-[#112229]/70 font-medium">
                  When a customer submits a query on the contact page, it will immediately appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => {
                  const formattedDate = inq.createdAt
                    ? new Date(inq.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
                  const whatsAppPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

                  return (
                    <div
                      key={inq._id}
                      className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm transition-all space-y-4 ${
                        inq.status === 'unread'
                          ? 'border-[#FFA7EE] shadow-pink-100/50'
                          : 'border-[#112229]/15'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#112229]/10 pb-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              inq.status === 'unread'
                                ? 'bg-[#FFA7EE] animate-ping'
                                : inq.status === 'replied'
                                ? 'bg-emerald-500'
                                : 'bg-[#147C98]'
                            }`}
                          />
                          <h3 className="font-hero font-extrabold text-xl uppercase text-[#112229]">
                            {inq.name}
                          </h3>
                          <span className="px-3 py-0.5 rounded-full bg-[#112229]/5 text-[#112229] font-bold text-xs uppercase">
                            {inq.subject || 'General Inquiry'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-[#112229]/60">
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      {/* Message Content */}
                      <p className="text-sm text-[#112229]/90 font-medium leading-relaxed bg-[#F8F8F2] p-4 rounded-2xl border border-[#112229]/10">
                        "{inq.message}"
                      </p>

                      {/* Contact details & action buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#112229]">
                          <span>
                            ✉ <a href={`mailto:${inq.email}`} className="underline hover:text-[#147C98]">{inq.email}</a>
                          </span>
                          {inq.phone && (
                            <span>
                              📞 <a href={`tel:${inq.phone}`} className="underline hover:text-[#147C98]">{inq.phone}</a>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* 1-Click WhatsApp Reply */}
                          {inq.phone && (
                            <a
                              href={`https://wa.me/${whatsAppPhone}?text=Hi%20${encodeURIComponent(inq.name)},%20thank%20you%20for%20contacting%20Cozy%20Crumbs!%20Regarding%20your%20inquiry:`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-pill bg-[#25D366] hover:bg-[#20ba5a] text-white font-title font-extrabold text-xs uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5"
                            >
                              <span>WhatsApp Reply</span>
                            </a>
                          )}

                          {/* Email Reply */}
                          <a
                            href={`mailto:${inq.email}?subject=Cozy%20Crumbs%20Inquiry%20Response`}
                            className="px-4 py-2 rounded-pill bg-[#112229] hover:bg-[#147C98] text-white font-title font-bold text-xs uppercase tracking-wider transition-colors"
                          >
                            Email
                          </a>

                          {/* Status toggle */}
                          {inq.status === 'unread' ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateInquiryStatus(inq._id, 'read')}
                              className="px-3 py-2 rounded-pill bg-[#F8F8F2] hover:bg-[#112229] hover:text-white text-[#112229] text-xs font-bold uppercase transition-colors"
                            >
                              Mark Read
                            </button>
                          ) : inq.status === 'read' ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateInquiryStatus(inq._id, 'replied')}
                              className="px-3 py-2 rounded-pill bg-emerald-100 text-emerald-800 text-xs font-bold uppercase transition-colors"
                            >
                              Mark Replied
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-700">✓ Replied</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#112229]/80 backdrop-blur-sm"
              onClick={() => setIsAddProductOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-[36px] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#112229]/15"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#112229]/15 mb-6">
                <div>
                  <h3 className="font-hero font-extrabold text-2xl uppercase text-[#112229]">
                    {editingProduct ? 'Edit Bake Creation' : 'Add New Bake Creation'}
                  </h3>
                  <p className="text-xs text-[#112229]/70 font-semibold">
                    Saved directly to your live MongoDB Atlas database
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#F8F8F2] hover:bg-[#FFA7EE] flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                      Bake Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Belgian Truffle Gateau"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none cursor-pointer"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe flavor notes, artisan sponge, buttercream textures..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                      Portion / Weight
                    </label>
                    <input
                      type="text"
                      value={productForm.weight}
                      onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                      placeholder="e.g. 500g / 1kg / 1 Pc"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                      Image Path or URL
                    </label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="/images/products/cakes/chocolate-cake.webp"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                    />
                  </div>
                </div>

                {/* Dietary Switches Box */}
                <div className="p-4 rounded-2xl bg-[#F8F8F2] border border-[#112229]/15 space-y-3">
                  <span className="font-title text-xs font-bold uppercase tracking-wider text-[#147C98] block">
                    Dietary & Availability Specifications
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#112229]">
                      <input
                        type="checkbox"
                        checked={productForm.isVeg}
                        onChange={(e) => setProductForm({ ...productForm, isVeg: e.target.checked })}
                        className="w-4 h-4 accent-[#147C98]"
                      />
                      <span>Vegetarian</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#112229]">
                      <input
                        type="checkbox"
                        checked={productForm.isEggless}
                        onChange={(e) => setProductForm({ ...productForm, isEggless: e.target.checked })}
                        className="w-4 h-4 accent-[#147C98]"
                      />
                      <span>Eggless</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#112229]">
                      <input
                        type="checkbox"
                        checked={productForm.isSeasonal}
                        onChange={(e) => setProductForm({ ...productForm, isSeasonal: e.target.checked })}
                        className="w-4 h-4 accent-[#FFA7EE]"
                      />
                      <span>Seasonal Edition</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#112229]">
                      <input
                        type="checkbox"
                        checked={productForm.isAvailable}
                        onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <span>In Stock</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    placeholder="Single-origin dark chocolate, dairy cream, unbleached flour..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#112229]/15">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-6 py-3 rounded-pill bg-[#F8F8F2] hover:bg-[#112229]/10 text-[#112229] text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-pill bg-[#FFA7EE] hover:bg-[#112229] hover:text-white text-[#112229] font-title font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    {editingProduct ? 'Update In Database' : 'Save To Database'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: ADD / EDIT CATEGORY ================= */}
      <AnimatePresence>
        {isAddCategoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#112229]/80 backdrop-blur-sm"
              onClick={() => setIsAddCategoryOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md bg-white rounded-[36px] shadow-2xl p-6 sm:p-8 border border-[#112229]/15"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#112229]/15 mb-6">
                <div>
                  <h3 className="font-hero font-extrabold text-2xl uppercase text-[#112229]">
                    {editingCategory ? 'Edit Category' : 'Create Category'}
                  </h3>
                  <p className="text-xs text-[#112229]/70 font-semibold">
                    Saved directly into MongoDB Atlas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#F8F8F2] hover:bg-[#FFA7EE] flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Tartlets & Pies"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Description of this bakery category..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#112229]/15">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="px-6 py-3 rounded-pill bg-[#F8F8F2] text-[#112229] text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-pill bg-[#147C98] hover:bg-[#112229] text-white font-title font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
