import { useEffect, useState } from "react";
import { Link } from "wouter";
import OnTheWheelBadge from "@/components/OnTheWheelBadge";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const FURKA_SIGNAL = {
  title: "Switzerland / Furka Pass",
  region: "Switzerland",
  country: "Switzerland",
  territory: "Beyond Territory",
  status: "Route signal",
  sourceName: "Switzerland Mobility National Cycling Routes",
  sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/national-routes",
  note: "Furka Pass. Switzerland. A public alpine route signal for riders who look beyond the map.",
};

const WATCH_ROAD_SIGNALS = [
  {
    title: "Jura Route — Swiss National Route 7",
    status: "Route signal",
    region: "Lake Geneva to Basel",
    territory: "Beyond Territory",
    sourceName: "Switzerland Mobility National Cycling Routes",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/national-routes",
    note: "A public national route signal through the Swiss Jura. Nyon to Basel. 266 km by official route length.",
  },
  {
    title: "Vallée de Joux",
    status: "Watchmaking region",
    region: "Canton Vaud",
    territory: "Beyond Territory",
    sourceName: "Cycling Thread — Jura Route",
    sourceUrl: "https://www.cyclingthread.com/jura-route-cycling-adventure-in-western-switzerland",
    note: "A quiet valley signal tied to Lac de Joux, the Marchairuz descent, and Swiss watchmaking country.",
  },
  {
    title: "La Chaux-de-Fonds / Le Locle",
    status: "Watchmaking region",
    region: "Canton Neuchâtel",
    territory: "Beyond Territory",
    sourceName: "UNESCO World Heritage Centre",
    sourceUrl: "https://whc.unesco.org/en/list/1302/",
    note: "UNESCO watchmaking urbanism in the Swiss Jura. City signal only.",
  },
];

const ALPINE_RESEARCH_SIGNALS = [
  {
    title: "On the Trail of Watches",
    status: "Watchmaking region",
    region: "La Chaux-de-Fonds",
    territory: "Beyond Territory",
    sourceName: "Switzerland Tourism — On the trail of watches",
    sourceUrl: "https://www.myswitzerland.com/en-us/experiences/on-the-trail-of-watches/",
    note: "La Chaux-de-Fonds is a public watchmaking city signal in the Swiss Jura. Switzerland Tourism ties the city’s street grid, altitude, UNESCO status, and museum culture to watchmaking.",
  },
  {
    title: "Furka / Nufenen / Gotthard Loop",
    status: "Route signal",
    region: "Andermatt / Swiss Alps",
    territory: "Beyond Territory",
    sourceName: "Switzerland Mobility National Cycling Routes",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/national-routes",
    note: "A high-alpine riding signal around Andermatt, Furka, Nufenen, Gotthard, and Tremola.",
  },
  {
    title: "Octopus Gravel",
    status: "Route signal",
    region: "Andermatt",
    territory: "Beyond Territory",
    sourceName: "Switzerland Tourism — Octopus Gravel",
    sourceUrl: "https://www.myswitzerland.com/en-us/experiences/events/octopus-gravel/",
    note: "A public Andermatt gravel event signal built around dead-end alpine climbs.",
  },
  {
    title: "Hospental Gravel Routes",
    status: "Route signal",
    region: "Hospental / Andermatt",
    territory: "Beyond Territory",
    sourceName: "Andermatt Swiss Alps — Hospental gravel routes",
    sourceUrl: "https://maps.andermatt.swiss/en/gravel-bike-routes/hospental/gravel-bike-routes-in-hospental/314685244/",
    note: "A public gravel route signal near Hospental and Andermatt. Source link only.",
  },
  {
    title: "Seven Arms Gravel",
    status: "Route signal",
    region: "Andermatt",
    territory: "Beyond Territory",
    sourceName: "Gravel Union — Seven Arms in the Alps",
    sourceUrl: "https://gravelunion.cc/article/ride-report-gravel-on-seven-arms-in-the-alps",
    note: "A source-backed alpine gravel story signal from the Andermatt area.",
  },
];

