import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Cake,
  FolderTree,
  Mail,
  ExternalLink,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  Pencil,
  Trash2,
  X,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Eye,
  EyeOff,
  Phone,
  Menu,
  TrendingUp,
  ShoppingBag,
  Users,
} from '../../components/admin/AdminIcons';
import { useAuth } from '../../context/AuthContext';
import { useBakery } from '../../context/BakeryContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminDashboardPage() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Tablet / Desktop Sidebar Collapse State (defaults to compact on tablet, full on desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 && window.innerWidth < 1024;
    }
    return false;
  });

  // Listen for viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileDrawerOpen(false);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const {
    products = [],
    categories = [],
    inquiries = [],
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    toggleProductFeatured,
    addCategory,
    updateCategory,
    deleteCategory,
    updateInquiryStatus,
    deleteInquiry,
    refreshData,
  } = useBakery();

  // Safe arrays
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  // Active navigation tab: 'dashboard' | 'products' | 'categories' | 'messages'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync latest data whenever active tab switches
  useEffect(() => {
    if (typeof refreshData === 'function') {
      refreshData();
    }
  }, [activeTab]);

  // Filters for Products
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState({ text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: 'success' }), 3500);
  };

  // Product Form state
  const [productForm, setProductForm] = useState({
    name: '',
    categoryName: 'Cakes',
    description: '',
    price: 0,
    weight: '500g / 1kg',
    image: '/images/products/cakes/chocolate-cake.webp',
    isVeg: true,
    isEggless: true,
    isAvailable: true,
    isFeatured: false,
    ingredients: '',
  });

  // Category Form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/images/products/cakes/chocolate-cake.webp',
    icon: 'Cake',
    displayOrder: 1,
    isActive: true,
  });

  // Curated bakery images list for fast image selection
  const curatedImages = [
    { label: 'Chocolate Cake', url: '/images/products/cakes/chocolate-cake.webp' },
    { label: 'Vanilla Cake', url: '/images/products/cakes/vanilla-cake.webp' },
    { label: 'Butterscotch Cake', url: '/images/products/cakes/butterscotch-cake.webp' },
    { label: 'Strawberry Cake', url: '/images/products/cakes/strawberry-cake.webp' },
    { label: 'Chocolate Pastry', url: '/images/products/pastries/chocolate-pastry.webp' },
    { label: 'Black Forest Pastry', url: '/images/products/pastries/black-forest-pastry.webp' },
    { label: 'Regular Bread', url: '/images/products/breads/regular-bread.webp' },
    { label: 'Brown Bread', url: '/images/products/breads/brown-bread.webp' },
    { label: 'Moon Biscuit', url: '/images/products/brownies/moon-biscuit.webp' },
    { label: 'Khari', url: '/images/products/brownies/khari.webp' },
    { label: 'Veg Puff', url: '/images/products/puffs/veg-puff.webp' },
    { label: 'Egg Puff', url: '/images/products/puffs/egg-puff.webp' },
    { label: 'Chocolate Protein Shake', url: '/images/products/protein-shakes/chocolate-protein-shake.webp' },
    { label: 'Vanilla Protein Shake', url: '/images/products/protein-shakes/vanilla-protein-shake.webp' },
  ];

  // ================= Calculations for Stats =================
  const totalProductsCount = safeProducts.length;
  const activeCategoriesCount = safeCategories.filter((c) => c && c.isActive !== false).length;
  const signatureFeaturedCount = safeProducts.filter((p) => p && p.isFeatured).length;
  const availableProductsCount = safeProducts.filter((p) => p && p.isAvailable !== false).length;
  const totalInquiriesCount = safeInquiries.length;
  const unreadInquiriesCount = safeInquiries.filter((i) => i && i.status === 'unread').length;

  const estimatedCatalogValue = useMemo(() => {
    return safeProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  }, [safeProducts]);

  const uniqueCustomersCount = useMemo(() => {
    const emails = new Set(safeInquiries.map((i) => i.email?.trim().toLowerCase()).filter(Boolean));
    return Math.max(emails.size, safeInquiries.length);
  }, [safeInquiries]);

  // Filtered Products for Products tab
  const filteredProducts = useMemo(() => {
    return safeProducts.filter((p) => {
      if (!p) return false;
      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchCat = p.categoryName?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) return false;
      }

      // Category
      if (categoryFilter !== 'All') {
        if (p.categoryName?.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
      }

      // Status
      if (statusFilter === 'Available' && p.isAvailable === false) return false;
      if (statusFilter === 'Unavailable' && p.isAvailable !== false) return false;
      if (statusFilter === 'Featured' && !p.isFeatured) return false;
      if (statusFilter === 'Eggless' && !p.isEggless) return false;
      if (statusFilter === 'Contains Egg' && p.isEggless) return false;

      return true;
    });
  }, [safeProducts, searchQuery, categoryFilter, statusFilter]);

  // ================= Handlers: Product =================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryName: safeCategories[0]?.name || 'Cakes',
      description: '',
      price: 0,
      weight: '500g / 1kg',
      image: '/images/products/cakes/chocolate-cake.webp',
      isVeg: true,
      isEggless: true,
      isAvailable: true,
      isFeatured: false,
      ingredients: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      categoryName: prod.categoryName || safeCategories[0]?.name || 'Cakes',
      description: prod.description || '',
      price: prod.price || 0,
      weight: prod.weight || '500g / 1kg',
      image: prod.image || '/images/products/cakes/chocolate-cake.webp',
      isVeg: prod.isVeg !== undefined ? prod.isVeg : true,
      isEggless: prod.isEggless !== undefined ? prod.isEggless : true,
      isAvailable: prod.isAvailable !== undefined ? prod.isAvailable : true,
      isFeatured: prod.isFeatured || false,
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }

    try {
      const selectedCatObj = safeCategories.find(
        (c) => c.name?.toLowerCase() === productForm.categoryName?.toLowerCase() ||
               c._id === productForm.categoryName ||
               c.id === productForm.categoryName
      );

      const payload = {
        ...productForm,
        name: productForm.name.trim(),
        category: selectedCatObj?._id || selectedCatObj?.id || productForm.categoryName,
        categoryName: selectedCatObj?.name || productForm.categoryName,
        categorySlug: selectedCatObj?.slug || productForm.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(productForm.price) || 0,
        ingredients: productForm.ingredients
          ? productForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
        showToast(`Updated "${payload.name}" successfully!`);
      } else {
        await addProduct(payload);
        showToast(`Added "${payload.name}" to the bakery catalog!`);
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = (prod) => {
    setDeletingProduct(prod);
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct._id || deletingProduct.id, deletingProduct.slug);
      showToast(`Removed "${deletingProduct.name}" from catalog`);
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleToggleAvail = async (prod) => {
    await toggleProductAvailability(prod._id || prod.id);
    showToast(`Updated availability for "${prod.name}"`);
  };

  const handleToggleFeat = async (prod) => {
    await toggleProductFeatured(prod._id || prod.id);
    showToast(`Updated featured status for "${prod.name}"`);
  };

  // ================= Handlers: Category =================
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      image: '/images/products/cakes/chocolate-cake.webp',
      icon: 'Cake',
      displayOrder: safeCategories.length + 1,
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '/images/products/cakes/chocolate-cake.webp',
      icon: cat.icon || 'Cake',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    try {
      const payload = {
        ...categoryForm,
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim() || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayOrder: Number(categoryForm.displayOrder) || safeCategories.length + 1,
      };

      if (editingCategory) {
        await updateCategory(editingCategory._id || editingCategory.id, payload);
        showToast(`Category "${payload.name}" updated!`);
      } else {
        await addCategory(payload);
        showToast(`Category "${payload.name}" created!`);
      }

      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Products in this category may become uncategorized.`)) return;
    try {
      await deleteCategory(cat._id || cat.id);
      showToast(`Deleted category "${cat.name}"`);
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  // ================= Handlers: Inquiry =================
  const handleToggleInquiryStatus = async (inq) => {
    const newStatus = inq.status === 'read' ? 'unread' : 'read';
    try {
      await updateInquiryStatus(inq._id || inq.id, newStatus);
      showToast(`Marked inquiry as ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteInquiry = async (inq) => {
    if (!window.confirm(`Delete inquiry from "${inq.name}"?`)) return;
    try {
      await deleteInquiry(inq._id || inq.id);
      showToast('Inquiry deleted');
    } catch (err) {
      showToast(err.message || 'Failed to delete inquiry', 'error');
    }
  };

  // Helper: icon representation for category
  const getCategoryIconSymbol = (slugOrName) => {
    const s = String(slugOrName || '').toLowerCase();
    if (s.includes('cake')) return '🎂';
    if (s.includes('pastr')) return '🍦';
    if (s.includes('bread')) return '🥐';
    if (s.includes('brown') || s.includes('biscuit') || s.includes('cookie')) return '🍪';
    if (s.includes('puff')) return '🥟';
    if (s.includes('shake') || s.includes('drink')) return '🥛';
    return '🍰';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1B130E] flex flex-col md:flex-row font-sans antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Desktop: Full 64 / Tablet: Collapsible 20)               */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col justify-between ${
          isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-5'
        } bg-[#1B130E] text-[#A89F91] select-none shrink-0 border-r border-[#2C1F17] shadow-xl z-20 transition-all duration-300`}
      >
        <div>
          {/* Brand Header */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'} px-2 py-3 mb-8`}>
            <div className="w-10 h-10 rounded-xl bg-[#ECE5D8] flex items-center justify-center text-[#1B130E] shadow-sm shrink-0">
              <Cake className="w-5 h-5 stroke-[2.2]" />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-white font-extrabold text-[17px] tracking-tight leading-none truncate">
                  Cozy Crumbs
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A89F91] block mt-1">
                  ADMIN DASHBOARD
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {/* Dashboard Button */}
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              title="Dashboard"
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            {/* Products Button */}
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              title="Products"
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Cake className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Products</span>}
            </button>

            {/* Categories Button */}
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              title="Categories"
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderTree className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Categories</span>}
            </button>

            {/* Messages Button */}
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              title="Messages"
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-3.5 py-3'
              } rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'messages'
                  ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Mail className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>Messages</span>}
              </div>
              {unreadInquiriesCount > 0 && (
                isSidebarCollapsed ? (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#C06B3E] ring-2 ring-[#1B130E]" />
                ) : (
                  <span className="bg-[#C06B3E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {unreadInquiriesCount}
                  </span>
                )
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Links */}
        <div className="space-y-1.5 pt-6 border-t border-[#2C1F17]/80">
          <Link
            to="/"
            target="_blank"
            title="Live Bakery Site"
            className={`flex items-center ${
              isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2'
            } text-xs font-medium text-[#A89F91] hover:text-white transition-colors`}
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Live Bakery Site</span>}
          </Link>

          <button
            type="button"
            onClick={logout}
            title="Logout"
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2'
            } text-xs font-medium text-[#A89F91] hover:text-rose-400 transition-colors text-left cursor-pointer`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>

          {/* Toggle Sidebar Collapse (Tablet / Desktop) */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center px-0 py-2' : 'justify-between px-3 py-2'
            } text-xs font-medium text-[#A89F91] hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer mt-1`}
          >
            {!isSidebarCollapsed && <span className="text-[11px]">Collapse View</span>}
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 1.1 MOBILE SLIDE-OVER DRAWER (For all phones & handheld devices)           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-over Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="relative w-72 max-w-[85vw] bg-[#1B130E] text-[#A89F91] flex flex-col justify-between p-5 select-none shadow-2xl z-10"
            >
              <div>
                {/* Brand Header & Close */}
                <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-[#2C1F17] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#ECE5D8] flex items-center justify-center text-[#1B130E] shadow-sm shrink-0">
                      <Cake className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h2 className="text-white font-extrabold text-[16px] tracking-tight leading-none">
                        Cozy Crumbs
                      </h2>
                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#C06B3E] block mt-1">
                        ADMIN PORTAL
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('products');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'products'
                        ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Cake className="w-4 h-4 shrink-0" />
                    <span>Products</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('categories');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'categories'
                        ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <FolderTree className="w-4 h-4 shrink-0" />
                    <span>Categories</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('messages');
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'messages'
                        ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>Messages</span>
                    </div>
                    {unreadInquiriesCount > 0 && (
                      <span className="bg-[#C06B3E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {unreadInquiriesCount}
                      </span>
                    )}
                  </button>
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="space-y-2 pt-6 border-t border-[#2C1F17]">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#A89F91] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Bakery Site</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE (Light Canvas with Top Navigation)                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 px-3.5 sm:px-6 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile (< 768px) */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open Admin Menu"
              className="md:hidden p-2 -ml-1 text-gray-700 hover:text-[#1B130E] hover:bg-gray-100 rounded-xl transition cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Tablet Sidebar Toggle (768px–1023px) */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden md:flex lg:hidden p-2 -ml-1 text-gray-600 hover:text-[#1B130E] hover:bg-gray-100 rounded-xl transition cursor-pointer shrink-0"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>

            <h2 className="text-sm sm:text-base md:text-[17px] font-bold text-[#1B130E] tracking-tight truncate">
              Cozy Crumbs Admin
            </h2>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              title="Open Live Website"
              className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#1B130E] rounded-lg transition flex items-center gap-1.5 text-xs font-semibold border border-gray-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>

            <div className="w-8 h-8 rounded-full bg-[#ECE5D8] text-[#1B130E] font-bold text-xs flex items-center justify-center shadow-inner shrink-0">
              C
            </div>
            <div className="hidden lg:block text-right sm:text-left">
              <span className="block text-xs font-bold text-[#1B130E] leading-tight">
                Cozy Crumbs Admin
              </span>
              <span className="block text-[11px] text-gray-400 font-medium leading-tight">
                cozycrumbs6767@gmail.com
              </span>
            </div>
          </div>
        </header>

        {/* Toast alert feedback */}
        <AnimatePresence>
          {toast.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-3 rounded-xl shadow-xl font-bold text-xs flex items-center gap-2 bg-[#1B130E] text-white border border-[#C06B3E]"
            >
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>{toast.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body Container */}
        <main className="p-3 sm:p-6 md:p-8 pb-28 md:pb-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 min-w-0">
          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW (Image 1)                                       */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              {/* Control Center Hero Banner */}
              <div className="bg-[#192231] rounded-2xl p-5 sm:p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-md">
                <div className="space-y-1.5 max-w-xl">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#94A3B8] block">
                    CONTROL CENTER
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    Bakery Catalog & Operations
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] font-medium leading-relaxed">
                    Manage your artisanal cakes, pastry inventory, bakery categories, and monitor customer inquiries.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('products');
                      handleOpenAddProduct();
                    }}
                    className="bg-[#C06B3E] hover:bg-[#a8582d] text-white text-xs font-bold uppercase tracking-wider px-4 sm:px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>MANAGE PRODUCTS</span>
                  </button>

                  <Link
                    to="/"
                    target="_blank"
                    className="bg-[#2B384E] hover:bg-[#394a66] text-white text-xs font-bold uppercase tracking-wider px-4 sm:px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>VIEW STORE</span>
                  </Link>
                </div>
              </div>

              {/* Stat Metric Cards (Responsive Grid: 1 col on <420px, 2 cols on mobile/tablet, 4 cols on desktop) */}
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {/* 1. Total Products */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block truncate">
                      TOTAL PRODUCTS
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1B130E] mt-1 block">
                      {totalProductsCount}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">In bakery catalog</span>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shadow-sm shrink-0 ml-2">
                    <Cake className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* 2. Active Categories */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block truncate">
                      ACTIVE CATEGORIES
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1B130E] mt-1 block">
                      {activeCategoriesCount}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">Live menu sections</span>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#10B981] text-white flex items-center justify-center shadow-sm shrink-0 ml-2">
                    <FolderTree className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* 3. Orders & Inquiries */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block truncate">
                      ORDERS & INQUIRIES
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1B130E] mt-1 block">
                      {totalInquiriesCount}
                    </span>
                    <span className="text-[11px] text-[#C06B3E] font-bold">
                      {unreadInquiriesCount > 0 ? `${unreadInquiriesCount} unread` : `${uniqueCustomersCount} customers`}
                    </span>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#C06B3E] text-white flex items-center justify-center shadow-sm shrink-0 ml-2">
                    <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* 4. Estimated Store Value / Revenue Potential */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block truncate">
                      CATALOG VALUE
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1B130E] mt-1 block truncate">
                      ₹{estimatedCatalogValue.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {availableProductsCount} available now
                    </span>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center shadow-sm shrink-0 ml-2">
                    <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
              </div>

              {/* Responsive Sales & Weekly Activity Analytics Chart */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#C06B3E] block">
                      SALES & INQUIRY ANALYTICS
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-[#1B130E]">
                      Weekly Customer Activity & Demand
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-gray-500 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +24% vs last week
                    </span>
                  </div>
                </div>

                {/* SVG Chart with 100% fluid viewBox */}
                <div className="w-full overflow-hidden pt-2">
                  <svg
                    viewBox="0 0 600 160"
                    className="w-full h-auto max-h-48 sm:max-h-56"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="caramelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C06B3E" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#C06B3E" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="30" y1="20" x2="580" y2="20" stroke="#F3F4F6" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="30" y1="60" x2="580" y2="60" stroke="#F3F4F6" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="30" y1="100" x2="580" y2="100" stroke="#F3F4F6" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="30" y1="140" x2="580" y2="140" stroke="#E5E7EB" strokeWidth="1.2" />

                    {/* Area under curve */}
                    <path
                      d="M 50 120 Q 130 90, 210 105 T 370 45 T 530 30 L 530 140 L 50 140 Z"
                      fill="url(#caramelGrad)"
                    />

                    {/* Smooth curve line */}
                    <path
                      d="M 50 120 Q 130 90, 210 105 T 370 45 T 530 30"
                      fill="none"
                      stroke="#C06B3E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive points */}
                    {[
                      { x: 50, y: 120, label: 'Mon' },
                      { x: 130, y: 90, label: 'Tue' },
                      { x: 210, y: 105, label: 'Wed' },
                      { x: 290, y: 70, label: 'Thu' },
                      { x: 370, y: 45, label: 'Fri' },
                      { x: 450, y: 35, label: 'Sat' },
                      { x: 530, y: 30, label: 'Sun' },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          fill="#FFFFFF"
                          stroke="#C06B3E"
                          strokeWidth="3"
                        />
                        <text
                          x={pt.x}
                          y="155"
                          textAnchor="middle"
                          fill="#9CA3AF"
                          fontSize="11"
                          fontWeight="600"
                        >
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Popular Bakery Categories Distribution */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 text-[11px] block">Cakes & Bestsellers</span>
                    <span className="font-extrabold text-[#1B130E] text-sm">48% Demand</span>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#C06B3E] h-full rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Pastries & Desserts</span>
                    <span className="font-extrabold text-[#1B130E] text-sm">26% Demand</span>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#10B981] h-full rounded-full" style={{ width: '26%' }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Artisan Breads</span>
                    <span className="font-extrabold text-[#1B130E] text-sm">16% Demand</span>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: '16%' }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Puffs & Shakes</span>
                    <span className="font-extrabold text-[#1B130E] text-sm">10% Demand</span>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Two Columns (Stacked on mobile/tablet, 2 cols on lg) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                {/* Left (8 cols): Recently Added Bakery Items */}
                <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#1B130E]">
                        Recently Added Bakery Items
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Live products synced to the customer catalog
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-[#C06B3E] hover:text-[#9e5229] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>VIEW ALL</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mobile Recent Items (< 640px) */}
                  <div className="sm:hidden space-y-2.5">
                    {safeProducts.slice(0, 5).map((p) => (
                      <div
                        key={p._id || p.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-[#1B130E] text-xs truncate">
                              {p.name}
                            </h5>
                            <span className="text-[10px] text-gray-400 block truncate">
                              {p.categoryName} • {p.price > 0 ? `₹${p.price}` : 'In Store'}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {p.isAvailable ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Recent Items Table (>= 640px) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 font-semibold">PRODUCT</th>
                          <th className="pb-3 font-semibold">CATEGORY</th>
                          <th className="pb-3 font-semibold">PRICE</th>
                          <th className="pb-3 font-semibold text-right">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {safeProducts.slice(0, 5).map((p) => (
                          <tr key={p._id || p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0"
                              />
                              <span className="font-bold text-[#1B130E] truncate">{p.name}</span>
                            </td>
                            <td className="py-3.5 text-gray-500 font-medium">
                              {p.categoryName}
                            </td>
                            <td className="py-3.5 font-bold text-[#1B130E]">
                              {p.price > 0 ? `₹${p.price}` : '₹0'}
                            </td>
                            <td className="py-3.5 text-right">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                                {p.isAvailable ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right (4 cols): Quick Shortcuts + System Status */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Quick Shortcuts */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-[#1B130E]">
                      Quick Shortcuts
                    </h4>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('products');
                          handleOpenAddProduct();
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition text-xs font-semibold text-[#1B130E] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">🎂</span>
                          <span>Add & Edit Products</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition text-xs font-semibold text-[#1B130E] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">📑</span>
                          <span>Category Management</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('messages')}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition text-xs font-semibold text-[#1B130E] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">💬</span>
                          <span>Contact Inquiries ({safeInquiries.length})</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* System Status Card */}
                  <div className="bg-[#192231] rounded-2xl p-6 text-white space-y-4 shadow-sm">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#94A3B8] block">
                        SYSTEM STATUS
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        Live Production Database
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs text-gray-300 font-medium">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
                        <span>MongoDB Database Connected</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
                        <span>REST API Server Online (Port 5050)</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
                        <span>JWT Authentication Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCT MANAGEMENT (Image 2)                                       */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#1B130E] tracking-tight">
                    Product Management
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Add, update, or remove cakes, breads, pastries, and snacks in real-time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="bg-[#C06B3E] hover:bg-[#a8582d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW PRODUCT</span>
                </button>
              </div>

              {/* Filter Controls Row */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs font-medium text-[#1B130E] placeholder-gray-400 outline-none focus:border-[#C06B3E] transition"
                  />
                </div>

                {/* Dropdowns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-gray-200/80 rounded-xl text-xs font-medium text-gray-700 outline-none cursor-pointer focus:border-[#C06B3E]"
                  >
                    <option value="All">All Categories</option>
                    {safeCategories.map((c) => (
                      <option key={c._id || c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-gray-200/80 rounded-xl text-xs font-medium text-gray-700 outline-none cursor-pointer focus:border-[#C06B3E]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Featured">Signature Featured</option>
                    <option value="Eggless">Eggless</option>
                    <option value="Contains Egg">Contains Egg</option>
                  </select>
                </div>
              </div>

              {/* Mobile Product Cards View (< 640px) */}
              <div className="sm:hidden space-y-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id || p.id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3"
                  >
                    {/* Top Row: Image & Info */}
                    <div className="flex items-start gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C06B3E] truncate">
                            {p.categoryName || 'Bake'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleFeat(p)}
                            title={p.isFeatured ? 'Signature Featured' : 'Mark Featured'}
                            className="p-1 -mr-1"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                p.isFeatured
                                  ? 'fill-[#A855F7] text-[#A855F7]'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        </div>
                        <h4 className="font-bold text-[#1B130E] text-sm leading-tight truncate">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {p.price > 0 ? (
                            <span className="font-extrabold text-[#1B130E] text-sm">₹{p.price}</span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEF9EE] text-[#926017] border border-[#F6E3B8]">
                              In Store
                            </span>
                          )}
                          <span className="text-[11px] text-gray-400 font-medium">
                            • {p.weight || '500g / 1kg'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Dietary & Availability */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                      <div>
                        {p.isEggless ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            <div className="w-2 h-2 border border-emerald-600 flex items-center justify-center p-0.5 rounded-[2px]">
                              <div className="w-1 h-1 rounded-full bg-emerald-600" />
                            </div>
                            <span>Eggless</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded bg-gray-50 border border-gray-200">
                            Regular
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleAvail(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                          p.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {p.isAvailable ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>AVAILABLE</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>OUT OF STOCK</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(p)}
                        className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-gray-200/80 transition cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Product</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p)}
                        className="py-2 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-rose-200 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-xs border border-gray-100">
                    No products match your filter criteria.
                  </div>
                )}
              </div>

              {/* Desktop Products Table Card (Hidden on small screens) */}
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/40 text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="px-6 py-4 font-semibold">IMAGE & PRODUCT</th>
                        <th className="px-4 py-4 font-semibold">CATEGORY</th>
                        <th className="px-4 py-4 font-semibold">PRICE</th>
                        <th className="px-4 py-4 font-semibold">DIETARY</th>
                        <th className="px-4 py-4 font-semibold text-center">FEATURED</th>
                        <th className="px-4 py-4 font-semibold">AVAILABILITY</th>
                        <th className="px-6 py-4 font-semibold text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.map((p) => (
                        <tr key={p._id || p.id} className="hover:bg-gray-50/50 transition-colors">
                          {/* Image & Title */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-11 h-11 rounded-lg object-cover bg-gray-100 border border-gray-100 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-[#1B130E] text-xs leading-tight">
                                  {p.name}
                                </h4>
                                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                                  {p.weight || '500g / 1kg'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-4 text-gray-600 font-medium">
                            {p.categoryName}
                          </td>

                          {/* Price Tag */}
                          <td className="px-4 py-4">
                            {p.price > 0 ? (
                              <span className="font-bold text-[#1B130E]">₹{p.price}</span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#FEF9EE] text-[#926017] border border-[#F6E3B8]">
                                In Store
                              </span>
                            )}
                          </td>

                          {/* Dietary Badge */}
                          <td className="px-4 py-4">
                            {p.isEggless ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                                <div className="w-3 h-3 border border-emerald-600 flex items-center justify-center p-0.5 rounded-[2px]">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                </div>
                                <span>Eggless</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded bg-gray-50 border border-gray-200">
                                Regular
                              </span>
                            )}
                          </td>

                          {/* Featured Star Toggle */}
                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleFeat(p)}
                              title={p.isFeatured ? 'Remove featured' : 'Mark as signature featured'}
                              className="p-1 rounded hover:scale-110 transition cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  p.isFeatured
                                    ? 'fill-[#A855F7] text-[#A855F7]'
                                    : 'text-gray-300 hover:text-[#A855F7]'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Availability Pill Toggle */}
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => handleToggleAvail(p)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                                p.isAvailable
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              {p.isAvailable ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>AVAILABLE</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>UNAVAILABLE</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(p)}
                                title="Edit Product"
                                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p)}
                                title="Delete Product"
                                className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-400 text-xs">
                            No products match your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CATEGORY MANAGEMENT (Image 3)                                     */}
          {/* ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#1B130E] tracking-tight">
                    Category Management
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Organize bakery sections, display order, and customer menu filters.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="bg-[#C06B3E] hover:bg-[#a8582d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW CATEGORY</span>
                </button>
              </div>

              {/* Mobile Category Cards View (< 640px) */}
              <div className="sm:hidden space-y-3">
                {safeCategories.map((cat, idx) => (
                  <div
                    key={cat._id || cat.id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image || '/images/products/cakes/chocolate-cake.webp'}
                        alt={cat.name}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-[#1B130E] text-sm leading-tight truncate">
                            {cat.name}
                          </h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {cat.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 font-mono">
                          <span>{getCategoryIconSymbol(cat.slug || cat.name)}</span>
                          <span>/{cat.slug || cat.name?.toLowerCase()}</span>
                        </div>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-gray-600">
                          {cat.productCount || 0} products
                        </span>
                      </div>
                    </div>

                    {cat.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(cat)}
                        className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-gray-200/80 transition cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Category</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="py-2 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-rose-200 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                {safeCategories.length === 0 && (
                  <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-xs border border-gray-100">
                    No categories found.
                  </div>
                )}
              </div>

              {/* Desktop Categories Table Card */}
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[620px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/40 text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="px-6 py-4 font-semibold">CATEGORY</th>
                        <th className="px-4 py-4 font-semibold">ICON & SLUG</th>
                        <th className="px-4 py-4 font-semibold">PRODUCTS</th>
                        <th className="px-4 py-4 font-semibold">DISPLAY ORDER</th>
                        <th className="px-4 py-4 font-semibold">STATUS</th>
                        <th className="px-6 py-4 font-semibold text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {safeCategories.map((cat, idx) => (
                        <tr key={cat._id || cat.id} className="hover:bg-gray-50/50 transition-colors">
                          {/* Category Image & Info */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={cat.image || '/images/products/cakes/chocolate-cake.webp'}
                                alt={cat.name}
                                className="w-11 h-11 rounded-lg object-cover bg-gray-100 border border-gray-100 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-[#1B130E] text-xs leading-tight">
                                  {cat.name}
                                </h4>
                                <p className="text-[11px] text-gray-400 font-medium line-clamp-1 max-w-xs mt-0.5">
                                  {cat.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Icon & Slug */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-gray-500 font-mono text-[11px]">
                              <span className="text-sm">{getCategoryIconSymbol(cat.slug || cat.name)}</span>
                              <span>/{cat.slug || cat.name?.toLowerCase()}</span>
                            </div>
                          </td>

                          {/* Products Count Pill */}
                          <td className="px-4 py-4">
                            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                              {cat.productCount || 0} products
                            </span>
                          </td>

                          {/* Display Order */}
                          <td className="px-4 py-4 font-bold text-gray-700 text-xs">
                            #{cat.displayOrder || idx + 1}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                              {cat.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategory(cat)}
                                title="Edit Category"
                                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                title="Delete Category"
                                className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CUSTOMER INQUIRIES & MESSAGES (Image 4)                           */}
          {/* ========================================================================= */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Bar */}
              <div>
                <h3 className="text-2xl font-bold text-[#1B130E] tracking-tight">
                  Customer Inquiries & Messages
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Review catering inquiries, custom celebration requests, and store feedback.
                </p>
              </div>

              {/* Messages Container */}
              {safeInquiries.length === 0 ? (
                /* Empty state matching Image 4 */
                <div className="bg-white rounded-2xl border border-gray-200/80 p-20 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400 border border-gray-100">
                    <MessageSquare className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <h4 className="text-base font-bold text-[#1B130E]">
                    No Messages Yet
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Customer contact submissions will show up here.
                  </p>
                </div>
              ) : (
                /* Populated list of inquiries */
                <div className="space-y-4">
                  {safeInquiries.map((inq) => (
                    <div
                      key={inq._id || inq.id}
                      className={`bg-white rounded-2xl p-6 border transition-all shadow-sm ${
                        inq.status === 'unread'
                          ? 'border-[#C06B3E]/40 ring-1 ring-[#C06B3E]/20'
                          : 'border-gray-100'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#1B130E] text-[#ECE5D8] flex items-center justify-center font-bold text-xs">
                            {inq.name ? inq.name[0].toUpperCase() : 'U'}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-[#1B130E] flex items-center gap-2">
                              {inq.name}
                              {inq.status === 'unread' && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#C06B3E] text-white">
                                  NEW
                                </span>
                              )}
                            </h4>
                            <span className="text-[11px] text-gray-400">
                              {new Date(inq.createdAt || Date.now()).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Badges & Actions */}
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            {inq.subject || inq.inquiryType || 'General Inquiry'}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleInquiryStatus(inq)}
                            className="px-3 py-1 rounded-full text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                          >
                            {inq.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="pt-4 space-y-3">
                        <p className="text-xs text-[#1B130E]/85 leading-relaxed whitespace-pre-wrap font-medium">
                          {inq.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 pt-2 border-t border-gray-50">
                          {inq.email && (
                            <a
                              href={`mailto:${inq.email}`}
                              className="hover:text-[#C06B3E] transition flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{inq.email}</span>
                            </a>
                          )}
                          {inq.phone && (
                            <a
                              href={`tel:${inq.phone}`}
                              className="hover:text-[#C06B3E] transition flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{inq.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 2.5 MOBILE BOTTOM NAVIGATION BAR                                          */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B130E]/95 backdrop-blur-lg border-t border-[#2C1F17] px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer py-1 px-2.5 rounded-xl ${
            activeTab === 'dashboard' ? 'text-[#C06B3E]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold">Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer py-1 px-2.5 rounded-xl ${
            activeTab === 'products' ? 'text-[#C06B3E]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Cake className="w-5 h-5" />
          <span className="text-[10px] font-bold">Products</span>
        </button>

        {/* Quick Add Product Floating Center Button */}
        <button
          type="button"
          onClick={handleOpenAddProduct}
          className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-[#C06B3E] to-[#d47f50] text-white shadow-lg shadow-[#C06B3E]/40 border-2 border-[#1B130E] active:scale-95 transition cursor-pointer"
          title="Add New Product"
          aria-label="Add New Product"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer py-1 px-2.5 rounded-xl ${
            activeTab === 'categories' ? 'text-[#C06B3E]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FolderTree className="w-5 h-5" />
          <span className="text-[10px] font-bold">Categories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`relative flex flex-col items-center gap-1 transition cursor-pointer py-1 px-2.5 rounded-xl ${
            activeTab === 'messages' ? 'text-[#C06B3E]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-bold">Messages</span>
          {unreadInquiriesCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#C06B3E] ring-2 ring-[#1B130E]" />
          )}
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* 3. MODAL: ADD / EDIT PRODUCT                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 max-w-2xl w-full border border-gray-100 shadow-2xl space-y-5 sm:space-y-6 max-h-[92vh] sm:max-h-[88vh] overflow-y-auto my-0 sm:my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 sm:pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1B130E]">
                    {editingProduct ? 'Edit Bakery Item' : 'Add New Bakery Product'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    Changes will sync immediately to the customer website
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
                {/* Product Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Belgian Chocolate Truffle Cake"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium text-sm sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Category *</label>
                    <select
                      value={productForm.categoryName}
                      onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium cursor-pointer text-sm sm:text-xs"
                    >
                      {safeCategories.map((c) => (
                        <option key={c._id || c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Weight/Portion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1">
                      Price in ₹ (Set 0 for "In Store")
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium text-sm sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Weight / Portion Tag</label>
                    <input
                      type="text"
                      value={productForm.weight}
                      onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                      placeholder="e.g. 500g / 1kg or 1 Pc"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium text-sm sm:text-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-600 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Short description of ingredients, flavor notes and texture..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium resize-none text-sm sm:text-xs"
                  />
                </div>

                {/* Image Selection with Direct Device Upload */}
                <ImageUploader
                  label="Product Photo"
                  value={productForm.image}
                  onChange={(val) => setProductForm({ ...productForm, image: val })}
                  presets={curatedImages}
                />

                {/* Toggles: Dietary & Flags */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isEggless}
                      onChange={(e) => setProductForm({ ...productForm, isEggless: e.target.checked })}
                      className="accent-[#10B981] w-4 h-4"
                    />
                    <span className="text-[11px] text-gray-700">100% Eggless</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isVeg}
                      onChange={(e) => setProductForm({ ...productForm, isVeg: e.target.checked })}
                      className="accent-[#10B981] w-4 h-4"
                    />
                    <span className="text-[11px] text-gray-700">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="accent-[#A855F7] w-4 h-4"
                    />
                    <span className="text-[11px] text-gray-700">Signature Featured</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isAvailable}
                      onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                      className="accent-[#3B82F6] w-4 h-4"
                    />
                    <span className="text-[11px] text-gray-700">Available</span>
                  </label>
                </div>

                {/* Submit buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#C06B3E] hover:bg-[#a8582d] text-white font-bold transition shadow-sm cursor-pointer text-center"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD / EDIT CATEGORY                                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-5 sm:space-y-6 max-h-[90vh] overflow-y-auto my-0 sm:my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 sm:pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1B130E]">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    Will update menu navigation and catalog filters
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-gray-600 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Sourdough Loaves"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium text-sm sm:text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      placeholder="sourdough-loaves"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium text-sm sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Display Order</label>
                    <input
                      type="number"
                      min="1"
                      value={categoryForm.displayOrder}
                      onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium text-sm sm:text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Brief description displayed on category sections..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium resize-none text-sm sm:text-xs"
                  />
                </div>

                {/* Category Cover Photo with Direct Device Upload */}
                <ImageUploader
                  label="Category Cover Photo"
                  value={categoryForm.image}
                  onChange={(val) => setCategoryForm({ ...categoryForm, image: val })}
                  presets={curatedImages}
                />

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                      className="accent-[#10B981] w-4 h-4"
                    />
                    <span className="text-gray-700">Category is Active on Customer Menu</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#C06B3E] hover:bg-[#a8582d] text-white font-bold transition shadow-sm cursor-pointer text-center"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. MODAL: DELETE PRODUCT CONFIRMATION                                     */}
        {/* ========================================================================= */}
        {deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-gray-100 shadow-2xl space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="text-base font-bold text-[#1B130E]">
                  Delete Product?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Are you sure you want to remove <span className="font-bold text-gray-800">"{deletingProduct.name}"</span>? It will be removed immediately from the bakery catalog and live menu.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
