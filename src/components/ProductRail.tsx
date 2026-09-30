import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "../data/store";
import ProductCard from "./ProductCard";

interface Props {
  kicker: string;
  title: string;
  note?: string;
  products: Product[];
  viewAllHref: string;
  viewAllLabel?: string;
}

export default function ProductRail({ kicker, title, note, products, viewAllHref, viewAllLabel = "View all" }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">{kicker}</p>
          <h2 className="font-serif mt-2 text-[28px] font-light leading-tight md:text-4xl">{title}</h2>
          {note && <p className="text-faint mt-1.5 max-w-md text-[13px] leading-relaxed">{note}</p>}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={viewAllHref}
            className="link-underline hidden shrink-0 text-[11px] font-bold tracking-[0.16em] uppercase sm:block"
          >
            {viewAllLabel}
          </a>
          <div className="ml-2 hidden gap-1.5 md:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll back"
              className="border-line hover:border-ink rounded-full border p-2.5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll forward"
              className="border-line hover:border-ink rounded-full border p-2.5 transition-colors"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div ref={railRef} className="rail-snap no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:-mx-8 md:gap-5 md:px-8">
        {products.map((p, i) => (
          <div key={p.id} className="w-[64vw] shrink-0 sm:w-[44vw] lg:w-[calc(25%-15px)]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>

      <a
        href={viewAllHref}
        className="border-ink mt-6 block w-full border py-3.5 text-center text-[11px] font-bold tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-porcelain sm:hidden"
      >
        {viewAllLabel}
      </a>
    </section>
  );
}
