import { useEffect, type ReactNode } from "react";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const RIDE_TIERS = [
  {
    title: "Gravel — The Trinity Levee",
    note: "Moots Routt 45",
    copy:
      "The Trinity Levee Trail runs 8.2 miles of gravel atop the city's levee system with views of the Dallas skyline and the Trinity River. Part of a planned 22.6-mile expansion connecting multiple city parks. DFW's urban gravel anchor.",
  },
  {
    title: "Road — White Rock Lake",
    note: "Moots Vamoots RCS",
    copy:
      "White Rock Lake is where North Texas road riders earn their legs. A 1,254-acre reservoir with a full paved circumnavigation loop. Fast, iconic, and the social center of DFW road cycling.",
  },
  {
    title: "Trail — Grapevine Lake",
    note: "Moots Womble or Routt YBB",
    copy:
      "Grapevine Lake and the surrounding Flower Mound trail network offer mixed-surface riding with gravel and singletrack options. Mountain bike terrain within city reach.",
  },
] as const;

const COMMUNITY_LINKS = [
  { label: "Matrix Cycle Club", href: "https://matrixcycleclub.org" },
  { label: "BikeDFW", href: "https://bikedfw.org" },
] as const;

const EVENTS = [
  {
    name: "Dallas Gravel Ride",
    details: "Trinity River levee system, Margaret Hunt Hill Bridge. wheelbrothers.com/dallas-gravel-ride",
  },
  {
    name: "Hotter'N Hell Hundred",
    details: "Wichita Falls, TX. August 27-30, 2026. hellhundred.com",
  },
  {
    name: "Matrix Cycle Club monthly meetings",
    details: "Third Tuesday, Richardson Bike Mart. matrixcycleclub.org",
  },
] as const;

const RESOURCES = [
  { label: "BikeDFW", href: "https://bikedfw.org" },
  { label: "Matrix Cycle Club", href: "https://matrixcycleclub.org" },
  { label: "Fort Worth Bicycling Association", href: "https://fwbaclub.org" },
  { label: "RideWithGPS Dallas", href: "https://ridewithgps.com/regions/north_america/us/21-dallas-texas-usa" },
  { label: "Trinity Levee Trail info", href: "https://dallasparks.org" },
] as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
      {children}
    </p>
  );
}

function DarkCard({
  title,
  children,
  note,
}: {
  title: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <article className="p-6 md:p-7 flex flex-col gap-4 min-h-[240px]" style={{ background: "oklch(0.24 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
      <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight" style={{ color: "oklch(0.945 0.018 78)" }}>
        {title}
      </h3>
      <div className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
        {children}
      </div>
      {note ? (
        <p className="font-label text-xs tracking-[0.18em] uppercase mt-auto" style={{ color: READABLE_ACCENT }}>
          {note}
        </p>
      ) : null}
    </article>
  );
}

export default function DFW() {
  useEffect(() => {
    const title = "Dallas-Fort Worth — MootsFrame";
    const description =
      "Dallas-Fort Worth location page for MootsFrame. Levees. Lake loops. Hill Country on the horizon. Public routes, community, events, and service-area contact.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/locations/dfw");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-5xl">
          <SectionLabel>Dallas-Fort Worth</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
            Dallas-Fort Worth: Where the Territory Gets Fast
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: READABLE_ACCENT }}>
            Levees. Lake loops. Hill Country on the horizon.
          </p>
          <p className="font-mono-custom text-base md:text-lg leading-loose max-w-4xl" style={{ color: "oklch(0.78 0.03 70)" }}>
            DFW doesn't do slow. The Trinity Levee gives you gravel inside city limits. White Rock Lake gives you the road loop that built North Texas cycling. The Hill Country starts two hours south. A titanium frame that earns its keep in Dallas earns it everywhere in the territory.
          </p>
        </div>
      </article>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Ride Tiers</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Three ways DFW rides.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {RIDE_TIERS.map((tier) => (
            <DarkCard key={tier.title} title={tier.title} note={tier.note}>
              {tier.copy}
            </DarkCard>
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Community</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Community
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Matrix Cycle Club is the anchor of North Texas performance cycling — founded 1984 in partnership with Richardson Bike Mart, USA Cycling Center of Excellence since 2017. BikeDFW connects the broader network of clubs across the metroplex. Monthly Matrix meetings at Richardson Bike Mart, Richardson.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {COMMUNITY_LINKS.map((resource) => (
            <a
              key={resource.label}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 md:p-7 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
              style={{ background: "oklch(0.24 0.01 60)" }}
            >
              <p className="font-label text-xs tracking-[0.22em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
                Community
              </p>
              <h3 className="font-display text-2xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                {resource.label} →
              </h3>
            </a>
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Events</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Rides and Events
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {EVENTS.map((event) => (
            <article key={event.name} className="p-6 md:p-7 min-h-[180px] flex flex-col gap-4" style={{ background: "oklch(0.24 0.01 60)" }}>
              <h3 className="font-display text-2xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                {event.name}
              </h3>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                {event.details}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Demo a Moots in Dallas-Fort Worth
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian Zakrocki represents Moots titanium bikes across Texas, Arkansas, and Oklahoma. Demo rides available in the DFW area.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="p-7 md:p-9" style={{ background: "oklch(0.24 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
            <p className="font-label text-xs tracking-[0.22em] uppercase mb-4" style={{ color: READABLE_ACCENT }}>
              WhatsApp
            </p>
            <a
              href="https://wa.me/19175787687"
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-sm tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
              style={{ color: READABLE_ACCENT }}
            >
              WhatsApp Ian →
            </a>
          </div>
          <p className="font-mono-custom text-sm leading-loose p-7 md:p-9" style={{ background: "oklch(0.18 0.008 60)", color: "oklch(0.78 0.03 70)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
            MootsFrame is a service-area dealership. No storefront address.
          </p>
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Resources</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Resources
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {RESOURCES.map((resource) => (
            <a
              key={resource.label}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 md:p-7 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
              style={{ background: "oklch(0.24 0.01 60)" }}
            >
              <p className="font-label text-xs tracking-[0.22em] uppercase mb-3" style={{ color: READABLE_ACCENT }}>
                Source
              </p>
              <h3 className="font-display text-2xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                {resource.label} →
              </h3>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
