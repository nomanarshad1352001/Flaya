import { AnimatePresence, motion } from "framer-motion";
import { Ruler, X } from "lucide-react";
import { SIZE_GUIDE } from "../data/store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SizeGuide({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="bg-porcelain fixed inset-x-0 bottom-0 z-[90] max-h-[86svh] overflow-y-auto overscroll-contain rounded-t-2xl p-6 md:inset-0 md:m-auto md:h-fit md:max-w-lg md:rounded-none md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-taupe flex items-center gap-1.5 text-[10px] font-bold tracking-[0.26em] uppercase">
                  <Ruler className="h-3.5 w-3.5" strokeWidth={1.8} /> Size Guide
                </p>
                <h3 className="font-serif mt-2 text-2xl font-light">Find your FLAYA fit</h3>
              </div>
              <button onClick={onClose} aria-label="Close size guide" className="hover:bg-ivory -mr-2 rounded-full p-2 transition-colors">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <p className="text-smoke mt-4 text-[13px] leading-relaxed">
              Measurements in centimetres, taken on the body. FLAYA pieces are cut with a modest, relaxed drape —
              if you are between sizes, we suggest sizing down for dresses and staying true for abayas.
            </p>

            <div className="border-line mt-6 overflow-x-auto border">
              <table className="w-full min-w-[420px] text-[12.5px]">
                <thead>
                  <tr className="bg-ivory text-[10px] font-bold tracking-[0.14em] uppercase">
                    <th className="px-3 py-3 text-left">Size</th>
                    <th className="px-3 py-3 text-left">Bust</th>
                    <th className="px-3 py-3 text-left">Waist</th>
                    <th className="px-3 py-3 text-left">Hip</th>
                    <th className="px-3 py-3 text-left">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-line divide-y">
                  {SIZE_GUIDE.map((row) => (
                    <tr key={row.size} className="hover:bg-ivory/60 transition-colors">
                      <td className="px-3 py-3 font-bold">{row.size}</td>
                      <td className="px-3 py-3">{row.bust}</td>
                      <td className="px-3 py-3">{row.waist}</td>
                      <td className="px-3 py-3">{row.hip}</td>
                      <td className="px-3 py-3">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="text-faint mt-5 space-y-1.5 text-[12px] leading-relaxed">
              <li>· Abayas and overlays include ease for layering — no need to size up.</li>
              <li>· Hem length is measured from the highest shoulder point.</li>
              <li>· Unsure? Message us your height and usual size on WhatsApp — we reply within hours.</li>
            </ul>

            <p className="text-faint/70 mt-5 border-line border-t pt-4 text-[10.5px] italic">
              Sample chart for prototype — final FLAYA measurements supplied by the atelier.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
