import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FREE_DELIVERY_THRESHOLD_AED, REGIONS, Region, track } from "../lib/shop";
import { Product, Size, productById } from "../data/store";

export interface CartLine {
  key: string;
  productId: string;
  color: string;
  size: Size;
  qty: number;
}

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

interface StoreState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (p: Product, color: string, size: Size, qty?: number, silent?: boolean) => void;
  updateQty: (key: string, delta: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  region: Region;
  setRegion: (r: RegionCode) => void;
  deliveryProgress: number; // 0..1 vs free-delivery threshold (AE only)
  freeDeliveryUnlocked: boolean;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  toasts: Toast[];
  pushToast: (message: string, action?: Toast["action"]) => void;
  dismissToast: (id: number) => void;
}

type RegionCode = Region["code"];

const StoreContext = createContext<StoreState | null>(null);

let toastId = 0;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [region, setRegionState] = useState<Region>(REGIONS[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [milestoneHit, setMilestoneHit] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" && document.documentElement.dataset.theme === "dark" ? "dark" : "light"
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      if (next === "dark") document.documentElement.dataset.theme = "dark";
      else delete document.documentElement.dataset.theme;
      try {
        localStorage.setItem("flaya-theme", next);
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  const pushToast = useCallback((message: string, action?: Toast["action"]) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, action }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addToCart = useCallback(
    (p: Product, color: string, size: Size, qty = 1, silent = false) => {
      const key = `${p.id}__${color}__${size}`;
      setCart((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
        }
        return [...prev, { key, productId: p.id, color, size, qty }];
      });
      track("add_to_cart", { item_id: p.id, item_name: p.name, colour: color, size, price: p.price, qty });
      if (!silent) {
        pushToast(`Added to bag — ${p.name} · ${color} · ${size}`, {
          label: "View bag",
          onClick: () => setCartOpen(true),
        });
        setCartOpen(true);
      }
    },
    [pushToast]
  );

  const updateQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: Math.max(0, l.qty + delta) } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const setRegion = useCallback((code: RegionCode) => {
    const next = REGIONS.find((r) => r.code === code) || REGIONS[0];
    setRegionState(next);
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const p = productById(l.productId);
        return sum + (p ? p.price * l.qty : 0);
      }, 0),
    [cart]
  );

  const deliveryProgress = Math.min(1, subtotal / FREE_DELIVERY_THRESHOLD_AED);
  const freeDeliveryUnlocked = subtotal >= FREE_DELIVERY_THRESHOLD_AED;

  if (region.freeDeliveryEligible && freeDeliveryUnlocked && !milestoneHit && subtotal > 0) {
    setMilestoneHit(true);
    track("delivery_progress_reached", { threshold: FREE_DELIVERY_THRESHOLD_AED, subtotal });
  }
  if (!freeDeliveryUnlocked && milestoneHit) setMilestoneHit(false);

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);

  const value: StoreState = {
    theme,
    toggleTheme,
    cart,
    cartCount,
    subtotal,
    addToCart,
    updateQty,
    removeLine,
    clearCart,
    wishlist,
    toggleWishlist,
    region,
    setRegion,
    deliveryProgress,
    freeDeliveryUnlocked,
    cartOpen,
    setCartOpen,
    menuOpen,
    setMenuOpen,
    searchOpen,
    setSearchOpen,
    toasts,
    pushToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
