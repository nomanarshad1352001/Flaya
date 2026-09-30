import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { CATEGORY_FILTERS, COLLECTIONS, COLOR_FILTERS, PRODUCTS, Product, SORT_OPTIONS, SortKey } from "../data/store";
import { cx, track } from "../lib/shop";
import ProductCard from "../components/ProductCard";
import FilterDrawer, { FilterState, EMPTY_FILTERS } from "../components/FilterDrawer";

const CATEGORY_META: Record<string, { title: string; blurb: string }> = {
  all: { title: "Shop All", blurb: "Every FLAYA piece — one wardrobe system." },
  new: { title: "New Collection", blurb: "SS26 has landed. Fresh silhouettes in the season’s neutral palette." },
  "best-sellers": { title: "Best Sellers", blurb: "The pieces our community reorders, gifts and styles on repeat." },
  abayas: { title: "Abayas", blurb: "Fluid lines, architecture-grade drape. The signature of the house." },
  dresses: { title: "Dresses", blurb: "Base layers and standalone statements, cut to floor-skimming lengths." },
  sets: { title: "Co-ord Sets", blurb: "Tailored ensembles that multiply your wardrobe." },
  outerwear: { title: "Outerwear", blurb: "Trenches and tailoring with the weight removed." },
};

const CHIPS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "abayas", label: "Abayas" },
  { id: "dresses", label: "Dresses" },
  { id: "sets", label: "Sets" },
  { id: "outerwear", label: "Outerwear" },
];

const matchesColor = (p: Product, selected: Set<string>) => {
  const names = p.colors.map((c) => c.name);
  return COLOR_FILTERS.some(
    (cf) => selected.has(cf.label) && cf.members.some((m) => names.includes(m))
  );
};
const matchesSize = (p: Product, selected: Set<string>) =>
  p.colors.some((c) => c.sizes.some((s) => selected.has(s)));

interface Props {
  category: string;
  collection?: string;
}

