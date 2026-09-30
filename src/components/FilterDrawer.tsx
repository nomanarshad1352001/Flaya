import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { CATEGORY_FILTERS, COLOR_FILTERS, SIZE_FILTERS } from "../data/store";
import { cx } from "../lib/shop";

export interface FilterState {
  categories: Set<string>;
  sizes: Set<string>;
  colors: Set<string>;
}

export const EMPTY_FILTERS: FilterState = {
  categories: new Set(),
  sizes: new Set(),
  colors: new Set(),
};

const clone = (f: FilterState): FilterState => ({
  categories: new Set(f.categories),
  sizes: new Set(f.sizes),
  colors: new Set(f.colors),
});

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-line border-b">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-[12px] font-bold tracking-[0.16em] uppercase">{title}</span>
        <ChevronDown className={cx("text-faint h-4 w-4 transition-transform duration-300", open && "rotate-180")} strokeWidth={1.5} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
}

export default function FilterDrawer({ open, onClose, filters, onChange, resultCount }: Props) {
  const [draft, setDraft] = useState<FilterState>(filters);
  useEffect(() => {
    if (open) setDraft(clone(filters));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalSelected = draft.categories.size + draft.sizes.size + draft.colors.size;

  /* Instant apply — products update the moment a filter is tapped */
  const apply = (next: FilterState) => {
    setDraft(next);
    onChange(next);
  };

  const toggle = (set: Set<string>, val: string) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="bg-porcelain fixed inset-y-0 right-0 z-[90] flex w-full max-w-[400px] flex-col shadow-2xl"
            aria-label="Filters"
          >
            {/* Head */}
            <div className="border-line flex h-16 shrink-0 items-center justify-between border-b px-5">
              <p className="flex items-center gap-2.5 text-[13px] font-bold tracking-[0.16em] uppercase">
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
                All Filters
              </p>
              <div className="flex items-center gap-2">
                {totalSelected > 0 && (
                  <button
                    onClick={() => apply(EMPTY_FILTERS)}
                    className="text-clay text-[11px] font-bold tracking-wide uppercase"
                  >
                    Clear all
                  </button>
                )}
                <button onClick={onClose} aria-label="Close filters" className="hover:bg-ivory -mr-2 rounded-full p-2 transition-colors">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              {totalSelected === 0 && (
                <p className="text-faint py-4 text-[12.5px] italic">No filter selected — showing everything.</p>
              )}

              <Group title="Category">
                <div className="space-y-1">
                  {CATEGORY_FILTERS.map((c) => {
                    const active = draft.categories.has(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => apply({ ...draft, categories: toggle(draft.categories, c.id) })}
                        className="group flex w-full items-center gap-3 rounded-sm py-2.5 text-left"
                      >
                        <span
                          className={cx(
                            "flex h-[18px] w-[18px] items-center justify-center border transition-colors",
                            active ? "bg-ink border-ink" : "border-faint/50 group-hover:border-ink"
                          )}
                        >
                          {active && <Check className="text-porcelain h-3 w-3" strokeWidth={3} />}
                        </span>
                        <span className={cx("text-[14px]", active ? "font-semibold" : "text-smoke")}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Group>

              <Group title="Size">
                <div className="flex flex-wrap gap-2">
                  {SIZE_FILTERS.map((s) => {
                    const active = draft.sizes.has(s.value);
                    return (
                      <button
                        key={s.value}
                        disabled={s.disabled}
                        onClick={() => apply({ ...draft, sizes: toggle(draft.sizes, s.value) })}
                        className={cx(
                          "min-w-[48px] border px-3 py-2.5 text-[12.5px] font-semibold transition-all",
                          active
                            ? "bg-ink text-porcelain border-ink"
                            : s.disabled
                              ? "border-line text-faint/50 cursor-not-allowed line-through"
                              : "border-line hover:border-ink"
                        )}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-faint mt-3 text-[11px] italic">2XL — coming soon to the live store.</p>
              </Group>

              <Group title="Colour">
                <div className="grid grid-cols-2 gap-1">
                  {COLOR_FILTERS.map((c) => {
                    const active = draft.colors.has(c.label);
                    return (
                      <button
                        key={c.label}
                        onClick={() => apply({ ...draft, colors: toggle(draft.colors, c.label) })}
                        className={cx(
                          "flex items-center gap-2.5 rounded-sm border px-3 py-2.5 text-left transition-all",
                          active ? "border-ink bg-ivory/60" : "border-transparent hover:border-line"
                        )}
                      >
                        <span
                          className="border-line relative h-[18px] w-[18px] shrink-0 rounded-full border"
                          style={{ backgroundColor: c.hex }}
                        >
                          {active && (
                            <Check
                              className={cx(
                                "absolute inset-0 m-auto h-3 w-3",
                                ["White", "Beige", "Nude", "Yellow"].includes(c.label) ? "text-black" : "text-white"
                              )}
                              strokeWidth={3}
                            />
                          )}
                        </span>
                        <span className={cx("text-[13px]", active ? "font-semibold" : "text-smoke")}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Group>
            </div>

            {/* Footer */}
            <div className="border-line shrink-0 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p className="text-faint mb-2.5 text-center text-[11px]">
                Filters apply instantly — showing {resultCount} item{resultCount === 1 ? "" : "s"}
              </p>
              <button
                onClick={onClose}
                className="bg-ink text-porcelain w-full py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                View results
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
