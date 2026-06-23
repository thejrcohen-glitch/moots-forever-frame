import { useEffect, useState } from "react";
import { Link } from "wouter";
import OnTheWheelBadge from "@/components/OnTheWheelBadge";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const FURKA_SIGNAL = {
  title: "Switzerland / Furka Pass",
  region: "Switzerland",
  country: "Switzerland",
  territory: "Beyond Territory",
  status: "Research",
  sourceName: "SwitzerlandMobility National Cycling Routes",
  sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/national-routes",
  note: "Furka Pass. Switzerland. A public alpine route signal for riders who look beyond the map.",
  governanceNote: "Public source signal only. No route ownership, attendance, partnership, or endorsement implied.",
};

const HELD_ITEMS = [
  "Rhône Route",
  "Rhine Route",
  "Alpine Panorama Route",
  "Additional Swiss climbs",
  "Coffee and village stops",
  "GPX files",
  "Maps and embeds",
  "Photos",
  "Strava, Komoot, and RideWithGPS links",
];

function SwitzerlandNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Routes", href: "/routes" },
    { label: "Races", href: "/races" },
    { label: "Strava", href: "/strava" },
    { label: "Bikes", href: "/bikes" },
    { label: "Dealers", href: "/dealers" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.22 0.01 60 / 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)",
      }}
      aria-label="Primary"
    >
      <div className="container flex items-center justify-between py-4">
        <Link href="/" onClick={close}>
          <div className="flex flex-col cursor-pointer">
            <span className="font-display text-xl font-bold tracking-tight" style={{ color: "oklch(0.945 0.018 78)" }}>
              Moots
            </span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>
              The Forever Frame
            </span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4"
              style={{ color: "oklch(0.88 0.025 75)" }}
            >
              {link.label}
            </Link>
          ))}
          <span
            className="font-label text-xs tracking-widest uppercase"
            style={{ color: "oklch(0.52 0.12 45)" }}
            aria-current="page"
          >
            Switzerland
          </span>
          <OnTheWheelBadge />
        </div>
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((line) => (
            <span
              key={line}
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: "oklch(0.945 0.018 78)",
                transform:
                  line === 0 && menuOpen
                    ? "translateY(8px) rotate(45deg)"
                    : line === 2 && menuOpen
                      ? "translateY(-8px) rotate(-45deg)"
                      : "none",
                opacity: line === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t" style={{ background: "oklch(0.28 0.01 60)", borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <div className="container py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={close}
                className="font-label text-sm tracking-widest uppercase hover:opacity-60 focus:outline focus:outline-2 focus:outline-offset-4"
                style={{ color: "oklch(0.945 0.018 78)" }}
              >
                {link.label}
              </Link>
            ))}
            <OnTheWheelBadge className="self-start" />
          </div>
        </div>
      )}
    </nav>
  );
}

function SignalCard() {
  return (
    <article
      className="p-6 flex flex-col"
      style={{
        background: "oklch(0.24 0.01 60)",
        border: "1px solid oklch(0.38 0.015 60 / 0.5)",
        borderLeft: "3px solid oklch(0.52 0.12 45)",
      }}
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {[FURKA_SIGNAL.status, FURKA_SIGNAL.territory, FURKA_SIGNAL.country].map((label) => (
          <span
            key={label}
            className="font-label text-xs tracking-[0.18em] uppercase px-2 py-1"
            style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
          >
            {label}
          </span>
        ))}
      </div>
      <p className="font-label text-xs tracking-[0.25em] uppercase mb-2" style={{ color: READABLE_ACCENT }}>
        {FURKA_SIGNAL.region}
      </p>
      <h2 className="font-display text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
        {FURKA_SIGNAL.title}
      </h2>
      <p className="font-mono-custom text-sm leading-relaxed mb-5" style={{ color: "oklch(0.72 0.04 65)" }}>
        {FURKA_SIGNAL.note}
      </p>
      <p className="font-mono-custom text-xs leading-relaxed mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>
        {FURKA_SIGNAL.governanceNote}
      </p>
      <a
        href={FURKA_SIGNAL.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-label text-xs tracking-[0.2em] uppercase mt-auto hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
        style={{ color: READABLE_ACCENT }}
      >
        {FURKA_SIGNAL.sourceName} →
      </a>
    </article>
  );
}

export default function SwitzerlandRoutes() {
  useEffect(() => {
    const title = "Switzerland Signals — MootsFrame";
    const description = "A governed Switzerland route signal page for MootsFrame. Public source signals only. No route ownership, attendance, partnership, or endorsement implied.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/routes/switzerland");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <SwitzerlandNav />
      <header className="pt-28 pb-12 container">
        <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
          Beyond Territory
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
          Switzerland Signals
        </h1>
        <p className="font-mono-custom text-sm leading-loose max-w-2xl" style={{ color: "oklch(0.78 0.03 70)" }}>
          Alpine roads, public route signals, and climbs held until the sources are clean.
        </p>
      </header>

      <section className="container pb-16" aria-labelledby="switzerland-signal-heading">
        <div className="mb-6">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
            Route Signal
          </p>
          <h2 id="switzerland-signal-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            One sourced signal.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SignalCard />
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="held-switzerland-heading">
        <div className="max-w-3xl">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Held for Verification
          </p>
          <h2 id="held-switzerland-heading" className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Not public until sourced.
          </h2>
          <p className="font-mono-custom text-sm leading-loose mb-8" style={{ color: "oklch(0.78 0.03 70)" }}>
            These signals stay held until direct public sources, rights, and governance rules are confirmed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
            {HELD_ITEMS.map((item) => (
              <div key={item} className="p-4" style={{ background: "oklch(0.24 0.01 60)" }}>
                <p className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: "oklch(0.88 0.025 75)" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
