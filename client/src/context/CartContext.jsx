import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cozy_crumbs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  // Cart fulfillment & scheduling state (Bernice Bakery feature)
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' or 'pickup'
  const [postalCode, setPostalCode] = useState('');
  const [postalVerified, setPostalVerified] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('11:00 - 13:00');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedStore, setSelectedStore] = useState('Gachibowli TNGOS Colony, Hyderabad');

  useEffect(() => {
    try {
      localStorage.setItem('cozy_crumbs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const openProductModal = (product) => {
    setSelectedProductModal(product);
  };

  const closeProductModal = () => {
    setSelectedProductModal(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        fulfillmentType,
        setFulfillmentType,
        postalCode,
        setPostalCode,
        postalVerified,
        setPostalVerified,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        orderNotes,
        setOrderNotes,
        selectedStore,
        setSelectedStore,
        selectedProductModal,
        openProductModal,
        closeProductModal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context || {
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    cartCount: 0,
    subtotal: 0,
    isCartOpen: false,
    setIsCartOpen: () => {},
    selectedProductModal: null,
    openProductModal: () => {},
    closeProductModal: () => {},
  };
};
