import { motion } from "framer-motion";
import { track, whatsappLink } from "../lib/shop";
import { WhatsAppIcon } from "./icons";

/* Single WhatsApp chat entry point (per audit: exactly one floating button) */
export default function WhatsAppFab() {
  return (
    <motion.a
      href={whatsappLink("Hi FLAYA! I have a question.")}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("whatsapp_click", { source: "floating_button" })}
      aria-label="Chat with FLAYA on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6, type: "spring", damping: 16, stiffness: 260 }}
      className="group fixed bottom-5 right-5 z-[64] flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] p-3.5 shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition-shadow hover:shadow-[0_16px_40px_rgba(37,211,102,0.55)] md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0 text-white" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[12px] font-bold text-white transition-all duration-500 group-hover:ml-2 group-hover:max-w-[130px] md:block">
        Chat with us
      </span>
    </motion.a>
  );
}