const WATCHES_AND_ROADS_EXPANSION = [
  {
    name: "Geneva start signal",
    location: "Geneva",
    status: "Public source",
    sourceUrl: "https://www.myswitzerland.com/en-us/destinations/geneva/",
    copy: "A quiet city start point for the Switzerland board.",
  },
  {
    name: "Jura Route / National Route 7",
    location: "Lake Geneva to Basel",
    status: "Route signal",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-7",
    copy: "A public national cycling route through the Jura.",
  },
  {
    name: "Vallée de Joux",
    location: "Canton Vaud",
    status: "Watchmaking region",
    sourceUrl: "https://www.myswitzerland.com/en-us/destinations/vallee-de-joux/",
    copy: "A public valley signal for watchmaking country and quiet road context.",
  },
  {
    name: "La Chaux-de-Fonds / Le Locle",
    location: "Canton Neuchâtel",
    status: "Watchmaking region",
    sourceUrl: "https://whc.unesco.org/en/list/1302/",
    copy: "UNESCO-listed watchmaking urbanism.",
  },
  {
    name: "Furka / Nufenen / Gotthard",
    location: "Andermatt / Swiss Alps",
    status: "Route signal",
    sourceUrl: "https://www.andermatt.ch/en/summer/cycling/",
    copy: "High-alpine road context around Andermatt.",
  },
  {
    name: "Hospental gravel routes",
    location: "Hospental / Andermatt",
    status: "Route signal",
    sourceUrl: "https://maps.andermatt.swiss/",
    copy: "Public gravel source board for the Andermatt area.",
  },
  {
    name: "Octopus Gravel",
    location: "Andermatt",
    status: "Route signal",
    sourceUrl: "https://www.myswitzerland.com/en-us/experiences/octopus-gravel/",
    copy: "A public gravel event signal.",
  },
  {
    name: "Seven Arms Gravel",
    location: "Andermatt area",
    status: "Route signal",
    sourceUrl: "https://gravelunion.cc/",
    copy: "A public gravel editorial source for alpine context.",
  },
  {
    name: "On the Trail of Watches",
    location: "La Chaux-de-Fonds",
    status: "Watchmaking region",
    sourceUrl: "https://www.myswitzerland.com/en-us/experiences/on-the-trail-of-watches/",
    copy: "A public watchmaking culture signal in the Swiss Jura.",
  },
  {
    name: "Rhône Route",
    location: "Swiss national route",
    status: "Public source",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-1",
    copy: "A public national-route source.",
  },
  {
    name: "Alpine Panorama Route",
    location: "Swiss national route",
    status: "Public source",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-4",
    copy: "A public alpine-route source.",
  },
  {
    name: "Rhine Route",
    location: "Swiss national route",
    status: "Public source",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-2",
    copy: "A public national-route source for later review.",
  },
] as const;

const WATCH_BRANDS = [
  { name: "Audemars Piguet", url: "https://www.audemarspiguet.com" },
  { name: "Jaeger-LeCoultre", url: "https://www.jaeger-lecoultre.com" },
  { name: "IWC Schaffhausen", url: "https://www.iwc.com" },
  { name: "Patek Philippe", url: "https://www.patek.com" },
  { name: "Longines", url: "https://www.longines.com" },
  { name: "TAG Heuer", url: "https://www.tagheuer.com" },
  { name: "Rolex", url: "https://www.rolex.com" },
  { name: "Omega", url: "https://www.omegawatches.com" },
] as const;

const COFFEE_SIGNALS = [
  {
    name: "Café du Glacier",
    city: "Andermatt",
    near: "Furka / Nufenen / Gotthard",
    status: "Coffee signal",
    sourceUrl: "https://www.andermatt.ch/en/gastronomy/",
    copy: "Coffee signal near the Andermatt route corridor. Publicly listed café.",
  },
  {
    name: "Andermatt village hospitality signal",
    city: "Andermatt",
    near: "Gotthard pass corridor",
    status: "Coffee signal",
    sourceUrl: "https://www.andermatt.ch/en/gastronomy/",
    copy: "Publicly listed hospitality corridor near Andermatt.",
  },
  {
    name: "Geneva café quarter",
    city: "Geneva",
    near: "Geneva start signal",
    status: "Coffee signal",
    sourceUrl: "https://www.myswitzerland.com/en-us/destinations/geneva/",
    copy: "Geneva café culture. Public destination source only.",
  },
  {
    name: "La Chaux-de-Fonds café signal",
    city: "La Chaux-de-Fonds",
    near: "Watchmaking region",
    status: "Coffee signal",
    sourceUrl: "https://www.myswitzerland.com/en-us/destinations/la-chaux-de-fonds/",
    copy: "Coffee signal in the watchmaking district. Public destination source only.",
  },
  {
    name: "Andermatt village cafés",
    city: "Andermatt",
    near: "Alpine passes corridor",
    status: "Coffee signal",
    sourceUrl: "https://www.andermatt.ch/en/gastronomy/",
    copy: "Publicly listed café corridor in Andermatt.",
  },
] as const;

