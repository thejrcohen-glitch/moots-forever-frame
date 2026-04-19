/**
 * MODEL COMPARISON
 * Side-by-side comparison of Moots bike models with specs, pricing, and features.
 * Users can select multiple models to compare, highlight differences, and build.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

// ─── Model Data ────────────────────────────────────────────────────────────────
interface ModelRec {
  name: string;
  tagline: string;
  priceRange: string;
  description: string;
  specs: string[];
  img: string;
  category: "gravel" | "road";
  useCase: string;
  terrain: string;
}

const MODELS: Record<string, ModelRec> = {
  "Routt 45": {
    name: "Routt 45",
    tagline: "One premium gravel bike for any occasion",
    priceRange: "Frameset $5,999 · Builds from $7,649",
    description: "From forest tracks to rough gravel to the unpredictable mix of Routt County Road 45, this is the bike built to handle it all. Relaxed geometry, 50c clearance, and titanium compliance for long days on back roads where maps end but you don't.",
    specs: ["50c tire clearance", "Relaxed endurance geometry", "68mm threaded BB", "3 bottle mounts + fender eyelets", "1x or 2x drivetrain compatible"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
    category: "gravel",
    useCase: "Gravel, Adventure, Commute",
    terrain: "Mixed, Dirt, Pavement",
  },
  "Routt YBB": {
    name: "Routt YBB",
    tagline: "The smoothest ride in gravel",
    priceRange: "Frameset $6,199 · Builds from $7,849",
    description: "YBB stands for 'Yeti Boing Boing' — a rear-end compliance system built into the titanium frame that absorbs chatter without sacrificing power transfer. For riders who want to go farther, faster, with less fatigue.",
    specs: ["50c tire clearance", "YBB rear compliance system", "68mm threaded BB", "3 bottle mounts + fender eyelets", "Gravel-tuned geometry"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
    category: "gravel",
    useCase: "Gravel, Adventure, Technical",
    terrain: "Mixed, Dirt, Technical",
  },
  "Routt RSL": {
    name: "Routt RSL",
    tagline: "Crafted from a decade on gravel",
    priceRange: "Frameset $7,249 · Builds from $8,899",
    description: "Named for the rugged roads of Routt County, the RSL is built for riders who seek distance, challenge, and discovery. Large-diameter double-butted RSL titanium tubing balances stiffness and comfort across endless miles of mixed terrain.",
    specs: ["50c tire clearance", "RSL double-butted tubeset", "3D-printed UDH dropouts", "Carbon MOOTS gravel fork", "3 bottle mounts + fender eyelets"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
    category: "gravel",
    useCase: "Gravel, Adventure, Distance",
    terrain: "Mixed, Dirt, Technical",
  },
  "Vamoots RCS": {
    name: "Vamoots RCS",
    tagline: "The performance road bike built to go beyond",
    priceRange: "Frameset $7,249 · Builds from $11,980",
    description: "The Vamoots RCS blends road efficiency with the clearance and handling needed for dirt and gravel. RSL double-butted titanium, fastback seat stays, and 3D-printed dropouts deliver a ride that is responsive, smooth, and endlessly versatile.",
    specs: ["35c tire clearance", "RSL double-butted tubeset", "Carbon MOOTS allroad fork", "Fastback seat stays", "Road + light gravel geometry"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
    category: "road",
    useCase: "Road, Allroad",
    terrain: "Pavement, Light Gravel",
  },
};

// ─── Nav Component ─────────────────────────────────────────────────────────────
function ComparisonNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "oklch(0.22 0.01 60 / 0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
      <div className="container flex items-center justify-between py-4">
        <Link href="/">
          <div className="flex flex-col cursor-pointer">
            <span className="font-display text-xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Compare Models</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/build" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Build a Moots</Link>
          <Link href="/community" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Community</Link>
          <Link href="/dealers" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Dealers</Link>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2" style={{ color: "oklch(0.945 0.018 78)" }}>
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ background: "oklch(0.22 0.01 60 / 0.98)", borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
            <div className="container py-4 space-y-3">
              {[{ href: "/build", label: "Build a Moots" }, { href: "/community", label: "Community" }, { href: "/dealers", label: "Dealers" }].map(link => (
                <Link key={link.href} href={link.href}>
                  <button onClick={() => setIsMenuOpen(false)} className="w-full text-left font-label text-xs tracking-widest uppercase py-2 hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Comparison() {
  const [selectedModels, setSelectedModels] = useState<string[]>(["Routt 45", "Routt RSL"]);

  const toggleModel = (modelName: string) => {
    if (selectedModels.includes(modelName)) {
      setSelectedModels(selectedModels.filter(m => m !== modelName));
    } else if (selectedModels.length < 4) {
      setSelectedModels([...selectedModels, modelName]);
    }
  };

  const selected = selectedModels.map(name => MODELS[name]).filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <ComparisonNav />

      <div className="pt-28 pb-20 container">
        {/* Header */}
        <div className="mb-12">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Comparison</p>
          <h1 className="font-display text-4xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>Find Your Forever Frame</h1>
          <p className="font-mono-custom text-sm max-w-2xl" style={{ color: "oklch(0.52 0.04 65)" }}>
            Compare specs, pricing, and features across our complete lineup. Select up to 4 models to see side-by-side details.
          </p>
        </div>

        {/* Model Selector */}
        <div className="mb-12">
          <p className="font-label text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "oklch(0.52 0.04 65)" }}>Select Models ({selectedModels.length} / 4)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(MODELS).map(([key, model]) => (
              <button
                key={key}
                onClick={() => toggleModel(key)}
                className="p-4 transition-all duration-200 text-left"
                style={{
                  background: selectedModels.includes(key) ? "oklch(0.35 0.06 145)" : "oklch(0.28 0.01 60)",
                  border: selectedModels.includes(key) ? "2px solid oklch(0.35 0.06 145)" : "1px solid oklch(0.38 0.015 60)",
                }}
              >
                <p className="font-display text-sm font-bold mb-1" style={{ color: "oklch(0.945 0.018 78)" }}>{model.name}</p>
                <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>{model.tagline}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selected.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: `${selected.length * 280}px` }}>
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
                  <th className="font-label text-xs tracking-[0.2em] uppercase pb-4 pr-6 sticky left-0" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)", minWidth: "200px" }}>
                    Spec
                  </th>
                  {selected.map(model => (
                    <th key={model.name} className="font-label text-xs tracking-[0.2em] uppercase pb-4 pr-6" style={{ color: "oklch(0.52 0.04 65)", minWidth: "260px" }}>
                      {model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Tagline */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.2)" }}>
                  <td className="font-label text-xs tracking-[0.15em] uppercase py-4 pr-6 sticky left-0" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)" }}>Tagline</td>
                  {selected.map(model => (
                    <td key={model.name} className="font-mono-custom text-sm py-4 pr-6" style={{ color: "oklch(0.72 0.14 65)" }}>
                      {model.tagline}
                    </td>
                  ))}
                </tr>

                {/* Price */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.2)" }}>
                  <td className="font-label text-xs tracking-[0.15em] uppercase py-4 pr-6 sticky left-0" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)" }}>Price</td>
                  {selected.map(model => (
                    <td key={model.name} className="font-mono-custom text-sm py-4 pr-6 font-bold" style={{ color: "oklch(0.52 0.12 45)" }}>
                      {model.priceRange}
                    </td>
                  ))}
                </tr>

                {/* Use Case */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.2)" }}>
                  <td className="font-label text-xs tracking-[0.15em] uppercase py-4 pr-6 sticky left-0" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)" }}>Best For</td>
                  {selected.map(model => (
                    <td key={model.name} className="font-mono-custom text-sm py-4 pr-6" style={{ color: "oklch(0.945 0.018 78)" }}>
                      {model.useCase}
                    </td>
                  ))}
                </tr>

                {/* Terrain */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.2)" }}>
                  <td className="font-label text-xs tracking-[0.15em] uppercase py-4 pr-6 sticky left-0" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)" }}>Terrain</td>
                  {selected.map(model => (
                    <td key={model.name} className="font-mono-custom text-sm py-4 pr-6" style={{ color: "oklch(0.72 0.14 65)" }}>
                      {model.terrain}
                    </td>
                  ))}
                </tr>

                {/* Specs */}
                {[0, 1, 2, 3, 4].map(specIndex => (
                  <tr key={`spec-${specIndex}`} style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.2)" }}>
                    <td className="font-label text-xs tracking-[0.15em] uppercase py-4 pr-6 sticky left-0" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)" }}>
                      {specIndex === 0 ? "Key Features" : ""}
                    </td>
                    {selected.map(model => (
                      <td key={model.name} className="font-mono-custom text-xs py-4 pr-6" style={{ color: "oklch(0.52 0.04 65)" }}>
                        {model.specs[specIndex] && (
                          <div className="flex items-start gap-2">
                            <span style={{ color: "oklch(0.35 0.06 145)" }}>✓</span>
                            <span>{model.specs[specIndex]}</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Build CTA */}
                <tr>
                  <td className="font-label text-xs tracking-[0.15em] uppercase py-6 pr-6 sticky left-0" style={{ background: "oklch(0.22 0.01 60)" }}></td>
                  {selected.map(model => (
                    <td key={model.name} className="py-6 pr-6">
                      <Link href="/build">
                        <button className="w-full font-label text-xs tracking-[0.15em] uppercase py-3 transition-all hover:opacity-80" style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}>
                          Build {model.name}
                        </button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {selected.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>Select models to compare</p>
            <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Choose up to 4 models above to see their specs side-by-side.</p>
          </div>
        )}
      </div>
    </div>
  );
}
