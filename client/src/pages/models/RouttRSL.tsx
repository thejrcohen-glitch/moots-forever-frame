import { useEffect } from "react";
import { Link } from "wouter";

const HERO_IMAGE = "https://moots.com/cdn/shop/files/RouttRSLStanley01.jpg";
const PAGE_URL = "https://mootsframe.com/bikes/routt-rsl";
const TITLE = "Moots Routt RSL — MootsFrame";
const DESCRIPTION =
  "Demo the Moots Routt RSL titanium gravel bike in Texas, Arkansas, and Oklahoma. Available through MootsFrame, the territory dealer.";
const ACCENT = "oklch(0.72 0.14 65)";
const WARM_TEXT = "oklch(0.78 0.03 70)";
const LIGHT_TEXT = "oklch(0.945 0.018 78)";
const MUTED_TEXT = "oklch(0.52 0.04 65)";
const DARK_BG = "oklch(0.24 0.01 60)";
const DARK_BORDER = "1px solid oklch(0.38 0.015 60 / 0.5)";

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Moots Routt RSL",
  description:
    "The Moots Routt RSL is a performance titanium gravel bike built on the RSL tube set, hand-built in Steamboat Springs, Colorado. Available for demo in Texas, Arkansas, and Oklahoma through MootsFrame.",
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

function useRouttRSLMetadata() {
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

    const schemaId = "routt-rsl-product-json-ld";
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

export default function RouttRSL() {
  useRouttRSLMetadata();

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <section className="pt-24 pb-20">
        <div className="container max-w-6xl space-y-8">
          <div className="max-w-3xl">
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: ACCENT }}>
              Gravel
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-none" style={{ color: LIGHT_TEXT }}>
              Routt RSL
            </h1>
            <p className="mt-4 font-mono-custom text-sm md:text-base leading-loose" style={{ color: WARM_TEXT }}>
              When the day turns competitive.
            </p>
          </div>

          <img
            src={HERO_IMAGE}
            alt="Moots Routt RSL titanium gravel bike"
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
                Named for the rugged roads of Routt County. The Routt RSL is built for riders who seek distance, challenge,
                and discovery. Large-diameter, double-butted RSL titanium tube set — engineered to balance stiffness and
                comfort across long miles of mixed terrain. This is the serious gravel bike.
              </p>
            </div>
            <div className="p-6 md:p-8" style={{ background: DARK_BG, border: DARK_BORDER }}>
              <dl className="grid gap-4">
                {[
                  ["Material", "Titanium 3Al/2.5V alloy (RSL tube set)"],
                  ["Category", "Performance Gravel"],
                  ["Tire Clearance", "Up to 700x45mm or 650b"],
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
              Chappell Hill Gravel Grinder at race pace. The Mid South competitive field in Stillwater. Bentonville's
              fastest gravel loops. When the territory demands more, the RSL answers.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container max-w-6xl">
          <div className="p-6 md:p-8" style={{ background: DARK_BG, border: DARK_BORDER }}>
            <div className="max-w-3xl space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: LIGHT_TEXT }}>
                Demo the Routt RSL
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
            href="https://moots.com/products/routt-rsl"
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