const ROUTE_SOURCE_MAPS = [
  {
    name: "Furka / Andermatt alpine signal",
    location: "Andermatt / Furka Pass",
    status: "Route signal",
    sourceUrl: "https://www.andermatt.ch/en/summer/cycling/",
    mapUrl: "https://www.google.com/maps?q=Furka%20Pass%20Andermatt&z=8&output=embed",
    copy: "High alpine route signal from the Furka and Andermatt corridor.",
  },
  {
    name: "Jura Route / National Route 7",
    location: "Lake Geneva to Basel",
    status: "Route signal",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-7",
    mapUrl: "https://www.google.com/maps?q=SchweizMobil%20Route%207&z=7&output=embed",
    copy: "Public national route signal through the Swiss Jura.",
  },
  {
    name: "Rhône Route / National Route 1",
    location: "Swiss national route",
    status: "Route signal",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-1",
    mapUrl: "https://www.google.com/maps?q=SchweizMobil%20Route%201&z=7&output=embed",
    copy: "Public source signal for the Rhône corridor.",
  },
  {
    name: "Rhine Route / National Route 2",
    location: "Swiss national route",
    status: "Route signal",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-2",
    mapUrl: "https://www.google.com/maps?q=SchweizMobil%20Route%202&z=7&output=embed",
    copy: "Public source signal for the Rhine corridor.",
  },
  {
    name: "Alpine Panorama Route / National Route 4",
    location: "Swiss national route",
    status: "Route signal",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/route-4",
    mapUrl: "https://www.google.com/maps?q=SchweizMobil%20Route%204&z=7&output=embed",
    copy: "Public alpine route signal with broad east-west context.",
  },
  {
    name: "La Chaux-de-Fonds / Le Locle watch-road signal",
    location: "Swiss Jura",
    status: "Watchmaking region",
    sourceUrl: "https://whc.unesco.org/en/list/1302/",
    mapUrl: "https://www.google.com/maps?q=La%20Chaux-de-Fonds%20Le%20Locle&z=10&output=embed",
    copy: "Watchmaking urbanism signal from the Swiss Jura.",
  },
  {
    name: "Vallée de Joux watch-road signal",
    location: "Canton Vaud",
    status: "Watchmaking region",
    sourceUrl: "https://www.myswitzerland.com/en-us/destinations/vallee-de-joux/",
    mapUrl: "https://www.google.com/maps?q=Vall%C3%A9e%20de%20Joux&z=10&output=embed",
    copy: "Quiet valley signal tied to watchmaking country.",
  },
  {
    name: "Andermatt / Hospental gravel source signal",
    location: "Hospental / Andermatt",
    status: "Route signal",
    sourceUrl: "https://maps.andermatt.swiss/",
    mapUrl: "https://www.google.com/maps?q=Andermatt%20Hospental&z=10&output=embed",
    copy: "Public gravel source signal near Andermatt and Hospental.",
  },
] as const;

