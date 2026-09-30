import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShieldCheck, Truck, X } from "lucide-react";
import { productById } from "../data/store";
import { FREE_DELIVERY_THRESHOLD_AED, formatMoney, track } from "../lib/shop";
import { useStore } from "../store/StoreContext";

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQty,
    removeLine,
    subtotal,
    region,
    deliveryProgress,
    freeDeliveryUnlocked,
  } = useStore();

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD_AED - subtotal);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="bg-porcelain fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col shadow-2xl"
            aria-label="Shopping bag"
          >
            {/* Head */}
            <div className="border-line flex h-16 shrink-0 items-center justify-between border-b px-5">
              <p className="font-serif text-xl font-medium">
                Your Bag{" "}
                <span className="text-faint text-sm font-normal">
                  {cart.length === 0 ? "" : `(${cart.reduce((n, l) => n + l.qty, 0)})`}
                </span>
              </p>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
                className="hover:bg-ivory -mr-2 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Free-delivery progress — UAE only, per approved geographic rule */}
            {region.freeDeliveryEligible && cart.length > 0 && (
              <div className="border-line shrink-0 border-b px-5 py-4">
                <div className="flex items-center gap-2.5">
                  {freeDeliveryUnlocked ? (
                    <span className="bg-moss text-porcelain flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  ) : (
                    <Truck className="text-taupe h-5 w-5 shrink-0" strokeWidth={1.5} />
                  )}
                  <p className="text-[12.5px] font-semibold leading-snug">
                    {freeDeliveryUnlocked ? (
                      <span className="text-moss">You’ve unlocked free delivery in Dubai & the UAE</span>
                    ) : (
                      <>
                        Add <span className="text-clay">{formatMoney(remaining, region)}</span> more to unlock free
                        UAE delivery
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-line mt-3 h-1 overflow-hidden rounded-full">
                  <motion.div
                    className={freeDeliveryUnlocked ? "bg-moss h-full rounded-full" : "bg-taupe h-full rounded-full"}
                    initial={false}
                    animate={{ width: `${deliveryProgress * 100}%` }}
                    transition={{ type: "spring", damping: 26, stiffness: 220 }}
                  />
                </div>
              </div>
            )}

            {/* Neutral note for international customers — free shipping never implied */}
            {!region.freeDeliveryEligible && cart.length > 0 && (
              <div className="border-line shrink-0 border-b px-5 py-3.5">
                <p className="text-smoke text-[12px] leading-relaxed">
                  Shipping to <span className="font-semibold text-ink">{region.label}</span> is calculated at
                  checkout based on destination and parcel weight.
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="bg-ivory flex h-16 w-16 items-center justify-center rounded-full">
                    <Truck className="text-faint h-6 w-6" strokeWidth={1.2} />
                  </span>
                  <p className="font-serif mt-5 text-2xl font-light">Your bag is empty</p>
                  <p className="text-faint mt-2 max-w-[240px] text-sm leading-relaxed">
                    Discover the capsule — pieces designed to work together.
                  </p>
                  <a
                    href="#/shop/new"
                    onClick={() => setCartOpen(false)}
                    className="bg-ink text-porcelain mt-6 px-8 py-3.5 text-[11px] font-bold tracking-[0.18em] uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Shop New Collection
                  </a>
                </div>
              ) : (
                <ul className="divide-line divide-y">
                  <AnimatePresence initial={false}>
                    {cart.map((line) => {
                      const p = productById(line.productId);
                      if (!p) return null;
                      const variant = p.colors.find((c) => c.name === line.color) || p.colors[0];
                      return (
                        <motion.li
                          key={line.key}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-4 py-4"
                        >
                          <a
                            href={`#/product/${p.id}`}
                            onClick={() => setCartOpen(false)}
                            className="bg-ivory block h-28 w-20 shrink-0 overflow-hidden"
                          >
                            <img
                              src={variant.images[0]}
                              alt={p.name}
                              width={80}
                              height={112}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </a>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <a
                                href={`#/product/${p.id}`}
                                onClick={() => setCartOpen(false)}
                                className="font-serif text-[16px] font-medium leading-snug"
                              >
                                {p.name}
                              </a>
                              <button
                                onClick={() => removeLine(line.key)}
                                aria-label="Remove item"
                                className="text-faint hover:text-ink rounded-full p-1 transition-colors"
                              >
                                <X className="h-4 w-4" strokeWidth={1.5} />
                              </button>
                            </div>
                            <p className="text-faint mt-0.5 flex items-center gap-1.5 text-[12px]">
                              <span
                                className="border-line inline-block h-3 w-3 rounded-full border"
                                style={{ backgroundColor: variant.hex }}
                              />
                              {line.color} · Size {line.size}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="border-line flex items-center border">
                                <button
                                  onClick={() => updateQty(line.key, -1)}
                                  aria-label="Decrease quantity"
                                  className="hover:bg-ivory p-1.5 transition-colors"
                                >
                                  <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                                </button>
                                <span className="min-w-8 text-center text-[13px] font-semibold">{line.qty}</span>
                                <button
                                  onClick={() => updateQty(line.key, 1)}
                                  aria-label="Increase quantity"
                                  className="hover:bg-ivory p-1.5 transition-colors"
                                >
                                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                                </button>
                              </div>
                              <p className="text-[14px] font-semibold">{formatMoney(p.price * line.qty, region)}</p>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && (
              <div className="border-line shrink-0 border-t px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-smoke">Subtotal</span>
                  <span className="text-[16px] font-bold">{formatMoney(subtotal, region)}</span>
                </div>
                <div className="text-faint mt-1 flex items-center justify-between text-[12px]">
                  <span>Delivery</span>
                  <span>
                    {region.freeDeliveryEligible
                      ? freeDeliveryUnlocked
                        ? "Free (UAE)"
                        : "Calculated at checkout"
                      : "Calculated at checkout"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    track("begin_checkout", { subtotal, currency: region.currency });
                    window.location.hash = "/cart";
                    setCartOpen(false);
                  }}
                  className="bg-ink text-porcelain mt-4 flex w-full items-center justify-center gap-2 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Review bag & checkout <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <p className="text-faint mt-3 flex items-center justify-center gap-1.5 text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Secure checkout · Exchange available per policy
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
