import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle, PackageCheck, RefreshCw, Truck } from "lucide-react";
import { cx, track, whatsappLink } from "../lib/shop";

function Section({ title, children, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-line border-b">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-5 text-left">
        <span className="font-serif text-[18px] font-medium md:text-[20px]">{title}</span>
        <ChevronDown className={cx("text-faint h-4 w-4 shrink-0 transition-transform duration-300", open && "rotate-180")} strokeWidth={1.5} />
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
            <div className="text-smoke space-y-3 pb-6 text-[13.5px] leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={className}>{children}</p>;
}
function UL({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((i) => (
        <li key={i.slice(0, 24)}>{i}</li>
      ))}
    </ul>
  );
}

export default function DeliveryPage() {
  return (
    <main className="mx-auto max-w-[860px] px-5 pb-10 md:px-8">
      <header className="pb-4 pt-10 md:pt-14">
        <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">Customer Care</p>
        <h1 className="font-serif mt-2 text-[36px] font-light leading-tight md:text-[52px]">Delivery & Exchanges</h1>
        <p className="text-faint mt-3 max-w-xl text-[13.5px] leading-relaxed">
          Everything about how your FLAYA order reaches you — and how exchanges work. Last updated 13 May 2026.
        </p>
      </header>

      {/* Quick answer cards */}
      <div className="grid gap-3 py-6 sm:grid-cols-3">
        {[
          { icon: Truck, t: "Next day in Dubai", s: "Order before 8:00 PM GST" },
          { icon: PackageCheck, t: "UAE 2–3 days", s: "Other Emirates · International 5–7 days" },
          { icon: RefreshCw, t: "Exchange only", s: "14 days · no cash refunds" },
        ].map((c, i) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-ivory/70 border-line border p-5"
          >
            <c.icon className="text-taupe h-5 w-5" strokeWidth={1.5} />
            <p className="mt-3 text-[13px] font-bold leading-tight">{c.t}</p>
            <p className="text-faint mt-1 text-[11.5px] leading-snug">{c.s}</p>
          </motion.div>
        ))}
      </div>

      <div className="border-line border-t">
        <Section title="Delivery Policy" defaultOpen>
          <P>At Flaya, we aim to deliver your abayas and dresses as quickly and smoothly as possible.</P>
          <P>
            <span className="text-ink font-semibold">1 · Delivery areas.</span> Dubai — next day delivery available
            (see cut-off below). Other Emirates (Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah, Al Ain) — 2–3
            business days.
          </P>
          <P>
            <span className="text-ink font-semibold">2 · Dubai deliveries.</span> Orders placed before 8:00 PM GST
            are eligible for next day FREE delivery within Dubai. Orders after 8:00 PM GST are processed the next
            day and delivered the day after. Example: order at 7:30 PM → delivered next day; order at 9:15 PM →
            processed next day → delivered the following day.
          </P>
          <P>
            <span className="text-ink font-semibold">3 · Other Emirates.</span> Orders placed before 8:00 PM GST
            arrive within 2–3 business days; later orders begin processing the next day.
          </P>
          <P>
            <span className="text-ink font-semibold">4 · Delivery charges.</span> Free UAE delivery on orders above
            AED 500. Orders below the threshold carry a standard courier fee shown at checkout.
          </P>
          <P>
            <span className="text-ink font-semibold">5 · Timeframe notes.</span> Delivery days are calculated on
            courier working days. Delays may occur during weekends, public holidays, sale periods or bad weather. If
            the courier cannot reach you, they may re-attempt delivery or contact you.
          </P>
          <P>
            <span className="text-ink font-semibold">6 · Order & contact details.</span> Please ensure your mobile
            number, full address and location details are correct — failed deliveries due to incomplete addresses
            may cause delays.
          </P>
          <P>
            <span className="text-ink font-semibold">7 · International delivery.</span> FLAYA ships worldwide in
            5–7 business days depending on destination. Shipping is calculated at checkout; customs duties or
            import fees may apply per your country’s regulations. Timelines may vary during holidays, customs
            clearance or peak periods. Every FLAYA piece is carefully packed to arrive beautifully, wherever you
            are.
          </P>
        </Section>

        <Section title="Exchange Policy">
          <P>
            Flaya provides exchanges only. We do not offer refunds — our abayas and dresses are curated, limited in
            quantity, and must remain in new, hygienic and resellable condition for all customers. Please read the
            terms below carefully before requesting an exchange.
          </P>
          <P className="text-ink font-semibold">Exchange eligibility</P>
          <UL
            items={[
              "Exchanges can be requested within 14 days of the delivery date.",
              "The item must be unworn, unused, and unwashed.",
              "All original Flaya tags and labels must still be attached.",
              "The item should be in its original packaging where possible.",
              "The item must be in a clean, resellable condition.",
            ]}
          />
          <P>Flaya reserves the right to refuse an exchange if any of the above conditions are not met.</P>
          <P className="text-ink font-semibold">No refunds</P>
          <P>
            This policy maintains hygiene standards and product presentation. Because items are limited and often
            made in small batches, returned items cannot always be placed back into stock as “new” — we therefore
            offer exchanges only, within 14 days, subject to inspection and stock availability.
          </P>
          <P className="text-ink font-semibold">How to request an exchange</P>
          <UL
            items={[
              "Contact Flaya via WhatsApp with your order number and last name.",
              "Mention the size or item you wish to exchange to, if known.",
              "Our team will confirm the request falls within 14 days and that the requested item is available.",
              "All exchanges are subject to approval by the Flaya team.",
            ]}
          />
          <P className="text-ink font-semibold">Exchange fees</P>
          <P>
            An exchange fee applies to every approved exchange: <span className="text-ink font-semibold">AED 20 in Dubai · AED 30 in other Emirates</span>,
            covering courier collection and processing. The fee can be paid by payment link or bank transfer, and
            the exchange proceeds once the fee has been paid.
          </P>
          <P className="text-ink font-semibold">Courier collection & inspection</P>
          <P>
            Once approved, Flaya arranges courier collection. The item is inspected on arrival — if it passes, your
            exchange item is dispatched; if it shows wear, perfume or makeup marks, damage or missing tags, the
            exchange may be refused and the original item returned to you.
          </P>
          <P>
            Exchanges are always subject to stock availability. If your requested size or item is unavailable, our
            team will suggest alternatives. By placing an order with Flaya you agree to the terms of this exchange
            policy.
          </P>
        </Section>

        <Section title="International Orders">
          <P>
            Estimated international delivery time is 5–7 business days. Shipping charges are calculated
            automatically at checkout.
          </P>
          <P className="text-clay font-semibold">
            Please note: international orders are not eligible for exchange or refund.
          </P>
          <P>
            Customs duties or import fees may apply depending on your country. For sizing or delivery assistance
            before placing your order, contact us via WhatsApp.
          </P>
        </Section>
      </div>

      <a
        href={whatsappLink("Hi FLAYA! I have a question about delivery or an exchange. My order number is: ")}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("whatsapp_click", { source: "delivery_page" })}
        className="bg-ink text-porcelain mt-8 flex w-full items-center justify-center gap-2.5 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
        Ask us on WhatsApp
      </a>
    </main>
  );
}
