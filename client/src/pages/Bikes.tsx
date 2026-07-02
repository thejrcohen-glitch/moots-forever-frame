/*
 * DESIGN: Analog Film / Western Americana — consistent with Home.tsx
 * Bikes Catalog: Gravel, Road, Mountain. Text-first cards linking to the
 * official Moots product and category pages. No fabricated imagery.
 */

import { useState } from "react";
import { Link } from "wouter";

if (typeof window !== "undefined") {
  document.title = "Moots Bikes Catalog — Gravel, Road, Mountain";
}

type Category = "gravel" | "road" | "mountain";

interface Bike {
  name: string;
  tagline: string;
  description: string;
  url: string;
  modelPage?: string;
}

interface Section {
  id: Category;
  label: string;
  heading: string;
  intro: string;
  collectionUrl: string;
  accent: string;
  bikes: Bike[];
}

const SECTIONS: Section[] = [
  {
    id: "gravel",
    label: "Gravel Lineup",
    heading: "Gravel.",
    intro:
      "The Routt family — five strong. Hand-welded titanium for fire roads, farm roads, and the long way home.",
    collectionUrl: "https://moots.com/collections/gravel",
    accent: "oklch(0.35 0.06 145)",
    bikes: [
      {
        name: "Routt RSL",
        tagline: "Race-ready gravel",
        description:
          "The lightweight Routt for fast gravel days. Tight clearance, sharp handling, all-day titanium.",
        url: "https://moots.com/products/routt-rsl",
        modelPage: "/bikes/routt-rsl",
      },
      {
        name: "Routt 45",
        tagline: "Wider tires, longer days",
        description:
          "Built around 45mm rubber. The middle of the Routt family — the one that goes everywhere.",
        url: "https://moots.com/products/routt-45",
        modelPage: "/bikes/routt-45",
      },
      {
        name: "Routt YBB",
        tagline: "Soft-tail comfort",
        description:
          "Moots' patented YBB rear suspension takes the edge off the worst chatter without slowing you down.",
        url: "https://moots.com/products/routt-ybb",
        modelPage: "/bikes/routt-ybb",
      },
      {
        name: "Routt CRD",
        tagline: "Carbon-fork classic",
        description:
          "The original Routt platform. Capable, balanced, and quietly fast.",
        url: "https://moots.com/products/routt-crd",
        modelPage: "/bikes/routt-crd",
      },
      {
        name: "Routt ESC",
        tagline: "Extended clearance",
        description:
          "Bigger rubber, bigger adventures. The Routt for when the route is more trail than road.",
        url: "https://moots.com/collections/gravel",
      },
    ],
  },
  {
    id: "road",
    label: "Road Lineup",
    heading: "Road.",
    intro:
      "The Vamoots family. Forty-plus years of titanium road geometry, refined for the climbs you keep coming back to.",
    collectionUrl: "https://moots.com/collections/road",
    accent: "oklch(0.52 0.12 45)",
    bikes: [
      {
        name: "Vamoots CRD",
        tagline: "Carbon-fork road",
        description:
          "Long-mile geometry with a smooth, planted feel. Built for the way most people actually ride.",
        url: "https://moots.com/collections/road",
        modelPage: "/bikes/vamoots-crd",
      },
      {
        name: "Vamoots 33",
        tagline: "Wider road tires",
        description:
          "Clearance for 33mm rubber. Modern road, classic Moots ride quality.",
        url: "https://moots.com/collections/road",
        modelPage: "/bikes/vamoots-33",
      },
      {
        name: "Vamoots RCS",
        tagline: "Race-cut titanium",
        description:
          "Stiffer, sharper, and still unmistakably titanium. The Vamoots for spirited days.",
        url: "https://moots.com/products/vamoots-rcs",
        modelPage: "/bikes/vamoots-rcs",
      },
    ],
  },
  {
    id: "mountain",
    label: "Mountain Lineup",
    heading: "Mountain.",
    intro:
      "Titanium mountain bikes from a brand that never stopped building them. Hardtails with feel, full-suspension with patience.",
    collectionUrl: "https://moots.com/collections/mountain",
    accent: "oklch(0.38 0.015 60)",
    bikes: [
      {
        name: "Womble",
        tagline: "Trail hardtail",
        description:
          "A modern trail hardtail in titanium. Forgiving when you want it, sharp when you ask.",
        url: "https://moots.com/products/womble",
        modelPage: "/bikes/womble",
      },
      {
        name: "Mountaineer",
        tagline: "Classic XC hardtail",
        description:
          "A Moots cornerstone. Light, fast, and built to outlast carbon by a couple of decades.",
        url: "https://moots.com/collections/mountain",
        modelPage: "/bikes/mountaineer",
      },
      {
        name: "MXC",
        tagline: "Cross-country titanium",
        description:
          "Race-leaning XC geometry in titanium. Long days in the saddle, no rattle in the bones.",
        url: "https://moots.com/collections/mountain",
        modelPage: "/bikes/mxc",
      },
    ],
  },
];

function BikesNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Races", href: "/races" },
    { label: "Engineering", href: "/engineering" },
    { label: "Dealers", href: "/dealers" },
    { label: "Build a Moots", href: "/build" },
  ];
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.22 0.01 60 / 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)",
      }}
    >
      <div className="container flex items-center justify-between py-4">
        <Link href="/" onClick={close}>
          <div className="flex flex-col cursor-pointer">
            <span
              className="font-display text-xl font-bold tracking-tight"
              style={{ color: "oklch(0.945 0.018 78)" }}
            >
              Moots
            </span>
            <span
              className="font-label text-xs tracking-[0.2em] uppercase"
              style={{ color: "oklch(0.52 0.12 45)" }}
            >
              The Forever Frame
            </span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4"
              style={{ color: "oklch(0.88 0.025 75)" }}
            >
              {l.label}
            </Link>
          ))}
          <span
            className="font-label text-xs tracking-widest uppercase"
            style={{ color: "oklch(0.52 0.12 45)" }}
            aria-current="page"
          >
            Bikes
          </span>
        </div>
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: "oklch(0.945 0.018 78)",
                transform:
                  i === 0 && menuOpen
                    ? "translateY(8px) rotate(45deg)"
                    : i === 2 && menuOpen
                    ? "translateY(-8px) rotate(-45deg)"
                    : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "oklch(0.28 0.01 60)",
            borderColor: "oklch(0.38 0.015 60 / 0.4)",
          }}
        >
          <div className="container py-6 flex flex-col gap-5">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={close}
                className="font-label text-sm tracking-widest uppercase hover:opacity-60 focus:outline focus:outline-2 focus:outline-offset-4"
                style={{ color: "oklch(0.945 0.018 78)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function SectionJump({ accent, sections }: { accent: string; sections: Section[] }) {
  return (
    <nav aria-label="Catalog sections" className="flex flex-wrap gap-3 mt-8">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-200 focus:outline focus:outline-2 focus:outline-offset-2"
          style={{
            background: "transparent",
            color: "oklch(0.88 0.025 75)",
            border: `1px solid ${accent}`,
          }}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}

function BikeCard({ bike, accent }: { bike: Bike; accent: string }) {
  return (
    <article
      className="p-6 transition-all duration-200 hover:opacity-90"
      style={{
        background: "oklch(0.24 0.01 60)",
        border: "1px solid oklch(0.38 0.015 60 / 0.5)",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <p
        className="font-label text-xs tracking-[0.25em] uppercase mb-2"
        style={{ color: accent }}
      >
        {bike.tagline}
      </p>
      <h3
        className="font-display text-2xl font-bold mb-3"
        style={{ color: "oklch(0.945 0.018 78)" }}
      >
        {bike.name}
      </h3>
      <p
        className="font-mono-custom text-sm leading-relaxed mb-5"
        style={{ color: "oklch(0.72 0.04 65)" }}
      >
        {bike.description}
      </p>
      <a
        href={bike.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
        style={{ color: accent }}
      >
        View {bike.name} on moots.com →
      </a>
      {bike.modelPage && (
        <Link
          href={bike.modelPage}
          className="block mt-3 font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: "oklch(0.72 0.14 65)" }}
        >
          View model →
        </Link>
      )}
    </article>
  );
}

function CategorySection({ section }: { section: Section }) {
  return (
    <section
      id={section.id}
      className="py-16 border-t scroll-mt-24"
      style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
      aria-labelledby={`${section.id}-heading`}
    >
      <p
        className="font-label text-xs tracking-[0.35em] uppercase mb-3"
        style={{ color: section.accent }}
      >
        {section.label}
      </p>
      <h2
        id={`${section.id}-heading`}
        className="font-display text-4xl md:text-5xl font-bold mb-4"
        style={{ color: "oklch(0.945 0.018 78)" }}
      >
        {section.heading}
      </h2>
      <p
        className="font-mono-custom text-sm max-w-2xl mb-6"
        style={{ color: "oklch(0.72 0.04 65)" }}
      >
        {section.intro}
      </p>
      <a
        href={section.collectionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-label text-xs tracking-[0.2em] uppercase mb-10 hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
        style={{ color: section.accent }}
      >
        Browse the full {section.label.toLowerCase()} on moots.com →
      </a>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {section.bikes.map((bike) => (
          <BikeCard key={bike.name} bike={bike} accent={section.accent} />
        ))}
      </div>
    </section>
  );
}

export default function Bikes() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <BikesNav />

      <header className="pt-28 pb-10 container">
        <p
          className="font-label text-xs tracking-[0.35em] uppercase mb-3"
          style={{ color: "oklch(0.52 0.12 45)" }}
        >
          Official Catalog
        </p>
        <h1
          className="font-display text-5xl md:text-6xl font-bold mb-4"
          style={{ color: "oklch(0.945 0.018 78)" }}
        >
          Moots <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Bikes.</em>
        </h1>
        <p
          className="font-mono-custom text-sm max-w-xl"
          style={{ color: "oklch(0.52 0.04 65)" }}
        >
          Gravel, road, and mountain — hand-welded titanium from Steamboat Springs, Colorado. Every link below opens the official product page on{" "}
          <a
            href="https://moots.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: "oklch(0.72 0.14 65)" }}
          >
            moots.com
          </a>
          .
        </p>

        <SectionJump accent="oklch(0.52 0.12 45)" sections={SECTIONS} />
      </header>

      <main className="container pb-24">
        {SECTIONS.map((s) => (
          <CategorySection key={s.id} section={s} />
        ))}

        <section
          className="py-16 border-t"
          style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
          aria-labelledby="order-heading"
        >
          <p
            className="font-label text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "oklch(0.52 0.12 45)" }}
          >
            Order
          </p>
          <h2
            id="order-heading"
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "oklch(0.945 0.018 78)" }}
          >
            Talk to a human.
          </h2>
          <p
            className="font-mono-custom text-sm max-w-xl mb-6"
            style={{ color: "oklch(0.72 0.04 65)" }}
          >
            Questions, sizing, build sheets — reach out directly. We answer the phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:ianzak@mac.com"
              className="font-label text-xs tracking-[0.2em] uppercase px-5 py-3 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
              style={{
                background: "oklch(0.52 0.12 45)",
                color: "oklch(0.945 0.018 78)",
              }}
            >
              Email ianzak@mac.com →
            </a>
            <a
              href="tel:+19175787687"
              className="font-label text-xs tracking-[0.2em] uppercase px-5 py-3 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
              style={{
                background: "transparent",
                color: "oklch(0.88 0.025 75)",
                border: "1px solid oklch(0.52 0.12 45)",
              }}
            >
              Call 917-578-7687 →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
