"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Product } from "@/types/products.types";
import { useToast } from "@/components/ui/Toast";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isItemInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CART_STORAGE_KEY = "megamart_cart_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to read cart from localStorage", e);
      } finally {
        setIsHydrated(true);
      }
    });
  }, []);

  // Save to localStorage when items change (after initial hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to write cart to localStorage", e);
    }
  }, [items, isHydrated]);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        const maxStock = product.stock > 0 ? product.stock : 99;

        if (existingIndex > -1) {
          const next = [...prev];
          const newQty = Math.min(next[existingIndex].quantity + quantity, maxStock);
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: newQty,
          };
          return next;
        } else {
          const safeQty = Math.min(Math.max(1, quantity), maxStock);
          return [...prev, { product, quantity: safeQty }];
        }
      });

      toast({
        title: "Added to Cart",
        description: `${product.name} (${quantity > 1 ? `${quantity} items` : "1 item"}) added to your cart.`,
        variant: "success",
      });
    },
    [toast]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((item) => item.product.id === productId);
        if (itemToRemove) {
          toast({
            title: "Removed from Cart",
            description: `${itemToRemove.product.name} removed from your cart.`,
            variant: "info",
          });
        }
        return prev.filter((item) => item.product.id !== productId);
      });
    },
    [toast]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock > 0 ? item.product.stock : 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "info",
    });
  }, [toast]);

  const isItemInCart = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      const match = items.find((item) => item.product.id === productId);
      return match ? match.quantity : 0;
    },
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isItemInCart,
      getItemQuantity,
    }),
    [
      items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isItemInCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
