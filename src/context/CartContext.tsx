import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedPackSize?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedPackSize: string) => void;
  updateQuantity: (productId: string, selectedPackSize: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  getItemQuantity: (productId: string, selectedPackSize?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'graminum_cart_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  const addToCart = (product: Product, selectedPackSize?: string, quantity: number = 1) => {
    const pack = selectedPackSize || product.packSize;

    // Find unit price from packSizeOptions or fallback to base price
    const packOption = product.packSizeOptions?.find((opt) => opt.size === pack);
    const unitPrice = packOption ? packOption.price : product.price;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id && item.selectedPackSize === pack
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        showToast(`Updated "${product.name} (${pack})" quantity in your cart`, 'success');
        return updated;
      } else {
        showToast(`Added "${product.name} (${pack})" to your cart!`, 'success');
        return [
          ...prevItems,
          {
            productId: product.id,
            product,
            selectedPackSize: pack,
            unitPrice,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string, selectedPackSize: string) => {
    setItems((prevItems) => {
      const target = prevItems.find(
        (item) => item.productId === productId && item.selectedPackSize === selectedPackSize
      );
      if (target) {
        showToast(`Removed "${target.product.name}" from your cart`, 'info');
      }
      return prevItems.filter(
        (item) => !(item.productId === productId && item.selectedPackSize === selectedPackSize)
      );
    });
  };

  const updateQuantity = (productId: string, selectedPackSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedPackSize);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId && item.selectedPackSize === selectedPackSize) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string, selectedPackSize?: string): number => {
    if (selectedPackSize) {
      const item = items.find(
        (i) => i.productId === productId && i.selectedPackSize === selectedPackSize
      );
      return item ? item.quantity : 0;
    }
    return items
      .filter((i) => i.productId === productId)
      .reduce((total, i) => total + i.quantity, 0);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  // Free delivery for orders >= ₹499, else ₹50
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 50;

  const discount = 0; // standard promotional calculation

  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
