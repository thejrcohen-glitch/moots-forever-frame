/*
 * BUILD CONFIGURATOR
 * Multi-step quiz: use case → terrain → budget → recommendation → lead capture
 * Sends warm lead to Ian via trpc.configurator.submitLead
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { IS_STATIC_SITE } from "@/const";
import { toast } from "sonner";
import { Link } from "wouter";

// ─── Types ─────────────────────────────────────────────────────────────────────
type UseCase = "gravel" | "road" | "adventure" | "commute";
type Terrain = "pavement" | "mixed" | "dirt" | "technical";
type Budget = "under-5k" | "5k-8k" | "8k-12k" | "12k-plus";
type Territory = "TX" | "OK" | "AR";

interface Answers {
  useCase: UseCase | null;
  terrain: Terrain | null;
  budget: Budget | null;
  territory: Territory | null;
}

// ─── Recommendation Logic ──────────────────────────────────────────────────────
interface ModelRec {
  name: string;
  tagline: string;
  priceRange: string;
  description: string;
  specs: string[];
  img: string;
}

const MODELS: Record<string, ModelRec> = {
  "Routt 45": {
    name: "Routt 45",
    tagline: "One premium gravel bike for any occasion",
    priceRange: "Frameset $5,999 · Builds from $7,649",
    description: "From forest tracks to rough gravel to the unpredictable mix of Routt County Road 45, this is the bike built to handle it all. Relaxed geometry, 50c clearance, and titanium compliance for long days on back roads where maps end but you don't.",
    specs: ["50c tire clearance", "Relaxed endurance geometry", "68mm threaded BB", "3 bottle mounts + fender eyelets", "1x or 2x drivetrain compatible"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
  },
  "Routt YBB": {
    name: "Routt YBB",
    tagline: "The smoothest ride in gravel",
    priceRange: "Frameset $6,199 · Builds from $7,849",
    description: "YBB stands for 'Yeti Boing Boing' — a rear-end compliance system built into the titanium frame that absorbs chatter without sacrificing power transfer. For riders who want to go farther, faster, with less fatigue.",
    specs: ["50c tire clearance", "YBB rear compliance system", "68mm threaded BB", "3 bottle mounts + fender eyelets", "Gravel-tuned geometry"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
  },
  "Routt RSL": {
    name: "Routt RSL",
    tagline: "Crafted from a decade on gravel",
    priceRange: "Frameset $7,249 · Builds from $8,899",
    description: "Named for the rugged roads of Routt County, the RSL is built for riders who seek distance, challenge, and discovery. Large-diameter double-butted RSL titanium tubing balances stiffness and comfort across endless miles of mixed terrain.",
    specs: ["50c tire clearance", "RSL double-butted tubeset", "3D-printed UDH dropouts", "Carbon MOOTS gravel fork", "3 bottle mounts + fender eyelets"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
  },
  "Vamoots RCS": {
    name: "Vamoots RCS",
    tagline: "The performance road bike built to go beyond",
    priceRange: "Frameset $7,249 · Builds from $11,980",
    description: "The Vamoots RCS blends road efficiency with the clearance and handling needed for dirt and gravel. RSL double-butted titanium, fastback seat stays, and 3D-printed dropouts deliver a ride that is responsive, smooth, and endlessly versatile.",
    specs: ["35c tire clearance", "RSL double-butted tubeset", "Carbon MOOTS allroad fork", "Fastback seat stays", "Road + light gravel geometry"],
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp",
  },
};

function getRecommendation(answers: Answers): string {
  const { useCase, terrain, budget } = answers;

  // Road-focused
  if (useCase === "road" || (terrain === "pavement" && useCase !== "gravel")) {
    if (budget === "under-5k" || budget === "5k-8k") return "Routt 45";
    return "Vamoots RCS";
  }

  // Adventure / bikepacking on technical terrain — needs max clearance and compliance
  if (useCase === "adventure" || terrain === "technical") {
    if (budget === "8k-12k" || budget === "12k-plus") return "Routt YBB";
    return "Routt 45";
  }

  // Commute
  if (useCase === "commute") {
    return "Routt 45";
  }

  // Gravel — mixed or dirt terrain
  if (terrain === "dirt" || terrain === "mixed") {
    if (budget === "under-5k" || budget === "5k-8k") return "Routt 45";
    if (budget === "8k-12k") return "Routt YBB";
    return "Routt RSL";
  }

  // Default gravel
  if (budget === "12k-plus") return "Routt RSL";
  if (budget === "8k-12k") return "Routt YBB";
  if (budget === "5k-8k") return "Routt 45";
  return "Routt 45";
}

// ─── Step Components ───────────────────────────────────────────────────────────
interface OptionCardProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}

function OptionCard({ label, sublabel, selected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left p-5 transition-all duration-200 w-full"
      style={{
        background: selected ? "oklch(0.52 0.12 45 / 0.15)" : "oklch(0.28 0.01 60)",
        border: `1px solid ${selected ? "oklch(0.52 0.12 45)" : "oklch(0.38 0.015 60 / 0.6)"}`,
      }}
    >
      <p className="font-display text-lg font-bold" style={{ color: selected ? "oklch(0.72 0.14 65)" : "oklch(0.945 0.018 78)" }}>{label}</p>
      {sublabel && <p className="font-mono-custom text-xs mt-1" style={{ color: "oklch(0.52 0.04 65)" }}>{sublabel}</p>}
    </button>
  );
}

// ─── Mobile-responsive Nav ───────────────────────────────────────────────────────
function BuildNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Bikes", href: "/bikes" },
    { label: "Compare Models", href: "/comparison" },
    { label: "Dealers", href: "/dealers" },
    { label: "Community", href: "/community" },
    { label: "Engineering", href: "/engineering" },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.22 0.01 60 / 0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
      <div className="container flex items-center justify-between py-4">
        <Link href="/" onClick={close}>
          <div className="flex flex-col cursor-pointer">
            <span className="font-display text-xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Build Configurator</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>{l.label}</Link>
          ))}
        </div>
        <button className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {[0, 1, 2].map(i => (
            <span key={i} className="block h-0.5 w-6 transition-all duration-300" style={{
              background: "oklch(0.945 0.018 78)",
              transform: i === 0 && menuOpen ? "translateY(8px) rotate(45deg)" : i === 2 && menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
              opacity: i === 1 && menuOpen ? 0 : 1,
            }} />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t" style={{ background: "oklch(0.28 0.01 60)", borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <div className="container py-6 flex flex-col gap-5">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} onClick={close} className="font-label text-sm tracking-widest uppercase hover:opacity-60" style={{ color: "oklch(0.945 0.018 78)" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Build Configurator Page ──────────────────────────────────────────────────────────────────
export default function BuildConfigurator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ useCase: null, terrain: null, budget: null, territory: null });
  const [leadForm, setLeadForm] = useState({ name: "", email: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = trpc.configurator.submitLead.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Your build inquiry has been sent to Ian.");
    },
    onError: (err) => toast.error(err.message || "Failed to send inquiry."),
  });

  const recommendedModel = answers.useCase && answers.terrain && answers.budget
    ? getRecommendation(answers as Required<Answers>)
    : null;

  const totalSteps = 5; // useCase, terrain, budget, territory, recommendation+lead
  const progress = Math.round((step / (totalSteps - 1)) * 100);

  const steps = [
    {
      question: "How will you primarily use this bike?",
      sublabel: "Your riding style shapes everything.",
      options: [
        { value: "gravel", label: "Gravel & Mixed Terrain", sublabel: "Dirt roads, gravel, some pavement" },
        { value: "road", label: "Road Riding", sublabel: "Pavement, centuries, fast group rides" },
        { value: "adventure", label: "Bikepacking & Touring", sublabel: "Multi-day trips, loaded riding" },
        { value: "commute", label: "Daily Commute + Weekend Rides", sublabel: "Utility + recreation" },
      ] as { value: UseCase; label: string; sublabel: string }[],
      key: "useCase" as keyof Answers,
    },
    {
      question: "What terrain do you ride most?",
      sublabel: "Be honest — titanium is built for the real answer.",
      options: [
        { value: "pavement", label: "Mostly Pavement", sublabel: "Smooth roads, bike paths" },
        { value: "mixed", label: "Mixed Surfaces", sublabel: "Pavement + gravel, 50/50" },
        { value: "dirt", label: "Mostly Dirt & Gravel", sublabel: "Unpaved roads, forest tracks" },
        { value: "technical", label: "Technical Off-Road", sublabel: "Singletrack, rocky terrain" },
      ] as { value: Terrain; label: string; sublabel: string }[],
      key: "terrain" as keyof Answers,
    },
    {
      question: "What's your complete build budget?",
      sublabel: "Frame + components + build. Be realistic — a forever bike is worth it.",
      options: [
        { value: "under-5k", label: "Under $6,000", sublabel: "Frameset only or entry build — bring your own components" },
        { value: "5k-8k", label: "$6,000 – $9,000", sublabel: "Frameset + SRAM Rival XPLR or Force build" },
        { value: "8k-12k", label: "$9,000 – $12,000", sublabel: "SRAM Force or Red XPLR — high-end complete build" },
        { value: "12k-plus", label: "$12,000+", sublabel: "SRAM Red XPLR or Red AXS — top-spec, no compromises" },
      ] as { value: Budget; label: string; sublabel: string }[],
      key: "budget" as keyof Answers,
    },
    {
      question: "Which territory are you in?",
      sublabel: "Ian covers TX, OK, and AR — he'll connect you with the right dealer.",
      options: [
        { value: "TX", label: "Texas", sublabel: "Austin · Dallas · Houston · San Antonio" },
        { value: "OK", label: "Oklahoma", sublabel: "Oklahoma City · Tulsa" },
        { value: "AR", label: "Arkansas", sublabel: "Bentonville · Fayetteville · Little Rock" },
      ] as { value: Territory; label: string; sublabel: string }[],
      key: "territory" as keyof Answers,
    },
  ];

  const currentStep = steps[step];
  const isLastQuestionStep = step === steps.length - 1;
  const isResultStep = step === steps.length;

  const handleSelect = (value: string) => {
    const key = currentStep.key;
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < steps.length) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC_SITE) {
      toast.info("Lead submission is unavailable on the static site. Please use the contact links on this site.");
      return;
    }
    if (!leadForm.name || !leadForm.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    if (!answers.useCase || !answers.terrain || !answers.budget || !answers.territory || !recommendedModel) {
      toast.error("Please complete all steps first.");
      return;
    }
    submitLead.mutate({
      name: leadForm.name,
      email: leadForm.email,
      territory: answers.territory,
      useCase: answers.useCase,
      terrain: answers.terrain,
      budget: answers.budget,
      recommendedModel,
      notes: leadForm.notes || undefined,
    });
  };

  const model = recommendedModel ? MODELS[recommendedModel] : null;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      {/* Nav */}
      <BuildNav />

      <div className="pt-28 pb-20 container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>Find Your Frame</p>
            <h1 className="font-display text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
              Build a <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Moots.</em>
            </h1>
            <p className="font-mono-custom text-sm mt-3" style={{ color: "oklch(0.52 0.04 65)" }}>
              Four questions. One recommendation. A direct line to Ian.
            </p>
          </div>

          {/* Progress bar */}
          {!isResultStep && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.04 65)" }}>
                  Step {step + 1} of {steps.length}
                </span>
                <span className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.12 45)" }}>{progress}%</span>
              </div>
              <div className="h-0.5 w-full" style={{ background: "oklch(0.38 0.015 60)" }}>
                <div
                  className="h-0.5 transition-all duration-500"
                  style={{ width: `${progress}%`, background: "oklch(0.52 0.12 45)" }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Question Steps */}
            {!isResultStep && currentStep && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>
                  {currentStep.question}
                </h2>
                <p className="font-mono-custom text-sm mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>
                  {currentStep.sublabel}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {currentStep.options.map(opt => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      sublabel={opt.sublabel}
                      selected={answers[currentStep.key] === opt.value}
                      onClick={() => handleSelect(opt.value)}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      className="font-label text-xs tracking-[0.2em] uppercase px-6 py-3 transition-all hover:opacity-70"
                      style={{ color: "oklch(0.52 0.04 65)", border: "1px solid oklch(0.38 0.015 60)" }}
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!answers[currentStep.key]}
                    className="font-label text-sm tracking-[0.2em] uppercase px-10 py-3.5 transition-all hover:opacity-80 disabled:opacity-30"
                    style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}
                  >
                    {isLastQuestionStep ? "See My Recommendation →" : "Next →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Result + Lead Capture */}
            {isResultStep && model && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center" style={{ border: "1px solid oklch(0.52 0.12 45)" }}>
                      <span className="font-display text-2xl" style={{ color: "oklch(0.52 0.12 45)" }}>✓</span>
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>Inquiry Sent.</h2>
                    <p className="font-mono-custom text-sm mb-2" style={{ color: "oklch(0.52 0.04 65)" }}>
                      Ian will be in touch about your {model.name} build.
                    </p>
                    <p className="font-mono-custom text-xs mb-8" style={{ color: "oklch(0.38 0.015 60)" }}>
                      Expect a reply within 24–48 hours.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link href="/" className="font-label text-xs tracking-[0.2em] uppercase px-6 py-3 hover:opacity-70" style={{ color: "oklch(0.52 0.04 65)", border: "1px solid oklch(0.38 0.015 60)" }}>
                        ← Back to Home
                      </Link>
                      <Link href="/dealers" className="font-label text-xs tracking-[0.2em] uppercase px-6 py-3 hover:opacity-80" style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}>
                        Find a Dealer →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Recommendation card */}
                    <div className="mb-8 p-6" style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.52 0.12 45 / 0.6)" }}>
                      <p className="font-label text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Your Recommendation</p>
                      <h2 className="font-display text-4xl font-bold mb-1" style={{ color: "oklch(0.945 0.018 78)" }}>{model.name}</h2>
                      <p className="font-label text-sm tracking-widest uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>{model.tagline}</p>
                      <p className="font-mono-custom text-sm leading-relaxed mb-4" style={{ color: "oklch(0.52 0.04 65)" }}>{model.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {model.specs.map(s => (
                          <span key={s} className="font-mono-custom text-xs px-3 py-1" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.72 0.14 65)", border: "1px solid oklch(0.38 0.015 60)" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.12 45)" }}>{model.priceRange}</p>
                    </div>

                    {/* Lead form */}
                    <div className="mb-6">
                      <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>Connect with Ian</h3>
                      <p className="font-mono-custom text-sm mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>
                        Ian handles all builds in TX, OK, and AR. He'll reach out with pricing, lead times, and build options.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitLead} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Your Name *</label>
                          <input
                            type="text"
                            className="w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none"
                            style={{ borderBottomColor: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" }}
                            placeholder="First Last"
                            value={leadForm.name}
                            onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Email *</label>
                          <input
                            type="email"
                            className="w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none"
                            style={{ borderBottomColor: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" }}
                            placeholder="you@example.com"
                            value={leadForm.email}
                            onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Notes (optional)</label>
                        <textarea
                          rows={3}
                          className="w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none"
                          style={{ borderBottomColor: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)", resize: "none" }}
                          placeholder="Current bike, riding goals, component preferences..."
                          value={leadForm.notes}
                          onChange={e => setLeadForm(f => ({ ...f, notes: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          type="submit"
                          disabled={submitLead.isPending}
                          className="font-label text-sm tracking-[0.2em] uppercase px-10 py-3.5 transition-all hover:opacity-80 disabled:opacity-40"
                          style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}
                        >
                          {submitLead.isPending ? "Sending..." : "Send to Ian →"}
                        </button>
                        <button
                          type="button"
                          onClick={handleBack}
                          className="font-label text-xs tracking-[0.2em] uppercase px-6 py-3 hover:opacity-70"
                          style={{ color: "oklch(0.52 0.04 65)", border: "1px solid oklch(0.38 0.015 60)" }}
                        >
                          ← Revise
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
