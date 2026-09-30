import { useState } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { InstagramIcon, PinterestIcon, TikTokIcon, WhatsAppIcon } from "./icons";
import { FIXED_LIGHT, track, whatsappLink } from "../lib/shop";
import { PaymentRow } from "./payments";

const SOCIALS = [
  { icon: InstagramIcon, label: "Instagram — @flaya.official", href: "https://instagram.com" },
  { icon: PinterestIcon, label: "Pinterest — save your next FLAYA look", href: "https://pinterest.com" },
  { icon: TikTokIcon, label: "TikTok — @flaya.official", href: "https://tiktok.com" },
  { icon: WhatsAppIcon, label: "WhatsApp — we reply within hours", href: whatsappLink("Hi FLAYA! I have a question.") },
];
import { useStore } from "../store/StoreContext";

export default function Footer() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setEmail("");
    pushToast("Welcome to the FLAYA list — you’re on it.");
  };

  return (
    <footer style={FIXED_LIGHT as React.CSSProperties} className="bg-ink text-porcelain mt-24">
      {/* Newsletter */}
      <div className="border-porcelain/10 border-b">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 md:grid-cols-2 md:items-center md:px-10 md:py-16">
          <div>
            <p className="text-porcelain/50 text-[10px] font-bold tracking-[0.3em] uppercase">The FLAYA List</p>
            <h3 className="font-serif mt-3 text-3xl font-light leading-tight md:text-4xl">
              New drops, capsule styling notes,
              <br className="hidden md:block" /> and private previews.
            </h3>
          </div>
          <form onSubmit={subscribe} className="w-full">
            <div className="border-porcelain/30 focus-within:border-porcelain flex items-center gap-3 border-b pb-3 transition-colors">
              <Mail className="text-porcelain/50 h-5 w-5 shrink-0" strokeWidth={1.5} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-porcelain/40"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-porcelain text-ink shrink-0 rounded-full p-2.5 transition-transform hover:scale-105 active:scale-95"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <p className="text-porcelain/40 mt-3 text-[11px] leading-relaxed">
              One considered email a week. No noise, unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>

      {/* Link columns — reduced structure per approved audit */}
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="font-serif text-[28px] font-medium tracking-[0.14em]">FLAYA</p>
          <p className="text-porcelain/60 mt-4 max-w-sm text-[13.5px] leading-relaxed">
            Premium modest fashion designed in Dubai. Abayas, dresses and capsule pieces made to be worn together —
            shipped across the UAE and worldwide.
          </p>
          <div className="mt-6 space-y-2.5 text-[13px]">
            <p className="text-porcelain/60 flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} /> Dubai, United Arab Emirates
            </p>
            <a
              href={whatsappLink("Hi FLAYA! I have a question.")}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("whatsapp_click", { source: "footer" })}
              className="text-porcelain/60 hover:text-porcelain flex items-center gap-2.5 transition-colors"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" /> WhatsApp us — we reply within hours
            </a>
            <a href="mailto:contact@flaya.store" className="text-porcelain/60 hover:text-porcelain flex items-center gap-2.5 transition-colors">
              <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} /> contact@flaya.store
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-porcelain/40 mb-4 text-[10px] font-bold tracking-[0.26em] uppercase">Customer care</p>
          <ul className="space-y-2.5 text-[13.5px]">
            <li><a href="#/delivery" className="text-porcelain/70 hover:text-porcelain transition-colors">Delivery & Exchanges</a></li>
            <li><a href="#/delivery" className="text-porcelain/70 hover:text-porcelain transition-colors">Exchange Policy</a></li>
            <li><a href="#/contact" className="text-porcelain/70 hover:text-porcelain transition-colors">Contact Us</a></li>
            <li><a href="#/shop/all" className="text-porcelain/70 hover:text-porcelain transition-colors">Size Guide</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-porcelain/40 mb-4 text-[10px] font-bold tracking-[0.26em] uppercase">Collections</p>
          <ul className="space-y-2.5 text-[13.5px]">
            <li><a href="#/about" className="text-porcelain/70 hover:text-porcelain transition-colors">About FLAYA</a></li>
            <li><a href="#/shop/all?collection=the-capsule" className="text-porcelain/70 hover:text-porcelain transition-colors">Capsule Collection</a></li>
            <li><a href="#/shop/all?collection=emirati-satin" className="text-porcelain/70 hover:text-porcelain transition-colors">Satin Collection</a></li>
            <li><a href="#/shop/all?collection=velvet" className="text-porcelain/70 hover:text-porcelain transition-colors">Velvet Abaya</a></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-porcelain/40 mb-4 text-[10px] font-bold tracking-[0.26em] uppercase">Follow FLAYA</p>
          <div className="space-y-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => s.label.startsWith("WhatsApp") && track("whatsapp_click", { source: "footer" })}
                className="group flex items-center gap-3 text-[13.5px] text-porcelain/70 transition-colors hover:text-porcelain"
              >
                <span className="border-porcelain/20 group-hover:border-porcelain group-hover:bg-porcelain group-hover:text-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all">
                  <s.icon className="h-[16px] w-[16px]" />
                </span>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Legal strip */}
      <div className="border-porcelain/10 border-t">
        <div className="text-porcelain/40 mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 px-5 py-5 text-[11px] md:flex-row md:items-center md:px-10">
          <p>© 2026 FLAYA FZ-LLC · Dubai, UAE. All rights reserved.</p>
          <PaymentRow light className="[&_svg]:h-5 [&_svg]:w-8" />
          <p>FLAYA operates an exchange-only policy. No cash refunds — see Exchange Policy.</p>
        </div>
      </div>
    </footer>
  );
}
