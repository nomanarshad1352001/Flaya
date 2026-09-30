import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Minus, Plus, RefreshCw, ShieldCheck, Trash2, Truck } from "lucide-react";
import { PRODUCTS, productById } from "../data/store";
import { FREE_DELIVERY_THRESHOLD_AED, cx, formatMoney, track } from "../lib/shop";
import { useStore } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";
import { PaymentRow } from "../components/payments";

export default function CartPage() {
  const {
    cart,
    updateQty,
    removeLine,
    subtotal,
    region,
    deliveryProgress,
    freeDeliveryUnlocked,
    pushToast,
  } = useStore();
  useEffect(() => {
    track("view_cart", { items: cart.length, subtotal });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD_AED - subtotal);
  const deliveryFeeAed = region.freeDeliveryEligible ? (freeDeliveryUnlocked ? 0 : 25) : null;

  const upsell = PRODUCTS.filter((p) => !cart.some((l) => l.productId === p.id))
    .filter((p) => p.badge === "bestseller")
    .slice(0, 4);

  const checkout = () => {
    track("begin_checkout", { subtotal, currency: region.currency });
    window.location.hash = "/checkout";
  };

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <span className="bg-ivory flex h-16 w-16 items-center justify-center rounded-full">
          <Truck className="text-faint h-6 w-6" strokeWidth={1.2} />
        </span>
        <h1 className="font-serif mt-6 text-4xl font-light">Your bag is empty</h1>
        <p className="text-faint mt-3 text-sm leading-relaxed">
          Start with the capsule — one base, a few overlays, a week of looks.
        </p>
        <a
          href="#/shop/new"
          className="bg-ink text-porcelain mt-8 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase"
        >
          Shop New Collection
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-8 md:px-8">
      <header className="pb-6 pt-8 md:pt-10">
        <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">Review your order</p>
        <h1 className="font-serif mt-2 text-[34px] font-light md:text-5xl">Your Bag</h1>
      </header>

      {/* Free delivery progress — UAE only */}
      {region.freeDeliveryEligible ? (
        <div className="border-line bg-ivory/60 mb-8 border p-4 md:p-5">
          <div className="flex items-center gap-2.5">
            {freeDeliveryUnlocked ? (
              <span className="bg-moss text-porcelain flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            ) : (
              <Truck className="text-taupe h-5 w-5 shrink-0" strokeWidth={1.5} />
            )}
            <p className="text-[13px] font-semibold">
              {freeDeliveryUnlocked ? (
                <span className="text-moss">You’ve unlocked free delivery — Dubai & UAE</span>
              ) : (
                <>
                  Add <span className="text-clay">{formatMoney(remaining, region)}</span> more to unlock free
                  delivery in Dubai & the UAE
                </>
              )}
            </p>
          </div>
          <div className="bg-line mt-3 h-1.5 overflow-hidden rounded-full">
            <motion.div
              className={cx("h-full rounded-full", freeDeliveryUnlocked ? "bg-moss" : "bg-taupe")}
              initial={false}
              animate={{ width: `${deliveryProgress * 100}%` }}
              transition={{ type: "spring", damping: 26, stiffness: 200 }}
            />
          </div>
        </div>
      ) : (
        <div className="border-line bg-ivory/60 mb-8 border p-4 md:p-5">
          <p className="text-smoke text-[13px] leading-relaxed">
            Shipping to <span className="text-ink font-semibold">{region.label}</span> is calculated at checkout by
            destination and parcel weight. Orders containing several heavy capsule pieces may carry a small
            additional charge, always confirmed before payment.
          </p>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Lines */}
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="flex gap-4 py-5 md:gap-6"
                >
                  <a href={`#/product/${p.id}`} className="bg-ivory block h-36 w-28 shrink-0 overflow-hidden md:h-44 md:w-36">
                    <img
                      src={variant.images[0]}
                      alt={p.name}
                      width={144}
                      height={192}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </a>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <a href={`#/product/${p.id}`} className="font-serif text-[19px] font-medium leading-tight md:text-[21px]">
                          {p.name}
                        </a>
                        <p className="text-faint mt-1.5 flex items-center gap-2 text-[12.5px]">
                          <span className="border-line inline-block h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: variant.hex }} />
                          {line.color} · Size {line.size}
                        </p>
                        <button
                          onClick={() => {
                            removeLine(line.key);
                            pushToast("Removed — you can exchange sizes anytime within 14 days.");
                          }}
                          className="text-faint hover:text-clay mt-2 flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} /> Remove
                        </button>
                      </div>
                      <p className="whitespace-nowrap pt-1 text-[15px] font-semibold md:text-[16px]">
                        {formatMoney(p.price * line.qty, region)}
                      </p>
                    </div>
                    <div className="mt-auto pt-3">
                      <div className="border-line inline-flex items-center border">
                        <button onClick={() => updateQty(line.key, -1)} aria-label="Decrease" className="hover:bg-ivory p-2.5 transition-colors">
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.6} />
                        </button>
                        <span className="min-w-10 text-center text-[13.5px] font-semibold">{line.qty}</span>
                        <button onClick={() => updateQty(line.key, 1)} aria-label="Increase" className="hover:bg-ivory p-2.5 transition-colors">
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-line border p-5 md:p-6">
            <p className="font-serif text-xl font-medium">Order summary</p>
            <dl className="mt-5 space-y-2.5 text-[13.5px]">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd className="font-semibold">{formatMoney(subtotal, region)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-smoke">Delivery</dt>
                <dd className="font-semibold">
                  {deliveryFeeAed === null
                    ? "At checkout"
                    : deliveryFeeAed === 0
                      ? <span className="text-moss">Free</span>
                      : formatMoney(deliveryFeeAed, region)}
                </dd>
              </div>
              {region.code !== "AE" && (
                <p className="text-faint text-[11.5px] leading-relaxed">
                  International rates are weight-based and confirmed before payment.
                </p>
              )}
              <div className="border-line flex justify-between border-t pt-3 text-[15px]">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold">{formatMoney(subtotal + (deliveryFeeAed ?? 0), region)}</dd>
              </div>
            </dl>

            <button
              onClick={checkout}
              className="bg-ink text-porcelain mt-6 flex w-full items-center justify-center gap-2 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:opacity-90 active:scale-[0.99]"
            >
              <Lock className="h-3.5 w-3.5" strokeWidth={2} /> Secure checkout
            </button>
            <PaymentRow className="mt-3 justify-center [&_svg]:h-5 [&_svg]:w-8" />

            <div className="border-line mt-5 space-y-2.5 border-t pt-5 text-[12px]">
              <p className="text-smoke flex items-center gap-2.5">
                <ShieldCheck className="text-taupe h-4 w-4 shrink-0" strokeWidth={1.6} /> Secure payment — cards & Apple Pay
              </p>
              <p className="text-smoke flex items-center gap-2.5">
                <RefreshCw className="text-taupe h-4 w-4 shrink-0" strokeWidth={1.6} /> 14-day exchange policy — no cash refunds
              </p>
              <p className="text-smoke flex items-center gap-2.5">
                <Truck className="text-taupe h-4 w-4 shrink-0" strokeWidth={1.6} /> 1–3 day delivery in the UAE
              </p>
            </div>
          </div>

          <a href="#/shop/all" className="link-underline mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold">
            ← Continue shopping
          </a>
        </aside>
      </div>

      {/* Upsell */}
      {upsell.length > 0 && (
        <section className="mt-20">
          <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">Complete your capsule</p>
          <h2 className="font-serif mt-2 text-[26px] font-light md:text-3xl">Before you check out</h2>
          <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
            {upsell.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
