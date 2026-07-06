import { useEffect, type ReactNode } from "react";

const READABLE_ACCENT = "oklch(0.72 0.14 65)";

const RIDE_TIERS = [
  {
    title: "Gravel — Pinto Canyon Road",
    note: "Moots Routt 45 for the pavement. Moots Scrambler for the full descent.",
    copy:
      "Thirty-two miles of smooth asphalt heading west from Marfa into the Chinati Mountains. The pavement ends at the canyon rim — then the road drops through tequila gravel, ruts, and desert rock. Tubeless mandatory. Extra sealant mandatory. One of the most remarkable roads in Texas.",
  },
  {
    title: "Road — Texas Mountain Ride Loop",
    note: "Moots Vamoots RCS",
    copy:
      "Seventy-two miles of chip-seal connecting Marfa, Alpine, and Fort Davis on US-90, TX-118, and TX-17. More than 3,000 feet of elevation gain. The kind of road that tests your gearing and rewards your frame.",
  },
  {
    title: "Climbing — Fort Davis to McDonald Observatory",
    note: "Moots Vamoots CRD",
    copy:
      "Twenty-five miles north of Marfa. The final 1.5 miles to Mount Locke reach 6,791 feet — the highest paved road in Texas — on gradients pushing 18 to 20 percent. Pure tarmac. Pure suffering. Worth every foot.",
  },
  {
    title: "Epic — Big Bend Ranch IMBA Trail",
    note: "Moots Scrambler or MXC",
    copy:
      "The Fresno-Sauceda Loop is the only IMBA Epic trail in Texas. Fifty-seven miles of backcountry singletrack through rocky creek beds, abandoned mines, ranch ruins, and volcanic limestone. This is remote. Plan accordingly — water, tubeless, GPS, and a bike that can take it.",
  },
] as const;

const EVENTS = [
  {
    name: "The Marfa 100",
    details: "Annual gravel event. Pinto Canyon and Chihuahuan Desert. 62-mile course. marfa100.com",
  },
  {
    name: "Texas Mountain Ride",
    details: "Alpine, TX. Multi-day road event through the Davis Mountains. biketexas.org",
  },
] as const;

const RESOURCES = [
  { label: "The Marfa 100", href: "https://marfa100.com" },
  { label: "Big Bend Ranch State Park", href: "https://tpwd.texas.gov" },
  { label: "Visit Marfa", href: "https://visitmarfa.com" },
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

export default function Marfa() {
  useEffect(() => {
    const title = "Marfa — MootsFrame";
    const description =
      "Marfa and Far West Texas location page for MootsFrame. High desert roads, Pinto Canyon gravel, Texas Mountain Ride, McDonald Observatory, Big Bend Ranch, events, and service-area contact.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/locations/marfa");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-5xl">
          <SectionLabel>Marfa</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
            Marfa: The Roads That Don't Explain Themselves
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: READABLE_ACCENT }}>
            High desert. Empty roads. Titanium that earns it.
          </p>
          <p className="font-mono-custom text-base md:text-lg leading-loose max-w-4xl" style={{ color: "oklch(0.78 0.03 70)" }}>
            Marfa doesn't explain itself. The light is different. The roads are empty. Pinto Canyon runs 32 miles of smooth asphalt west of town before the pavement ends and the canyon drops into the desert. The Texas Mountain Ride loops 72 miles through Marfa, Alpine, and Fort Davis on chip-seal that rewards titanium and punishes everything else. The only IMBA Epic trail in Texas is 57 miles of backcountry inside Big Bend Ranch State Park. None of this is casual. All of it is worth it.
          </p>
        </div>
      </article>

      <section className="container py-16 border-t" style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}>
        <div className="max-w-4xl mb-9">
          <SectionLabel>Ride Tiers</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Four ways Far West Texas rides.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.5)" }}>
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
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
            Demo a Moots in Far West Texas
          </h2>
          <p className="font-mono-custom text-base md:text-lg leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ian Zakrocki represents Moots titanium bikes across Texas, Arkansas, and Oklahoma. Demo rides available across the territory — including the Far West Texas corridor.
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
