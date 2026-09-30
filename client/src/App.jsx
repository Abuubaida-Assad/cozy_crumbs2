import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BakeryProvider } from './context/BakeryContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';

import Header from './components/Header';
import Footer from './components/Footer';
import MobileDrawer from './components/MobileDrawer';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import FloatingCartBar from './components/FloatingCartBar';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CartToast from './components/CartToast';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, token, user } = useAuth();
  if (
    !isAuthenticated ||
    !token ||
    !user ||
    user.role !== 'admin' ||
    user.email?.toLowerCase() !== 'cozycrumbs6767@gmail.com'
  ) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F2] text-[#112229]">
      <ScrollToTop />

      {/* Header matching Photo 5 */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar />

      {/* Cart Toast Notification */}
      <CartToast />

      {/* Product Modal */}
      <ProductModal />

      {/* Main Pages */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer matching Photo 2 */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BakeryProvider>
          <CartProvider>
            <SearchProvider>
              <MainLayout />
            </SearchProvider>
          </CartProvider>
        </BakeryProvider>
      </AuthProvider>
    </Router>
  );
}
