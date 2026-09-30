import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  Plus,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { PRODUCTS, Product, Size, ALL_SIZES, productById } from "../data/store";
import { FIXED_LIGHT, cx, formatMoney, track, whatsappLink } from "../lib/shop";
import { useStore } from "../store/StoreContext";
import SizeGuide from "../components/SizeGuide";
import ProductRail from "../components/ProductRail";
import { WhatsAppIcon } from "../components/icons";
import { REVIEWS } from "../data/store";

/* -------- small accordion -------- */
function Accordion({ title, children, defaultOpen = false, onOpen }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-line border-b">
      <button
        onClick={() => {
          if (!open && onOpen) onOpen();
          setOpen((v) => !v);
        }}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-[12px] font-bold tracking-[0.16em] uppercase">{title}</span>
        <ChevronDown className={cx("text-faint h-4 w-4 transition-transform duration-300", open && "rotate-180")} strokeWidth={1.5} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="text-smoke pb-5 text-[13.5px] leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage({ id }: { id: string }) {
  const product = productById(id);
  const { region, addToCart, pushToast, wishlist, toggleWishlist } = useStore();

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizePulse, setSizePulse] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [nowTs, setNowTs] = useState(() => Date.now());

  const atcRef = useRef<HTMLButtonElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Live countdown to the 8:00 PM GST next-day cut-off
  useEffect(() => {
    const t = window.setInterval(() => setNowTs(Date.now()), 30000);
    return () => window.clearInterval(t);
  }, []);

  // Reset when product changes
  useEffect(() => {
    setColorIdx(0);
    setSize(null);
    setGalleryIdx(0);
    setShowSticky(false);
    if (product) track("view_item", { item_id: product.id, item_name: product.name, price: product.price });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sticky ATC visibility
  useEffect(() => {
    const el = atcRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [id]);

  if (!product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-4xl font-light">This piece has moved on</p>
        <p className="text-faint mt-3 text-sm">The product you’re looking for isn’t available anymore.</p>
        <a href="#/shop/new" className="bg-ink text-porcelain mt-8 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase">
          Shop New Collection
        </a>
      </main>
    );
  }

  const color = product.colors[colorIdx];
  const gallery = color.images;
  const liked = wishlist.includes(product.id);
  const isOneSize = color.sizes.length === 1 && color.sizes[0] === "OS";
  const effectiveSize: Size | null = isOneSize ? "OS" : size;
  const onSale = !!product.compareAtPrice;
  const salePct = onSale ? Math.round((1 - product.price / (product.compareAtPrice ?? product.price)) * 100) : 0;

  // Cut-off countdown (8 PM local stand-in for GST) + expected receive date
  const now = new Date(nowTs);
  const cutoff = new Date(now);
  cutoff.setHours(20, 0, 0, 0);
  const beforeCutoff = now.getTime() < cutoff.getTime();
  const msLeft = beforeCutoff ? cutoff.getTime() - now.getTime() : 0;
  const hrsLeft = Math.floor(msLeft / 3600000);
  const minsLeft = Math.floor((msLeft % 3600000) / 60000);
  const receive = new Date(now);
  receive.setDate(now.getDate() + (beforeCutoff ? 1 : 2));
  const receiveLabel = receive.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });

  const selectColor = (i: number) => {
    setColorIdx(i);
    setGalleryIdx(0);
    galleryRef.current?.scrollTo({ left: 0 });
    setSize(null);
    const c = product.colors[i];
    track("select_variant", { item_id: product.id, colour: c.name, context: "pdp" });
  };

  const requestSize = () => {
    setSizePulse(true);
    sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    pushToast("Please choose a size first");
    window.setTimeout(() => setSizePulse(false), 1800);
  };

  const handleAdd = (silent = false) => {
    if (!effectiveSize) {
      requestSize();
      return;
    }
    addToCart(product, color.name, effectiveSize, 1, silent);
  };

  const waMessage = `Hi FLAYA! I have a question about the ${product.name} — ${window.location.href}\nColour: ${color.name}${effectiveSize ? ` · Size: ${effectiveSize}` : ""}`;

  const recommended = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 6);

  const galleryScroll = (dir: number) => {
    const el = galleryRef.current;
    if (!el) return;
    const next = Math.min(gallery.length - 1, Math.max(0, galleryIdx + dir));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setGalleryIdx(next);
  };

  return (
    <main className="pb-4">
      {/* Breadcrumb */}
      <nav className="mx-auto flex max-w-[1440px] items-center gap-1.5 px-4 pb-2 pt-4 text-[11px] text-faint md:px-8" aria-label="Breadcrumb">
        <a href="#/" className="hover:text-ink transition-colors">Home</a>
        <span>/</span>
        <a href={`#/shop/${product.category}`} className="hover:text-ink capitalize transition-colors">{product.category}</a>
        <span>/</span>
        <span className="text-ink truncate font-medium">{product.name}</span>
      </nav>

      <div className="mx-auto max-w-[1440px] md:grid md:grid-cols-2 md:gap-10 md:px-8 lg:gap-16">
        {/* ---------------- GALLERY ---------------- */}
        <div className="md:sticky md:top-[96px] md:self-start">
          {/* Mobile swipe gallery */}
          <div className="relative md:hidden">
            <div
              ref={galleryRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                setGalleryIdx(Math.round(el.scrollLeft / el.clientWidth));
              }}
              className="rail-snap no-scrollbar flex aspect-[3/4] w-full overflow-x-auto"
            >
              {gallery.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt={`${product.name} in ${color.name} — view ${i + 1}`}
                  width={900}
                  height={1200}
                  fetchPriority={i === 0 ? "high" : undefined}
                  loading={i === 0 ? undefined : "lazy"}
                  className="img-premium h-full w-full shrink-0 snap-center object-cover object-top"
                />
              ))}
            </div>
            {gallery.length > 1 && (
              <>
                <span className="bg-black/60 text-white absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide">
                  {galleryIdx + 1} / {gallery.length}
                </span>
                <div style={FIXED_LIGHT as React.CSSProperties} className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {gallery.map((_, i) => (
                    <span key={i} className={cx("h-1 rounded-full transition-all duration-300", i === galleryIdx ? "bg-porcelain w-5" : "bg-porcelain/50 w-1")} />
                  ))}
                </div>
              </>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Add to wishlist"
              className={cx(
                "absolute right-3 top-3 rounded-full p-2.5 backdrop-blur transition-all active:scale-90",
                liked ? "bg-clay/90 text-porcelain" : "bg-porcelain/85 text-ink"
              )}
            >
              <Heart className={cx("h-4 w-4", liked && "fill-current")} strokeWidth={1.8} />
            </button>
          </div>

          {/* Desktop gallery — composed grid */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-ivory relative aspect-[3/4] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={gallery[Math.min(galleryIdx, gallery.length - 1)]}
                    src={gallery[Math.min(galleryIdx, gallery.length - 1)]}
                    alt={`${product.name} in ${color.name}`}
                    width={1100}
                    height={1466}
                    fetchPriority="high"
                    initial={{ opacity: 0, scale: 1.015 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </AnimatePresence>
                {gallery.length > 1 && (
                  <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
                    <button onClick={() => galleryScroll(-1)} aria-label="Previous image" className="bg-porcelain/85 hover:bg-porcelain rounded-full p-2.5 backdrop-blur transition-colors">
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button onClick={() => galleryScroll(1)} aria-label="Next image" className="bg-porcelain/85 hover:bg-porcelain rounded-full p-2.5 backdrop-blur transition-colors">
                      <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Add to wishlist"
                  className={cx(
                    "absolute right-3 top-3 rounded-full p-2.5 backdrop-blur transition-all active:scale-90",
                    liked ? "bg-clay/90 text-porcelain" : "bg-porcelain/85 text-ink"
                  )}
                >
                  <Heart className={cx("h-4 w-4", liked && "fill-current")} strokeWidth={1.8} />
                </button>
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-3">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setGalleryIdx(i)}
                      className={cx(
                        "bg-ivory relative aspect-[3/4] w-24 overflow-hidden transition-all",
                        i === galleryIdx ? "ring-ink ring-1 ring-offset-2 ring-offset-porcelain" : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={src} alt="" width={160} height={213} loading="lazy" className="h-full w-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- INFO ---------------- */}
        <div className="px-4 pt-5 md:px-0 md:pt-2">
          <p className="text-taupe text-[10px] font-bold uppercase tracking-[0.3em]">
            {product.badge === "new" ? "New · " : product.badge === "bestseller" ? "Best Seller · " : ""}
            <span className="capitalize">{product.category}</span>
          </p>
          <h1 className="font-serif mt-2 text-[30px] font-light leading-tight md:text-[38px]">{product.name}</h1>

          <a href="#reviews" className="mt-2.5 flex items-center gap-2">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(product.rating) ? "fill-taupe text-taupe h-3.5 w-3.5" : "text-line h-3.5 w-3.5"}
                  strokeWidth={i < Math.round(product.rating) ? 0 : 1.5}
                />
              ))}
            </span>
            <span className="text-faint text-[12px] font-medium">
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </a>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-[22px] font-semibold tracking-tight">{formatMoney(product.price, region)}</p>
            {onSale && (
              <>
                <p className="text-faint text-[15px] font-medium line-through">{formatMoney(product.compareAtPrice!, region)}</p>
                <span className="bg-clay text-porcelain px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase">Sale −{salePct}%</span>
              </>
            )}
          </div>
          <p className="text-faint mt-1 text-[11.5px]">
            VAT included ·{" "}
            {region.code === "AE"
              ? "next-day delivery in Dubai · 2–3 days other Emirates"
              : `international delivery to ${region.label} within 5–7 days`}
          </p>

          {/* Order-cutoff urgency (UAE only) */}
          {region.code === "AE" && (
            <div className="bg-ivory/80 border-line mt-4 flex items-center gap-2.5 border px-3.5 py-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="bg-moss absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
                <span className="bg-moss relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <p className="text-[12px] leading-snug">
                {beforeCutoff ? (
                  <>
                    Order within <span className="font-bold">{hrsLeft} Hrs {String(minsLeft).padStart(2, "0")} Mins</span> to receive{" "}
                    <span className="font-bold">{receiveLabel}</span>
                  </>
                ) : (
                  <>
                    Order now — receive <span className="font-bold">{receiveLabel}</span> (next-day cut-off 8:00 PM GST)
                  </>
                )}
              </p>
            </div>
          )}

          {/* Colour */}
          <div className="mt-7">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase">
              Colour — <span className="text-taupe normal-case tracking-normal">{color.name}</span>
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              {product.colors.map((c, i) => {
                const soldOut = c.sizes.length === 0;
                return (
                  <button
                    key={c.name}
                    onClick={() => !soldOut && selectColor(i)}
                    disabled={soldOut}
                    aria-label={`${c.name}${soldOut ? " — unavailable" : ""}`}
                    title={soldOut ? `${c.name} — currently unavailable` : c.name}
                    className={cx(
                      "relative h-9 w-9 rounded-full border-2 transition-all",
                      i === colorIdx ? "border-ink scale-105" : "border-line hover:border-faint",
                      soldOut && "cursor-not-allowed opacity-40"
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {soldOut && (
                      <span className="absolute inset-0 m-auto h-[1.5px] w-9 -rotate-45 rounded bg-porcelain shadow-[0_0_0_1px_rgba(28,25,23,0.35)]" />
                    )}
                  </button>
                );
              })}
              <span className="text-faint ml-1 text-[11px]">Shown in best-selling colour first</span>
            </div>
          </div>

          {/* Size */}
          <div ref={sizeRef} className={cx("mt-7 rounded-sm transition-shadow duration-500", sizePulse && "shadow-[0_0_0_2px_var(--color-clay)]")}>
            {isOneSize ? (
              <div className="border-line bg-ivory/60 flex items-center justify-between border px-4 py-3.5">
                <p className="text-[12px] font-bold tracking-[0.14em] uppercase">Size</p>
                <p className="text-[13px] font-semibold">
                  One size <span className="text-faint font-normal">· relaxed free-size fit</span>
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold tracking-[0.14em] uppercase">Size</p>
                  <button
                    onClick={() => {
                      setSizeGuideOpen(true);
                      track("size_guide_open", { item_id: product.id });
                    }}
                    className="link-underline text-taupe flex items-center gap-1.5 text-[12px] font-semibold"
                  >
                    <Ruler className="h-3.5 w-3.5" strokeWidth={1.8} /> Size Guide
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => {
                    const available = color.sizes.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => available && setSize(s)}
                        disabled={!available}
                        aria-label={`Size ${s}${available ? "" : " — unavailable"}`}
                        className={cx(
                          "relative min-w-[52px] border px-3.5 py-3 text-[13px] font-semibold transition-all",
                          size === s
                            ? "bg-ink text-porcelain border-ink"
                            : available
                              ? "border-line hover:border-ink"
                              : "border-line text-faint/60 cursor-not-allowed"
                        )}
                      >
                        {s}
                        {!available && <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rotate-[-8deg] bg-faint/70" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {color.stockNote && <p className="text-clay mt-2.5 text-[11.5px] font-semibold">{color.stockNote} — selling fast</p>}
          </div>

          {/* Primary CTA */}
          <button
            ref={atcRef}
            onClick={() => handleAdd(false)}
            className="bg-ink text-porcelain mt-7 flex w-full items-center justify-center gap-2.5 py-[18px] text-[12px] font-bold tracking-[0.22em] uppercase transition-all hover:opacity-90 active:scale-[0.99]"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
            Add to Bag — {formatMoney(product.price, region)}
          </button>

          {/* WhatsApp — compact, product-aware */}
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("whatsapp_click", { item_id: product.id, colour: color.name, size: effectiveSize })}
            className="group mt-3.5 flex items-center justify-center gap-2 text-[13px] font-medium text-moss"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="link-underline">
              {effectiveSize ? "Have a question about this item?" : "Need help with size?"} Chat on WhatsApp →
            </span>
          </a>

          {/* Trust block — exchange-only, no refund promises */}
          <div className="border-line mt-6 grid grid-cols-2 gap-px border bg-line">
            {[
              { icon: Truck, t: "Delivery across the UAE", s: "Free over AED 500" },
              { icon: Globe, t: "Worldwide shipping", s: "By weight & destination" },
              { icon: RefreshCw, t: "14-day exchanges", s: "Exchange-only policy" },
              { icon: ShieldCheck, t: "Secure payment", s: "Cards · Apple Pay" },
            ].map((b) => (
              <div key={b.t} className="bg-porcelain flex items-center gap-3 p-3.5">
                <b.icon className="text-taupe h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[11.5px] font-bold leading-tight">{b.t}</p>
                  <p className="text-faint text-[10.5px] leading-tight">{b.s}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="border-line mt-8 border-t">
            <Accordion title="Description" defaultOpen>
              <p>{product.desc}</p>
              {product.details && product.details.length > 0 && (
                <p className="mt-4">
                  <span className="text-ink mb-2 block text-[11px] font-bold tracking-[0.16em] uppercase">Details</span>
                  <ul className="space-y-1.5">
                    {product.details.map((d) => (
                      <li key={d} className="flex gap-2.5">
                        <span className="text-taupe mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </p>
              )}
            </Accordion>
            <Accordion title="Fabric & Care">{product.fabric}</Accordion>
            <Accordion title="Delivery">
              <p>
                <span className="text-ink font-semibold">Dubai:</span> next day FREE delivery for orders placed
                before 8:00 PM GST (free over AED 500). <span className="text-ink font-semibold">Other Emirates:</span>{" "}
                2–3 business days.
              </p>
              <p className="mt-2.5">
                <span className="text-ink font-semibold">International:</span> worldwide in 5–7 business days,
                calculated at checkout by destination and weight. International orders are final sale — no exchange
                or refund. <a href="#/delivery" className="link-underline font-semibold text-ink">Full delivery policy →</a>
              </p>
            </Accordion>
            <Accordion title="Exchange Policy">
              FLAYA operates an exchange-only policy — we do not offer cash refunds. Items in original condition may
              be exchanged within 14 days of delivery (AED 20 Dubai / AED 30 other Emirates), subject to inspection
              and stock. <a href="#/delivery" className="link-underline font-semibold text-ink">Read the full exchange policy →</a>
            </Accordion>
          </div>
        </div>
      </div>

      {/* ---------------- COMPLETE THE LOOK ---------------- */}
      {product.look && <CompleteTheLook product={product} />}

      {/* ---------------- REVIEWS ---------------- */}
      <section id="reviews" className="bg-ivory/60 mt-20 px-4 py-14 md:mt-28 md:py-20">
        <div className="mx-auto max-w-[1200px] md:px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">Reviews</p>
              <h2 className="font-serif mt-2 text-[28px] font-light md:text-4xl">What FLAYA women say</h2>
            </div>
            <div className="flex items-center gap-2.5">
              <Star className="fill-taupe text-taupe h-5 w-5" strokeWidth={0} />
              <p className="text-smoke text-[13px] font-semibold">
                {product.rating.toFixed(1)} / 5 · from the FLAYA community
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 md:gap-5">
            {REVIEWS.slice(0, 4).map((r, i) => (
              <motion.figure
                key={r.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                className="bg-porcelain border-line border p-6"
              >
                <div className="flex" aria-label={`${r.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={s < r.rating ? "fill-taupe text-taupe h-3.5 w-3.5" : "text-line h-3.5 w-3.5"} strokeWidth={s < r.rating ? 0 : 1.5} />
                  ))}
                </div>
                <blockquote className="text-smoke mt-3 text-[13.5px] leading-relaxed">“{r.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  {r.avatar ? (
                    <img
                      src={r.avatar}
                      alt="Customer photo"
                      width={72}
                      height={72}
                      loading="lazy"
                      className="border-line h-9 w-9 shrink-0 rounded-full border object-cover object-top"
                    />
                  ) : (
                    <span className="bg-ivory text-taupe flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold">{r.initials}</span>
                  )}
                  <div>
                    <p className="text-[12px] font-bold">Verified customer</p>
                    <p className="text-faint text-[11px]">{r.context} · via {r.source}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <p className="text-faint mt-5 text-[11.5px] italic">
            Stage one: reviews from across FLAYA are shown while product-specific reviews are collected.
          </p>
        </div>
      </section>

      {/* ---------------- RECOMMENDED ---------------- */}
      <div className="mt-20 md:mt-28">
        <ProductRail
          kicker="Continue Exploring"
          title="You may also like"
          products={recommended}
          viewAllHref={`#/shop/${product.category}`}
          viewAllLabel={`All ${product.category}`}
        />
      </div>

      {/* ---------------- STICKY ATC (mobile only) ---------------- */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="bg-porcelain/97 border-line fixed inset-x-0 bottom-0 z-[65] border-t pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center gap-3 px-4">
              <div className="min-w-0 flex-1">
                <p className="font-serif truncate text-[15px] font-medium leading-tight">{product.name}</p>
                <p className="text-faint text-[11px] leading-tight">
                  {color.name}
                  {effectiveSize ? (isOneSize ? " · one size" : ` · ${effectiveSize}`) : " · select size"} ·{" "}
                  <span className="text-ink font-semibold">{formatMoney(product.price, region)}</span>
                </p>
              </div>
              <button
                onClick={() => handleAdd(false)}
                className="bg-ink text-porcelain flex shrink-0 items-center gap-2 px-6 py-3.5 text-[11px] font-bold tracking-[0.18em] uppercase active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
                Add to Bag
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* spacer so sticky bar never covers content */}
      {showSticky && <div className="h-[76px] md:hidden" />}

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </main>
  );
}

/* ---------------- Complete the Look ---------------- */

function CompleteTheLook({ product }: { product: Product }) {
  const { region, addToCart, pushToast } = useStore();
  const look = product.look!;
  const items = look.itemIds.map((i) => productById(i)).filter(Boolean) as Product[];

  const quickAdd = (p: Product) => {
    const variant = p.colors.find((c) => c.sizes.length > 0);
    if (!variant) return;
    const s = variant.sizes[0];
    track("cross_sell_add_to_cart", { from_item: product.id, item_id: p.id, colour: variant.name, size: s });
    addToCart(p, variant.name, s, 1, true);
    pushToast(`Added — ${p.name} · ${variant.name} · ${s}`);
  };

  return (
    <section className="mx-auto mt-20 max-w-[1440px] px-4 md:mt-28 md:px-8">
      <div className="mb-6 md:mb-8">
        <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">Part of the Capsule</p>
        <h2 className="font-serif mt-2 text-[28px] font-light md:text-4xl">Complete the look</h2>
        <p className="text-faint mt-2 max-w-md text-[13px] leading-relaxed">
          Every FLAYA piece is designed to layer with the next — shop the full outfit below.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Full outfit imagery */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-ivory relative aspect-[3/4] overflow-hidden md:aspect-auto md:h-full"
        >
          <img
            src={look.image}
            alt={look.caption}
            width={1000}
            height={1300}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="bg-porcelain/95 absolute bottom-4 left-4 px-3.5 py-2 font-serif text-[13px] italic">{look.caption}</span>
        </motion.div>

        {/* Items in the look */}
        <div className="flex flex-col justify-center gap-3 md:gap-4">
          {items.map((p, i) => {
            const firstVariant = p.colors.find((c) => c.sizes.length > 0) || p.colors[0];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group border-line hover:border-taupe/60 flex items-center gap-4 border p-3 transition-colors"
              >
                <a
                  href={`#/product/${p.id}`}
                  onClick={() => track("complete_the_look_click", { from_item: product.id, item_id: p.id })}
                  className="bg-ivory block h-24 w-[72px] shrink-0 overflow-hidden"
                >
                  <img
                    src={firstVariant.images[0]}
                    alt={p.name}
                    width={144}
                    height={192}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </a>
                <div className="min-w-0 flex-1">
                  <a
                    href={`#/product/${p.id}`}
                    onClick={() => track("complete_the_look_click", { from_item: product.id, item_id: p.id })}
                    className="font-serif block truncate text-[16px] font-medium leading-snug"
                  >
                    {p.name}
                  </a>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {p.colors.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className={cx("border-line inline-block h-3.5 w-3.5 rounded-full border", c.sizes.length === 0 && "opacity-40")}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[13px] font-semibold">{formatMoney(p.price, region)}</p>
                </div>
                <button
                  onClick={() => quickAdd(p)}
                  disabled={!p.colors.some((c) => c.sizes.length > 0)}
                  aria-label={`Quick add ${p.name}`}
                  className="bg-ink text-porcelain mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </motion.div>
            );
          })}
          <p className="text-faint mt-1 text-[11px]">
            Quick-add selects the first available size — you can exchange sizes free within 14 days.
          </p>
        </div>
      </div>
    </section>
  );
}
