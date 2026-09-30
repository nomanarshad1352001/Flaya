import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe, RefreshCw, ShieldCheck, Star, Truck } from "lucide-react";
import { CATEGORIES, COMMUNITY, EDITORIAL, HERO_SLIDES, REVIEWS, heroImg, productById } from "../data/store";
import { FIXED_LIGHT, cx, formatMoney, track } from "../lib/shop";
import { useStore } from "../store/StoreContext";
import { InstagramIcon } from "./icons";

/* ------------------------------ HERO SLIDESHOW ------------------------------
 * 16 editorial frames · crossfades + Ken Burns · auto every 6s · tappable nav
 * ------------------------------------------------------------------------- */

const SLIDE_MS = 6000;

export function Hero() {
  const [idx, setIdx] = useState(0);
  const total = HERO_SLIDES.length;
  const slide = HERO_SLIDES[idx];

  useEffect(() => {
    const t = window.setInterval(() => setIdx((i) => (i + 1) % total), SLIDE_MS);
    return () => window.clearInterval(t);
  }, [idx, total]);

  // Preload upcoming frame for seamless crossfade
  useEffect(() => {
    const next = HERO_SLIDES[(idx + 1) % total];
    const img = new Image();
    img.src = heroImg(next.id, 1600, 2000);
  }, [idx, total]);

  return (
    <section style={FIXED_LIGHT as React.CSSProperties} className="bg-ink relative h-[92svh] min-h-[560px] w-full overflow-hidden md:h-[90vh]">
      {/* Frames */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={heroImg(slide.id, 1600, 2000)}
            srcSet={`${heroImg(slide.id, 900, 1300)} 900w, ${heroImg(slide.id, 1600, 2000)} 1600w`}
            sizes="100vw"
            alt={`FLAYA SS26 editorial — ${slide.tag}`}
            width={1600}
            height={2000}
            fetchPriority={idx === 0 ? "high" : undefined}
            loading={idx === 0 ? undefined : "lazy"}
            decoding="async"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.14 }}
            transition={{ duration: 7.2, ease: "linear" }}
            className="absolute inset-0 h-full w-full object-cover object-[50%_24%]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

      {/* Slide tag — top right, editorial detail (tappable to product) */}
      <div className="absolute right-5 top-5 hidden items-center gap-3 md:right-10 md:top-8 md:flex">
        <AnimatePresence mode="wait">
          {slide.productId ? (
            <motion.a
              key={idx}
              href={`#/product/${slide.productId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-porcelain/90 font-serif link-underline text-sm italic tracking-wide"
            >
              {slide.tag}
            </motion.a>
          ) : (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-porcelain/90 font-serif text-sm italic tracking-wide"
            >
              {slide.tag}
            </motion.p>
          )}
        </AnimatePresence>
        <span className="text-porcelain/60 text-[11px] font-bold tracking-[0.2em]">
          {String(idx + 1).padStart(2, "0")} / {total}
        </span>
      </div>

      {/* Copy block */}
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 pb-[104px] md:px-10 md:pb-[120px]">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-porcelain/80 text-[10px] font-bold tracking-[0.34em] uppercase"
        >
          SS26 · The Capsule Wardrobe
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-porcelain mt-4 max-w-[720px] text-[40px] font-light leading-[1.05] md:text-[64px] lg:text-[76px]"
        >
          The new language
          <br />
          of <em className="italic">modest luxury.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-porcelain/85 mt-4 max-w-[520px] text-[14px] leading-relaxed md:text-[15px]"
        >
          FLAYA is a premium modest fashion house from Dubai — abayas, dresses and capsule pieces designed to be
          worn together, everywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.76, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <a
            href="#/shop/new"
            className="bg-porcelain text-ink px-7 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Shop New Collection
          </a>
          <a
            href="#/shop/abayas"
            className="border-porcelain/70 text-porcelain hover:bg-porcelain/10 border px-7 py-4 text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-sm transition-colors"
          >
            Explore Abayas
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.9 }}
          className="text-porcelain/80 mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-semibold tracking-wide"
        >
          <span className="flex items-center gap-2">
            <Truck className="h-4 w-4" strokeWidth={1.5} />
            Free delivery in Dubai & UAE · orders over AED 500
          </span>
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            Worldwide shipping available
          </span>
        </motion.div>
      </div>

      {/* Slide navigation segments */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1440px] px-5 pb-6 md:px-10">
        <div className="flex items-center gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group relative h-6 flex-1"
            >
              <span className="bg-porcelain/25 absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full transition-colors group-hover:bg-porcelain/40">
                {i === idx && <span key={idx} className="hero-progress bg-porcelain absolute inset-0 rounded-full" />}
                {i < idx && <span className="bg-porcelain/70 absolute inset-0 rounded-full" />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- TRUST STRIP --------------------------- */

const TRUST = [
  { icon: Truck, title: "Free UAE delivery", note: "Dubai & UAE · AED 500+" },
  { icon: Globe, title: "Worldwide shipping", note: "By destination & weight" },
  { icon: RefreshCw, title: "Easy exchanges", note: "14-day exchange policy" },
  { icon: ShieldCheck, title: "Secure payment", note: "Cards, Apple Pay & more" },
];

export function TrustStrip() {
  return (
    <section className="border-line border-b">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
        {TRUST.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className={cx(
              "border-line flex items-center gap-3 px-5 py-5 md:justify-center",
              i % 2 === 0 && "border-r",
              i < 2 && "border-b md:border-b-0",
              i > 0 && "md:border-l"
            )}
          >
            <t.icon className="text-taupe h-5 w-5 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-bold leading-tight">{t.title}</p>
              <p className="text-faint text-[11px] leading-tight">{t.note}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- CATEGORY MOSAIC ------------------------- */

export function CategoryMosaic() {
  return (
    <section style={FIXED_LIGHT as React.CSSProperties} className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="mb-6 md:mb-8">
        <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">The Catalogue</p>
        <h2 className="font-serif mt-2 text-[28px] font-light leading-tight md:text-4xl">Where to begin</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <motion.a
            key={c.id}
            href={`#/shop/${c.id}`}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={cx(
              "bg-ivory group relative overflow-hidden",
              i === 0 ? "aspect-[3/4] lg:row-span-2 lg:aspect-auto lg:h-full" : "aspect-[3/4]"
            )}
          >
            <img
              src={c.image}
              alt={c.name}
              width={800}
              height={1100}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5">
              <div>
                <p className="font-serif text-porcelain text-[19px] font-medium leading-tight md:text-2xl">{c.name}</p>
                <p className="text-porcelain/70 mt-1 text-[10px] font-semibold tracking-[0.18em] uppercase">{c.note}</p>
              </div>
              <span className="bg-porcelain text-ink flex h-9 w-9 translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ------------------------ CAPSULE EDITORIAL ------------------------ */

export function CapsuleEditorial() {
  const { region } = useStore();
  const lookIds = ["amara-maxi-dress", "aya-signature-abaya", "mira-trench-coat"];

  return (
    <section className="bg-ivory/60 overflow-hidden">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:gap-16 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[3/4] w-[86%] overflow-hidden">
            <img
              src={EDITORIAL.main}
              alt="FLAYA capsule styling — serene neutral pairing"
              width={1100}
              height={1400}
              loading="lazy"
              className="img-premium h-full w-full object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="border-porcelain absolute -bottom-8 right-0 w-[42%] overflow-hidden border-[6px] shadow-[0_24px_60px_rgba(28,25,23,0.18)]"
          >
            <img
              src={EDITORIAL.texture}
              alt="Ivory silk detail"
              width={900}
              height={1100}
              loading="lazy"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </motion.div>
          <p className="text-faint absolute -bottom-8 left-1 font-serif text-[13px] italic">
            The Capsule — styled in Ecru
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="md:pl-4"
        >
          <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">The Capsule Concept</p>
          <h2 className="font-serif mt-3 text-[32px] font-light leading-[1.12] md:text-5xl">
            One dress.
            <br />A week of looks.
          </h2>
          <p className="text-smoke mt-5 max-w-md text-[14px] leading-relaxed md:text-[15px]">
            Every FLAYA piece is designed as part of a system: base dresses that pair with every overlay, overlays
            that transform one silhouette into three. Buy fewer pieces — wear more looks.
          </p>

          <div className="mt-8 space-y-3">
            {lookIds.map((id, i) => {
              const p = productById(id);
              if (!p) return null;
              return (
                <motion.a
                  key={id}
                  href={`#/product/${id}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.55 }}
                  className="group bg-porcelain border-line hover:border-taupe flex items-center gap-4 border p-2.5 transition-colors"
                >
                  <img
                    src={p.colors[0].images[0]}
                    alt={p.name}
                    width={96}
                    height={128}
                    loading="lazy"
                    className="bg-ivory h-[68px] w-[52px] object-cover object-top"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-faint text-[10px] font-bold tracking-[0.18em] uppercase">
                      {i === 0 ? "The base" : i === 1 ? "The overlay" : "The layer"}
                    </p>
                    <p className="font-serif truncate text-[16px] font-medium">{p.name}</p>
                  </div>
                  <p className="pr-2 text-[13px] font-semibold">{formatMoney(p.price, region)}</p>
                </motion.a>
              );
            })}
          </div>

          <a
            href="#/shop/new?collection=the-capsule"
            className="bg-ink text-porcelain mt-8 inline-flex items-center gap-2.5 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore the Capsule <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------- TESTIMONIALS — 3 infinite sliding rows ------------------- */

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure
      onClick={() => track("review_interaction", { review_id: r.id, context: r.context })}
      className="bg-ivory/70 border-line flex w-[300px] shrink-0 cursor-default flex-col border p-5 sm:w-[340px] md:w-[380px] md:p-6"
    >
      <div className="flex" aria-label={`${r.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, s) => (
          <Star
            key={s}
            className={s < r.rating ? "fill-taupe text-taupe h-3.5 w-3.5" : "text-line h-3.5 w-3.5"}
            strokeWidth={s < r.rating ? 0 : 1.5}
          />
        ))}
      </div>
      <blockquote className="text-smoke mt-3.5 flex-1 text-[13.5px] leading-relaxed">“{r.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {r.avatar ? (
          <img
            src={r.avatar}
            alt="Customer photo"
            width={72}
            height={72}
            loading="lazy"
            className="border-line h-10 w-10 shrink-0 rounded-full border object-cover object-top"
          />
        ) : (
          <span className="bg-porcelain border-line text-taupe flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tracking-wide">
            {r.initials}
          </span>
        )}
        <div>
          <p className="text-[12px] font-bold">Verified customer</p>
          <p className="text-faint text-[11px]">
            {r.context} · via {r.source}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  const rows = [REVIEWS.slice(0, 5), REVIEWS.slice(5, 10), REVIEWS.slice(10, 15)];
  const durations = ["46s", "58s", "52s"];

  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
          <div>
            <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">In Their Words</p>
            <h2 className="font-serif mt-2 text-[28px] font-light leading-tight md:text-4xl">Worn, loved, reviewed</h2>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="fill-taupe text-taupe h-4 w-4" strokeWidth={0} />
              ))}
            </span>
            <p className="text-smoke text-[12.5px] font-semibold">4.9 — from verified customer reviews</p>
          </div>
        </div>
      </div>

      {/* Three rows, perpetually sliding in alternating directions */}
      <div className="space-y-3 md:space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="marquee-hover-pause overflow-hidden" aria-hidden={i > 0}>
            <div
              className={cx("marquee-track gap-3 md:gap-4", i === 1 && "marquee-reverse")}
              style={{ ["--marquee-dur" as string]: durations[i] }}
            >
              {[...row, ...row].map((r, j) => (
                <ReviewCard key={`${r.id}-${j}`} r={r} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-faint mx-auto mt-5 max-w-[1440px] px-4 text-[11px] italic md:px-8">
        15 verified reviews · hover to pause · stage one: shared across the collection
      </p>
    </section>
  );
}

/* ----------------------------- COMMUNITY ---------------------------- */

export function CommunitySection() {
  const { region } = useStore();
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">The FLAYA Circle</p>
          <h2 className="font-serif mt-2 text-[28px] font-light leading-tight md:text-4xl">Styled by you</h2>
          <p className="text-faint mt-2 max-w-md text-[13px] leading-relaxed">
            Real women, real wardrobes. Tag <span className="text-ink font-semibold">@flaya.official</span> to be
            featured.
          </p>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="border-ink hover:bg-ink hover:text-porcelain flex items-center gap-2 border px-5 py-3 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors"
        >
          <InstagramIcon className="h-4 w-4" /> Follow us
        </a>
      </div>

      <div style={FIXED_LIGHT as React.CSSProperties} className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
        {COMMUNITY.map((post, i) => {
          const product = post.productId ? productById(post.productId) : undefined;
          return (
            <motion.a
              key={post.handle}
              href={product ? `#/product/${product.id}` : "https://instagram.com"}
              target={product ? undefined : "_blank"}
              rel={product ? undefined : "noreferrer"}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
              className="bg-ivory group relative aspect-[4/5] overflow-hidden"
            >
              <img
                src={post.image}
                alt={`FLAYA styled by ${post.handle}`}
                width={700}
                height={880}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-3.5 transition-colors duration-400 group-hover:bg-black/35">
                <span className="bg-porcelain/90 text-ink flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <InstagramIcon className="h-4 w-4" />
                </span>
                <div className="translate-y-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-porcelain text-[12.5px] font-bold">{post.handle}</p>
                  {product && (
                    <p className="text-porcelain/85 mt-0.5 text-[11px]">
                      Wearing: {product.name} · {formatMoney(product.price, region)}
                    </p>
                  )}
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
