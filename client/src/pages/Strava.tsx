import { useEffect, useState } from "react";
import { Link } from "wouter";
import OnTheWheelBadge from "@/components/OnTheWheelBadge";

type StravaStatus = "Research" | "Verified Public Source";

type StravaDiscipline =
  | "Road"
  | "Gravel"
  | "MTB"
  | "Mixed"
  | "Charity"
  | "Race"
  | "Shop";

type StravaTerritory = "TX" | "AR" | "OK" | "Beyond Territory";

interface StravaSource {
  title: string;
  region: string;
  section: "Core Territory Groups" | "National Race Clubs" | "International Race Clubs" | "Charity / Endurance Events" | "Moots-related Clubs" | "Bike Shops / Dealers with Strava";
  discipline: StravaDiscipline;
  territory: StravaTerritory;
  status: StravaStatus;
  stravaUrl: string;
  websiteUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  note: string;
}

const STRAVA_SOURCES: StravaSource[] = [
  {
    title: "Northwest Cycling Club (NWCC)",
    region: "Houston, TX",
    section: "Core Territory Groups",
    discipline: "Road",
    territory: "TX",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/nwcc",
    note: "Houston road and gravel source signal. No partnership or attendance implied.",
  },
  {
    title: "Team UBG Cycling",
    region: "Houston, TX",
    section: "Core Territory Groups",
    discipline: "Road",
    territory: "TX",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/ubg-cycling-club-",
    note: "Houston cycling source signal. Link requires future verification before expansion.",
  },
  {
    title: "Saint Arnold Bike Team",
    region: "Houston, TX",
    section: "Core Territory Groups",
    discipline: "Road",
    territory: "TX",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/saintarnoldbiketeam",
    note: "Houston endurance and road source signal. No affiliation implied.",
  },
  {
    title: "Violet Crown Cycling",
    region: "Austin, TX",
    section: "Core Territory Groups",
    discipline: "Mixed",
    territory: "TX",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/violet-crown-cycling",
    note: "Austin riding source signal for future verification.",
  },
  {
    title: "The Breakfast Club ATX",
    region: "Austin, TX",
    section: "Core Territory Groups",
    discipline: "Mixed",
    territory: "TX",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/breakfast-club-atx",
    note: "Austin social ride source signal. No partnership implied.",
  },
  {
    title: "DORBA",
    region: "Dallas, TX",
    section: "Core Territory Groups",
    discipline: "MTB",
    territory: "TX",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/dorba",
    note: "Dallas mountain bike source signal.",
  },
  {
    title: "Gravel Locos",
    region: "Hico, TX",
    section: "Core Territory Groups",
    discipline: "Gravel",
    territory: "TX",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/gravel-locos",
    note: "Hill Country gravel source signal.",
  },
  {
    title: "Big Sugar Gravel",
    region: "Bentonville, AR",
    section: "Core Territory Groups",
    discipline: "Gravel",
    territory: "AR",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/life-time-big-sugar-gravel",
    websiteUrl: "https://www.bigsugarclassic.com/gravel/",
    note: "Bentonville gravel race source signal. Event facts live elsewhere on /races.",
  },
  {
    title: "OZ Trails",
    region: "Bentonville, AR",
    section: "Core Territory Groups",
    discipline: "MTB",
    territory: "AR",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/oz-trails",
    note: "Northwest Arkansas trail source signal.",
  },
  {
    title: "FAST",
    region: "Fayetteville, AR",
    section: "Core Territory Groups",
    discipline: "MTB",
    territory: "AR",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/fast-trails",
    note: "Arkansas singletrack source signal.",
  },
  {
    title: "Central Arkansas Trail Alliance",
    region: "Little Rock, AR",
    section: "Core Territory Groups",
    discipline: "MTB",
    territory: "AR",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/cata",
    note: "Central Arkansas trail source signal.",
  },
  {
    title: "The Mid South",
    region: "Stillwater, OK",
    section: "Core Territory Groups",
    discipline: "Gravel",
    territory: "OK",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/mid-south-racing-",
    websiteUrl: "https://midsouthgravel.com",
    note: "Oklahoma gravel source signal. Past/current public event facts stay governed separately.",
  },
  {
    title: "Tulsa Tough",
    region: "Tulsa, OK",
    section: "Core Territory Groups",
    discipline: "Road",
    territory: "OK",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/saint-francis-tulsa-tough",
    websiteUrl: "https://tulsatough.com",
    note: "Tulsa road source signal. No attendance implied.",
  },
  {
    title: "OKC Velo",
    region: "Oklahoma City, OK",
    section: "Core Territory Groups",
    discipline: "Road",
    territory: "OK",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/okc-velo",
    note: "Oklahoma City road source signal.",
  },
  {
    title: "Unbound Gravel",
    region: "Emporia, KS",
    section: "National Race Clubs",
    discipline: "Gravel",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/life-time-unbound-gravel",
    websiteUrl: "https://unboundgravel.com",
    note: "National gravel source signal. No MootsFrame attendance implied.",
  },
  {
    title: "SBT GRVL",
    region: "Steamboat Springs, CO",
    section: "National Race Clubs",
    discipline: "Gravel",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/sbtgrvl",
    websiteUrl: "https://www.sbtgrvl.com/",
    instagramUrl: "https://www.instagram.com/sbtgrvl",
    facebookUrl: "https://www.facebook.com/SBTGRVL/",
    note: "Beyond Territory gravel signal. Event facts live on /races.",
  },
  {
    title: "Leadville Race Series",
    region: "Leadville, CO",
    section: "National Race Clubs",
    discipline: "MTB",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/leadvilleraceseries",
    websiteUrl: "https://www.leadvilleraceseries.com/",
    note: "High-country race source signal. No attendance implied.",
  },
  {
    title: "Sea Otter Classic",
    region: "Monterey, CA",
    section: "National Race Clubs",
    discipline: "Mixed",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/sea-otter-classic",
    websiteUrl: "https://seaotterclassic.com",
    note: "National event source signal for future verification.",
  },
  {
    title: "Triple Bypass",
    region: "Evergreen to Avon, CO",
    section: "Charity / Endurance Events",
    discipline: "Charity",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com",
    websiteUrl: "https://runsignup.com/Race/CO/Evergreen/TripleBypass",
    note: "Three Colorado passes. Event facts live on /races. No attendance or partnership implied.",
  },
  {
    title: "L'Etape du Tour",
    region: "France",
    section: "Charity / Endurance Events",
    discipline: "Road",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/letape-du-tour-de-france",
    websiteUrl: "https://letapedutour.com",
    note: "International road source signal for future verification.",
  },
  {
    title: "The Traka",
    region: "Girona, Spain",
    section: "International Race Clubs",
    discipline: "Gravel",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/the-traka",
    websiteUrl: "https://thetraka.com",
    note: "International gravel source signal.",
  },
  {
    title: "The Rift",
    region: "Hvolsvollur, Iceland",
    section: "International Race Clubs",
    discipline: "Gravel",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/the-rift-iceland",
    websiteUrl: "https://therift.is",
    note: "International gravel source signal.",
  },
  {
    title: "FNLD GRVL",
    region: "Lahti, Finland",
    section: "International Race Clubs",
    discipline: "Gravel",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/fnld-grvl",
    websiteUrl: "https://breakaway.cc",
    note: "International gravel source signal.",
  },
  {
    title: "Cape Epic",
    region: "Western Cape, South Africa",
    section: "International Race Clubs",
    discipline: "MTB",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/absa-cape-epic",
    websiteUrl: "https://cape-epic.com",
    note: "International mountain bike source signal.",
  },
  {
    title: "BC Bike Race",
    region: "British Columbia, Canada",
    section: "International Race Clubs",
    discipline: "MTB",
    territory: "Beyond Territory",
    status: "Research",
    stravaUrl: "https://www.strava.com/clubs/bc-bike-race",
    websiteUrl: "https://bcbikerace.com",
    note: "International mountain bike source signal.",
  },
];

