import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { StoreProvider, useStore } from "./store/StoreContext";
import { useHashRoute } from "./hooks/useHashRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileMenu from "./components/MobileMenu";
import CartDrawer from "./components/CartDrawer";
import SearchOverlay from "./components/SearchOverlay";
import WhatsAppFab from "./components/WhatsAppFab";
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import DeliveryPage from "./pages/DeliveryPage";
import ContactPage from "./pages/ContactPage";

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("flaya-cookies")) {
        const t = window.setTimeout(() => setVisible(true), 2200);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const answer = (v: "accepted" | "declined") => {
    try {
      localStorage.setItem("flaya-cookies", v);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[96] flex justify-center px-4 pb-4 md:bottom-5 md:justify-start md:pl-5"
        >
          <div className="bg-ink text-porcelain flex w-full max-w-md flex-col gap-3 rounded-md p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-start gap-3">
              <Cookie className="text-dune mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
              <p className="text-[12.5px] leading-relaxed text-porcelain/85">
                FLAYA uses cookies to improve your shopping experience — analytics, preferences and a faster site.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => answer("accepted")}
                className="bg-porcelain text-ink flex-1 py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase"
              >
                Accept
              </button>
              <button
                onClick={() => answer("declined")}
                className="border-porcelain/30 hover:border-porcelain flex-1 border py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[95] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 md:bottom-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="bg-ink text-porcelain pointer-events-auto flex w-full items-center gap-3 px-4 py-3.5 shadow-[0_16px_40px_rgba(28,25,23,0.3)]"
          >
            <p className="flex-1 text-[12.5px] font-medium leading-snug">{t.message}</p>
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                  dismissToast(t.id);
                }}
                className="text-dune shrink-0 text-[11px] font-bold tracking-[0.14em] uppercase"
              >
                {t.action.label}
              </button>
            )}
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-porcelain/60 hover:text-porcelain shrink-0">
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Shell() {
  const route = useHashRoute();
  const { menuOpen, cartOpen, searchOpen } = useStore();

  // Lock body scroll while any overlay is open
  useEffect(() => {
    const locked = menuOpen || cartOpen || searchOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen, searchOpen]);

  const routeKey =
    route.name === "listing"
      ? `listing-${route.category}-${route.collection ?? ""}`
      : route.name === "product"
        ? `product-${route.id}`
        : route.name;

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {route.name === "home" && <HomePage />}
            {route.name === "listing" && <ListingPage category={route.category} collection={route.collection} />}
            {route.name === "product" && <ProductPage id={route.id} />}
            {route.name === "cart" && <CartPage />}
            {route.name === "checkout" && <CheckoutPage />}
            {route.name === "about" && <AboutPage />}
            {route.name === "delivery" && <DeliveryPage />}
            {route.name === "contact" && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />

      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <WhatsAppFab />
      <Toasts />
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
