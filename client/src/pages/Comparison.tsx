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
  frameMaterial: string;
  geometry: string;
  weight: string;
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
    frameMaterial: "Titanium (3/2.5 tubing)",
    geometry: "Relaxed endurance (71.5° HTA, 74° STA)",
    weight: "~1,050g frameset",
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
    frameMaterial: "Titanium (3/2.5 tubing + YBB)",
    geometry: "Gravel-tuned (71° HTA, 73.5° STA)",
    weight: "~1,150g frameset",
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
    frameMaterial: "Titanium RSL (double-butted)",
    geometry: "Aggressive gravel (71° HTA, 73° STA)",
    weight: "~950g frameset",
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
    frameMaterial: "Titanium RSL (double-butted)",
    geometry: "Road-biased allroad (73° HTA, 74° STA)",
    weight: "~900g frameset",
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
        <div className="hidden md:flex items-center gap-5">
          <Link href="/" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>← Home</Link>
          <Link href="/bikes" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Bikes</Link>
          <Link href="/build" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Build</Link>
          <Link href="/community" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Community</Link>
        </div>
        <button className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5" onClick={() => setIsMenuOpen(o => !o)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {[0, 1, 2].map(i => (
            <span key={i} className="block h-0.5 w-6 transition-all duration-300" style={{
              background: "oklch(0.945 0.018 78)",
              transform: i === 0 && isMenuOpen ? "translateY(8px) rotate(45deg)" : i === 2 && isMenuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
              opacity: i === 1 && isMenuOpen ? 0 : 1,
            }} />
          ))}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t" style={{ background: "oklch(0.28 0.01 60)", borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <div className="container py-6 flex flex-col gap-5">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>← Home</Link>
            <Link href="/bikes" onClick={() => setIsMenuOpen(false)} className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Bikes</Link>
            <Link href="/build" onClick={() => setIsMenuOpen(false)} className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Build</Link>
            <Link href="/community" onClick={() => setIsMenuOpen(false)} className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Community</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Comparison Page ───────────────────────────────────────────────────────────
export default function Comparison() {
  const [selected, setSelected] = useState<string[]>(["Routt 45", "Routt RSL"]);

  const toggleModel = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(m => m !== name));
    } else if (selected.length < 4) {
      setSelected([...selected, name]);
    }
  };

  const selectedModels = selected.map(name => MODELS[name]).filter(Boolean);

  // Helper: detect if a value differs across selected models
  const isDifferent = (key: keyof ModelRec) => {
    if (selectedModels.length < 2) return false;
    const values = selectedModels.map(m => m[key]);
    return values.some(v => v !== values[0]);
  };

  return (
    <div style={{ background: "oklch(0.22 0.01 60)" }}>
      <ComparisonNav />
      <div className="container pt-24 pb-16">
        <div className="mb-12">
          <h1 className="font-display text-5xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>Compare Models</h1>
          <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Select up to 4 models to see side-by-side specs, pricing, and features.</p>
        </div>

        {/* Model Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(MODELS).map(([key, model]) => (
            <motion.button
              key={key}
              onClick={() => toggleModel(key)}
              className="p-4 text-left transition-all duration-200 rounded-lg"
              style={{
                background: selected.includes(key) ? "oklch(0.52 0.12 45 / 0.15)" : "oklch(0.28 0.01 60)",
                border: `1px solid ${selected.includes(key) ? "oklch(0.52 0.12 45)" : "oklch(0.38 0.015 60 / 0.6)"}`,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-label text-xs tracking-widest uppercase mb-1" style={{ color: selected.includes(key) ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.04 65)" }}>
                {selected.includes(key) ? "✓" : "○"} {model.name}
              </p>
              <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>{model.tagline}</p>
            </motion.button>
          ))}
        </div>

        {/* Comparison Table */}
        {selectedModels.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "2px solid oklch(0.38 0.015 60 / 0.5)" }}>
                  <th className="text-left p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Spec</th>
                  {selectedModels.map(model => (
                    <th key={model.name} className="text-left p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.72 0.14 65)" }}>
                      {model.name}
                      <button
                        onClick={() => toggleModel(model.name)}
                        className="block mt-1 text-xs font-mono-custom text-red-500 hover:opacity-70"
                        style={{ color: "oklch(0.52 0.12 45)" }}
                      >
                        ✕ Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                  <td className="p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Price</td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4 font-mono-custom text-sm" style={{
                      color: isDifferent("priceRange") ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)",
                      background: isDifferent("priceRange") ? "oklch(0.52 0.12 45 / 0.1)" : "transparent",
                    }}>
                      {model.priceRange}
                    </td>
                  ))}
                </tr>

                {/* Frame Material */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                  <td className="p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Frame Material</td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4 font-mono-custom text-sm" style={{
                      color: isDifferent("frameMaterial") ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)",
                      background: isDifferent("frameMaterial") ? "oklch(0.52 0.12 45 / 0.1)" : "transparent",
                    }}>
                      {model.frameMaterial}
                    </td>
                  ))}
                </tr>

                {/* Geometry */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                  <td className="p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Geometry</td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4 font-mono-custom text-sm" style={{
                      color: isDifferent("geometry") ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)",
                      background: isDifferent("geometry") ? "oklch(0.52 0.12 45 / 0.1)" : "transparent",
                    }}>
                      {model.geometry}
                    </td>
                  ))}
                </tr>

                {/* Weight */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                  <td className="p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Weight</td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4 font-mono-custom text-sm" style={{
                      color: isDifferent("weight") ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)",
                      background: isDifferent("weight") ? "oklch(0.52 0.12 45 / 0.1)" : "transparent",
                    }}>
                      {model.weight}
                    </td>
                  ))}
                </tr>

                {/* Use Case */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                  <td className="p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Use Case</td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4 font-mono-custom text-sm" style={{
                      color: isDifferent("useCase") ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)",
                      background: isDifferent("useCase") ? "oklch(0.52 0.12 45 / 0.1)" : "transparent",
                    }}>
                      {model.useCase}
                    </td>
                  ))}
                </tr>

                {/* Terrain */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                  <td className="p-4 font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>Terrain</td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4 font-mono-custom text-sm" style={{
                      color: isDifferent("terrain") ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)",
                      background: isDifferent("terrain") ? "oklch(0.52 0.12 45 / 0.1)" : "transparent",
                    }}>
                      {model.terrain}
                    </td>
                  ))}
                </tr>

                {/* Key Features */}
                <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                  <td className="p-4 font-label text-xs tracking-widest uppercase align-top" style={{ color: "oklch(0.52 0.04 65)" }}>Key Features</td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4">
                      <ul className="space-y-1">
                        {model.specs.map((spec, i) => (
                          <li key={i} className="font-mono-custom text-xs flex items-start gap-2" style={{ color: "oklch(0.72 0.14 65)" }}>
                            <span>✓</span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* CTA */}
                <tr>
                  <td className="p-4"></td>
                  {selectedModels.map(model => (
                    <td key={model.name} className="p-4">
                      <Link href="/build">
                        <button className="w-full py-2 px-3 font-label text-xs tracking-widest uppercase transition-all duration-200" style={{
                          background: "oklch(0.52 0.12 45)",
                          color: "oklch(0.945 0.018 78)",
                        }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
                          Build {model.name}
                        </button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}

        {selectedModels.length === 0 && (
          <div className="text-center py-12">
            <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Select at least one model to begin comparing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
