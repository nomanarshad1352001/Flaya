import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, MessageCircle, X } from "lucide-react";
import { InstagramIcon, PinterestIcon, TikTokIcon } from "./icons";
import { CATEGORIES } from "../data/store";
import { REGIONS, cx, whatsappLink, track } from "../lib/shop";
import { useStore } from "../store/StoreContext";

export default function MobileMenu() {
  const { menuOpen, setMenuOpen, region, setRegion, pushToast } = useStore();
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const primary = [
    { label: "Home", href: "#/" },
    { label: "About Us", href: "#/about" },
    { label: "Velvet Abaya", href: "#/shop/all?collection=velvet" },
    { label: "Armani Silk", href: "#/shop/all?collection=armani-silk" },
    { label: "Aura Collection", href: "#/shop/all?collection=aura" },
    { label: "Emirati Satin", href: "#/shop/all?collection=emirati-satin" },
    { label: "Capsule Collection", href: "#/shop/all?collection=the-capsule" },
    { label: "Best Sellers", href: "#/shop/best-sellers" },
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-porcelain fixed inset-y-0 left-0 z-[80] flex w-full max-w-sm flex-col overflow-hidden"
          >
            {/* Head */}
            <div className="border-line flex h-16 shrink-0 items-center justify-between border-b px-5">
              <span className="font-serif text-[22px] font-medium tracking-[0.14em]">FLAYA</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="hover:bg-ivory -mr-2 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable nav */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
              <nav className="space-y-1">
                {primary.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif block py-2.5 text-[26px] font-light leading-tight"
                  >
                    {item.label}
                  </motion.a>
                ))}

                {/* All collections accordion */}
                <div className="pt-1">
                  <button
                    onClick={() => setCollectionsOpen((v) => !v)}
                    className="font-serif flex w-full items-center justify-between py-2.5 text-[26px] font-light leading-tight"
                  >
                    Shop by Category
                    <ChevronDown
                      className={cx("h-5 w-5 transition-transform duration-300", collectionsOpen && "rotate-180")}
                      strokeWidth={1.5}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {collectionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-line mb-2 space-y-1 border-l pl-4">
                          <a href="#/shop/new" onClick={() => setMenuOpen(false)} className="text-smoke block py-2 text-[15px]">
                            New Collection
                          </a>
                          {CATEGORIES.slice(0, 4).map((c) => (
                            <a
                              key={c.id}
                              href={`#/shop/${c.id}`}
                              onClick={() => setMenuOpen(false)}
                              className="text-smoke block py-2 text-[15px]"
                            >
                              {c.name}
                            </a>
                          ))}
                          <a href="#/shop/all" onClick={() => setMenuOpen(false)} className="text-ink block py-2 text-[15px] font-semibold">
                            Shop Everything →
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* Utility pages */}
              <div className="border-line mt-8 border-t pt-6">
                <p className="text-faint mb-3 text-[10px] font-bold tracking-[0.22em] uppercase">Customer care</p>
                <div className="grid grid-cols-2 gap-x-4">
                  <a href="#/delivery" onClick={() => setMenuOpen(false)} className="text-smoke py-2 text-[14px]">Delivery & Exchanges</a>
                  <a href="#/contact" onClick={() => setMenuOpen(false)} className="text-smoke py-2 text-[14px]">Contact</a>
                  <a href="#/about" onClick={() => setMenuOpen(false)} className="text-smoke py-2 text-[14px]">About FLAYA</a>
                  <a href="#/shop/all" onClick={() => setMenuOpen(false)} className="text-smoke py-2 text-[14px]">Shop All</a>
                </div>
                <a
                  href={whatsappLink("Hi FLAYA! I have a question.")}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    track("whatsapp_click", { source: "mobile_menu" });
                    setMenuOpen(false);
                  }}
                  className="bg-moss/10 text-moss mt-4 flex items-center gap-2.5 rounded-sm px-4 py-3 text-[13px] font-semibold"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                  Chat with us on WhatsApp
                </a>
              </div>

              {/* Account */}
              <div className="border-line mt-6 border-t pt-6">
                <p className="text-faint mb-3 text-[10px] font-bold tracking-[0.22em] uppercase">Account</p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      pushToast("Accounts launch with the live store — staging preview only");
                    }}
                    className="border-line hover:border-ink flex-1 border py-3 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      pushToast("Create your FLAYA account at launch — staging preview only");
                    }}
                    className="bg-ink text-porcelain flex-1 py-3 text-[11px] font-bold tracking-[0.16em] uppercase"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* Region */}
              <div className="border-line mt-6 border-t pt-6">
                <p className="text-faint mb-3 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] uppercase">
                  <Globe className="h-3.5 w-3.5" strokeWidth={1.5} /> Ships to · {region.currency}
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {REGIONS.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => setRegion(r.code)}
                      className={cx(
                        "flex items-center justify-between rounded-sm px-3 py-2.5 text-left text-[13px] transition-colors",
                        r.code === region.code ? "bg-ivory font-semibold" : "text-smoke"
                      )}
                    >
                      <span>{r.label}</span>
                      <span className="text-faint text-[11px] font-bold">{r.currency}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer of menu */}
            <div className="border-line flex shrink-0 items-center justify-between border-t px-5 py-4">
              <p className="text-faint text-[11px]">© 2026 FLAYA</p>
              <div className="flex items-center gap-1">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:bg-ivory rounded-full p-2 transition-colors">
                  <InstagramIcon className="h-[17px] w-[17px]" />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest" className="hover:bg-ivory rounded-full p-2 transition-colors">
                  <PinterestIcon className="h-[17px] w-[17px]" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:bg-ivory rounded-full p-2 transition-colors">
                  <TikTokIcon className="h-[17px] w-[17px]" />
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
