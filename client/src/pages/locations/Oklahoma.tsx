import { useEffect, type ReactNode } from "react";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const RIDE_TIERS = [
  {
    title: "Gravel — The Red Clay Roads",
    note: "Moots Routt 45 or Routt RSL",
    copy:
      "The roads outside Stillwater are the backbone of American gravel cycling. 100 miles, 6,000 feet of climbing, Cross Timbers eco-region, tribal lands, dense oak forests, and creek crossings. When conditions are dry, fast hard-packed dirt. When wet, legendary mud. The Routt 45 and Routt RSL were built for this.",
  },
  {
    title: "Road — Tulsa and Oklahoma City",
    note: "Moots Vamoots RCS",
    copy:
      "Tulsa Bicycle Club has anchored the Oklahoma road community since before most gravel races existed. Oklahoma City Bicycle Society has been promoting riding in central Oklahoma since 1974. Road cycling infrastructure across both cities for the Vamoots rider.",
  },
  {
    title: "Adventure — Ouachita Country",
    note: "Moots Scrambler",
    copy:
      "Southeast Oklahoma and the Ouachita Mountains give the Scrambler its natural environment. Bikepacking routes, remote fire roads, mixed surface. The Oklahoma-Arkansas border country where gravel becomes something else entirely.",
  },
] as const;

const EVENTS = [
  {
    name: "The Mid South",
    details:
      "Stillwater, Oklahoma. Life Time Grand Prix event. 100-mile and 50-mile options. Block 34, Husband Street finish. midsouthgravel.com",
  },
  {
    name: "Tulsa Bicycle Club events",
    details: "Year-round schedule across Oklahoma and the region. tulsabicycleclub.com",
  },
  {
    name: "Oklahoma Bicycle Society",
    details: "Central Oklahoma rides since 1974. okcbike.org",
  },
] as const;

const RESOURCES = [
  { label: "The Mid South", href: "https://midsouthgravel.com" },
  { label: "Tulsa Bicycle Club", href: "https://tulsabicycleclub.com" },
  { label: "Oklahoma Bicycle Society", href: "https://okcbike.org" },
  { label: "BikeOklahoma", href: "https://okbike.org" },
  { label: "District Bicycles Stillwater", href: "https://districtbicycles.com" },
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

export default function Oklahoma() {
  useEffect(() => {
    const title = "Oklahoma — MootsFrame";
    const description =
      "Oklahoma location page for MootsFrame. Red dirt, red clay, Stillwater gravel, Tulsa and OKC road riding, events, and service-area contact.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/locations/oklahoma");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-5xl">
          <SectionLabel>Oklahoma</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
            Oklahoma: Red Dirt. Red Clay. Real Gravel.
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: READABLE_ACCENT }}>
            Stillwater. Tulsa. OKC. The roads that built The Mid South.
          </p>
          <p className="font-mono-custom text-base md:text-lg leading-loose max-w-4xl" style={{ color: "oklch(0.78 0.03 70)" }}>
            Oklahoma doesn't need to prove anything. The red clay roads outside Stillwater are the reason The Mid South exists — one of the longest-running gravel races in America, built on terrain that punishes pretenders and rewards permanence. A titanium frame fits here the same way it fits everywhere in the territory. Because it was built to last.
          </p>
        </div>
      </article>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Ride Tiers</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Three ways Oklahoma rides.
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
          <SectionLabel>Stillwater</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            District Bicycles — Stillwater
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            District Bicycles at 712 South Main in Stillwater is the home base of The Mid South. Bobby Wintle built the race and the shop together. Worth a stop.
          </p>
        </div>
        <div className="p-7 md:p-9" style={{ background: "oklch(0.18 0.008 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            No affiliation with MootsFrame. Listed as a community reference.
          </p>
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Demo a Moots in Oklahoma
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian Zakrocki represents Moots titanium bikes across Texas, Arkansas, and Oklahoma. Demo rides available in Stillwater, Tulsa, Oklahoma City, and across the state.
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
