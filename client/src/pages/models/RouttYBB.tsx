import { useEffect } from "react";
import { Link } from "wouter";

const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0049/1612/files/YBB_UDH.jpg?v=1762966604";
const PAGE_URL = "https://mootsframe.com/bikes/routt-ybb";
const TITLE = "Moots Routt YBB — MootsFrame";
const DESCRIPTION =
  "Demo the Moots Routt YBB titanium gravel bike in Texas, Arkansas, and Oklahoma. Available through MootsFrame, the territory dealer.";
const ACCENT = "oklch(0.72 0.14 65)";
const WARM_TEXT = "oklch(0.78 0.03 70)";
const LIGHT_TEXT = "oklch(0.945 0.018 78)";
const MUTED_TEXT = "oklch(0.52 0.04 65)";
const DARK_BG = "oklch(0.24 0.01 60)";
const DARK_BORDER = "1px solid oklch(0.38 0.015 60 / 0.5)";

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Moots Routt YBB",
  description:
    "The Moots Routt YBB features titanium rear microsuspension for rough gravel and technical trail riding. Hand-built in Steamboat Springs, Colorado. Available for demo in Texas, Arkansas, and Oklahoma through MootsFrame.",
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

function useRouttYBBMetadata() {
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

    const schemaId = "routt-ybb-product-json-ld";
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

export default function RouttYBB() {
  useRouttYBBMetadata();

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <section className="pt-24 pb-20">
        <div className="container max-w-6xl space-y-8">
          <div className="max-w-3xl">
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: ACCENT }}>
              Gravel
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-none" style={{ color: LIGHT_TEXT }}>
              Routt YBB
            </h1>
            <p className="mt-4 font-mono-custom text-sm md:text-base leading-loose" style={{ color: WARM_TEXT }}>
              The rough stuff, handled.
            </p>
          </div>

          <img
            src={HERO_IMAGE}
            alt="Moots Routt YBB titanium gravel bike with rear microsuspension"
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
                The YBB carries Moots' rear microsuspension system — a titanium flex zone built into the seat stay that takes
                the edge off rough terrain without adding complexity. The result is a gravel bike that stays controlled on
                long, technical days without dulling the trail feedback that makes riding interesting.
              </p>
            </div>
            <div className="p-6 md:p-8" style={{ background: DARK_BG, border: DARK_BORDER }}>
              <dl className="grid gap-4">
                {[
                  ["Material", "Titanium 3Al/2.5V alloy"],
                  ["Category", "All-Road Gravel / Singletrack"],
                  ["Rear System", "YBB Microsuspension"],
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
              Terry Hershey Anthills. Lake Houston Wilderness. Cypress Creek singletrack. Memorial Park MTB trails. The YBB
              is the frame for Houston's technical trail network and every rough gravel day in the territory.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container max-w-6xl">
          <div className="p-6 md:p-8" style={{ background: DARK_BG, border: DARK_BORDER }}>
            <div className="max-w-3xl space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: LIGHT_TEXT }}>
                Demo the Routt YBB
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
            href="https://moots.com/products/routt-ybb"
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
