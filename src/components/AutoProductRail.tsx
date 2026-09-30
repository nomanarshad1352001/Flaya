import { ArrowRight } from "lucide-react";
import type { Product } from "../data/store";
import { cx } from "../lib/shop";
import ProductCard from "./ProductCard";

interface Props {
  kicker: string;
  title: string;
  note?: string;
  products: Product[];
  viewAllHref: string;
  viewAllLabel?: string;
  reverse?: boolean;
  duration?: string;
}

/* Perpetually gliding rail — duplicated track, seamless -50% loop, pause on hover */
export default function AutoProductRail({
  kicker,
  title,
  note,
  products,
  viewAllHref,
  viewAllLabel = "View all",
  reverse = false,
  duration = "85s",
}: Props) {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">{kicker}</p>
            <h2 className="font-serif mt-2 text-[28px] font-light leading-tight md:text-4xl">{title}</h2>
            {note && <p className="text-faint mt-1.5 max-w-md text-[13px] leading-relaxed">{note}</p>}
          </div>
          <a
            href={viewAllHref}
            className="link-underline hidden shrink-0 items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase sm:flex"
          >
            {viewAllLabel} <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>
      </div>

      <div className="marquee-hover-pause overflow-hidden">
        <div
          className={cx("marquee-track gap-3 pl-4 md:gap-5 md:pl-8", reverse && "marquee-reverse")}
          style={{ ["--marquee-dur" as string]: duration }}
        >
          {[...products, ...products].map((p, i) => (
            <div key={`${p.id}-${i}`} className="w-[240px] shrink-0 sm:w-[280px] lg:w-[300px]">
              <ProductCard product={p} index={i % products.length} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-8">
        <a
          href={viewAllHref}
          className="border-ink mx-auto mt-6 block w-full max-w-[1440px] border py-3.5 text-center text-[11px] font-bold tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-porcelain sm:hidden"
        >
          {viewAllLabel}
        </a>
      </div>
    </section>
  );
}
