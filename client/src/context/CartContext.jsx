import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const getProductId = (product) => {
  if (!product) return '';
  return product._id || product.id || product.slug || '';
};

export const getProductPrice = (product) => {
  if (!product) return 0;
  const num = Number(product.price);
  return isNaN(num) ? 0 : num;
};

export const generateWhatsAppOrderMessage = ({
  cart,
  orderType = 'delivery',
  customerDetails = {},
  subtotal = 0,
  deliveryCharge = 0,
  total = 0,
}) => {
  const itemsText = cart
    .map((item) => {
      const name = item.product?.name || 'Artisanal Bake';
      const qty = item.quantity;
      const unitPrice = getProductPrice(item.product);
      const itemSubtotal = Math.round(unitPrice * qty);
      return `${name}\nQuantity: ${qty}\nUnit Price: ₹${unitPrice}\nSubtotal: ₹${itemSubtotal}`;
    })
    .join('\n\n');

  const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const deliveryChargeText =
    orderType === 'pickup'
      ? 'Free (Store Pickup)'
      : deliveryCharge === 0
      ? 'Free'
      : `₹${deliveryCharge}`;

  const addressText =
    orderType === 'pickup'
      ? 'Store Pickup: Cozy Crumbs Bakery, Gachibowli, Hyderabad'
      : customerDetails.address?.trim() || 'N/A';

  let message = `Hello Cozy Crumbs! I would like to place an order.

CUSTOMER DETAILS
Name: ${customerDetails.name?.trim() || ''}
Phone: ${customerDetails.phone?.trim() || ''}
Order Type: ${orderType === 'pickup' ? 'Pickup' : 'Delivery'}
Address: ${addressText}`;

  if (customerDetails.date) {
    message += `\nPreferred Date: ${customerDetails.date}`;
  }
  if (customerDetails.timeSlot) {
    message += `\nPreferred Time: ${customerDetails.timeSlot}`;
  }

  message += `\n\nORDER DETAILS\n${itemsText}

ORDER SUMMARY
Total Items: ${totalItems}
Subtotal: ₹${subtotal}
Delivery Charge: ${deliveryChargeText}
TOTAL: ₹${total}`;

  if (customerDetails.instructions && customerDetails.instructions.trim()) {
    message += `\nSpecial Instructions: ${customerDetails.instructions.trim()}`;
  }

  message += `\n\nPlease confirm the availability and order details. Thank you!`;

  return message;
};

export const CartProvider = ({ children }) => {
  // 1. Cart Persistence via localStorage (safe parsing)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cozy_crumbs_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Validate schema: must be array with valid quantity >= 1
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item && item.product && (item.product.id || item.product._id))
          .map((item) => ({
            product: item.product,
            quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
          }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  // 2. Order Type: 'delivery' or 'pickup'
  const [orderType, setOrderType] = useState(() => {
    try {
      const saved = localStorage.getItem('cozy_crumbs_order_type');
      return saved === 'pickup' ? 'pickup' : 'delivery';
    } catch {
      return 'delivery';
    }
  });

  // 3. Customer Details State
  const defaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    date: defaultDate(),
    timeSlot: 'Evening (03:00 PM – 07:00 PM)',
    instructions: '',
  });

  // 4. Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    message: '',
    productName: '',
  });

  const showToast = (message, productName = '') => {
    setToast({ show: true, message, productName });
    setTimeout(() => {
      setToast({ show: false, message: '', productName: '' });
    }, 3200);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cozy_crumbs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync order type
  useEffect(() => {
    try {
      localStorage.setItem('cozy_crumbs_order_type', orderType);
    } catch (e) {
      console.error('Failed to save order type', e);
    }
  }, [orderType]);

  const updateCustomerDetails = (field, value) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addToCart = (product, quantity = 1, openDrawer = false) => {
    if (!product) return;
    if (product.isAvailable === false) {
      showToast(`${product.name} is currently out of stock`);
      return;
    }

    const targetId = getProductId(product);
    if (!targetId) return;

    const safeQty = Math.max(1, parseInt(quantity, 10) || 1);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => getProductId(item.product) === targetId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + safeQty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }
      return [...prev, { product, quantity: safeQty }];
    });

    showToast(`Added ${safeQty}x ${product.name} to cart`, product.name);

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => getProductId(item.product) !== productId));
  };

  const updateQuantity = (productId, qty) => {
    const num = parseInt(qty, 10);
    if (isNaN(num) || num <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        getProductId(item.product) === productId ? { ...item, quantity: num } : item
      )
    );
  };

  const getItemQuantity = (productId) => {
    if (!productId) return 0;
    const item = cart.find((i) => getProductId(i.product) === productId);
    return item ? Number(item.quantity) || 0 : 0;
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + (Number(item.quantity) || 0), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = getProductPrice(item.product);
      const qty = Number(item.quantity) || 0;
      return sum + Math.round(price * qty);
    }, 0);
  }, [cart]);

  // Delivery charge rule:
  // Pickup: ₹0
  // Delivery: Free above ₹500, ₹50 for orders below ₹500
  const deliveryCharge = useMemo(() => {
    if (orderType === 'pickup') return 0;
    if (cart.length === 0) return 0;
    return subtotal >= 500 ? 0 : 50;
  }, [orderType, subtotal, cart.length]);

  const total = subtotal + deliveryCharge;

  const openProductModal = (product) => {
    setSelectedProductModal(product);
  };

  const closeProductModal = () => {
    setSelectedProductModal(null);
  };

  // WhatsApp Configuration:
  // Reuses bakery's official number from environment variable or configured default
  const BAKERY_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917093322796';

  const getWhatsAppOrderUrl = () => {
    const message = generateWhatsAppOrderMessage({
      cart,
      orderType,
      customerDetails,
      subtotal,
      deliveryCharge,
      total,
    });
    return `https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryCharge,
        total,
        isCartOpen,
        setIsCartOpen,
        orderType,
        setOrderType,
        customerDetails,
        updateCustomerDetails,
        setCustomerDetails,
        selectedProductModal,
        openProductModal,
        closeProductModal,
        toast,
        showToast,
        whatsappNumber: BAKERY_WHATSAPP_NUMBER,
        generateWhatsAppOrderMessage: () =>
          generateWhatsAppOrderMessage({
            cart,
            orderType,
            customerDetails,
            subtotal,
            deliveryCharge,
            total,
          }),
        getWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return (
    context || {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      getItemQuantity: () => 0,
      clearCart: () => {},
      cartCount: 0,
      subtotal: 0,
      deliveryCharge: 0,
      total: 0,
      isCartOpen: false,
      setIsCartOpen: () => {},
      orderType: 'delivery',
      setOrderType: () => {},
      customerDetails: {
        name: '',
        phone: '',
        address: '',
        date: '',
        timeSlot: '',
        instructions: '',
      },
      updateCustomerDetails: () => {},
      setCustomerDetails: () => {},
      selectedProductModal: null,
      openProductModal: () => {},
      closeProductModal: () => {},
      toast: { show: false, message: '', productName: '' },
      showToast: () => {},
      whatsappNumber: '917093322796',
      generateWhatsAppOrderMessage: () => '',
      getWhatsAppOrderUrl: () => '',
    }
  );
};
