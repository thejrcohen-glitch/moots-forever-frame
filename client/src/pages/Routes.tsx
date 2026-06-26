import { useEffect, useState } from "react";
import { Link } from "wouter";
import OnTheWheelBadge from "@/components/OnTheWheelBadge";

type SourceType = "Route Source" | "Coffee Stop" | "Ride Group" | "Repair / Service" | "Beyond Territory";
type Territory = "TX" | "AR" | "OK" | "Beyond Territory";
type SourceStatus = "Research" | "Public Source";

interface RouteCoffeeSource {
  title: string;
  region: string;
  type: SourceType;
  territory: Territory;
  status: SourceStatus;
  sourceUrl: string;
  detailUrl?: string;
  note: string;
}

const SOURCES: RouteCoffeeSource[] = [
  {
    title: "Ian Strava",
    region: "Rider source",
    type: "Route Source",
    territory: "Beyond Territory",
    status: "Research",
    sourceUrl: "https://www.strava.com/athletes/275498",
    note: "Source lead for future approved route work. No route ownership or endorsement implied.",
  },
  {
    title: "Moots Cycles Club Strava",
    region: "Global",
    type: "Route Source",
    territory: "Beyond Territory",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/6046",
    note: "Public club source lead for future route and ride discovery.",
  },
  {
    title: "SBT GRVL Strava",
    region: "Steamboat Springs, CO",
    type: "Route Source",
    territory: "Beyond Territory",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/sbtgrvl",
    note: "Beyond Territory gravel signal. Listing does not imply MootsFrame attendance.",
  },
  {
    title: "FNLD GRVL Strava",
    region: "Finland",
    type: "Route Source",
    territory: "Beyond Territory",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/fnldgrvl",
    note: "Global rider signal for future source verification.",
  },
  {
    title: "Switzerland / Furka Pass",
    region: "Switzerland",
    type: "Beyond Territory",
    territory: "Beyond Territory",
    status: "Research",
    sourceUrl: "https://schweizmobil.ch/en/cycling-in-switzerland/national-routes",
    detailUrl: "/routes/switzerland",
    note: "Furka Pass. Switzerland. A public alpine route signal for riders who look beyond the map.",
  },
  {
    title: "The Meteor Strava",
    region: "Austin, TX",
    type: "Ride Group",
    territory: "TX",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/903896",
    note: "Austin ride-culture source lead.",
  },
  {
    title: "Anthills MTB",
    region: "Houston, TX",
    type: "Route Source",
    territory: "TX",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/232932",
    note: "Houston MTB source lead. Public copy requires verification before expansion.",
  },
  {
    title: "Chasing Watts Strava",
    region: "Houston, TX",
    type: "Ride Group",
    territory: "TX",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/chasingwatts",
    note: "Houston ride-community source lead.",
  },
  {
    title: "Pushin Watts Strava",
    region: "Richmond, TX",
    type: "Ride Group",
    territory: "TX",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/Pushinwatts",
    note: "Richmond / Houston cycling-community source lead.",
  },
  {
    title: "Houston Gravel Collective",
    region: "Houston, TX",
    type: "Ride Group",
    territory: "TX",
    status: "Research",
    sourceUrl: "https://www.strava.com/clubs/HoustonGravelCollective",
    note: "Houston gravel-community source lead. No partnership implied.",
  },
  {
    title: "The Meteor",
    region: "Austin, TX",
    type: "Coffee Stop",
    territory: "TX",
    status: "Public Source",
    sourceUrl: "https://themeteor.cafe/",
    note: "Coffee, bikes, and rider culture under one roof. Listing does not imply partnership.",
  },
  {
    title: "Chasing Watts",
    region: "Houston, TX",
    type: "Ride Group",
    territory: "TX",
    status: "Public Source",
    sourceUrl: "https://chasingwatts.com",
    note: "Houston ride-community source. No attendance or endorsement implied.",
  },
  {
    title: "Pushin Watts",
    region: "Richmond, TX",
    type: "Ride Group",
    territory: "TX",
    status: "Public Source",
    sourceUrl: "https://www.pushinwatts.com",
    note: "Cycling-community source. No partnership or endorsement implied.",
  },
];

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

function RoutesNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Bikes", href: "/bikes" },
    { label: "Races", href: "/races" },
    { label: "Switzerland", href: "/routes/switzerland" },
    { label: "Build", href: "/build" },
    { label: "Community", href: "/community" },
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
            Routes
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

