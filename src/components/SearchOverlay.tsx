import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { PRODUCTS } from "../data/store";
import { formatMoney } from "../lib/shop";
import { useStore } from "../store/StoreContext";

const POPULAR = ["Abaya", "Capsule", "Trench", "Maxi dress", "Noir"];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen, region } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      window.setTimeout(() => inputRef.current?.focus(), 220);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="bg-porcelain/97 fixed inset-0 z-[90] flex flex-col backdrop-blur-xl"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-10 pt-6 md:pt-14">
            <div className="flex items-center justify-between">
              <p className="text-faint text-[10px] font-bold tracking-[0.26em] uppercase">Search FLAYA</p>
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="hover:bg-ivory -mr-2 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="border-ink mt-6 flex items-center gap-3 border-b-2 pb-3">
              <Search className="text-faint h-6 w-6 shrink-0" strokeWidth={1.5} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Abayas, dresses, colours…"
                className="font-serif w-full bg-transparent text-2xl font-light outline-none placeholder:text-faint md:text-4xl"
              />
            </div>

            {query.trim().length < 2 ? (
              <div className="mt-8">
                <p className="text-faint mb-3 text-[10px] font-bold tracking-[0.22em] uppercase">Popular right now</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="border-line hover:border-ink rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 flex-1 overflow-y-auto overscroll-contain">
                {results.length === 0 ? (
                  <p className="text-smoke font-serif text-xl font-light">
                    Nothing found for “{query}”.
                    <span className="text-faint mt-1 block text-sm">Try “abaya”, “capsule” or a colour like “camel”.</span>
                  </p>
                ) : (
                  <>
                    <p className="text-faint mb-4 text-[10px] font-bold tracking-[0.22em] uppercase">
                      {results.length} result{results.length > 1 ? "s" : ""}
                    </p>
                    <div className="divide-line divide-y">
                      {results.map((p) => (
                        <a
                          key={p.id}
                          href={`#/product/${p.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex items-center gap-4 py-3.5"
                        >
                          <div className="bg-ivory h-20 w-16 shrink-0 overflow-hidden">
                            <img
                              src={p.colors[0].images[0]}
                              alt={p.name}
                              width={64}
                              height={80}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-serif truncate text-lg font-medium">{p.name}</p>
                            <p className="text-faint text-xs capitalize">{p.category} · {p.colors.length} colours</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold">{formatMoney(p.price, region)}</span>
                            <ArrowRight className="text-faint h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
