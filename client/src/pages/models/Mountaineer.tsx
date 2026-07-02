import { useEffect } from "react";
import { Link } from "wouter";

const ACCENT = "oklch(0.72 0.14 65)";
const PRODUCT_URL = "https://moots.com/products/mountaineer";
const DEMO_URL = "https://wa.me/19175787687";
const HERO_IMAGE = "https://moots.com/cdn/shop/files/Mountaineer1.jpg?v=1760713186";

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Moots Mountaineer",
  description:
    "The Moots Mountaineer is a titanium trail mountain bike with YBB rear microsuspension and 120mm fork travel. Hand-built in Steamboat Springs, Colorado. Available for demo in Texas, Arkansas, and Oklahoma through MootsFrame.",
  brand: { "@type": "Brand", name: "Moots", url: "https://moots.com" },
  image: HERO_IMAGE,
  url: "https://mootsframe.com/bikes/mountaineer",
  manufacturer: {
    "@type": "Organization",
    name: "Moots",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Steamboat Springs",
      addressRegion: "CO",
      addressCountry: "US",
    },
  },
  material: "Titanium 3Al/2.5V alloy",
  countryOfOrigin: "US",
};

const specs = [
  ["Material", "Titanium 3Al/2.5V alloy"],
  ["Category", "Trail Mountain"],
  ["Rear System", "YBB Microsuspension"],
  ["Fork Travel", "120mm"],
  ["Handbuilt", "Steamboat Springs, CO"],
  ["Warranty", "Lifetime (original owner)"],
];

function Seo() {
  useEffect(() => {
    document.title = "Moots Mountaineer \u2014 MootsFrame";

    const description =
      "Demo the Moots Mountaineer titanium trail mountain bike in Texas, Arkansas, and Oklahoma. Available through MootsFrame.";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    const scriptId = "mountaineer-product-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(productJsonLd);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, []);

  return null;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="font-label text-xs tracking-[0.35em] uppercase mb-3"
      style={{ color: ACCENT }}
    >
      {children}
    </p>
  );
}

function CTAButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: string;
  variant?: "solid" | "outline";
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="inline-block font-label text-xs tracking-[0.2em] uppercase px-6 py-3 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4"
      style={{
        background: variant === "solid" ? ACCENT : "transparent",
        color: variant === "solid" ? "oklch(0.22 0.01 60)" : "oklch(0.88 0.025 75)",
        border: variant === "solid" ? "1px solid transparent" : `1px solid ${ACCENT}`,
      }}
    >
      {children}
    </a>
  );
}

export default function Mountaineer() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <Seo />

      <main>
        <section className="pt-28 pb-14">
          <div className="container">
            <SectionLabel>Mountain</SectionLabel>
            <h1
              className="font-display text-5xl md:text-7xl font-bold mb-4"
              style={{ color: "oklch(0.945 0.018 78)" }}
            >
              Mountaineer
            </h1>
            <p
              className="font-mono-custom text-base md:text-lg mb-8"
              style={{ color: "oklch(0.72 0.04 65)" }}
            >
              Smooth control on rough terrain.
            </p>
          </div>
          <img
            src={HERO_IMAGE}
            alt="Moots Mountaineer titanium mountain bike with YBB rear suspension"
            className="w-full object-cover max-h-[480px]"
            loading="lazy"
          />
        </section>

        <section
          className="py-16 border-t"
          style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
          aria-labelledby="frame-heading"
        >
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionLabel>The Frame</SectionLabel>
              <h2
                id="frame-heading"
                className="font-display text-3xl md:text-4xl font-bold mb-5"
                style={{ color: "oklch(0.945 0.018 78)" }}
              >
                YBB feel. Mountain control.
              </h2>
              <p
                className="font-mono-custom text-sm leading-loose max-w-2xl"
                style={{ color: "oklch(0.72 0.04 65)" }}
              >
                The Mountaineer carries Moots&apos; YBB rear microsuspension on a
                mountain platform. 120mm fork up front, YBB flex zone at the
                rear — the edge comes off rough trails without dulling the feel.
                Built for long, demanding rides where comfort and control matter
                equally.
              </p>
            </div>
            <dl
              className="divide-y"
              style={{ borderTop: `1px solid ${ACCENT}`, borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
            >
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-4">
                  <dt
                    className="font-label text-xs tracking-[0.25em] uppercase"
                    style={{ color: ACCENT }}
                  >
                    {label}
                  </dt>
                  <dd
                    className="font-mono-custom text-sm"
                    style={{ color: "oklch(0.88 0.025 75)" }}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          className="py-16 border-t"
          style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
          aria-labelledby="territory-heading"
        >
          <div className="container max-w-3xl">
            <SectionLabel>In Territory</SectionLabel>
            <h2
              id="territory-heading"
              className="font-display text-3xl md:text-4xl font-bold mb-5"
              style={{ color: "oklch(0.945 0.018 78)" }}
            >
              In Territory
            </h2>
            <p
              className="font-mono-custom text-sm leading-loose"
              style={{ color: "oklch(0.72 0.04 65)" }}
            >
              Jack Brooks Park. Lake Houston Wilderness. The rough Houston trail
              network on long days. The Mountaineer stays smooth where hardtails
              get harsh.
            </p>
          </div>
        </section>

        <section
          className="py-16 border-t"
          style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
          aria-labelledby="demo-heading"
        >
          <div className="container max-w-3xl">
            <SectionLabel>Demo</SectionLabel>
            <h2
              id="demo-heading"
              className="font-display text-3xl md:text-4xl font-bold mb-5"
              style={{ color: "oklch(0.945 0.018 78)" }}
            >
              Demo the Mountaineer
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTAButton href={DEMO_URL}>Book a Demo →</CTAButton>
              <CTAButton href={PRODUCT_URL} variant="outline">
                View on Moots.com →
              </CTAButton>
            </div>
          </div>
        </section>

        <section
          className="py-12 border-t"
          style={{ borderColor: "oklch(0.38 0.015 60 / 0.5)" }}
        >
          <div className="container">
            <Link
              href="/bikes"
              className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity focus:outline focus:outline-2 focus:outline-offset-4"
              style={{ color: ACCENT }}
            >
              ← All Bikes
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
