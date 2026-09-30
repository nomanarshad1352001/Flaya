import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "../data/store";
import { FIXED_LIGHT, cx, formatMoney, track } from "../lib/shop";
import { useStore } from "../store/StoreContext";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { region, wishlist, toggleWishlist } = useStore();
  // Best-selling colour first (data ordered so index 0 = best seller)
  const [colorIdx, setColorIdx] = useState(0);
  const variant = product.colors[colorIdx];
  const liked = wishlist.includes(product.id);
  const [hovered, setHovered] = useState(false);

  const altImage = variant.images[1];
  const onSale = !!product.compareAtPrice;
  const salePct = onSale ? Math.round((1 - product.price / (product.compareAtPrice ?? product.price)) * 100) : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="bg-ivory relative aspect-[3/4] overflow-hidden">
        <a
          href={`#/product/${product.id}`}
          onClick={() => track("select_item", { item_id: product.id, item_name: product.name })}
          aria-label={product.name}
          className="absolute inset-0"
        >
          <img
            src={variant.images[0]}
            alt={`${product.name} in ${variant.name}`}
            width={600}
            height={800}
            loading="lazy"
            className={cx(
              "img-premium absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out",
              altImage && hovered ? "opacity-0" : "opacity-100",
              "group-hover:scale-[1.03]"
            )}
          />
          {altImage && (
            <img
              src={altImage}
              alt=""
              width={600}
              height={800}
              loading="lazy"
              aria-hidden="true"
              className={cx(
                "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-out",
                hovered ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </a>

        {/* Badge */}
        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span
              className={cx(
                "px-2.5 py-1 text-[9px] font-bold tracking-[0.18em] uppercase",
                product.badge === "new" ? "bg-porcelain text-ink" : "bg-ink text-porcelain"
              )}
            >
              {product.badge === "new" ? "New" : "Best Seller"}
            </span>
          )}
          {onSale && (
            <span className="bg-clay text-porcelain px-2.5 py-1 text-[9px] font-bold tracking-[0.18em] uppercase">
              Sale −{salePct}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={cx(
            "absolute right-2.5 top-2.5 z-10 rounded-full p-2 backdrop-blur transition-all active:scale-90",
            liked ? "bg-clay/90 text-porcelain" : "bg-porcelain/80 text-ink hover:bg-porcelain"
          )}
        >
          <Heart className={cx("h-[15px] w-[15px]", liked && "fill-current")} strokeWidth={1.8} />
        </button>

        {/* Colour swatch strip */}
        <div style={FIXED_LIGHT as React.CSSProperties} className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-gradient-to-t from-black/35 to-transparent p-3 pt-8 opacity-100 transition-all duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <div className="flex items-center gap-1.5">
            {product.colors.map((c, i) => {
              const soldOut = c.sizes.length === 0;
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    if (soldOut) return;
                    setColorIdx(i);
                    track("select_variant", { item_id: product.id, colour: c.name, context: "plp_card" });
                  }}
                  disabled={soldOut}
                  aria-label={`${c.name}${soldOut ? " — unavailable" : ""}`}
                  title={soldOut ? `${c.name} — unavailable` : c.name}
                  className={cx(
                    "relative h-[22px] w-[22px] rounded-full border-2 transition-transform",
                    i === colorIdx ? "scale-110 border-porcelain shadow-[0_0_0_1.5px_rgba(28,25,23,0.8)]" : "border-porcelain/70",
                    soldOut && "opacity-50"
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {soldOut && (
                    <span className="absolute inset-0 m-auto h-[1.5px] w-[16px] -rotate-45 rounded bg-porcelain" />
                  )}
                </button>
              );
            })}
          </div>
          <span className="text-porcelain text-[10px] font-semibold tracking-wide drop-shadow">
            {variant.name}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start justify-between gap-2">
          <a
            href={`#/product/${product.id}`}
            className="font-serif text-[16px] font-medium leading-snug md:text-[17px]"
          >
            {product.name}
          </a>
          <p className="pt-0.5 text-right text-[14px] font-semibold tracking-tight">
            {formatMoney(product.price, region)}
            {onSale && (
              <span className="text-faint block text-[11px] font-medium line-through">
                {formatMoney(product.compareAtPrice!, region)}
              </span>
            )}
          </p>
        </div>
        <p className="text-faint mt-1 text-[11.5px]">
          {product.colors.length} colour{product.colors.length > 1 ? "s" : ""}
          {product.colors.some((c) => c.sizes.length === 0) && <span className="text-clay/80"> · some unavailable</span>}
        </p>
      </div>
    </motion.article>
  );
}
