import { useEffect, type ReactNode } from "react";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const RIDE_TIERS = [
  {
    title: "Gravel — The Levees",
    note: "Moots Routt 45",
    copy:
      "Barker Reservoir Dam Levee (13.3-mile loop, the 'Damn Dam Loop') and Addicks Reservoir Levee (11.5 miles from Clay Road to Greenhouse Road) form the longest uninterrupted gravel in Houston city limits. Exposed dam tops. Headwinds. Real riding.",
  },
  {
    title: "Road — The Bayou Network",
    note: "Moots Vamoots RCS",
    copy:
      "163 miles of bayou greenway trails connect the city largely car-free. Buffalo Bayou Trail (10 miles, downtown skyline), Brays Bayou Greenway (30+ miles, city's longest continuous trail), White Oak Bayou and MKT Trail (Heights connection). The Trans-Houston Mega-Loop connects West Houston levees to The Heights in one ~33-mile car-free ride.",
  },
  {
    title: "Singletrack — The Anthills",
    note: "Moots Routt YBB",
    copy:
      "Terry Hershey Park's Anthills singletrack runs parallel to the paved path with technical roots, bayou drop-ins, and ruts. Memorial Park adds 12.6 miles of dedicated mountain bike trails. Cypress Creek MTB (North Houston) offers community-maintained singletrack with jumps, drops, and flow tracks.",
  },
] as const;

const COFFEE_SPOTS: { name: string; address: string; note: string; href?: string }[] = [
  {
    name: "Coffee & Bikes HTX",
    address: "coffeeandbikeshtx.com",
    note: "Sunday morning social ride, 18 miles, 11 mph, 8am rollout. The community anchor.",
    href: "https://coffeeandbikeshtx.com",
  },
  {
    name: "CoffeeTrend",
    address: "4042 S Braeswood Blvd",
    note: "Literally on the Brays Bayou trail, open 7am–9pm every day.",
  },
  {
    name: "Tree House Craft Coffee",
    address: "14008 Memorial Dr",
    note: "At the edge of Terry Hershey Park.",
  },
  {
    name: "Slowpokes",
    address: "13210 Memorial Dr",
    note: "Adjacent to Terry Hershey path entry points.",
  },
  {
    name: "Verbena Coffee",
    address: "14029 Memorial Dr",
    note: "Just off Terry Hershey Park.",
  },
  {
    name: "Café Forth",
    address: "731 Yale St",
    note: "Directly on the Heights Trail.",
  },
  {
    name: "Wolfsmiths Coffee",
    address: "636 W 26th St",
    note: "Bike parking confirmed, Heights.",
  },
  {
    name: "Segundo Coffee Lab",
    address: "711 Milby St",
    note: "Buffalo Bayou East, confirmed bike rack.",
  },
  {
    name: "The Coffee House at West End",
    address: "802 Shepherd Dr",
    note: "One block from Buffalo Bayou Trail.",
  },
  {
    name: "Active Coffee Shop",
    address: "5416 E 4th St, Katy",
    note: "Bike shop next door.",
  },
  {
    name: "Red Light Coffee Roasters",
    address: "2728 Market St, Galveston",
    note: "Galveston's best, personal recommendation.",
  },
] as const;

const EVENTS = [
  {
    name: "Coffee & Bikes HTX",
    details: "Sunday morning, recurring. coffeeandbikeshtx.com",
  },
  {
    name: "NWCC Saturday Coffee Ride",
    details: "8:00 AM, relaxed, no-drop. nwcc.bike",
  },
  {
    name: "Bikes & Bats Along Buffalo Bayou",
    details: "July 18 and August 15, 2026. bikehouston.org/events/bike-bats-aug-2026",
  },
  {
    name: "Critical Mass Houston",
    details: "Last Friday of every month, Guadalupe Plaza Park.",
  },
  {
    name: "Soirée du Vélo 2026",
    details: "bikehouston.org/events/soiree-du-velo-2026",
  },
] as const;

const RESOURCES = [
  { label: "BikeHouston", href: "https://bikehouston.org" },
  { label: "Buffalo Bayou Partnership", href: "https://buffalobayou.org" },
  { label: "Houston Parks Board", href: "https://houstonparksboard.org" },
  { label: "Coffee & Bikes HTX", href: "https://coffeeandbikeshtx.com" },
  { label: "RideWithGPS Great Rides Houston", href: "https://ridewithgps.com/organizations/7684-great-rides-houston" },
  { label: "My Active Passion", href: "https://myactivepassion.com" },
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

export default function Houston() {
  useEffect(() => {
    const title = "Houston — MootsFrame";
    const description =
      "Houston location page for MootsFrame. Bayous. Levees. Titanium. Public routes, coffee, events, and service-area contact.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/locations/houston");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-5xl">
          <SectionLabel>Houston</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
            Houston: Where the Forever Frame Starts
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: READABLE_ACCENT }}>
            Bayous. Levees. Titanium.
          </p>
          <p className="font-mono-custom text-base md:text-lg leading-loose max-w-4xl" style={{ color: "oklch(0.78 0.03 70)" }}>
            Houston doesn't ease you in. The heat, the headwinds on the levee, the flat miles along the bayou — this city tests equipment from day one. That's exactly why Moots makes sense here. The same frame that earns its keep on the bayou is the same frame that rides the cobbles of Paris, climbs the Furka Pass, and finishes the year in Steamboat. It starts here.
          </p>
        </div>
      </article>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Ride Tiers</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Three ways Houston rides.
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
          <SectionLabel>Coffee</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Coffee — Where Rides Start and Stop
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
          {COFFEE_SPOTS.map((spot) => (
            <article key={spot.name} className="p-6 md:p-7 flex flex-col gap-4 min-h-[250px]" style={{ background: "oklch(0.24 0.01 60)" }}>
              <div>
                <h3 className="font-display text-2xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                  {spot.href ? (
                    <a href={spot.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4">
                      {spot.name}
                    </a>
                  ) : (
                    spot.name
                  )}
                </h3>
                <p className="font-label text-xs tracking-[0.22em] uppercase mt-3" style={{ color: READABLE_ACCENT }}>
                  {spot.address}
                </p>
              </div>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                {spot.note}
              </p>
            </article>
          ))}
        </div>
        <p className="font-mono-custom text-sm leading-loose mt-6" style={{ color: "oklch(0.78 0.03 70)" }}>
          No café on this list is a MootsFrame partner or sponsor. These are publicly operating businesses with documented cycling-community presence.
        </p>
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
          <SectionLabel>Dispatch</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Ian's Houston Dispatch
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian Zakrocki moves to Houston in August 2026. This section documents his rides — real routes, real Strava data, real photos — as he explores the bayou network, the levees, and the surrounding territory. Nothing published here until it's ridden.
          </p>
        </div>
        <div className="p-7 md:p-9" style={{ background: "oklch(0.24 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
          <a
            href="https://www.instagram.com/mootsframes/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-sm tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: READABLE_ACCENT }}
          >
            Follow @mootsframes on Instagram for live updates.
          </a>
        </div>
      </section>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Demo a Moots in Houston
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian Zakrocki represents Moots titanium bikes across Texas, Arkansas, and Oklahoma. Demo rides available in the Houston area starting August 2026.
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