const DISPATCHES = [
  {
    title: "Andermatt Base",
    status: "Route signal",
    note: "Trip base signal for July riding updates.",
  },
  {
    title: "Furka Signal",
    status: "Route signal",
    note: "Alpine pass dispatch placeholder.",
  },
  {
    title: "Nufenen / Gotthard",
    status: "Route signal",
    note: "High-alpine road dispatch placeholder.",
  },
  {
    title: "Watch Road",
    status: "Watchmaking region",
    note: "Jura and watchmaking-country dispatch placeholder.",
  },
  {
    title: "Strava Activity Link",
    status: "Source",
    note: "View on Strava.",
  },
  {
    title: "Instagram Post",
    status: "Source",
    note: "Public post link.",
  },
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
        <a
          href={FURKA_SIGNAL.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source: ${FURKA_SIGNAL.sourceName}`}
          className="font-label text-xs tracking-[0.2em] uppercase mt-auto hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: READABLE_ACCENT }}
        >
          Source →
        </a>
      </div>
    </article>
  );
}

function TravelSignalCard() {
  return (
    <article
      className="overflow-hidden flex flex-col min-h-full"
      style={{ background: "oklch(0.24 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}
    >
      <a
        href="https://www.strava.com/athletes/275498"
        target="_blank"
        rel="noopener noreferrer"
        className="relative min-h-[300px] md:min-h-[360px] overflow-hidden transition-opacity hover:opacity-90 focus:outline focus:outline-2 focus:outline-offset-4"
        aria-label="Follow Ian Zakrocki on Strava"
      >
        <img
          src="/images/ian-furka-pass-moots.jpg"
          alt="Ian and his Moots titanium bike at Furka Pass in Switzerland."
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.006 60 / 0.08), oklch(0.10 0.006 60 / 0.72))" }} />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
          <p className="font-label text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "oklch(0.945 0.018 78)" }}>
            Travel Signal
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight" style={{ color: "oklch(0.945 0.018 78)" }}>
            Ian is inbound with his Moots.
          </h3>
        </div>
      </a>

      <div className="p-6 md:p-8 flex flex-col gap-6 flex-1">
        <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
          Furka, Gotthard, and the watch roads ahead. Follow the public journey on Strava, Instagram, Facebook, and the MootsFrame club.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.strava.com/athletes/275498"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: READABLE_ACCENT }}
          >
            Ian Strava
          </a>
          <a
            href="https://www.instagram.com/mootsframes/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: READABLE_ACCENT }}
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/MootsFrame"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: READABLE_ACCENT }}
          >
            Facebook
          </a>
          <a
            href="https://www.strava.com/clubs/2216534"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: READABLE_ACCENT }}
          >
            MootsFrame Club
          </a>
        </div>
      </div>
    </article>
  );
}

function WatchRoadCard({ signal }: { signal: (typeof WATCH_ROAD_SIGNALS)[number] }) {
  return (
    <article
      className="p-6 md:p-7 min-h-[320px] flex flex-col"
      style={{ background: "oklch(0.24 0.01 60)" }}
    >
      <div className="flex items-center justify-between gap-4 mb-7">
        <span
          className="font-label text-xs tracking-[0.18em] uppercase px-2.5 py-1"
          style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
        >
          {signal.status}
        </span>
      </div>
      <p className="font-label text-xs tracking-[0.24em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
        {signal.region} / {signal.territory}
      </p>
      <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
        {signal.title}
      </h3>
      <p className="font-mono-custom text-sm leading-loose mb-7" style={{ color: "oklch(0.78 0.03 70)" }}>
        {signal.note}
      </p>
      <div className="mt-auto flex flex-col gap-5">
        <div>
          <p className="font-label text-xs tracking-[0.26em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
            Source
          </p>
          <p className="font-mono-custom text-xs leading-relaxed" style={{ color: "oklch(0.88 0.025 75)" }}>
            {signal.sourceName}
          </p>
        </div>
        <a
          href={signal.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open source for ${signal.title}: ${signal.sourceName}`}
          className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: READABLE_ACCENT }}
        >
          Source →
        </a>
      </div>
    </article>
  );
}

