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

function AlpineMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 520 320"
      className={className}
      fill="none"
    >
      <path
        d="M40 235 C105 200 126 158 170 164 C213 170 221 116 263 108 C310 99 332 164 371 153 C414 141 439 190 480 174"
        stroke="oklch(0.72 0.14 65)"
        strokeWidth="2"
      />
      <path
        d="M52 262 C119 226 142 187 182 191 C220 195 238 145 275 140 C315 135 340 190 382 181 C426 171 449 213 486 202"
        stroke="oklch(0.88 0.025 75 / 0.45)"
        strokeWidth="1.5"
      />
      <path
        d="M65 291 C132 255 155 222 196 225 C236 228 254 183 292 178 C332 173 357 221 396 215 C438 209 460 242 496 235"
        stroke="oklch(0.88 0.025 75 / 0.28)"
        strokeWidth="1.5"
      />
      <path
        d="M112 86 C148 57 184 47 220 58 C256 69 283 51 318 42 C371 29 424 53 455 94"
        stroke="oklch(0.52 0.12 45 / 0.75)"
        strokeWidth="1.5"
      />
      <path
        d="M120 118 C162 92 196 87 235 96 C270 104 296 86 331 82 C378 76 420 97 451 128"
        stroke="oklch(0.88 0.025 75 / 0.25)"
        strokeWidth="1.5"
      />
      <path
        d="M208 246 C236 224 251 198 246 171 C241 141 257 119 287 105"
        stroke="oklch(0.945 0.018 78 / 0.42)"
        strokeWidth="1.25"
        strokeDasharray="7 8"
      />
      <circle cx="287" cy="105" r="5" fill="oklch(0.72 0.14 65)" />
      <circle cx="208" cy="246" r="4" fill="oklch(0.52 0.12 45)" />
    </svg>
  );
}

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
      className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-px"
      style={{
        border: "1px solid oklch(0.38 0.015 60 / 0.5)",
        background: "oklch(0.38 0.015 60 / 0.5)",
      }}
    >
      <div className="p-7 md:p-10 flex flex-col" style={{ background: "oklch(0.24 0.01 60)" }}>
        <div className="flex flex-wrap gap-2 mb-8">
          {[FURKA_SIGNAL.status, FURKA_SIGNAL.territory, FURKA_SIGNAL.country].map((label) => (
            <span
              key={label}
              className="font-label text-xs tracking-[0.18em] uppercase px-2.5 py-1"
              style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
            >
              {label}
            </span>
          ))}
        </div>
        <p className="font-label text-xs tracking-[0.25em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
          {FURKA_SIGNAL.region}
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" style={{ color: "oklch(0.945 0.018 78)" }}>
          {FURKA_SIGNAL.title}
        </h2>
        <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
          {FURKA_SIGNAL.note}
        </p>
      </div>

      <div className="p-7 md:p-10 flex flex-col gap-6" style={{ background: "oklch(0.20 0.01 60)" }}>
        <div>
          <p className="font-label text-xs tracking-[0.28em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
            Source
          </p>
          <p className="font-mono-custom text-sm leading-relaxed" style={{ color: "oklch(0.88 0.025 75)" }}>
            {FURKA_SIGNAL.sourceName}
          </p>
        </div>
        <div>
          <p className="font-label text-xs tracking-[0.28em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
            Governance
          </p>
          <p className="font-mono-custom text-xs leading-loose" style={{ color: "oklch(0.72 0.04 65)" }}>
            {FURKA_SIGNAL.governanceNote}
          </p>
        </div>
        <a
          href={FURKA_SIGNAL.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-label text-xs tracking-[0.2em] uppercase mt-auto hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: READABLE_ACCENT }}
        >
          Source →
        </a>
      </div>
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
      <header className="pt-28 pb-16 border-b" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="container grid grid-cols-1 lg:grid-cols-[1fr_0.82fr] gap-10 items-center">
          <div>
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
              Beyond Territory
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
              Switzerland Signals
            </h1>
            <p className="font-display text-2xl md:text-3xl font-bold mb-5" style={{ color: "oklch(0.88 0.025 75)" }}>
              Alpine roads. Old passes. Source first.
            </p>
            <p className="font-mono-custom text-sm leading-loose max-w-2xl" style={{ color: "oklch(0.78 0.03 70)" }}>
              Furka is the first signal. The rest stays held until the sources are clean.
            </p>
          </div>
          <div className="relative min-h-[260px] flex items-center justify-center overflow-hidden" style={{ background: "oklch(0.18 0.008 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
            <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 65% 35%, oklch(0.52 0.12 45 / 0.28), transparent 42%)" }} />
            <AlpineMotif className="relative z-10 w-full max-w-[520px] p-6" />
          </div>
        </div>
      </header>

      <section className="container py-16" aria-labelledby="switzerland-signal-heading">
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

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="why-switzerland-heading">
        <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_1fr] gap-8">
          <p className="font-label text-xs tracking-[0.35em] uppercase" style={{ color: READABLE_ACCENT }}>
            Editorial
          </p>
          <div className="max-w-3xl">
            <h2 id="why-switzerland-heading" className="font-display text-3xl md:text-4xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
              Why Switzerland
            </h2>
            <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
              Switzerland sits outside the territory. That is the point. Some roads become signals because riders remember them before they can explain them.
            </p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
            {HELD_ITEMS.map((item) => (
              <div key={item} className="p-5 min-h-[96px] flex items-center" style={{ background: "oklch(0.24 0.01 60)" }}>
                <p className="font-label text-xs tracking-[0.18em] uppercase leading-relaxed" style={{ color: "oklch(0.88 0.025 75)" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono-custom text-sm leading-loose mt-8" style={{ color: "oklch(0.78 0.03 70)" }}>
            More routes come later. The source comes first.
          </p>
        </div>
      </section>
    </main>
  );
}
