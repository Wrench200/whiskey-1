'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WhiskeyProduct } from '@/types/product';

export interface CartItem extends WhiskeyProduct {
  quantity: number;
  selectedOptions?: {
    giftWrapping?: boolean;
    giftMessage?: boolean;
    engraving?: boolean;
    insurance?: boolean;
    expressShipping?: boolean;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: WhiskeyProduct, quantity?: number, options?: CartItem['selectedOptions']) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('whiskey-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('whiskey-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: WhiskeyProduct, quantity: number = 1, options?: CartItem['selectedOptions']) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedOptions: options || item.selectedOptions }
            : item
        );
      }
      
      return [...prev, { ...product, quantity, selectedOptions: options }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      const optionsPrice = item.selectedOptions
        ? (item.selectedOptions.giftWrapping ? 5.99 : 0) +
          (item.selectedOptions.engraving ? 15.99 : 0) +
          (item.selectedOptions.insurance ? 2.99 : 0) +
          (item.selectedOptions.expressShipping ? 9.99 : 0)
        : 0;
      return total + (price + optionsPrice) * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

