import { useEffect, type ReactNode } from "react";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const RIDE_TIERS = [
  {
    title: "Gravel — The Hill Country",
    note: "Moots Routt 45",
    copy:
      "The Pedernales River area and Rocky Creek Ranch offer the toughest gravel Austin produces. Walnut Creek Park gives you accessible urban gravel to start. The roads west toward Dripping Springs and Wimberley are the ones that matter.",
  },
  {
    title: "Road — Lady Bird Lake and the Hill Country",
    note: "Moots Vamoots RCS",
    copy:
      "Lady Bird Lake trail runs 10 miles, car-free, through the center of the city. The roads west toward Fredericksburg are among the best road cycling terrain in Texas — sustained climbs, open skies, minimal traffic.",
  },
  {
    title: "Trail — Walnut Creek and the Greenbelt",
    note: "Moots Routt YBB or Womble",
    copy:
      "The Southern Walnut Creek and Manor trails run 15 miles from East Austin to Manor with no shared roads. Barton Creek Greenbelt adds technical limestone singletrack through the center of the city.",
  },
] as const;

const COMMUNITY_LINKS = [{ label: "Breakfast Club ATX", href: "https://breakfastclubatx.com" }] as const;

const EVENTS = [
  {
    name: "Breakfast Club ATX",
    details: "Monthly Saturday morning, Central Machine Works. breakfastclubatx.com",
  },
  {
    name: "Holey Roller",
    details: "Lexington, TX. Annual gravel event, classic Central Texas gravel. Trek Austin.",
  },
  {
    name: "Come And Grind It",
    details: "Harwood, TX. 18, 34, 46, or 61 mile options. capitalcityracingtexas.com",
  },
  {
    name: "Cross of Ages",
    details: "Richard Moya Park, Austin. Weekend before Halloween. Cyclocross. capitalcityracingtexas.com",
  },
] as const;

const RESOURCES = [
  { label: "Breakfast Club ATX", href: "https://breakfastclubatx.com" },
  { label: "Austin Parks Foundation trails", href: "https://austinparks.org" },
  { label: "RideWithGPS Austin gravel", href: "https://ridewithgps.com/regions/north_america/us/1152-gravel-riding-around-austin-texas" },
  { label: "Capital City Racing Texas", href: "https://capitalcityracingtexas.com" },
  { label: "BikeTexas", href: "https://biketexas.org" },
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

export default function Austin() {
  useEffect(() => {
    const title = "Austin — MootsFrame";
    const description =
      "Austin location page for MootsFrame. Gravel west. Road loops. Hill Country routes, community, events, and service-area contact.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/locations/austin");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-5xl">
          <SectionLabel>Austin</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
            Austin: Hill Country Starts Here
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: READABLE_ACCENT }}>
            Gravel west. Road loops. 800 riders on a Saturday morning.
          </p>
          <p className="font-mono-custom text-base md:text-lg leading-loose max-w-4xl" style={{ color: "oklch(0.78 0.03 70)" }}>
            Austin doesn't ease you in either. The Hill Country begins at the edge of the city. Thirty minutes west and you're on the roads that built Texas cycling — rolling, open, low traffic, and exactly what a titanium frame was built for. The same bike that earns its keep on the Pedernales earns it in Steamboat, on the cobbles, and everywhere in between.
          </p>
        </div>
      </article>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Ride Tiers</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Three ways Austin rides.
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
            Breakfast Club ATX is the largest monthly group ride in Austin — 800+ riders, four pace groups, coffee before and breakfast after at Central Machine Works. Founded in 2020. This is where Austin cycling happens.
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
            Demo a Moots in Austin
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian Zakrocki represents Moots titanium bikes across Texas, Arkansas, and Oklahoma. Demo rides available in the Austin area.
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
