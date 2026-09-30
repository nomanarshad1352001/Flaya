import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "../components/icons";
import { track, whatsappLink } from "../lib/shop";

const CHANNELS = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    note: "Chat with us directly — sizing, styling, orders and exchanges. We reply within hours.",
    action: "Start a chat",
    href: whatsappLink("Hi FLAYA! I have a question."),
    event: "whatsapp_click" as const,
    external: true,
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    note: "Send us a DM — and see how the FLAYA circle styles every piece daily.",
    action: "@flaya.official",
    href: "https://instagram.com",
    external: true,
  },
  {
    icon: Mail,
    title: "Email",
    note: "For order queries, press and partnerships — reach us any time.",
    action: "contact@flaya.store",
    href: "mailto:contact@flaya.store",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[960px] px-5 pb-10 md:px-8">
      <header className="pb-8 pt-10 md:pt-14">
        <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">We’re Here</p>
        <h1 className="font-serif mt-2 text-[36px] font-light leading-tight md:text-[52px]">
          Get in touch with <em className="italic">FLAYA</em>
        </h1>
        <p className="text-faint mt-3 max-w-lg text-[13.5px] leading-relaxed">
          Real humans, quick replies. The fastest way to reach us is WhatsApp.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3 md:gap-5">
        {CHANNELS.map((c, i) => (
          <motion.a
            key={c.title}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noreferrer" : undefined}
            onClick={() => c.event === "whatsapp_click" && track("whatsapp_click", { source: "contact_page" })}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group border-line hover:border-taupe/60 flex flex-col border p-6 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="bg-ivory flex h-11 w-11 items-center justify-center rounded-full">
                <c.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="text-faint h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </div>
            <p className="font-serif mt-5 text-[20px] font-medium">{c.title}</p>
            <p className="text-smoke mt-2 flex-1 text-[13px] leading-relaxed">{c.note}</p>
            <p className="link-underline mt-4 inline-flex text-[12px] font-bold tracking-[0.14em] uppercase">{c.action}</p>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.55 }}
        className="bg-ivory/70 border-line mt-10 flex flex-col gap-6 border p-6 md:flex-row md:items-center md:justify-between md:p-8"
      >
        <div className="flex items-start gap-3.5">
          <MapPin className="text-taupe mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[13.5px] font-bold">FLAYA Atelier — Dubai, United Arab Emirates</p>
            <p className="text-faint mt-1 text-[12px] leading-relaxed">Visits by appointment only.</p>
          </div>
        </div>
        <div className="flex items-start gap-3.5">
          <Clock className="text-taupe mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[13.5px] font-bold">Customer care hours</p>
            <p className="text-faint mt-1 text-[12px] leading-relaxed">Saturday – Thursday · 9:00 – 18:00 GST</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