const SECTION_ORDER: StravaSource["section"][] = [
  "Core Territory Groups",
  "National Race Clubs",
  "International Race Clubs",
  "Charity / Endurance Events",
];

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

function StravaNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Routes", href: "/routes" },
    { label: "Races", href: "/races" },
    { label: "Bikes", href: "/bikes" },
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
            Strava
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

function SourceCard({ source }: { source: StravaSource }) {
  const links = [
    { label: "Strava", href: source.stravaUrl },
    { label: "Website", href: source.websiteUrl },
    { label: "Instagram", href: source.instagramUrl },
    { label: "Facebook", href: source.facebookUrl },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <article
      className="p-6 flex flex-col min-h-[280px]"
      style={{
        background: "oklch(0.24 0.01 60)",
        border: "1px solid oklch(0.38 0.015 60 / 0.5)",
        borderLeft: `3px solid ${source.status === "Verified Public Source" ? READABLE_ACCENT : "oklch(0.52 0.12 45)"}`,
      }}
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {[source.status, source.discipline, source.territory].map((label) => (
          <span
            key={label}
            className="font-label text-xs tracking-[0.18em] uppercase px-2 py-1"
            style={{
              color: label === "Verified Public Source" ? "oklch(0.22 0.01 60)" : "oklch(0.88 0.025 75)",
              background: label === "Verified Public Source" ? READABLE_ACCENT : "oklch(0.30 0.01 60)",
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
      <div className="flex flex-wrap gap-4 mt-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: READABLE_ACCENT }}
          >
            {link.label} →
          </a>
        ))}
      </div>
    </article>
  );
}

function SourceSection({ section }: { section: StravaSource["section"] }) {
  const sources = STRAVA_SOURCES.filter((source) => source.section === section);
  if (sources.length === 0) return null;

  return (
    <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby={`${section.replace(/\W+/g, "-").toLowerCase()}-heading`}>
      <div className="mb-6">
        <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
          Source Signals
        </p>
        <h2 id={`${section.replace(/\W+/g, "-").toLowerCase()}-heading`} className="font-display text-3xl md:text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
          {section}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sources.map((source) => (
          <SourceCard key={`${source.section}-${source.title}`} source={source} />
        ))}
      </div>
    </section>
  );
}

export default function Strava() {
  useEffect(() => {
    const title = "Strava Signals — MootsFrame";
    const description = "Clubs, races, and rider groups worth watching. Public sources only. No partnership, attendance, sponsorship, or endorsement is implied.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/strava");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <StravaNav />
      <header className="pt-28 pb-12 container">
        <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
          Strava Signals
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
          Where the ride shows up.
        </h1>
        <div className="max-w-2xl space-y-4">
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Clubs, races, and rider groups worth watching. Public sources only. No partnership, attendance, sponsorship, or endorsement is implied.
          </p>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.72 0.04 65)" }}>
            These are public source signals. No partnership, attendance, sponsorship, dealer status, or endorsement is implied.
          </p>
        </div>
      </header>

      {SECTION_ORDER.map((section) => (
        <SourceSection key={section} section={section} />
      ))}

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }} aria-labelledby="held-heading">
        <div className="max-w-2xl">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
            Held for Later
          </p>
          <h2 id="held-heading" className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Not live until governed.
          </h2>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Rider submissions, I'm riding this, photo uploads, Strava profiles, sponsor fields, dealer claims, embeds, maps, and schema stay held until moderation and source rules are ready.
          </p>
        </div>
      </section>
    </main>
  );
}