function SourceCard({ source }: { source: RouteCoffeeSource }) {
  return (
    <article
      className="p-6 flex flex-col min-h-[260px]"
      style={{
        background: "oklch(0.24 0.01 60)",
        border: "1px solid oklch(0.38 0.015 60 / 0.5)",
        borderLeft: `3px solid ${source.status === "Public Source" ? READABLE_ACCENT : "oklch(0.52 0.12 45)"}`,
      }}
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {[source.status, source.type, source.territory].map((label) => (
          <span
            key={label}
            className="font-label text-xs tracking-[0.18em] uppercase px-2 py-1"
            style={{
              color: label === "Public Source" ? "oklch(0.22 0.01 60)" : "oklch(0.88 0.025 75)",
              background: label === "Public Source" ? READABLE_ACCENT : "oklch(0.30 0.01 60)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <p className="font-label text-xs tracking-[0.25em] uppercase mb-2" style={{ color: READABLE_ACCENT }}>
        {source.region}
      </p>
      <h2 className="font-display text-2xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
        {source.title}
      </h2>
      <p className="font-mono-custom text-sm leading-relaxed flex-1" style={{ color: "oklch(0.72 0.04 65)" }}>
        {source.note}
      </p>
      <a
        href={source.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-label text-xs tracking-[0.2em] uppercase mt-6 hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
        style={{ color: READABLE_ACCENT }}
      >
        Source →
      </a>
      {source.detailUrl && (
        <Link
          href={source.detailUrl}
          className="inline-block font-label text-xs tracking-[0.2em] uppercase mt-4 hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: "oklch(0.88 0.025 75)" }}
        >
          Details →
        </Link>
      )}
    </article>
  );
}

export default function Routes() {
  useEffect(() => {
    const title = "Routes + Coffee — MootsFrame";
    const description = "Route sources, coffee stops, ride groups, and rider signals for Moots riders.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/routes");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  const researchSources = SOURCES.filter((source) => source.status === "Research");
  const publicSources = SOURCES.filter((source) => source.status === "Public Source");

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <RoutesNav />
      <header className="pt-28 pb-12 container">
        <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
          Routes + Coffee
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
          Coffee first. Dirt nearby.
        </h1>
        <div className="max-w-2xl space-y-4">
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Moots riders travel. The frame goes where the rider goes.
          </p>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.72 0.04 65)" }}>
            Public route and coffee signals. Open links first.
          </p>
        </div>
      </header>

      <section className="container pb-12" aria-labelledby="switzerland-route-chapter-heading">
        <Link href="/routes/switzerland" className="block transition-opacity hover:opacity-95 focus:outline focus:outline-2 focus:outline-offset-4">
          <article className="p-7 md:p-9 flex flex-col gap-4" style={{ background: "oklch(0.24 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)", borderLeft: `3px solid ${READABLE_ACCENT}` }}>
            <p className="font-label text-xs tracking-[0.35em] uppercase" style={{ color: READABLE_ACCENT }}>
              Route Chapter
            </p>
            <h2 id="switzerland-route-chapter-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
              Switzerland / Furka Pass
            </h2>
            <p className="font-mono-custom text-sm leading-loose max-w-2xl" style={{ color: "oklch(0.78 0.03 70)" }}>
              Alpine roads, watch roads, coffee signals, and public source links from Furka toward the Jura.
            </p>
            <span className="font-label text-xs tracking-[0.2em] uppercase self-start" style={{ color: READABLE_ACCENT }}>
              Open Switzerland →
            </span>
          </article>
        </Link>
      </section>

      <section className="container pb-16" aria-labelledby="public-sources-heading">
        <div className="mb-6">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
            Public Source
          </p>
          <h2 id="public-sources-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Open doors.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {publicSources.map((source) => (
            <SourceCard key={source.title} source={source} />
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="research-sources-heading">
        <div className="mb-6">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
            Research
          </p>
          <h2 id="research-sources-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Signals to verify.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {researchSources.map((source) => (
            <SourceCard key={source.title} source={source} />
          ))}
        </div>
      </section>

      <footer className="py-12 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)", background: "oklch(0.18 0.008 60)" }}>
        <div className="container flex flex-col gap-4">
          <p className="font-label text-xs tracking-[0.22em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>
            Follow the field notes.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="https://www.instagram.com/MootsFrames/" target="_blank" rel="noopener noreferrer" className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.72 0.14 65)" }}>
              Instagram
            </a>
            <a href="https://www.facebook.com/MootsFrame" target="_blank" rel="noopener noreferrer" className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.72 0.14 65)" }}>
              Facebook
            </a>
            <a href="https://www.youtube.com/@Mootsframe" target="_blank" rel="noopener noreferrer" className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.72 0.14 65)" }}>
              YouTube
            </a>
            <a href="https://www.strava.com/clubs/2216534" target="_blank" rel="noopener noreferrer" className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.72 0.14 65)" }}>
              Strava Club
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