function ExpansionSignalCard({ signal }: { signal: (typeof WATCHES_AND_ROADS_EXPANSION)[number] }) {
  return (
    <article className="p-6 md:p-7 min-h-[300px] flex flex-col" style={{ background: "oklch(0.24 0.01 60)" }}>
      <span
        className="font-label text-xs tracking-[0.18em] uppercase px-2.5 py-1 self-start mb-7"
        style={{ color: "oklch(0.22 0.01 60)", background: READABLE_ACCENT }}
      >
        {signal.status}
      </span>
      <p className="font-label text-xs tracking-[0.24em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
        {signal.location}
      </p>
      <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
        {signal.name}
      </h3>
      <p className="font-mono-custom text-sm leading-loose mb-7" style={{ color: "oklch(0.78 0.03 70)" }}>
        {signal.copy}
      </p>
      <a
        href={signal.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open public source for ${signal.name}`}
        className="font-label text-xs tracking-[0.2em] uppercase mt-auto hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4 self-start"
        style={{ color: READABLE_ACCENT }}
      >
        Source →
      </a>
    </article>
  );
}

function CoffeeSignalCard({ signal }: { signal: (typeof COFFEE_SIGNALS)[number] }) {
  return (
    <article className="p-6 md:p-7 min-h-[280px] flex flex-col" style={{ background: "oklch(0.24 0.01 60)" }}>
      <span
        className="font-label text-xs tracking-[0.18em] uppercase px-2.5 py-1 self-start mb-7"
        style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
      >
        {signal.status}
      </span>
      <p className="font-label text-xs tracking-[0.24em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
        {signal.city} / {signal.near}
      </p>
      <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
        {signal.name}
      </h3>
      <p className="font-mono-custom text-sm leading-loose mb-7" style={{ color: "oklch(0.78 0.03 70)" }}>
        {signal.copy}
      </p>
      <a
        href={signal.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open public source for ${signal.name}`}
        className="font-label text-xs tracking-[0.2em] uppercase mt-auto hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4 self-start"
        style={{ color: READABLE_ACCENT }}
      >
        Source →
      </a>
    </article>
  );
}

function RouteSourceMapCard({ signal }: { signal: (typeof ROUTE_SOURCE_MAPS)[number] }) {
  return (
    <article className="p-5 md:p-6 min-h-[420px] flex flex-col gap-4" style={{ background: "oklch(0.24 0.01 60)" }}>
      <div className="flex items-start justify-between gap-4">
        <span
          className="font-label text-xs tracking-[0.18em] uppercase px-2.5 py-1"
          style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
        >
          {signal.status}
        </span>
        <span className="font-label text-[10px] tracking-[0.24em] uppercase text-right" style={{ color: READABLE_ACCENT }}>
          {signal.location}
        </span>
      </div>
      <h3 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
        {signal.name}
      </h3>
      <div className="overflow-hidden border" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)", background: "oklch(0.20 0.01 60)" }}>
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={signal.mapUrl}
          title={`${signal.name} map preview`}
          className="h-[220px] w-full"
        />
      </div>
      <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
        {signal.copy}
      </p>
      <div className="mt-auto flex flex-wrap gap-4">
        <a
          href={signal.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: READABLE_ACCENT }}
        >
          Source →
        </a>
        <a
          href={signal.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: READABLE_ACCENT }}
        >
          Open source map →
        </a>
      </div>
    </article>
  );
}

