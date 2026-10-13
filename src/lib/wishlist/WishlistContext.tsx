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

export interface WishlistContextType {
  items: Product[];
  totalWishlist: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

const WISHLIST_STORAGE_KEY = "megamart_wishlist_v1";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to read wishlist from localStorage", e);
      } finally {
        setIsHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to write wishlist to localStorage", e);
    }
  }, [items, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          toast({
            title: "Removed from Wishlist",
            description: `${product.name} removed from your wishlist.`,
            variant: "info",
          });
          return prev.filter((item) => item.id !== product.id);
        } else {
          toast({
            title: "Added to Wishlist",
            description: `${product.name} saved to your wishlist.`,
            variant: "success",
          });
          return [...prev, product];
        }
      });
    },
    [toast]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((item) => item.id === productId);
        if (itemToRemove) {
          toast({
            title: "Removed from Wishlist",
            description: `${itemToRemove.name} removed from your wishlist.`,
            variant: "info",
          });
        }
        return prev.filter((item) => item.id !== productId);
      });
    },
    [toast]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch {}
    toast({
      title: "Wishlist Cleared",
      description: "All items removed from your wishlist.",
      variant: "info",
    });
  }, [toast]);

  const totalWishlist = items.length;

  const value = useMemo(
    () => ({
      items,
      totalWishlist,
      isInWishlist,
      toggleWishlist,
      removeItem,
      clearWishlist,
    }),
    [items, totalWishlist, isInWishlist, toggleWishlist, removeItem, clearWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
