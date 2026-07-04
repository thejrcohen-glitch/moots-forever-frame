import { useEffect, type ReactNode } from "react";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const RIDE_TIERS = [
  {
    title: "Mountain — Government Canyon and McAllister",
    note: "Moots Womble, MXC, or Routt YBB",
    copy:
      "Government Canyon State Natural Area delivers limestone ledges, technical singletrack, and backcountry climbs north of the city. McAllister Park adds a pump track, skills course, and nearly 100 beginner and intermediate trails. Free county access.",
  },
  {
    title: "Road — Missions Trail and Salado Creek",
    note: "Moots Vamoots RCS",
    copy:
      "The San Antonio Missions Trail runs vehicle-free through the city's south side connecting the historic Spanish Missions. Salado Creek Greenway adds continuous paved trail through the urban core.",
  },
  {
    title: "Gravel — Hill Country Access",
    note: "Moots Routt 45 or Scrambler",
    copy:
      "The ranch roads climbing out of Pipe Creek and Bandera County begin thirty minutes west of downtown. Remote. Low traffic. The same gravel that feeds into Castell Grind country.",
  },
] as const;

const COMMUNITY_LINKS = [
  { label: "San Antonio Wheelmen", href: "https://sawheelmen.com" },
  { label: "San Antonio Cycling Club", href: "https://rideawaybicycles.com" },
  { label: "Major Taylor Cycling Club SA", href: "https://mtccsa.org" },
] as const;

const EVENTS = [
  {
    name: "Castell Grind",
    details: "Annual April event. Castell, TX. 62, 45, or 31 miles. Remote Hill Country gravel. castellgrind.com",
  },
  {
    name: "L'Etape San Antonio",
    details: "Tour de France-designed course. letapesanantonio.com",
  },
  {
    name: "Hill Country MTB Challenge",
    details: "Largest MTB race in the San Antonio area. Part of TMBRA XC State Championship Series.",
  },
] as const;

const RESOURCES = [
  { label: "Howard W. Peak Greenway", href: "https://sanantonio.gov/ParksAndRec" },
  { label: "Government Canyon State Natural Area", href: "https://tpwd.texas.gov" },
  { label: "San Antonio Wheelmen", href: "https://sawheelmen.com" },
  { label: "Major Taylor Cycling Club SA", href: "https://mtccsa.org" },
  { label: "Castell Grind", href: "https://castellgrind.com" },
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

export default function SanAntonio() {
  useEffect(() => {
    const title = "San Antonio — MootsFrame";
    const description =
      "San Antonio location page for MootsFrame. Urban trails, technical limestone, remote ranch roads, community, events, and service-area contact.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/locations/san-antonio");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-5xl">
          <SectionLabel>San Antonio</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
            San Antonio: Where the Hill Country Begins
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: READABLE_ACCENT }}>
            Urban trails. Technical limestone. Remote ranch roads.
          </p>
          <p className="font-mono-custom text-base md:text-lg leading-loose max-w-4xl" style={{ color: "oklch(0.78 0.03 70)" }}>
            San Antonio rides north. Thirty minutes west and the Hill Country opens up — Government Canyon, Pipe Creek ranch roads, the Castell Grind country. The Howard Peak Greenway connects 100 miles of urban trails inside the city. The terrain changes fast. The frame does not.
          </p>
        </div>
      </article>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Ride Tiers</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Three ways San Antonio rides.
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
            The San Antonio Wheelmen have anchored the local cycling community for decades. The San Antonio Cycling Club runs no-drop rides weekdays and weekends for all skill levels. The Major Taylor Cycling Club of San Antonio brings community rides and advocacy to the city.
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
            Demo a Moots in San Antonio
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian Zakrocki represents Moots titanium bikes across Texas, Arkansas, and Oklahoma. Demo rides available in the San Antonio area.
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
              WhatsApp Ian
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