export default function SwitzerlandRoutes() {
  useEffect(() => {
    const title = "Switzerland Signals — MootsFrame";
    const description = "Switzerland route signals for MootsFrame. Public source signals only.";
    const routeMapEntities = ROUTE_SOURCE_MAPS.map((signal, index) => {
      const entityId = `https://mootsframe.com/routes/switzerland#route-map-${index + 1}`;
      return {
        "@type": "Map",
        "@id": entityId,
        name: signal.name,
        description: signal.copy,
        url: signal.sourceUrl,
        contentUrl: signal.mapUrl,
        about: {
          "@type": "Place",
          name: signal.location,
          sameAs: signal.sourceUrl,
        },
      };
    });
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://mootsframe.com/routes/switzerland#webpage",
          name: "Switzerland Signals — MootsFrame",
          description: "Alpine cycling signals from Switzerland. Furka Pass, the Jura Route, Andermatt, and watchmaking country.",
          url: "https://mootsframe.com/routes/switzerland",
          isPartOf: {
            "@type": "WebSite",
            name: "MootsFrame",
            url: "https://mootsframe.com",
          },
          mainEntity: {
            "@id": "https://mootsframe.com/routes/switzerland#route-source-map",
          },
          about: [
            {
              "@type": "Place",
              name: "Furka Pass",
              description: "Alpine mountain pass in Switzerland. Public cycling route signal.",
              geo: {
                "@type": "GeoCoordinates",
                latitude: 46.5716,
                longitude: 8.4159,
              },
            },
            {
              "@type": "Place",
              name: "Andermatt",
              description: "Alpine cycling hub in Uri, Switzerland. Base for Furka, Nufenen, and Gotthard Pass riding.",
              geo: {
                "@type": "GeoCoordinates",
                latitude: 46.6355,
                longitude: 8.5942,
              },
            },
            {
              "@type": "Place",
              name: "Geneva",
              description: "Public start point for the Switzerland route board.",
            },
            {
              "@type": "Place",
              name: "Lake Geneva to Basel",
              description: "Swiss Jura corridor for National Route 7.",
            },
            {
              "@type": "Place",
              name: "Rhône corridor",
              description: "Public source signal for National Route 1.",
            },
            {
              "@type": "Place",
              name: "Rhine corridor",
              description: "Public source signal for National Route 2.",
            },
            {
              "@type": "Place",
              name: "Alpine Panorama Route corridor",
              description: "Public source signal for National Route 4.",
            },
            {
              "@type": "Place",
              name: "La Chaux-de-Fonds",
              description: "UNESCO World Heritage watchmaking city in the Swiss Jura, Canton Neuchâtel.",
              sameAs: "https://whc.unesco.org/en/list/1302/",
            },
            {
              "@type": "Place",
              name: "Vallée de Joux",
              description: "A quiet valley in Canton Vaud connected to Swiss watchmaking history and the Jura cycling route.",
            },
            {
              "@type": "Place",
              name: "Hospental",
              description: "Andermatt gravel corridor source signal.",
            },
          ],
        },
        {
          "@type": "ItemList",
          "@id": "https://mootsframe.com/routes/switzerland#route-source-map",
          name: "Route Source Map",
          itemListOrder: "http://schema.org/ItemListOrderAscending",
          itemListElement: routeMapEntities.map((entity, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@id": entity["@id"],
            },
          })),
        },
        ...routeMapEntities,
      ],
    };
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

    const schemaId = "switzerland-signals-json-ld";
    document.getElementById(schemaId)?.remove();
    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <SwitzerlandNav />
      <header className="pt-28 pb-16 border-b" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="container grid grid-cols-1 lg:grid-cols-[1fr_0.82fr] gap-10 items-center">
          <div>
            <div
              className="inline-flex flex-col gap-1 px-4 py-3 mb-5"
              style={{ background: "oklch(0.55 0.22 28)", borderLeft: "4px solid oklch(0.945 0.018 78)" }}
            >
              <p className="font-label text-xs tracking-[0.35em] uppercase" style={{ color: "oklch(0.945 0.018 78)" }}>
                Switzerland
              </p>
              <p className="font-label text-[10px] tracking-[0.28em] uppercase" style={{ color: "oklch(0.945 0.018 78 / 0.86)" }}>
                Route chapter
              </p>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
              Switzerland Signals
            </h1>
            <p className="font-display text-2xl md:text-3xl font-bold mb-5" style={{ color: "oklch(0.88 0.025 75)" }}>
              Alpine roads. Old passes. Source first.
            </p>
            <p className="font-mono-custom text-sm leading-loose max-w-2xl" style={{ color: "oklch(0.78 0.03 70)" }}>
              Furka is the first alpine signal. The Jura watch road points north toward the Jura. The sourced route begins at Nyon on Lake Geneva and runs toward Basel through watchmaking country.
            </p>
          </div>
          <figure className="relative min-h-[320px] overflow-hidden" style={{ background: "oklch(0.18 0.008 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
            <img
              src="/images/ian-andermatt-switzerland.jpg"
              alt="Rider on a gravel road in the Swiss Alps near Andermatt"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.18 0.008 60 / 0.08), oklch(0.18 0.008 60 / 0.62))" }} />
            <AlpineMotif className="absolute inset-x-0 bottom-8 mx-auto w-full max-w-[420px] px-6 opacity-20" />
            <figcaption className="absolute bottom-4 left-5 font-label text-xs tracking-[0.24em] uppercase" style={{ color: "oklch(0.945 0.018 78)" }}>
              Swiss Alps. Andermatt area.
            </figcaption>
          </figure>
        </div>
      </header>

      <section className="container py-16" aria-labelledby="switzerland-signal-heading">
        <div className="mb-6">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Route Signal
          </p>
          <h2 id="switzerland-signal-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            First alpine signal.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-5 items-stretch">
          <SignalCard />
          <TravelSignalCard />
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="why-switzerland-heading">
        <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_1fr] gap-8">
          <p className="font-label text-xs tracking-[0.35em] uppercase" style={{ color: READABLE_ACCENT }}>
            Editorial
          </p>
          <div className="max-w-3xl">
            <h2 id="why-switzerland-heading" className="font-display text-3xl md:text-4xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
              Watches and Roads
            </h2>
            <div className="space-y-5 font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
              <p>
                Two crafts built on restraint: metal, patience, time, and the parts nobody sees.
              </p>
              <p>
                A frame does not need to explain itself. Neither does a good watch. The work is in the tolerance, the silence, and the miles after the first climb.
              </p>
              <p>
                The Jura gives the page a second rhythm: less alpine spectacle, more mechanical time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="watches-roads-expansion-heading">
        <div className="max-w-4xl mb-9">
          <div className="inline-flex items-center px-4 py-2 mb-4" style={{ background: "oklch(0.55 0.22 28)" }}>
            <p className="font-label text-xs tracking-[0.35em] uppercase" style={{ color: "oklch(0.945 0.018 78)" }}>
              Switzerland
            </p>
          </div>
          <h2 id="watches-roads-expansion-heading" className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Watches + Roads
          </h2>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Open source signals for the Switzerland chapter.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {WATCHES_AND_ROADS_EXPANSION.map((signal) => (
            <ExpansionSignalCard key={signal.name} signal={signal} />
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="route-source-map-heading">
        <div className="max-w-4xl mb-9">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Map
          </p>
          <h2 id="route-source-map-heading" className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Route Source Map
          </h2>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Source-backed map cards. No route ownership implied.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {ROUTE_SOURCE_MAPS.map((signal) => (
            <RouteSourceMapCard key={signal.name} signal={signal} />
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="watch-brands-heading">
        <div className="grid grid-cols-1 lg:grid-cols-[0.35fr_1fr] gap-8">
          <div>
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
              Source
            </p>
            <h2 id="watch-brands-heading" className="font-display text-3xl md:text-4xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
              Watchmaking region.
            </h2>
            <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
              Official sites. Public source only.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
            {WATCH_BRANDS.map((brand) => (
              <a
                key={brand.name}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 min-h-[120px] flex flex-col justify-between transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
                style={{ background: "oklch(0.24 0.01 60)" }}
              >
                <span className="font-label text-xs tracking-[0.18em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>
                  Official Site
                </span>
                <span className="font-display text-xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                  {brand.name} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="coffee-signals-heading">
        <div className="max-w-4xl mb-9">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Coffee Signals
          </p>
          <h2 id="coffee-signals-heading" className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Cafés near the corridor.
          </h2>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Publicly listed cafés and destination signals for later field notes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {COFFEE_SIGNALS.map((signal) => (
            <CoffeeSignalCard key={signal.name} signal={signal} />
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="watch-road-heading">
        <div className="max-w-4xl mb-9">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Source
          </p>
          <h2 id="watch-road-heading" className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            The Watch Road
          </h2>
          <p className="font-display text-xl md:text-2xl font-bold mb-5" style={{ color: "oklch(0.88 0.025 75)" }}>
            Roads. Watches. Jura.
          </p>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Mechanical time. Mechanical distance. A quiet source board for Ian, Geneva, the Jura, and watchmaking country.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {WATCH_ROAD_SIGNALS.map((signal) => (
            <WatchRoadCard key={signal.title} signal={signal} />
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="alpine-research-heading">
        <div className="max-w-4xl mb-9">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Source
          </p>
          <h2 id="alpine-research-heading" className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Watch Trail / Andermatt Signals
          </h2>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Open source watchmaking and alpine riding signals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {ALPINE_RESEARCH_SIGNALS.map((signal) => (
            <WatchRoadCard key={signal.title} signal={signal} />
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="switzerland-dispatches-heading">
        <div className="max-w-4xl mb-9">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Dispatches
          </p>
          <h2 id="switzerland-dispatches-heading" className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Switzerland Dispatches
          </h2>
          <p className="font-display text-xl md:text-2xl font-bold mb-5" style={{ color: "oklch(0.88 0.025 75)" }}>
            July 7–14. Andermatt, Furka, Nufenen, Gotthard, Jura, and the watch road.
          </p>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian is in Switzerland July 7–14. Public links and field notes appear here.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {DISPATCHES.map((dispatch) => (
            <article key={dispatch.title} className="p-6 md:p-7 min-h-[220px] flex flex-col" style={{ background: "oklch(0.24 0.01 60)" }}>
              <span
                className="font-label text-xs tracking-[0.18em] uppercase px-2.5 py-1 self-start mb-7"
                style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
              >
                {dispatch.status}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
                {dispatch.title}
              </h3>
              <p className="font-mono-custom text-sm leading-loose mt-auto" style={{ color: "oklch(0.78 0.03 70)" }}>
                {dispatch.note}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="follow-switzerland-dispatch-heading">
        <div
          className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr]"
          style={{ background: "oklch(0.38 0.015 60 / 0.5)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}
        >
          <a
            href="https://www.strava.com/athletes/275498"
            target="_blank"
            rel="noopener noreferrer"
            className="relative min-h-[460px] overflow-hidden transition-opacity hover:opacity-90 focus:outline focus:outline-2 focus:outline-offset-4"
            aria-label="Follow Ian Zakrocki on Strava"
          >
            <img
              src="/images/ian-steamboat-ride.jpg"
              alt="Ian Zakrocki riding a Moots titanium bike in Steamboat Springs, Colorado."
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, oklch(0.08 0.005 60 / 0.88), oklch(0.08 0.005 60 / 0))" }} />
            <p className="absolute bottom-5 left-5 right-5 font-label text-xs tracking-[0.22em] uppercase leading-relaxed" style={{ color: "oklch(0.945 0.018 78)" }}>
              Ian Zakrocki. Territory Rep. Steamboat to Switzerland.
            </p>
          </a>

          <div className="p-7 md:p-10 lg:p-12 flex flex-col" style={{ background: "oklch(0.24 0.01 60)" }}>
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
              Follow the Dispatch
            </p>
            <h2 id="follow-switzerland-dispatch-heading" className="font-display text-4xl md:text-5xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
              Follow Ian through Switzerland.
            </h2>
            <p className="font-mono-custom text-sm leading-loose mb-7" style={{ color: "oklch(0.78 0.03 70)" }}>
              Ian rides public. Activity links added here as dispatches are approved. July 7–14.
            </p>
            <a
              href="https://www.strava.com/athletes/275498"
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4 self-start"
              style={{ color: READABLE_ACCENT }}
            >
              Follow Ian on Strava →
            </a>

            <div className="h-px my-8" style={{ background: "oklch(0.38 0.015 60 / 0.65)" }} />

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src="/images/mootsframe-logo.png"
                alt="MootsFrame"
                className="h-16 md:h-[68px] w-auto object-contain self-start"
              />
              <div>
                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>
                  MootsFrame Strava Club
                </h3>
                <p className="font-mono-custom text-sm leading-loose mb-4" style={{ color: "oklch(0.78 0.03 70)" }}>
                  Riders from TX, AR, OK, and wherever the frame goes.
                </p>
                <a
                  href="https://www.strava.com/clubs/2216534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
                  style={{ color: READABLE_ACCENT }}
                >
                  Join on Strava →
                </a>
              </div>
            </div>

            <div className="mt-10 pt-6 flex flex-col sm:flex-row gap-4 sm:gap-6" style={{ borderTop: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
              <a
                href="https://www.instagram.com/mootsframes/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-custom text-xs hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
                style={{ color: "oklch(0.72 0.04 65)" }}
              >
                @mootsframes on Instagram
              </a>
              <a
                href="https://www.youtube.com/@Mootsframe"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-custom text-xs hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
                style={{ color: "oklch(0.72 0.04 65)" }}
              >
                @Mootsframe on YouTube
              </a>
            </div>

            <p className="font-mono-custom text-xs leading-loose mt-6" style={{ color: "oklch(0.72 0.04 65)" }}>
              Public source signals.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
