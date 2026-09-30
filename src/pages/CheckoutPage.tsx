import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, Check, ChevronDown, ChevronLeft, CreditCard, Lock, Truck } from "lucide-react";
import { productById } from "../data/store";
import { REGIONS, cx, track } from "../lib/shop";
import { useStore } from "../store/StoreContext";
import { GooglePayLogo, PaymentRow } from "../components/payments";

const aed = (n: number) => `AED ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface ShipOption {
  id: string;
  label: string;
  note: string;
  price: number;
}

function Field({ label, optional, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; optional?: boolean }) {
  return (
    <label className="block">
      <span className="text-faint mb-1.5 block text-[11px] font-semibold tracking-wide">
        {label} {optional && <span className="font-normal">(optional)</span>}
      </span>
      <input
        {...props}
        className="border-line focus:border-ink w-full border bg-transparent px-4 py-3.5 text-[14px] outline-none transition-colors placeholder:text-faint/60"
      />
    </label>
  );
}

export default function CheckoutPage() {
  const { cart, subtotal, region, setRegion, clearCart } = useStore();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [codeMsg, setCodeMsg] = useState<string | null>(null);
  const [shipId, setShipId] = useState<string | null>(null);
  const [news, setNews] = useState(true);
  const [placed, setPlaced] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  const shipping: ShipOption[] = useMemo(() => {
    if (region.code === "AE") {
      const free = subtotal - discount >= 500;
      return [
        { id: "dxb", label: "Dubai — Next Day Delivery", note: "Order before 8:00 PM GST", price: free ? 0 : 25 },
        { id: "uae", label: "Other Emirates — 2–3 Business Days", note: "Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah, Al Ain", price: free ? 0 : 30 },
      ];
    }
    return [
      { id: "intl", label: `${region.label} — International Express 5–7 days`, note: "Duties & customs may apply", price: 133 },
    ];
  }, [region, subtotal, discount]);

  const selectedShip = shipping.find((s) => s.id === shipId) ?? null;
  const total = Math.max(0, subtotal - discount) + (selectedShip?.price ?? 0);

  const applyCode = () => {
    if (code.trim().toUpperCase() === "FLAYA10") {
      const d = Math.round(subtotal * 0.1);
      setDiscount(d);
      setCodeMsg(`Applied — you saved ${aed(d)}`);
    } else {
      setCodeMsg("Code not recognised. Try FLAYA10 (staging demo).");
    }
  };

  const finalize = () => {
    if (!selectedShip) {
      setCodeMsg("Please choose a shipping method to continue.");
      document.getElementById("shipping")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const orderId = `FL-${Math.floor(100000 + Math.random() * 899999)}`;
    track("purchase", { order_id: orderId, value: total, currency: "AED", shipping: selectedShip.id, discount });
    clearCart();
    setPlaced(orderId);
    window.scrollTo({ top: 0 });
  };

  if (placed) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 14, stiffness: 200 }} className="bg-moss/10 text-moss flex h-20 w-20 items-center justify-center rounded-full">
          <Check className="h-9 w-9" strokeWidth={2} />
        </motion.span>
        <h1 className="font-serif mt-7 text-4xl font-light">Shukran — order confirmed</h1>
        <p className="text-smoke mt-3 text-[14.5px] leading-relaxed">
          Order <span className="text-ink font-semibold">{placed}</span> is confirmed. On the live store you’d
          receive a confirmation email and a WhatsApp message with tracking. This staging checkout took no payment.
        </p>
        <a href="#/shop/new" className="bg-ink text-porcelain mt-8 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase">
          Continue shopping
        </a>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="font-serif text-4xl font-light">Your bag is empty</h1>
        <p className="text-faint mt-3 text-sm">Add something beautiful before checking out.</p>
        <a href="#/shop/new" className="bg-ink text-porcelain mt-8 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase">
          Shop New Collection
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 md:px-8">
      <header className="flex items-center justify-between py-6 md:py-8">
        <div>
          <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">FLAYA Checkout</p>
          <h1 className="font-serif mt-1.5 text-[26px] font-light md:text-[34px]">Almost yours</h1>
        </div>
        <a href="#/cart" className="link-underline flex items-center gap-1.5 text-[12px] font-semibold">
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} /> Back to bag
        </a>
      </header>

      {/* Express checkout */}
      <div className="border-line mb-8 border p-5 md:p-6">
        <p className="text-faint mb-3 text-center text-[10.5px] font-bold tracking-[0.22em] uppercase">Express checkout</p>
        <div className="flex justify-center">
          <button
            onClick={finalize}
            className="flex w-full max-w-sm items-center justify-center gap-2.5 bg-black py-3.5 text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <GooglePayLogo className="h-6 w-10" />
            <span className="text-[12px] font-semibold">Pay with Google Pay</span>
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="bg-line h-px flex-1" />
          <span className="text-faint text-[10.5px] font-bold tracking-[0.2em]">OR</span>
          <span className="bg-line h-px flex-1" />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        {/* --------------------------- Form column --------------------------- */}
        <div className="space-y-8">
          {/* Contact */}
          <section>
            <h2 className="text-[13px] font-bold tracking-[0.14em] uppercase">Contact</h2>
            <div className="mt-3">
              <Field
                label="Email or mobile phone number"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <label className="text-smoke mt-3 flex items-center gap-2.5 text-[12.5px]">
                <input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} className="accent-ink h-4 w-4" />
                Email me with news and offers
              </label>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="text-[13px] font-bold tracking-[0.14em] uppercase">Delivery</h2>
            <div className="mt-3 grid gap-3">
              <label className="block">
                <span className="text-faint mb-1.5 block text-[11px] font-semibold tracking-wide">Country / Region</span>
                <div className="relative">
                  <select
                    value={region.code}
                    onChange={(e) => {
                      setRegion(e.target.value as typeof region.code);
                      setShipId(null);
                    }}
                    className="border-line focus:border-ink w-full appearance-none border bg-transparent px-4 py-3.5 text-[14px] outline-none"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="text-faint pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" strokeWidth={1.5} />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" optional value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Maria" />
                <Field label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ahmed" />
              </div>
              <Field label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, building" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dubai" />
                <Field label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 5x xxx xxxx" />
              </div>
            </div>
          </section>

          {/* Shipping method */}
          <section id="shipping">
            <h2 className="text-[13px] font-bold tracking-[0.14em] uppercase">Shipping method</h2>
            <div className="mt-3 space-y-2.5">
              {shipping.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShipId(s.id)}
                  className={cx(
                    "flex w-full items-center gap-3.5 border p-4 text-left transition-all",
                    shipId === s.id ? "border-ink bg-ivory/60" : "border-line hover:border-faint"
                  )}
                >
                  <span className={cx("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors", shipId === s.id ? "border-ink" : "border-line")}>
                    {shipId === s.id && <span className="bg-ink h-2.5 w-2.5 rounded-full" />}
                  </span>
                  <Truck className="text-taupe h-5 w-5 shrink-0" strokeWidth={1.5} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-bold leading-tight">{s.label}</span>
                    <span className="text-faint text-[11.5px]">{s.note}</span>
                  </span>
                  <span className="text-[13.5px] font-bold">{s.price === 0 ? <span className="text-moss">FREE</span> : aed(s.price)}</span>
                </button>
              ))}
              {!selectedShip && codeMsg?.includes("shipping") && (
                <p className="text-clay text-[12px] font-semibold">{codeMsg}</p>
              )}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-[13px] font-bold tracking-[0.14em] uppercase">Payment</h2>
            <p className="text-faint mt-1.5 flex items-center gap-1.5 text-[11.5px]">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.6} /> All transactions are secure and encrypted.
            </p>
            <div className="border-line mt-3 border">
              <div className="border-line flex items-center justify-between border-b px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-[13.5px] font-bold">
                  <CreditCard className="h-[18px] w-[18px]" strokeWidth={1.5} /> Credit card
                </span>
                <PaymentRow className="hidden sm:flex" />
              </div>
              <div className="space-y-3 p-4">
                <Field label="Card number" placeholder="1234 5678 9012 3456" inputMode="numeric" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry" placeholder="MM / YY" inputMode="numeric" />
                  <Field label="CVC" placeholder="•••" inputMode="numeric" />
                </div>
                <Field label="Name on card" placeholder="As printed" />
              </div>
              <div className="border-line flex items-center justify-between border-t px-4 py-3">
                <p className="text-[12px] text-smoke">Or pay instantly with</p>
                <div className="flex items-center gap-2">
                  <GooglePayLogo className="h-5 w-8" />
                  <PaymentRow className="!gap-1 [&_svg]:h-4 [&_svg]:w-7" />
                </div>
              </div>
            </div>
          </section>

          <button
            onClick={finalize}
            className="bg-ink text-porcelain flex w-full items-center justify-center gap-2.5 py-[18px] text-[12px] font-bold tracking-[0.22em] uppercase transition-all hover:opacity-90 active:scale-[0.99]"
          >
            <Lock className="h-4 w-4" strokeWidth={1.8} /> Finalize order — {aed(total)}
          </button>
          <p className="text-center text-faint text-[10.5px]">Staging prototype — no payment is processed.</p>

          {/* Cancellations policy */}
          <section className="border-line border-t pt-6">
            <button onClick={() => setShowCancel((v) => !v)} className="flex w-full items-center justify-between">
              <span className="text-[13px] font-bold tracking-[0.14em] uppercase">Cancellations</span>
              <ChevronDown className={cx("text-faint h-4 w-4 transition-transform", showCancel && "rotate-180")} strokeWidth={1.5} />
            </button>
            <AnimatePresence initial={false}>
              {showCancel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="text-smoke space-y-3 pt-4 text-[12.5px] leading-relaxed">
                    <p>
                      Some items may be offered as a subscription, a pre-order or try before you buy. This policy
                      explains how those purchases can be changed or cancelled.
                    </p>
                    <p>
                      <span className="text-ink font-semibold">Subscriptions.</span> Repeat deliveries based on the
                      duration and frequency you select. Payment details are stored securely and charged per
                      delivery unless paid in advance. You can cancel or change a subscription at any time via the
                      links in your order confirmation emails.
                    </p>
                    <p>
                      <span className="text-ink font-semibold">Pre-orders.</span> You are buying an out-of-stock or
                      soon-to-be-available product. We may collect no payment or a partial deposit at checkout,
                      then fulfil and charge the remainder later. A partially paid pre-order that has not been
                      fulfilled can be cancelled; once fulfilled, see our exchange policy.
                    </p>
                    <p>
                      <span className="text-ink font-semibold">Try before you buy.</span> We authorise your payment
                      method before fulfilling the order. You have a set period to decide; if the item is not
                      returned within it, the full amount is charged.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* --------------------------- Summary column --------------------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-ivory/60 border-line border p-5 md:p-6">
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase">Order summary</p>
            <ul className="divide-line mt-4 divide-y">
              {cart.map((line) => {
                const p = productById(line.productId);
                if (!p) return null;
                const v = p.colors.find((c) => c.name === line.color) || p.colors[0];
                return (
                  <li key={line.key} className="flex items-center gap-3.5 py-3.5">
                    <div className="relative shrink-0">
                      <img src={v.images[0]} alt={p.name} width={64} height={80} loading="lazy" className="bg-ivory h-20 w-16 object-cover object-top" />
                      <span className="bg-ink text-porcelain absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                        {line.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold leading-snug">{p.name}</p>
                      <p className="text-faint text-[11px]">{line.color} · {line.size}</p>
                    </div>
                    <p className="text-[13px] font-semibold">{aed(p.price * line.qty)}</p>
                  </li>
                );
              })}
            </ul>

            {/* Discount */}
            <div className="border-line mt-4 border-t pt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <BadgePercent className="text-faint absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" strokeWidth={1.6} />
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Discount code"
                    className="border-line focus:border-ink w-full border bg-transparent py-3 pl-9 pr-3 text-[13px] outline-none placeholder:text-faint/60"
                  />
                </div>
                <button onClick={applyCode} className="bg-ink text-porcelain shrink-0 px-5 text-[11px] font-bold tracking-[0.14em] uppercase">
                  Apply
                </button>
              </div>
              {codeMsg && !codeMsg.includes("shipping") && (
                <p className={cx("mt-2 text-[11.5px] font-semibold", discount > 0 ? "text-moss" : "text-clay")}>{codeMsg}</p>
              )}
            </div>

            {/* Totals */}
            <dl className="border-line mt-4 space-y-2 border-t pt-4 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal · {cart.reduce((n, l) => n + l.qty, 0)} items</dt>
                <dd className="font-semibold">{aed(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="text-moss flex justify-between">
                  <dt>Discount (FLAYA10)</dt>
                  <dd className="font-semibold">−{aed(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-smoke">Shipping</dt>
                <dd className="font-semibold">
                  {selectedShip ? (selectedShip.price === 0 ? "FREE" : aed(selectedShip.price)) : "—"}
                </dd>
              </div>
              <div className="border-line flex justify-between border-t pt-3 text-[15px]">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold">{aed(total)}</dd>
              </div>
            </dl>
          </div>
          <p className="text-faint mt-4 text-center text-[11px] leading-relaxed">
            Exchange-only policy applies to UAE orders. International orders are final sale.
          </p>
        </aside>
      </div>
    </main>
  );
}
