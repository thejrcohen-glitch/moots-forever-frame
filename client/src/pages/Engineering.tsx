/**
 * DESIGN: Analog Film / Western Americana
 * Palette: bone, sienna, amber, flint, charcoal
 * Fonts: Playfair Display (headings), IBM Plex Mono (body/data), Barlow Condensed (labels)
 * Aesthetic: Grain over gloss. Lo-fi. Cinematic scroll. Deep technical storytelling.
 */

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

// ─── Asset URLs ────────────────────────────────────────────────────────────────
const ENG_TIG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/eng-tig-welding-an8rapK7p2TyeUhL4HTmXn.webp";
const ENG_MITER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/eng-tube-mitering-hjmhyT4FBt7D377xBFqhXf.webp";
const ENG_FRAME = "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/eng-finished-frame-Lis4paCi8cX8MrwtV4vhjd.webp";
const ENG_WELD = "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/eng-weld-detail-4xuLkP4TDpC3ruCChauALh.webp";

function GrainOverlay({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: "multiply",
      }}
    />
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useState(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Community", href: "/community" },
    { label: "Dealers", href: "/dealers" },
    { label: "Build a Moots", href: "/build" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled || menuOpen ? "oklch(0.945 0.018 78 / 0.97)" : "oklch(0.18 0.008 60 / 0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: scrolled || menuOpen ? "1px solid oklch(0.78 0.03 70)" : "1px solid oklch(0.38 0.015 60 / 0.3)",
        }}
      >
        <div className="container flex items-center justify-between py-4">
          <Link href="/" onClick={close}>
            <div className="flex flex-col cursor-pointer">
              <span className="font-display text-xl font-bold tracking-tight" style={{ color: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)" }}>Moots</span>
              <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: scrolled || menuOpen ? "oklch(0.52 0.12 45)" : "oklch(0.72 0.14 65)" }}>The Forever Frame</span>
            </div>
          </Link>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href}>
                <span className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70 cursor-pointer" style={{ color: scrolled ? "oklch(0.38 0.015 60)" : "oklch(0.88 0.025 75)" }}>{l.label}</span>
              </Link>
            ))}
            <a href="https://ianzskrocki.com" target="_blank" rel="noopener noreferrer" className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70" style={{ color: "oklch(0.72 0.14 65)" }}>Order →</a>
          </div>
          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {[0, 1, 2].map(i => (
              <span key={i} className="block h-0.5 w-6 transition-all duration-300" style={{
                background: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
                transform: i === 0 && menuOpen ? "translateY(8px) rotate(45deg)" : i === 2 && menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden border-t" style={{ background: "oklch(0.945 0.018 78)", borderColor: "oklch(0.78 0.03 70)" }}>
            <div className="container py-6 flex flex-col gap-5">
              {navLinks.map(l => (
                <Link key={l.label} href={l.href} onClick={close}>
                  <span className="font-label text-sm tracking-widest uppercase hover:opacity-60 cursor-pointer" style={{ color: "oklch(0.22 0.01 60)" }}>{l.label}</span>
                </Link>
              ))}
              <a href="https://ianzskrocki.com" target="_blank" rel="noopener noreferrer" onClick={close} className="font-label text-sm tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Order →</a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function EngHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} className="relative h-[70vh] overflow-hidden" style={{ background: "oklch(0.18 0.008 60)" }}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <img src={ENG_TIG} alt="TIG welding titanium bicycle frame in Steamboat Springs Colorado" className="w-full h-full object-cover" style={{ filter: "saturate(0.8) contrast(1.1)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, oklch(0.18 0.008 60 / 0.3) 0%, oklch(0.18 0.008 60 / 0.6) 60%, oklch(0.18 0.008 60 / 0.92) 100%)" }} />
        <GrainOverlay opacity={0.22} />
      </motion.div>
      <div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 z-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>
            Steamboat Springs, Colorado · Est. 1981
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Built by<br />
            <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Hand.</em>
          </h1>
          <p className="font-mono-custom text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: "oklch(0.88 0.025 75 / 0.75)" }}>
            Every Moots frame begins as raw aerospace-grade titanium tubing and ends as a hand-welded, lifetime-guaranteed bicycle. This is how it happens.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Material Science Section ──────────────────────────────────────────────────
function MaterialScience() {
  const properties = [
    { label: "Density", value: "4.51 g/cm³", note: "57% lighter than steel", highlight: true },
    { label: "Tensile Strength", value: "900–1200 MPa", note: "Grade 9 Ti-3Al-2.5V alloy", highlight: false },
    { label: "Fatigue Life", value: "Infinite*", note: "*Below endurance limit — no replacement cycle", highlight: true },
    { label: "Corrosion Resistance", value: "Exceptional", note: "Natural oxide layer — no paint required", highlight: false },
    { label: "Thermal Expansion", value: "8.6 µm/m·°C", note: "Stable across all riding temps", highlight: false },
    { label: "Elastic Modulus", value: "114 GPa", note: "Natural vibration damping vs. carbon", highlight: true },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.18 0.008 60)" }}>
      <GrainOverlay opacity={0.1} />
      <div className="container relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>The Material</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8" style={{ color: "oklch(0.945 0.018 78)" }}>
              Aerospace-Grade<br />
              <em className="italic">Titanium.</em>
            </h2>
            <div className="space-y-6 font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
              <p>
                Moots uses <strong style={{ color: "oklch(0.88 0.025 75)" }}>Grade 9 titanium (Ti-3Al-2.5V)</strong> — the same alloy used in aerospace hydraulic tubing and surgical implants. It is not the cheapest titanium. It is the right titanium.
              </p>
              <p>
                The key property that separates titanium from carbon is <strong style={{ color: "oklch(0.88 0.025 75)" }}>fatigue behavior</strong>. Carbon fiber has a fatigue limit — repeated stress cycles eventually cause micro-fractures, which is why carbon frames carry a recommended replacement window. Titanium, below its endurance limit, has no such ceiling. The material does not accumulate damage the same way.
              </p>
              <p>
                The natural oxide layer that forms on titanium is harder than the metal itself and self-repairing. Scratch a Moots frame and the oxide layer reforms within hours. No paint. No corrosion. No maintenance.
              </p>
            </div>
          </div>
          <div className="space-y-px">
            {properties.map((prop, i) => (
              <motion.div
                key={prop.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-6 p-5"
                style={{
                  background: prop.highlight ? "oklch(0.25 0.01 60)" : "oklch(0.22 0.01 60)",
                  borderLeft: prop.highlight ? "3px solid oklch(0.72 0.14 65)" : "3px solid oklch(0.38 0.015 60)",
                }}
              >
                <div className="flex-1">
                  <p className="font-label text-xs tracking-widest uppercase mb-1" style={{ color: "oklch(0.52 0.04 65)" }}>{prop.label}</p>
                  <p className="font-display text-xl font-bold" style={{ color: prop.highlight ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)" }}>{prop.value}</p>
                </div>
                <p className="font-mono-custom text-xs text-right max-w-[160px]" style={{ color: "oklch(0.52 0.04 65)" }}>{prop.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Build Process Steps ───────────────────────────────────────────────────────
const BUILD_STEPS = [
  {
    step: "01",
    title: "Tube Selection",
    subtitle: "Every build starts with the rider",
    image: ENG_FRAME,
    body: "Before a single tube is cut, Moots takes geometry measurements from the rider. Height, inseam, reach, drop — every dimension feeds into a custom tube set selection. Moots uses butted titanium tubing: thicker at the ends where stress concentrates, thinner in the middle to save weight without sacrificing strength. The wall thickness varies from 0.5mm to 1.0mm depending on tube position and rider weight.",
    specs: [
      { k: "Tubing", v: "Grade 9 Ti-3Al-2.5V" },
      { k: "Butting", v: "Double and triple butted" },
      { k: "Wall thickness", v: "0.5–1.0mm" },
      { k: "Tube sets", v: "Custom per rider geometry" },
    ],
  },
  {
    step: "02",
    title: "Precision Mitering",
    subtitle: "The joint that determines everything",
    image: ENG_MITER,
    body: "Tube mitering is the process of cutting a curved saddle into the end of one tube so it fits perfectly against the curved surface of another. On a bicycle frame, every joint is a miter — and every miter must be perfect. Moots uses CNC milling to cut miter profiles to within 0.1mm tolerance. A poorly mitered joint creates stress concentrations that can cause failure. A perfect miter creates a joint stronger than the parent material.",
    specs: [
      { k: "Miter tolerance", v: "±0.1mm" },
      { k: "Process", v: "CNC mill + hand-fit verification" },
      { k: "Joint types", v: "Butt, sleeve, and socket" },
      { k: "Fit check", v: "Hand-verified before tacking" },
    ],
  },
  {
    step: "03",
    title: "TIG Welding",
    subtitle: "Where skill becomes permanent",
    image: ENG_TIG,
    body: "Tungsten Inert Gas (TIG) welding is the only process used at Moots. Unlike MIG welding, TIG requires both hands — one for the torch, one feeding filler rod — and complete focus. The welder controls heat input, filler deposition, and torch angle simultaneously. Titanium is particularly demanding: it oxidizes instantly at welding temperatures, so the weld pool must be shielded with argon gas on all sides. Moots welders train for years before touching a production frame.",
    specs: [
      { k: "Process", v: "TIG (GTAW)" },
      { k: "Shielding gas", v: "100% Argon" },
      { k: "Filler rod", v: "ERTi-9 (Grade 9 match)" },
      { k: "Weld inspection", v: "Visual + dimensional per joint" },
    ],
  },
  {
    step: "04",
    title: "Weld Inspection",
    subtitle: "No shortcuts. No exceptions.",
    image: ENG_WELD,
    body: "After welding, every joint is inspected under magnification. The weld bead should show uniform ripple spacing — a sign of consistent heat input and travel speed. Discoloration is examined: gold and straw tones are acceptable; blue indicates heat contamination; white or grey means the argon shield failed. Any joint that does not pass is cut out and rewelded. There is no 'good enough' at Moots.",
    specs: [
      { k: "Inspection", v: "100% visual, per joint" },
      { k: "Acceptable tones", v: "Silver, gold, straw" },
      { k: "Rejection criteria", v: "Blue, grey, or white oxidation" },
      { k: "Rework rate", v: "<2% of joints" },
    ],
  },
  {
    step: "05",
    title: "Alignment & Finishing",
    subtitle: "The frame that rides straight forever",
    image: ENG_FRAME,
    body: "After welding, frames are checked on a precision alignment table. Titanium has memory — it wants to return to its pre-weld shape — so alignment corrections are made while the metal is still workable. The frame is then faced and chased: the bottom bracket shell, head tube, and seat tube are machined to precise tolerances. Finally, the raw titanium surface is brushed to a consistent finish. No paint. No powder coat. Just the metal.",
    specs: [
      { k: "Alignment tolerance", v: "±0.25mm across full frame" },
      { k: "Facing", v: "BB, HT, and ST machined post-weld" },
      { k: "Surface finish", v: "Brushed raw titanium" },
      { k: "Warranty", v: "Lifetime to original owner" },
    ],
  },
];

function BuildProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const step = BUILD_STEPS[activeStep];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.945 0.018 78)" }}>
      <GrainOverlay opacity={0.06} />
      <div className="container relative z-20">
        <div className="text-center mb-16">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.52 0.12 45)" }}>The Process</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.22 0.01 60)" }}>
            From Tube to<br />
            <em className="italic" style={{ color: "oklch(0.52 0.12 45)" }}>Forever Frame.</em>
          </h2>
        </div>

        {/* Step selector */}
        <div className="flex overflow-x-auto gap-px mb-12 pb-2">
          {BUILD_STEPS.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(i)}
              className="flex-shrink-0 flex flex-col items-center gap-2 px-6 py-4 transition-all duration-300"
              style={{
                background: activeStep === i ? "oklch(0.22 0.01 60)" : "oklch(0.88 0.025 75)",
                borderBottom: activeStep === i ? "3px solid oklch(0.72 0.14 65)" : "3px solid transparent",
                minWidth: "120px",
              }}
            >
              <span className="font-label text-xs tracking-widest" style={{ color: activeStep === i ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.04 65)" }}>
                {s.step}
              </span>
              <span className="font-display text-sm font-bold text-center" style={{ color: activeStep === i ? "oklch(0.945 0.018 78)" : "oklch(0.38 0.015 60)" }}>
                {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Active step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.85) contrast(1.05)" }}
              />
              <GrainOverlay opacity={0.15} />
              <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, oklch(0.22 0.01 60 / 0.85), transparent)" }}>
                <span className="font-label text-xs tracking-[0.3em] uppercase" style={{ color: "oklch(0.72 0.14 65)" }}>Step {step.step}</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="font-mono-custom text-xs tracking-widest uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>{step.subtitle}</p>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: "oklch(0.22 0.01 60)" }}>{step.title}</h3>
              <p className="font-mono-custom text-sm leading-loose mb-8" style={{ color: "oklch(0.38 0.015 60)" }}>{step.body}</p>

              {/* Specs */}
              <div className="space-y-px">
                {step.specs.map((spec) => (
                  <div key={spec.k} className="flex items-center gap-4 py-3 px-4" style={{ background: "oklch(0.88 0.025 75)", borderLeft: "2px solid oklch(0.52 0.12 45)" }}>
                    <span className="font-label text-xs tracking-widest uppercase w-36 flex-shrink-0" style={{ color: "oklch(0.52 0.12 45)" }}>{spec.k}</span>
                    <span className="font-mono-custom text-xs" style={{ color: "oklch(0.22 0.01 60)" }}>{spec.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Titanium vs Carbon Comparison ────────────────────────────────────────────
function TitaniumVsCarbon() {
  const rows = [
    { attribute: "Fatigue Life", titanium: "Infinite (below endurance limit)", carbon: "Finite — micro-fractures accumulate", winner: "ti" },
    { attribute: "Replacement Cycle", titanium: "None — lifetime frame", carbon: "Typically 5–10 years recommended", winner: "ti" },
    { attribute: "Crash Damage", titanium: "Dents, but rarely fails catastrophically", carbon: "Can delaminate invisibly — requires X-ray inspection", winner: "ti" },
    { attribute: "Vibration Damping", titanium: "Natural — elastic modulus absorbs road buzz", carbon: "Layup-dependent — varies widely by manufacturer", winner: "ti" },
    { attribute: "Weight", titanium: "Slightly heavier at equivalent stiffness", carbon: "Lightest option at equivalent stiffness", winner: "carbon" },
    { attribute: "Repairability", titanium: "Weldable — dents and cracks can be repaired", carbon: "Difficult — often requires full replacement", winner: "ti" },
    { attribute: "Corrosion", titanium: "Immune — self-healing oxide layer", carbon: "Galvanic corrosion at metal contact points", winner: "ti" },
    { attribute: "Environmental Impact", titanium: "Recyclable, long lifespan reduces replacement", carbon: "Non-recyclable fiber, shorter lifespan", winner: "ti" },
    { attribute: "Ride Feel", titanium: "Lively, springy, forgiving — unique character", carbon: "Stiff, precise, efficient — less personality", winner: "draw" },
    { attribute: "Cost Over 20 Years", titanium: "One frame, one time", carbon: "2–4 replacements at equivalent spec", winner: "ti" },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <GrainOverlay opacity={0.1} />
      <div className="container relative z-20">
        <div className="text-center mb-16">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>The Honest Comparison</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Titanium vs.<br />
            <em className="italic" style={{ color: "oklch(0.52 0.12 45)" }}>Carbon.</em>
          </h2>
          <p className="font-mono-custom text-sm mt-4 max-w-lg mx-auto" style={{ color: "oklch(0.78 0.03 70)" }}>
            Carbon is not bad. It is a different tool for a different job. Here is the honest breakdown.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60)" }}>
                <th className="text-left py-4 px-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Attribute</th>
                <th className="text-left py-4 px-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.72 0.14 65)" }}>Titanium (Moots)</th>
                <th className="text-left py-4 px-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Carbon</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.attribute}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    borderBottom: "1px solid oklch(0.28 0.01 60)",
                    background: i % 2 === 0 ? "oklch(0.22 0.01 60)" : "oklch(0.25 0.01 60)",
                  }}
                >
                  <td className="py-4 px-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>{row.attribute}</td>
                  <td className="py-4 px-4 font-mono-custom text-xs" style={{ color: row.winner === "ti" ? "oklch(0.72 0.14 65)" : "oklch(0.78 0.03 70)" }}>
                    {row.winner === "ti" && <span className="mr-2">→</span>}
                    {row.titanium}
                  </td>
                  <td className="py-4 px-4 font-mono-custom text-xs" style={{ color: row.winner === "carbon" ? "oklch(0.88 0.025 75)" : "oklch(0.52 0.04 65)" }}>
                    {row.winner === "carbon" && <span className="mr-2">→</span>}
                    {row.carbon}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono-custom text-xs mt-6 text-center" style={{ color: "oklch(0.38 0.015 60)" }}>
          → indicates the stronger attribute in that category
        </p>
      </div>
    </section>
  );
}

// ─── Moots Models ─────────────────────────────────────────────────────────────
function ModelsSection() {
  const models = [
    {
      name: "Routt RSL",
      category: "Gravel · Race",
      description: "The flagship. Race geometry, maximum tire clearance, built for riders who compete on gravel and want a frame that will outlast every carbon bike they've ever owned.",
      specs: ["Tire clearance: 700×50c / 650b×2.1\"", "Geometry: Race — aggressive stack/reach", "Tubing: Butted Grade 9 Ti-3Al-2.5V", "Mounts: Full bikepacking, 3× bottle"],
      territory: "All three states — the benchmark",
    },
    {
      name: "Routt 45",
      category: "Gravel · All-Road",
      description: "The versatile one. Slightly more relaxed geometry than the RSL, 45mm tire clearance, built for the rider who rides everything — gravel, road, light trail.",
      specs: ["Tire clearance: 700×45c", "Geometry: Endurance — relaxed head angle", "Tubing: Butted Grade 9 Ti-3Al-2.5V", "Mounts: Full bikepacking"],
      territory: "Bentonville, AR — Ozarks mixed terrain",
    },
    {
      name: "Vamoots RSL",
      category: "Road · Endurance",
      description: "The road bike that never needs replacing. Titanium road geometry, smooth ride quality, built for riders who log serious road miles and are done with carbon's replacement cycle.",
      specs: ["Tire clearance: 700×32c", "Geometry: Road RSL — efficient and precise", "Tubing: Triple-butted Grade 9 Ti-3Al-2.5V", "Mounts: Fender and rack compatible"],
      territory: "Austin, TX — road miles on Hill Country routes",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.88 0.025 75)" }}>
      <GrainOverlay opacity={0.07} />
      <div className="container relative z-20">
        <div className="mb-16">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.52 0.12 45)" }}>The Lineup</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.22 0.01 60)" }}>
            Three Frames.<br />
            <em className="italic" style={{ color: "oklch(0.52 0.12 45)" }}>One Standard.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "oklch(0.78 0.03 70)" }}>
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 flex flex-col gap-6"
              style={{ background: "oklch(0.945 0.018 78)" }}
            >
              <div>
                <p className="font-label text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>{model.category}</p>
                <h3 className="font-display text-3xl font-bold mb-4" style={{ color: "oklch(0.22 0.01 60)" }}>{model.name}</h3>
                <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.52 0.04 65)" }}>{model.description}</p>
              </div>
              <div className="space-y-2 flex-1">
                {model.specs.map((spec) => (
                  <div key={spec} className="flex items-start gap-3 font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
                    <span style={{ color: "oklch(0.52 0.12 45)" }}>—</span> {spec}
                  </div>
                ))}
              </div>
              <div className="pt-4" style={{ borderTop: "1px solid oklch(0.78 0.03 70)" }}>
                <p className="font-mono-custom text-xs mb-4" style={{ color: "oklch(0.52 0.04 65)" }}>
                  <span style={{ color: "oklch(0.52 0.12 45)" }}>Territory fit:</span> {model.territory}
                </p>
                <a
                  href="https://ianzskrocki.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-label text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all hover:opacity-80"
                  style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.945 0.018 78)" }}
                >
                  Inquire →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "How long does a Moots frame last?", a: "Indefinitely, if not crashed or damaged. Moots offers a lifetime warranty to the original owner. The titanium material does not fatigue under normal riding loads — there is no recommended replacement cycle. Riders regularly ride Moots frames that are 20–30 years old." },
    { q: "Can a Moots frame be repaired if damaged?", a: "Yes. Titanium is weldable, which means dents, cracks, and even broken tubes can be repaired by a skilled TIG welder. Moots can repair frames in-house. This is fundamentally different from carbon, where damage often requires full frame replacement." },
    { q: "Why does titanium cost more than carbon at the same weight?", a: "Titanium is more expensive to source, more difficult to machine, and requires significantly more skilled labor to weld. A Moots frame takes 40–60 hours of skilled craftsman time. The premium reflects the material, the process, and the lifetime guarantee — not marketing." },
    { q: "What is the difference between Grade 9 and Grade 5 titanium?", a: "Grade 9 (Ti-3Al-2.5V) is the standard for Moots frames. It offers an excellent balance of strength, weldability, and formability. Grade 5 (Ti-6Al-4V) is stronger but harder to weld and more brittle — better suited for aerospace fasteners than bicycle frames. Grade 9 is the correct choice for a hand-welded bicycle." },
    { q: "Does titanium need to be painted or coated?", a: "No. Titanium forms a natural oxide layer that is harder than the metal itself and self-repairing. It does not rust, corrode, or require paint for protection. Moots frames are finished with a brushed surface treatment that highlights the natural metal. Some riders add anodized color accents, but the base frame requires no coating." },
    { q: "How do I order a Moots in Texas, Arkansas, or Oklahoma?", a: "Contact Ian Zakrocki at ianzskrocki.com. Ian is the sole Moots representative for all three states. He handles dealer accounts, individual builds, geometry consultations, and pop-up demo events." },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <GrainOverlay opacity={0.1} />
      <div className="container relative z-20 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>Common Questions</p>
          <h2 className="font-display text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            The Honest<br />
            <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Answers.</em>
          </h2>
        </div>

        <div className="space-y-px">
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid oklch(0.32 0.01 60)" }}>
              <button
                className="w-full text-left py-6 flex items-start justify-between gap-6"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-display text-lg font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>{faq.q}</span>
                <span
                  className="flex-shrink-0 font-mono-custom text-lg transition-transform duration-300"
                  style={{
                    color: "oklch(0.72 0.14 65)",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="font-mono-custom text-sm leading-loose pb-6" style={{ color: "oklch(0.78 0.03 70)" }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function EngineeringCTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.18 0.008 60)" }}>
      <GrainOverlay opacity={0.15} />
      <div className="absolute inset-0">
        <img src={ENG_WELD} alt="Titanium weld detail" className="w-full h-full object-cover opacity-20" style={{ filter: "saturate(0.5)" }} />
      </div>
      <div className="container relative z-20 text-center">
        <p className="font-label text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "oklch(0.72 0.14 65)" }}>
          TX · OK · AR Territory
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6" style={{ color: "oklch(0.945 0.018 78)" }}>
          Ready to ride<br />
          <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>titanium?</em>
        </h2>
        <p className="font-mono-custom text-sm max-w-lg mx-auto mb-10 leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
          Ian Zakrocki handles all Moots builds, dealer accounts, and demo rides across Texas, Arkansas, and Oklahoma.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://ianzskrocki.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-sm tracking-[0.2em] uppercase px-10 py-4 transition-all hover:opacity-80"
            style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
          >
            Start a Build →
          </a>
          <Link href="/community">
            <span className="font-label text-sm tracking-[0.2em] uppercase px-10 py-4 border transition-all hover:opacity-80 cursor-pointer" style={{ borderColor: "oklch(0.945 0.018 78 / 0.3)", color: "oklch(0.945 0.018 78)" }}>
              See the Community →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 relative overflow-hidden" style={{ background: "oklch(0.15 0.006 60)" }}>
      <GrainOverlay opacity={0.15} />
      <div className="container relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Link href="/">
              <p className="font-display text-2xl font-bold mb-1 cursor-pointer hover:opacity-80" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</p>
            </Link>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>Handbuilt in Steamboat Springs, CO since 1981</p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Territory Rep · TX · OK · AR</p>
            <a href="https://ianzskrocki.com" target="_blank" rel="noopener noreferrer" className="font-mono-custom text-sm hover:underline" style={{ color: "oklch(0.88 0.025 75)" }}>
              ianzskrocki.com
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>© 2026 Moots Bicycle. The Forever Frame Campaign.</p>
          <div className="flex gap-6">
            <Link href="/community"><span className="font-mono-custom text-xs hover:underline cursor-pointer" style={{ color: "oklch(0.38 0.015 60)" }}>Community</span></Link>
            <Link href="/"><span className="font-mono-custom text-xs hover:underline cursor-pointer" style={{ color: "oklch(0.38 0.015 60)" }}>Home</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── CWSR Section ──────────────────────────────────────────────────────────────────────────────
function CWSRSection() {
  const CWSR_FACTS = [
    {
      label: "CWSR Process",
      title: "Cold Worked Stress Relieved",
      body: "After welding, every Moots frame is cold worked — a controlled deformation process that realigns the titanium’s grain structure. The frame is then stress relieved in a precision oven, removing residual weld stress without annealing the metal. The result is a frame that is stronger than the raw tube, not weaker.",
    },
    {
      label: "The Tube Mill",
      title: "15+ years. One Washington mill.",
      body: "Moots has sourced titanium from the same Pacific Northwest tube mill for over 15 years. This is not a commodity relationship — it is a technical partnership. The mill produces tubing to Moots’ exact specifications, including wall thickness tolerances measured in thousandths of an inch. No other bicycle brand has this arrangement.",
    },
    {
      label: "Tube Library",
      title: "35+ tube profiles. Tuned per rider.",
      body: "A standard frame builder orders from a catalog. Moots maintains a library of over 35 distinct tube profiles — varying diameter, wall thickness, butting profile, and alloy grade. Each model is built from a specific subset of these tubes, selected for the intended riding style. A Routt 45 is not built from the same tubes as a Routt RSL, even though both are titanium.",
    },
    {
      label: "Aircraft-Grade Standard",
      title: "3Al-2.5V. The same alloy as landing gear.",
      body: "Grade 9 titanium (3Al-2.5V) is the alloy used in aircraft hydraulic tubing and landing gear components. It is selected for aerospace applications because of its combination of strength, fatigue resistance, and formability. Moots uses this same alloy because bicycles and aircraft share a requirement: the frame must not fail under cyclic loading over a long service life.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.15 0.006 60)" }}>
      <GrainOverlay opacity={0.15} />
      <div className="container relative z-20">
        <div className="max-w-3xl mb-16">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>
            The Why Ti Deep Dive
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: "oklch(0.945 0.018 78)" }}>
            What actually happens in that Steamboat shop.
          </h2>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.72 0.04 65)" }}>
            Most titanium bike marketing stops at “lightweight and corrosion-resistant.” Moots goes further. The CWSR process, the proprietary tube library, and the 15-year mill relationship are not talking points — they are the engineering reasons why a Moots frame rides differently from any other titanium on the market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CWSR_FACTS.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8"
              style={{ background: "oklch(0.22 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}
            >
              <p className="font-label text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>{fact.label}</p>
              <h3 className="font-display text-xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>{fact.title}</h3>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.72 0.04 65)" }}>{fact.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Moots Why Ti CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="font-mono-custom text-sm mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>
            Moots publishes their full titanium philosophy at moots.com/pages/why-ti
          </p>
          <a
            href="https://moots.com/pages/why-ti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-label text-xs tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 hover:opacity-80"
            style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
          >
            Read: Why Titanium →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Engineering Page ──────────────────────────────────────────────────────────────────────────────
export default function Engineering() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.18 0.008 60)" }}>
      <Nav />
      <EngHero />
      <MaterialScience />
      <BuildProcess />
      <TitaniumVsCarbon />
      <CWSRSection />
      <ModelsSection />
      <FAQ />
      <EngineeringCTA />
      <Footer />
    </div>
  );
}