export default function ListingPage({ category, collection }: Props) {
  const [sort, setSort] = useState<SortKey>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const meta = CATEGORY_META[category] || CATEGORY_META.all;
  const activeCollection = collection ? COLLECTIONS.find((c) => c.id === collection) : undefined;

  const activeFilterCount = filters.categories.size + filters.sizes.size + filters.colors.size;

  useEffect(() => {
    setSort("featured");
    setInStockOnly(false);
    setFilters({ categories: new Set(), sizes: new Set(), colors: new Set() });
    track("view_item_list", { list: category, collection });
  }, [category, collection]);

  const items = useMemo(() => {
    let list: Product[] =
      category === "all"
        ? [...PRODUCTS]
        : category === "new"
          ? PRODUCTS.filter((p) => p.badge === "new")
          : category === "best-sellers"
            ? PRODUCTS.filter((p) => p.badge === "bestseller")
            : PRODUCTS.filter((p) => p.category === category);

    if (activeCollection) {
      const filtered = list.filter((p) => p.collection === activeCollection.id);
      list = filtered.length > 0 ? filtered : PRODUCTS.filter((p) => p.collection === activeCollection.id);
    }
    if (filters.categories.size > 0) list = list.filter((p) => filters.categories.has(p.category));
    if (filters.sizes.size > 0) list = list.filter((p) => matchesSize(p, filters.sizes));
    if (filters.colors.size > 0) list = list.filter((p) => matchesColor(p, filters.colors));
    if (inStockOnly) list = list.filter((p) => p.colors.some((c) => c.sizes.length > 0));

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "best-selling":
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case "relevant":
        return list.sort((a, b) => b.rating * 40 + b.reviewCount - (a.rating * 40 + a.reviewCount));
      case "date-asc":
        return list.sort((a, b) => (a.addedAt ?? 0) - (b.addedAt ?? 0));
      case "date-desc":
        return list.sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
      default:
        return list;
    }
  }, [category, sort, inStockOnly, activeCollection, filters]);

  const removeFilter = (kind: "categories" | "sizes" | "colors", value: string) => {
    const next: FilterState = {
      categories: new Set(filters.categories),
      sizes: new Set(filters.sizes),
      colors: new Set(filters.colors),
    };
    next[kind].delete(value);
    setFilters(next);
  };

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-4 md:px-8">
      {/* PLP intro */}
      <header className="border-line border-b pb-8 pt-8 md:pt-12">
        <motion.p
          key={`k-${category}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase"
        >
          {items.length} {items.length === 1 ? "style" : "styles"}
        </motion.p>
        <motion.h1
          key={`h-${category}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif mt-2 text-[36px] font-light leading-tight md:text-[52px]"
        >
          {meta.title}
        </motion.h1>
        <p className="text-faint mt-2 max-w-lg text-[13.5px] leading-relaxed">{meta.blurb}</p>

        {activeCollection && (
          <div className="mt-4 flex max-w-2xl flex-wrap items-start gap-2">
            <span className="bg-ink text-porcelain flex items-center gap-2 px-3.5 py-2 text-[11px] font-bold tracking-wide">
              {activeCollection.name}
              <a href={`#/shop/${category}`} aria-label="Clear collection filter">
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </span>
            <p className="text-smoke flex-1 text-[12.5px] italic leading-relaxed">{activeCollection.desc}</p>
          </div>
        )}
      </header>

      {/* Sticky control bar */}
      <div className="border-line sticky top-16 z-40 -mx-4 border-b bg-porcelain/95 px-4 py-3 backdrop-blur-xl md:top-[72px] md:-mx-8 md:px-8">
        <div className="flex items-center gap-2">
          {/* All filters trigger */}
          <button
            onClick={() => setFiltersOpen(true)}
            className={cx(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[11.5px] font-bold transition-colors",
              activeFilterCount > 0 ? "bg-ink text-porcelain border-ink" : "border-line hover:border-ink"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
            <span>All Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-porcelain text-ink flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
            {CHIPS.map((chip) => (
              <a
                key={chip.id}
                href={`#/shop/${chip.id}`}
                className={cx(
                  "shrink-0 rounded-full border px-3.5 py-2 text-[11.5px] font-semibold transition-colors",
                  chip.id === category
                    ? "bg-ink text-porcelain border-ink"
                    : "border-line text-smoke hover:border-ink hover:text-ink"
                )}
              >
                {chip.label}
              </a>
            ))}
          </div>

          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort by"
              className="border-line text-ink appearance-none rounded-full border bg-transparent py-2 pl-4 pr-8 text-[11.5px] font-semibold outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="text-faint pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={2} />
          </div>
        </div>

        {/* Active filter chips */}
        {(activeFilterCount > 0 || inStockOnly) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {[...filters.categories].map((v) => (
              <Chip key={`c-${v}`} label={CATEGORY_FILTERS.find((c) => c.id === v)?.label ?? v} onClear={() => removeFilter("categories", v)} />
            ))}
            {[...filters.sizes].map((v) => (
              <Chip key={`s-${v}`} label={v === "OS" ? "One size" : `Size ${v}`} onClear={() => removeFilter("sizes", v)} />
            ))}
            {[...filters.colors].map((v) => (
              <Chip key={`col-${v}`} label={v} dot={COLOR_FILTERS.find((c) => c.label === v)?.hex} onClear={() => removeFilter("colors", v)} />
            ))}
            {inStockOnly && <Chip label="In stock" onClear={() => setInStockOnly(false)} />}
            <button
              onClick={() => {
                setFilters({ categories: new Set(), sizes: new Set(), colors: new Set() });
                setInStockOnly(false);
              }}
              className="text-clay px-2 text-[11px] font-bold uppercase tracking-wide"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl font-light">Nothing matches those filters</p>
          <p className="text-faint mt-2 text-sm">Try widening the selection — or browse everything.</p>
          <button
            onClick={() => setFilters({ categories: new Set(), sizes: new Set(), colors: new Set() })}
            className="border-ink mt-6 inline-block border px-8 py-3.5 text-[11px] font-bold tracking-[0.18em] uppercase transition-colors hover:bg-ink hover:text-porcelain"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 pt-6 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      {/* Reassurance footer */}
      <div className="border-line text-faint mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t pt-6 text-[11.5px]">
        <span>Free UAE delivery over AED 500</span>
        <span className="hidden sm:inline">·</span>
        <span>Next day delivery in Dubai</span>
        <span className="hidden sm:inline">·</span>
        <span>Easy online exchanges</span>
      </div>

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={items.length}
      />
    </main>
  );
}

function Chip({ label, dot, onClear }: { label: string; dot?: string; onClear: () => void }) {
  return (
    <span className="bg-ivory border-line flex items-center gap-1.5 border py-1.5 pl-2.5 pr-1.5 text-[11px] font-semibold">
      {dot && <span className="border-line h-3 w-3 rounded-full border" style={{ backgroundColor: dot }} />}
      {label}
      <button onClick={onClear} aria-label={`Remove ${label}`} className="hover:text-clay rounded-full p-0.5 transition-colors">
        <X className="h-3 w-3" strokeWidth={2.2} />
      </button>
    </span>
  );
}
