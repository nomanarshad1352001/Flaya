export type RegionCode = "AE" | "SA" | "GB" | "US" | "EU";

export interface Region {
  code: RegionCode;
  label: string;
  currency: string;
  rate: number; // from AED
  freeDeliveryEligible: boolean;
}

export const REGIONS: Region[] = [
  { code: "AE", label: "United Arab Emirates", currency: "AED", rate: 1, freeDeliveryEligible: true },
  { code: "SA", label: "Saudi Arabia", currency: "SAR", rate: 1.02, freeDeliveryEligible: false },
  { code: "GB", label: "United Kingdom", currency: "GBP", rate: 0.21, freeDeliveryEligible: false },
  { code: "US", label: "United States", currency: "USD", rate: 0.27, freeDeliveryEligible: false },
  { code: "EU", label: "Europe", currency: "EUR", rate: 0.25, freeDeliveryEligible: false },
];

/** Free delivery threshold in AED (UAE orders only) */
export const FREE_DELIVERY_THRESHOLD_AED = 500;

export function formatMoney(aed: number, region: Region): string {
  const converted = aed * region.rate;
  const isWhole = Math.abs(converted - Math.round(converted)) < 0.005;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: region.currency,
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(converted);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Forces the light token palette inside a subtree — for white text over photography in dark mode */
export const FIXED_LIGHT: Record<string, string> = {
  "--color-porcelain": "#fbfaf7",
  "--color-ink": "#1c1917",
};

/* ---------------- Analytics ----------------
 * Prototype event bus mirroring the approved tracking plan.
 * Events are pushed to window.dataLayer for GTM / analytics pickup. */

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

export type AnalyticsEvent =
  | "view_item_list"
  | "select_item"
  | "view_item"
  | "select_variant"
  | "size_guide_open"
  | "whatsapp_click"
  | "add_to_cart"
  | "view_cart"
  | "begin_checkout"
  | "purchase"
  | "complete_the_look_click"
  | "cross_sell_add_to_cart"
  | "review_interaction"
  | "delivery_progress_reached";

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload, ts: Date.now() });
}

/* WhatsApp helper — message carries product context per approved spec */
export function whatsappLink(message: string): string {
  return `https://wa.me/971501234567?text=${encodeURIComponent(message)}`;
}
