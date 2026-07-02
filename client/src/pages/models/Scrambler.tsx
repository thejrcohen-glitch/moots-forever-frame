import { useEffect } from "react";
import { Link } from "wouter";

const HERO_IMAGE = "https://moots.com/cdn/shop/files/SCRAM1.jpg?v=1762383709";
const PAGE_URL = "https://mootsframe.com/bikes/scrambler";
const TITLE = "Moots Scrambler — MootsFrame";
const DESCRIPTION =
  "Demo the Moots Scrambler titanium adventure bike in Texas, Arkansas, and Oklahoma. Available through MootsFrame.";
const ACCENT = "oklch(0.72 0.14 65)";
const WARM_TEXT = "oklch(0.78 0.03 70)";
const LIGHT_TEXT = "oklch(0.945 0.018 78)";
const MUTED_TEXT = "oklch(0.52 0.04 65)";
const DARK_BG = "oklch(0.24 0.01 60)";
const DARK_BORDER = "1px solid oklch(0.38 0.015 60 / 0.5)";

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Moots Scrambler",
  description:
    "The Moots Scrambler is a titanium adventure and bikepacking bike with full cargo mount capability. Hand-built in Steamboat Springs, Colorado. Available for demo in Texas, Arkansas, and Oklahoma through MootsFrame.",
  brand: {
    "@type": "Brand",
    name: "Moots",
    url: "https://moots.com",
  },
  image: HERO_IMAGE,
  url: PAGE_URL,
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

function useScramblerMetadata() {
  useEffect(() => {
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = TITLE;
    setMetaContent('meta[name="description"]', DESCRIPTION);
    setMetaContent('meta[property="og:title"]', TITLE);
    setMetaContent('meta[property="og:description"]', DESCRIPTION);
    setMetaContent('meta[property="og:url"]', PAGE_URL);
    setMetaContent('meta[name="twitter:title"]', TITLE);
    setMetaContent('meta[name="twitter:description"]', DESCRIPTION);

    const schemaId = "scrambler-product-json-ld";
    document.getElementById(schemaId)?.remove();

    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(PRODUCT_SCHEMA);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);
}

export default function Scrambler() {
  useScramblerMetadata();

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <section className="pt-24 pb-20">
        <div className="container max-w-6xl space-y-8">
          <div className="max-w-3xl">
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: ACCENT }}>
              Mountain
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-none" style={{ color: LIGHT_TEXT }}>
              Scrambler
            </h1>
            <p className="mt-4 font-mono-custom text-sm md:text-base leading-loose" style={{ color: WARM_TEXT }}>
              Built for exploration beyond the map.
            </p>
          </div>

          <img
            src={HERO_IMAGE}
            alt="Moots Scrambler titanium adventure mountain bike"
            loading="lazy"
            className="w-full object-cover max-h-[480px]"
          />
        </div>
      </section>

      <section className="pb-20">
        <div className="container max-w-6xl space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: LIGHT_TEXT }}>
            The Frame
          </h2>
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="p-6 md:p-8" style={{ background: DARK_BG, border: DARK_BORDER }}>
              <p className="font-mono-custom text-sm md:text-base leading-loose" style={{ color: WARM_TEXT }}>
                The Scrambler is Moots' progressive adventure platform. All-new adventure geometry with generous frame
                and fork mounts for bottles, racks, and cargo cages. Built for weekend overnights, multi-day routes,
                and the roads and trails that connect them.
              </p>
            </div>
            <div className="p-6 md:p-8" style={{ background: DARK_BG, border: DARK_BORDER }}>
              <dl className="grid gap-4">
                {[
                  ["Material", "Titanium 3Al/2.5V alloy"],
                  ["Category", "Adventure / Bikepacking"],
                  ["Mounts", "Full cargo and rack mounts"],
                  ["Handbuilt", "Steamboat Springs, CO"],
                  ["Warranty", "Lifetime (original owner)"],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[140px_1fr] gap-4">
                    <dt className="font-label text-xs tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
                      {label}
                    </dt>
                    <dd className="font-mono-custom text-sm leading-relaxed" style={{ color: WARM_TEXT }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container max-w-6xl">
          <div className="max-w-3xl space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: LIGHT_TEXT }}>
              In Territory
            </h2>
            <p className="font-mono-custom text-sm md:text-base leading-loose" style={{ color: WARM_TEXT }}>
              The Ouachita Trail. Texas Hill Country overnight loops. Sam Houston National Forest. The Scrambler is the
              frame for riding where the road ends.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container max-w-6xl">
          <div className="p-6 md:p-8" style={{ background: DARK_BG, border: DARK_BORDER }}>
            <div className="max-w-3xl space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: LIGHT_TEXT }}>
                Demo the Scrambler
              </h2>
              <p className="font-mono-custom text-sm md:text-base leading-loose" style={{ color: WARM_TEXT }}>
                Ian Zakrocki represents Moots titanium bikes across Texas, Arkansas, and Oklahoma. Demo rides available
                on request.
              </p>
              <a
                href="https://wa.me/19175787687"
                target="_blank"
                rel="noopener noreferrer"
                className="font-label text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4 inline-flex items-center"
                style={{ color: ACCENT }}
              >
                WhatsApp Ian →
              </a>
              <p className="font-mono-custom text-xs leading-relaxed" style={{ color: MUTED_TEXT }}>
                MootsFrame is a service-area dealership. No storefront address.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container max-w-6xl flex flex-col gap-4">
          <a
            href="https://moots.com/products/scrambler"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: ACCENT }}
          >
            View on Moots.com →
          </a>
          <Link
            href="/bikes"
            className="font-label text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4"
            style={{ color: ACCENT }}
          >
            ← All Bikes
          </Link>
        </div>
      </section>
    </main>
  );
}
