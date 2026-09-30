import { motion } from "framer-motion";
import { ArrowRight, Globe, MapPin, Sparkles } from "lucide-react";
import { EDITORIAL, px } from "../data/store";
import { FIXED_LIGHT } from "../lib/shop";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const VALUES = [
  {
    icon: Sparkles,
    title: "Designed in Dubai",
    text: "Every silhouette begins in our Dubai atelier — sketched, draped and refined against the rhythm of the city.",
  },
  {
    icon: MapPin,
    title: "Handcrafted, small batch",
    text: "Limited runs, hand-finished seams. We make fewer pieces and make them properly.",
  },
  {
    icon: Globe,
    title: "Made for movement",
    text: "From a family gathering to a dinner in DIFC to a flight to Riyadh or London — one wardrobe, every world.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section style={FIXED_LIGHT as React.CSSProperties} className="relative flex min-h-[68svh] items-end overflow-hidden md:min-h-[76vh]">
        <img
          src={px(7814845, 1600, 1200)}
          alt="FLAYA atelier — woman in white hijab in soft studio light"
          width={1600}
          height={1200}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-14 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-porcelain/80 text-[10px] font-bold tracking-[0.34em] uppercase"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-porcelain mt-4 max-w-[640px] text-[38px] font-light leading-[1.05] md:text-[60px]"
          >
            About <em className="italic">FLAYA</em>
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24">
        <motion.div {...fadeUp()}>
          <p className="text-taupe text-[10px] font-bold tracking-[0.3em] uppercase">Born in Dubai</p>
          <h2 className="font-serif mt-3 text-[30px] font-light leading-[1.15] md:text-[40px]">
            Women here don’t choose between modesty and glamour.
            <span className="text-taupe italic"> They master both.</span>
          </h2>
        </motion.div>
        <motion.div {...fadeUp(0.12)} className="space-y-5 text-[15px] leading-relaxed text-smoke">
          <p>
            FLAYA was born in Dubai — a city where women don’t choose between modesty and glamour, they master
            both. We design abayas and dresses for the woman who moves between worlds: elegant at a family
            gathering, striking at a dinner in DIFC, effortless on a flight to Riyadh or London.
          </p>
          <p>
            Every piece is made to feel like a second skin — sculpted silhouettes, fluid fabrics, colors that
            flatter rather than hide.
          </p>
          <p className="font-serif text-ink text-[19px] italic leading-snug">
            FLAYA is not about covering up. It’s about revealing confidence.
          </p>
          <p>Designed and handcrafted in Dubai.</p>
          <div className="pt-4">
            <p className="font-serif text-ink text-[26px] font-light">Maria & Anastasia</p>
            <p className="text-faint mt-1 text-[11px] font-bold tracking-[0.22em] uppercase">Founders, FLAYA</p>
          </div>
        </motion.div>
      </section>

      {/* Portrait band */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-2 gap-3 px-5 md:grid-cols-3 md:gap-5 md:px-10">
        {[
          { src: px(36178530, 800, 1050), alt: "FLAYA portrait — seated in soft neutrals" },
          { src: EDITORIAL.main, alt: "FLAYA portrait — serene ecru styling" },
          { src: px(31132019, 800, 1050), alt: "FLAYA portrait — minimal tailoring", extra: "hidden md:block" },
        ].map((img, i) => (
          <motion.div key={img.src} {...fadeUp(i * 0.08)} className={`bg-ivory aspect-[3/4] overflow-hidden ${img.extra ?? ""}`}>
            <img src={img.src} alt={img.alt} width={800} height={1050} loading="lazy" className="h-full w-full object-cover object-top" />
          </motion.div>
        ))}
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {VALUES.map((v, i) => (
            <motion.div key={v.title} {...fadeUp(i * 0.08)} className="border-line border p-7">
              <v.icon className="text-taupe h-5 w-5" strokeWidth={1.5} />
              <p className="font-serif mt-4 text-xl font-medium leading-snug">{v.title}</p>
              <p className="text-smoke mt-2 text-[13.5px] leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.1)} className="mt-14 text-center">
          <a
            href="#/shop/new"
            className="bg-ink text-porcelain inline-flex items-center gap-2.5 px-9 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Discover the collections <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </a>
        </motion.div>
      </section>
    </main>
  );
}
