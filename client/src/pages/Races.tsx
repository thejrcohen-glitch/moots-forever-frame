/*
 * DESIGN: Analog Film / Western Americana — consistent with Home.tsx and Bikes.tsx
 * Races & Events: lead-generation page categorized by Gravel, Road, Mountain.
 * Surfaces only events already present in the site's ride calendar
 * (Home.tsx CALENDAR_EVENTS) plus category-level guidance and CTAs. No fabricated
 * races or imagery — text-first. CTAs route to RSVP modal (ride calendar),
 * pop-up booking section, build configurator, and direct contact.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";

type Discipline = "gravel" | "road" | "mountain";

interface RaceEvent {
  title: string;
  date: string;
  location: string;
  blurb: string;
  url?: string;
  note?: string;
}

interface CategoryCta {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

interface Category {
  id: Discipline;
  label: string;
  heading: string;
  intro: string;
  rideRecommendation: string;
  recommendedBikeHref: string;
  recommendedBikeLabel: string;
  accent: string;
  events: RaceEvent[];
  ctas: CategoryCta[];
}

// Curated only from existing, verified CALENDAR_EVENTS in client/src/pages/Home.tsx.
// No new events fabricated; popups are intentionally excluded — those are demo
// touchpoints, not races. Mountain category currently has one Moots-attended
// event in the calendar, so the section leans on category-level guidance and CTAs.
const CATEGORIES: Category[] = [
  {
    id: "gravel",
    label: "Gravel Races & Events",
    heading: "Gravel.",
    intro:
      "Gravel is where Moots feels most at home. Long days, mixed surfaces, and a frame that absorbs the chatter without dulling the road. The Routt family was built for the events on this list.",
    rideRecommendation:
      "Most riders we send to gravel events are on a Routt RSL or Routt 45. Talk to Ian about sizing and tire clearance before you toe the line.",
    recommendedBikeHref: "/bikes#gravel",
    recommendedBikeLabel: "See the Routt lineup",
    accent: "oklch(0.35 0.06 145)",
    events: [
      {
        title: "SBT GRVL",
        date: "Sunday, June 28, 2026",
        location: "Steamboat Springs, CO",
        blurb:
          "Premier gravel race from the birthplace of Moots. Beyond the territory — but very much on signal.",
        url: "https://www.sbtgrvl.com/",
      },
      {
        title: "Tulsa Tough",
        date: "Fri–Sun Jun 5–7, 2026",
        location: "Tulsa, OK",
        blurb:
          "Three days of criterium racing through Tulsa neighborhoods. A strong Oklahoma signal to track for the next cycle.",
        url: "https://www.tulsatough.com",
        note: "Past 2026 event",
      },
      {
        title: "Life Time Big Sugar Gravel",
        date: "Sat Oct 17, 2026",
        location: "Bentonville, AR",
        blurb:
          "The premier Ozarks gravel race. 100+ miles of dirt. Routt RSL and Routt YBB territory.",
        url: "https://www.bigsugarclassic.com/gravel/",
      },
      {
        title: "Grassroots Gravel",
        date: "Sat Oct 10, 2026",
        location: "Pueblo, CO",
        blurb:
          "Pueblo gravel. 15 to 110 miles through the river corridor. Two-day expo, live music, all levels.",
        url: "https://www.grassrootsgravel.com/grg-2026",
      },
      {
        title: "Slaughter Pen Jam",
        date: "Sat Oct 10, 2026",
        location: "Slaughter Pen Trail, Bentonville, AR",
        blurb:
          "Annual gravel and MTB gathering in the Ozarks. Prime demo opportunity.",
      },
      {
        title: "Flint Hills Gravel",
        date: "Sat Oct 17, 2026",
        location: "Emporia, KS (near OKC)",
        blurb:
          "Classic Flint Hills gravel riding. The landscape that inspired the campaign.",
        url: "https://flinthillsgravelride.com/",
      },
      {
        title: "The Mid South",
        date: "March 12–15, 2026",
        location: "Stillwater, OK",
        blurb:
          "Stillwater dirt, red roads, and a long weekend built around endurance. A strong Oklahoma signal.",
        url: "https://www.midsouthgravel.com/",
        note: "Past 2026 event",
      },
    ],
    ctas: [
      {
        label: "RSVP via the Ride Calendar →",
        href: "/#ride-calendar",
        variant: "primary",
      },
      {
        label: "Request a Pop-Up near a race →",
        href: "/#book-a-pop-up",
        variant: "secondary",
      },
      {
        label: "Build the Routt I'd race →",
        href: "/build",
        variant: "secondary",
      },
    ],
  },
  {
    id: "road",
    label: "Road Races & Events",
    heading: "Road.",
    intro:
      "Long-mile geometry, classic road feel. Vamoots frames have been showing up to centuries and gran fondos for forty-plus years — the Hotter 'N Hell Hundred is a fitting test piece.",
    rideRecommendation:
      "Most road event riders end up on a Vamoots RSL, Vamoots CRD, or Vamoots 33. Reach out for a build sheet before you commit.",
    recommendedBikeHref: "/bikes#road",
    recommendedBikeLabel: "See the Vamoots lineup",
    accent: "oklch(0.52 0.12 45)",
    events: [
      {
        title: "Hotter 'N Hell Hundred",
        date: "Sat Aug 29, 2026",
        location: "Wichita Falls, TX",
        blurb:
          "Road and gravel weekend in Wichita Falls, August 27–30, 2026. A long, hot Texas signal for riders who know what they are getting into.",
        url: "https://hh100.org/",
      },
      {
        title: "Tour de Houston",
        date: "Sun Apr 12, 2026",
        location: "Houston, TX",
        blurb:
          "The city century. Flat and fast through Houston. Vamoots RCS built for days like this.",
        url: "https://www.tourdehouston.org",
        note: "Past event",
      },
      {
        title: "Driveway Series",
        date: "Mar–Oct 2026 (weekly Thursdays)",
        location: "Austin, TX",
        blurb:
          "The longest-running weekly criterium in the country. Closed circuit, 4 miles from downtown.",
        url: "https://www.bikereg.com/74301",
      },
    ],
    ctas: [
      {
        label: "RSVP via the Ride Calendar →",
        href: "/#ride-calendar",
        variant: "primary",
      },
      {
        label: "Request a Pop-Up near a race →",
        href: "/#book-a-pop-up",
        variant: "secondary",
      },
      {
        label: "Build the Vamoots I'd ride →",
        href: "/build",
        variant: "secondary",
      },
    ],
  },
  {
    id: "mountain",
    label: "Mountain Races & Events",
    heading: "Mountain.",
    intro:
      "The Ozarks are a Moots stronghold. Bentonville hosts some of the strongest mountain bike events in the country, and we show up — Womble and Mountaineer in tow.",
    rideRecommendation:
      "Most riders we send into singletrack are on a Womble or a Mountaineer. Ian can walk you through trail-specific geometry before you build.",
    recommendedBikeHref: "/bikes#mountain",
    recommendedBikeLabel: "See the mountain lineup",
    accent: "oklch(0.38 0.015 60)",
    events: [
      {
        title: "Whistler Park Community Ride",
        date: "Sat Aug 15, 2026",
        location: "Whistler, BC",
        blurb:
          "Moots rides the mountain. Whistler Bike Park — where titanium meets elevation.",
      },
    ],
    ctas: [
      {
        label: "RSVP via the Ride Calendar →",
        href: "/#ride-calendar",
        variant: "primary",
      },
      {
        label: "Request a Pop-Up near a race →",
        href: "/#book-a-pop-up",
        variant: "secondary",
      },
      {
        label: "Build the trail bike I'd race →",
        href: "/build",
        variant: "secondary",
      },
    ],
  },
];

const APPROVED_EVENT_SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Hotter 'N Hell Hundred",
    startDate: "2026-08-27",
    endDate: "2026-08-30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: "Wichita Falls, TX",
    url: "https://hh100.org/",
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Life Time Big Sugar Gravel",
    startDate: "2026-10-17",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: "Bentonville, AR",
    url: "https://www.bigsugarclassic.com/gravel/",
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "SBT GRVL",
    startDate: "2026-06-28",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: "Steamboat Springs, CO",
    url: "https://www.sbtgrvl.com/",
  },
];

function RacesNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Bikes", href: "/bikes" },
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
            Races
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

function SectionJump({
  accent,
  categories,
}: {
  accent: string;
  categories: Category[];
}) {
  return (
    <nav aria-label="Race disciplines" className="flex flex-wrap gap-3 mt-8">
      {categories.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className="font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-200 focus:outline focus:outline-2 focus:outline-offset-2"
          style={{
            background: "transparent",
            color: "oklch(0.88 0.025 75)",
            border: `1px solid ${accent}`,
          }}
        >
          {c.label}
        </a>
      ))}
    </nav>
  );
}

function EventCard({ event, accent }: { event: RaceEvent; accent: string }) {
  return (
    <article
      className="p-6"
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
        <time>{event.date}</time>
      </p>
      <h3
        className="font-display text-2xl font-bold mb-2"
        style={{ color: "oklch(0.945 0.018 78)" }}
      >
        {event.title}
      </h3>
      <p
        className="font-mono-custom text-xs mb-3"
        style={{ color: "oklch(0.52 0.04 65)" }}
      >
        {event.location}
      </p>
      <p
        className="font-mono-custom text-sm leading-relaxed"
        style={{ color: "oklch(0.72 0.04 65)" }}
      >
        {event.blurb}
      </p>
      {event.note && (
        <p
          className="font-label text-xs tracking-[0.2em] uppercase mt-4"
          style={{ color: "oklch(0.52 0.04 65)" }}
        >
          {event.note}
        </p>
      )}
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-label text-xs tracking-[0.2em] uppercase mt-4 hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
          style={{ color: accent }}
        >
          Event site →
        </a>
      )}
    </article>
  );
}

function CtaRow({ ctas, accent }: { ctas: CategoryCta[]; accent: string }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
      {ctas.map((cta) => {
        const isPrimary = cta.variant === "primary";
        const isInternal = cta.href.startsWith("/") && !cta.href.startsWith("/#");
        const baseClass =
          "font-label text-xs tracking-[0.2em] uppercase px-5 py-3 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4 inline-block";
        const style = isPrimary
          ? { background: accent, color: "oklch(0.945 0.018 78)" }
          : {
              background: "transparent",
              color: "oklch(0.88 0.025 75)",
              border: `1px solid ${accent}`,
            };
        if (isInternal) {
          return (
            <Link key={cta.label} href={cta.href} className={baseClass} style={style}>
              {cta.label}
            </Link>
          );
        }
        return (
          <a key={cta.label} href={cta.href} className={baseClass} style={style}>
            {cta.label}
          </a>
        );
      })}
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  const headingId = `${category.id}-heading`;
  return (
    <section
      id={category.id}
      className="py-16 border-t scroll-mt-24"
      style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
      aria-labelledby={headingId}
    >
      <p
        className="font-label text-xs tracking-[0.35em] uppercase mb-3"
        style={{ color: category.accent }}
      >
        {category.label}
      </p>
      <h2
        id={headingId}
        className="font-display text-4xl md:text-5xl font-bold mb-4"
        style={{ color: "oklch(0.945 0.018 78)" }}
      >
        {category.heading}
      </h2>
      <p
        className="font-mono-custom text-sm max-w-2xl mb-3"
        style={{ color: "oklch(0.72 0.04 65)" }}
      >
        {category.intro}
      </p>
      <p
        className="font-mono-custom text-sm max-w-2xl mb-6"
        style={{ color: "oklch(0.52 0.04 65)" }}
      >
        {category.rideRecommendation}
      </p>
      <Link
        href={category.recommendedBikeHref}
        className="inline-block font-label text-xs tracking-[0.2em] uppercase mb-10 hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
        style={{ color: category.accent }}
      >
        {category.recommendedBikeLabel} →
      </Link>

      {category.events.length > 0 ? (
        <>
          <p
            className="font-label text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: "oklch(0.52 0.04 65)" }}
          >
            On the calendar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {category.events.map((event) => (
              <EventCard key={event.title} event={event} accent={category.accent} />
            ))}
          </div>
        </>
      ) : (
        <p
          className="font-mono-custom text-sm max-w-xl"
          style={{ color: "oklch(0.52 0.04 65)" }}
        >
          No {category.id} events on the public calendar yet. Reach out — Ian
          tracks regional races and can point you toward the right start line.
        </p>
      )}

      <CtaRow ctas={category.ctas} accent={category.accent} />
    </section>
  );
}

export default function Races() {
  useEffect(() => {
    const title = "Races & Events — Moots Forever Frame";
    const description = "Gravel races, criteriums, and rides across TX, AR, and OK. Real events, real dates, direct registration links.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/races");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);

    const eventSchemaScript = document.createElement("script");
    eventSchemaScript.type = "application/ld+json";
    eventSchemaScript.textContent = JSON.stringify(APPROVED_EVENT_SCHEMA);
    document.head.appendChild(eventSchemaScript);

    return () => {
      eventSchemaScript.remove();
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <RacesNav />

      <header className="pt-28 pb-10 container">
        <p
          className="font-label text-xs tracking-[0.35em] uppercase mb-3"
          style={{ color: "oklch(0.52 0.12 45)" }}
        >
          Races & Events
        </p>
        <h1
          className="font-display text-5xl md:text-6xl font-bold mb-4"
          style={{ color: "oklch(0.945 0.018 78)" }}
        >
          Where we{" "}
          <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>
            show up.
          </em>
        </h1>
        <p
          className="font-mono-custom text-sm max-w-2xl"
          style={{ color: "oklch(0.72 0.04 65)" }}
        >
          Gravel, road, and mountain events across TX · OK · AR where Moots is in
          the mix. Every event below is already on the Moots ride calendar — RSVP
          there, or have Ian bring a demo fleet to your start line.
        </p>

        <SectionJump accent="oklch(0.52 0.12 45)" categories={CATEGORIES} />

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <a
            href="/#ride-calendar"
            className="font-label text-xs tracking-[0.2em] uppercase px-5 py-3 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
            style={{
              background: "oklch(0.52 0.12 45)",
              color: "oklch(0.945 0.018 78)",
            }}
          >
            See the full Ride Calendar →
          </a>
          <a
            href="/#book-a-pop-up"
            className="font-label text-xs tracking-[0.2em] uppercase px-5 py-3 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
            style={{
              background: "transparent",
              color: "oklch(0.88 0.025 75)",
              border: "1px solid oklch(0.72 0.14 65)",
            }}
          >
            Book a Pop-Up near a race →
          </a>
        </div>
      </header>

      <main className="container pb-24">
        {CATEGORIES.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

        <section
          className="py-16 border-t"
          style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
          aria-labelledby="races-contact-heading"
        >
          <p
            className="font-label text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "oklch(0.52 0.12 45)" }}
          >
            Talk to a human
          </p>
          <h2
            id="races-contact-heading"
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "oklch(0.945 0.018 78)" }}
          >
            Racing soon? Let's get you on the right bike.
          </h2>
          <p
            className="font-mono-custom text-sm max-w-xl mb-6"
            style={{ color: "oklch(0.72 0.04 65)" }}
          >
            Sizing, geometry, gear ratios for the climb you're worried about —
            Ian Zakrocki is the Moots representative for TX · OK · AR and
            answers the phone.
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
            <Link
              href="/build"
              className="font-label text-xs tracking-[0.2em] uppercase px-5 py-3 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
              style={{
                background: "transparent",
                color: "oklch(0.88 0.025 75)",
                border: "1px solid oklch(0.72 0.14 65)",
              }}
            >
              Start a build sheet →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
