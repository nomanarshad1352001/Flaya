import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, Heart, Menu, Moon, Search, ShoppingBag, Sun } from "lucide-react";
import { COLLECTIONS } from "../data/store";
import { REGIONS, cx } from "../lib/shop";
import { useStore } from "../store/StoreContext";

const ANNOUNCEMENTS = [
  "Free delivery across Dubai & the UAE on orders over AED 500",
  "Worldwide shipping — calculated at checkout",
  "New in: The Capsule Wardrobe — SS26",
  "14-day size & colour exchanges",
  "100+ styles · designed & handcrafted in Dubai",
];

const NAV = [
  { label: "New Collection", href: "#/shop/new" },
  { label: "Best Sellers", href: "#/shop/best-sellers" },
  { label: "Abayas", href: "#/shop/abayas" },
  { label: "Dresses", href: "#/shop/dresses" },
];

export default function Header() {
  const { cartCount, wishlist, setCartOpen, setMenuOpen, setSearchOpen, region, setRegion, theme, toggleTheme } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <>
      {/* Announcement marquee — always in motion */}
      <div className="bg-ink text-porcelain relative z-[60] h-9 overflow-hidden md:h-10">
        <div className="marquee-track h-full items-center" style={{ ["--marquee-dur" as string]: "30s" }}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex h-full shrink-0 items-center">
              {ANNOUNCEMENTS.map((a) => (
                <span
                  key={`${dup}-${a}`}
                  className="flex h-full shrink-0 items-center px-8 text-[10px] font-semibold tracking-[0.18em] uppercase md:text-[11px]"
                >
                  {a}
                  <span className="text-dune ml-8 text-[9px]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky header */}
      <header
        className={cx(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-porcelain/90 border-line border-b shadow-[0_1px_24px_rgba(28,25,23,0.06)] backdrop-blur-xl"
            : "bg-porcelain border-transparent border-b"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 md:h-[72px] md:px-8">
          {/* Left: menu + logo (logo on the left per approved spec) */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="hover:bg-ivory -ml-2 rounded-full p-2 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="w-10 lg:hidden" aria-hidden="true" />

          <a
            href="#/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:flex-1"
            aria-label="FLAYA home"
          >
            <span className="font-serif block text-center text-[27px] leading-none font-medium tracking-[0.16em] md:text-[30px] lg:text-left">
              FLAYA
            </span>
          </a>

          {/* Desktop navigation */}
          <nav className="mx-auto hidden items-center gap-7 lg:flex xl:gap-9">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="link-underline text-[12px] font-semibold tracking-[0.14em] uppercase"
              >
                {item.label}
              </a>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button
                className={cx(
                  "flex items-center gap-1 text-[12px] font-semibold tracking-[0.14em] uppercase",
                  collectionsOpen && "text-taupe"
                )}
                onClick={() => setCollectionsOpen((v) => !v)}
              >
                Collections
                <ChevronDown
                  className={cx("h-3.5 w-3.5 transition-transform duration-300", collectionsOpen && "rotate-180")}
                  strokeWidth={1.5}
                />
              </button>
              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-porcelain border-line absolute left-1/2 top-full z-50 w-[300px] -translate-x-1/2 border p-2 pt-3 shadow-[0_24px_60px_rgba(28,25,23,0.12)]"
                  >
                    {COLLECTIONS.map((c) => (
                      <a
                        key={c.id}
                        href={`#/shop/all?collection=${c.id}`}
                        onClick={() => setCollectionsOpen(false)}
                        className="hover:bg-ivory group/item block rounded-sm px-4 py-3 transition-colors"
                      >
                        <span className="font-serif text-[17px] font-medium">{c.name}</span>
                        <span className="text-faint line-clamp-1 block text-[11px] mt-0.5">{c.desc}</span>
                      </a>
                    ))}
                    <a
                      href="#/shop/all"
                      onClick={() => setCollectionsOpen(false)}
                      className="border-line text-ink mt-1 block border-t px-4 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase"
                    >
                      Shop everything →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-0.5 md:gap-1">
            {/* Region selector (desktop) */}
            <div className="relative mr-1 hidden md:block" ref={regionRef}>
              <button
                onClick={() => setRegionOpen((v) => !v)}
                className="hover:bg-ivory flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[11px] font-semibold tracking-wide transition-colors"
                aria-label="Select country and currency"
              >
                <Globe className="h-4 w-4" strokeWidth={1.5} />
                <span>{region.code} · {region.currency}</span>
              </button>
              <AnimatePresence>
                {regionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22 }}
                    className="bg-porcelain border-line absolute right-0 top-full z-50 mt-1 w-64 border p-1.5 shadow-[0_24px_60px_rgba(28,25,23,0.12)]"
                  >
                    <p className="text-faint px-3 pb-1 pt-2 text-[10px] font-semibold tracking-[0.18em] uppercase">
                      Ships to · Currency
                    </p>
                    {REGIONS.map((r) => (
                      <button
                        key={r.code}
                        onClick={() => {
                          setRegion(r.code);
                          setRegionOpen(false);
                        }}
                        className={cx(
                          "hover:bg-ivory flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-[13px] transition-colors",
                          r.code === region.code && "bg-ivory font-semibold"
                        )}
                      >
                        <span>{r.label}</span>
                        <span className="text-faint text-[11px] font-semibold">{r.currency}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="hover:bg-ivory rounded-full p-2 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" strokeWidth={1.5} /> : <Moon className="h-5 w-5" strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hover:bg-ivory rounded-full p-2 transition-colors"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <a
              href="#/shop/all"
              aria-label="Wishlist"
              className="hover:bg-ivory relative hidden rounded-full p-2 transition-colors sm:block"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="bg-taupe text-porcelain absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold">
                  {wishlist.length}
                </span>
              )}
            </a>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open bag"
              className="hover:bg-ivory relative rounded-full p-2 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    className="bg-ink text-porcelain absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
