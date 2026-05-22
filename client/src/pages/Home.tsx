/*
 * DESIGN: Analog Film / Western Americana
 * Palette: bone, sienna, amber, flint, charcoal
 * Fonts: Playfair Display (headings), IBM Plex Mono (body/data), Barlow Condensed (labels)
 * Aesthetic: Grain over gloss. Lo-fi. Cinematic scroll.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { IS_STATIC_SITE } from "@/const";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Set page title for SEO
if (typeof window !== "undefined") {
  document.title = "Moots Titanium Bikes — The Forever Frame Campaign";
}

// ─── SEO & Page Setup ──────────────────────────────────────────────────────────────

// ─── Asset URLs ────────────────────────────────────────────────────────────────
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/hero-main-4D9bn8NjtqknDj4u5Mioxh.webp";
const BADGE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/moots-badge-SsSjrtob5NzC4d8pf8FWPY.webp";

const TERRITORIES = [
  {
    id: "bentonville",
    name: "Bentonville, AR",
    tagline: "The Ozarks Vibe",
    caption: "No carbon expiration dates. Just the sound of tires on flint and the promise of a cold one at the finish. Built in Colorado, proven in the Ozarks.",
    hashtags: "#Moots #Titanium #Gravel",
    coords: "36.3729° N, 94.2088° W",
    lat: 36.3729,
    lon: -94.2088,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/territory-bentonville-iRc4P2FMuTMdoGFoZkMzdq.webp",
    coffee: { name: "Airship Coffee at Coler", address: "1300 Applegate Trail, Bentonville, AR", url: "https://airshipcoffee.com", vibe: "Open-air concrete café inside the Coler Mountain Bike Preserve. No front door, no Wi-Fi, just swings, espresso, and trail access." },
    brewery: { name: "Bike Rack Brewing Co.", address: "801 SE 8th St, Bentonville, AR", url: "https://bikerackbrewing.com", vibe: "Bentonville's go-to taproom for trail-ready craft beer, deeply embedded in the local cycling community." },
    model: "Routt 45",
    color: "oklch(0.35 0.06 145)",
  },
  {
    id: "austin",
    name: "Austin, TX",
    tagline: "The East Side Vibe",
    caption: "Some things are built to last. Your frame should be one of them. Hand-welded in Steamboat, right at home in ATX.",
    hashtags: "#Moots #ForeverBike #AustinCycling",
    coords: "30.2672° N, 97.7431° W",
    lat: 30.2672,
    lon: -97.7431,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/territory-austin-XyH5opWd6pBGv7sRuNWxEr.webp",
    coffee: { name: "Flat Track Coffee", address: "1619 E Cesar Chavez St, Austin, TX", url: "https://flattrackcoffee.com", vibe: "Shares space with Cycleast bike shop. The absolute core of Austin's coffee meets chain grease culture." },
    brewery: { name: "Cosmic Coffee + Beer Garden", address: "121 Pickle Rd, Austin, TX", url: "https://cosmichospitalitygroup.com/south-austin/", vibe: "Massive outdoor garden with food trucks, waterfalls, and a mix of coffee and craft beer. Perfect for a post-ride gathering." },
    model: "Vamoots RSL",
    color: "oklch(0.52 0.12 45)",
  },
  {
    id: "okc",
    name: "Oklahoma City, OK",
    tagline: "The Urban Grit Vibe",
    caption: "Miles fade. Titanium doesn't. Outlasting the light in OKC.",
    hashtags: "#Moots #GravelGrinder #Titanium",
    coords: "35.4676° N, 97.5164° W",
    lat: 35.4676,
    lon: -97.5164,
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/territory-okc-UNC9ch2ArK2NfhctY2yUxW.webp",
    coffee: { name: "Elemental Coffee Roasters", address: "815 N Hudson Ave, Oklahoma City, OK", url: "https://elementalcoffee.com", vibe: "A staple of Midtown OKC, known for excellent roasts and a strong connection to the local cycling community." },
    brewery: { name: "Stonecloud Brewing Company", address: "1012 NW 1st St, Oklahoma City, OK", url: "https://stonecloudbrewing.com", vibe: "Housed in a historic renovated laundry building, a short ride from downtown trails." },
    model: "Routt RSL",
    color: "oklch(0.38 0.015 60)",
  },
];

// ─── Weather helpers ───────────────────────────────────────────────────────────
interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitation: number;
}

function weatherCodeToLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function weatherCodeToIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

function tempScore(maxF: number): { label: string; color: string; score: number } {
  const diff = Math.abs(maxF - 72);
  if (diff <= 5) return { label: "Perfect ride day", color: "oklch(0.45 0.15 145)", score: 100 };
  if (diff <= 12) return { label: "Great conditions", color: "oklch(0.55 0.13 145)", score: 80 };
  if (diff <= 20) return { label: "Rideable", color: "oklch(0.72 0.14 65)", score: 55 };
  return { label: "Not ideal", color: "oklch(0.52 0.12 45)", score: 25 };
}

// ─── Weather Widget ────────────────────────────────────────────────────────────
function WeatherWidget({ territoryId, selectedDate }: { territoryId: string; selectedDate: string }) {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const territory = TERRITORIES.find((t) => t.id === territoryId);

  useEffect(() => {
    if (!territory) return;
    setLoading(true);
    setError(false);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${territory.lat}&longitude=${territory.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&temperature_unit=fahrenheit&precipitation_unit=inch&forecast_days=14&timezone=America%2FChicago`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
          date,
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          weatherCode: data.daily.weathercode[i],
          precipitation: data.daily.precipitation_sum[i],
        }));
        setForecast(days);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [territory?.id]);

  if (!territory) return null;

  // Find selected date in forecast
  const selectedDay = selectedDate ? forecast.find((d) => d.date === selectedDate) : null;
  const nearDays = selectedDate
    ? forecast.filter((d) => {
        const diff = Math.abs(new Date(d.date).getTime() - new Date(selectedDate).getTime());
        return diff <= 3 * 86400000 && diff > 0;
      })
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-5 relative overflow-hidden"
      style={{ background: "oklch(0.22 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-label text-xs tracking-[0.25em] uppercase" style={{ color: "oklch(0.72 0.14 65)" }}>
            Live Forecast · {territory.name}
          </p>
          <p className="font-mono-custom text-xs mt-0.5" style={{ color: "oklch(0.52 0.04 65)" }}>
            Ideal ride temp: 72°F
          </p>
        </div>
        {loading && (
          <div className="w-4 h-4 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "oklch(0.72 0.14 65)", borderTopColor: "transparent" }} />
        )}
      </div>

      {error && (
        <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>
          Forecast unavailable. Check back later.
        </p>
      )}

      {/* Selected date highlight */}
      {selectedDay && (
        <div className="mb-4 p-4" style={{ background: "oklch(0.28 0.01 60)", border: `1px solid ${tempScore(selectedDay.tempMax).color}` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label text-xs tracking-widest uppercase mb-1" style={{ color: tempScore(selectedDay.tempMax).color }}>
                {tempScore(selectedDay.tempMax).label}
              </p>
              <p className="font-display text-3xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                {selectedDay.tempMax}°F
              </p>
              <p className="font-mono-custom text-xs mt-1" style={{ color: "oklch(0.52 0.04 65)" }}>
                Low {selectedDay.tempMin}°F · {weatherCodeToLabel(selectedDay.weatherCode)} · {selectedDay.precipitation}" precip
              </p>
            </div>
            <div className="text-4xl">{weatherCodeToIcon(selectedDay.weatherCode)}</div>
          </div>
          {/* Score bar */}
          <div className="mt-3 h-1 w-full rounded-full" style={{ background: "oklch(0.38 0.015 60)" }}>
            <div
              className="h-1 rounded-full transition-all duration-700"
              style={{ width: `${tempScore(selectedDay.tempMax).score}%`, background: tempScore(selectedDay.tempMax).color }}
            />
          </div>
        </div>
      )}

      {/* 14-day strip */}
      {forecast.length > 0 && !loading && (
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-1" style={{ minWidth: "max-content" }}>
            {forecast.map((day) => {
              const score = tempScore(day.tempMax);
              const isSelected = day.date === selectedDate;
              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1 px-2 py-2 transition-all duration-200"
                  style={{
                    background: isSelected ? "oklch(0.32 0.01 60)" : "transparent",
                    border: isSelected ? `1px solid ${score.color}` : "1px solid transparent",
                    minWidth: "44px",
                  }}
                >
                  <span className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>
                    {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-sm">{weatherCodeToIcon(day.weatherCode)}</span>
                  <span className="font-mono-custom text-xs font-medium" style={{ color: score.color }}>
                    {day.tempMax}°
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedDate && !loading && (
        <p className="font-mono-custom text-xs mt-2" style={{ color: "oklch(0.52 0.04 65)" }}>
          ← Select a preferred date above to see ride conditions
        </p>
      )}
    </motion.div>
  );
}

// ─── Grain overlay component ───────────────────────────────────────────────────
function GrainOverlay({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: "multiply",
      }}
    />
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = "Moots Titanium Bikes — The Forever Frame Campaign";
  }, []);

  // Close menu on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setMenuOpen(false);

  const navLinks = [
    { label: "Territories", href: "#territories" },
    { label: "The Vibe", href: "#the-vibe" },
    { label: "Order", href: "#order" },
    { label: "Calendar", href: "#ride-calendar" },
    { label: "Book a Pop-Up", href: "#book-a-pop-up" },
    { label: "Engineering", href: "/engineering" },
    { label: "Community", href: "/community" },
    { label: "Dealers", href: "/dealers" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled || menuOpen ? "oklch(0.945 0.018 78 / 0.97)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(8px)" : "none",
          borderBottom: scrolled || menuOpen ? "1px solid oklch(0.78 0.03 70)" : "none",
        }}
      >
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <a href="/" className="flex flex-col" onClick={close}>
            <span className="font-display text-xl font-bold tracking-tight" style={{ color: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)" }}>
              Moots
            </span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: scrolled || menuOpen ? "oklch(0.52 0.12 45)" : "oklch(0.88 0.025 75 / 0.8)" }}>
              The Forever Frame
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
                style={{ color: scrolled ? "oklch(0.38 0.015 60)" : "oklch(0.945 0.018 78)" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/build"
              className="font-label text-xs tracking-widest uppercase px-4 py-1.5 transition-all hover:opacity-80"
              style={{ background: scrolled ? "oklch(0.52 0.12 45)" : "oklch(0.72 0.14 65)", color: scrolled ? "oklch(0.945 0.018 78)" : "oklch(0.22 0.01 60)" }}
            >
              Build a Moots
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
                transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
                transform: menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div
            className="lg:hidden border-t"
            style={{ background: "oklch(0.945 0.018 78)", borderColor: "oklch(0.78 0.03 70)" }}
          >
            <div className="container py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  className="font-label text-sm tracking-widest uppercase transition-opacity hover:opacity-60"
                  style={{ color: "oklch(0.22 0.01 60)" }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/build"
                onClick={close}
                className="font-label text-sm tracking-widest uppercase px-5 py-3 text-center transition-all hover:opacity-80"
                style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}
              >
                Build a Moots
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <img src={HERO_IMG} alt="Moots titanium gravel bike at a trailhead" className="w-full h-full object-cover" style={{ filter: "saturate(0.85) contrast(1.05)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, oklch(0.22 0.01 60 / 0.2) 0%, oklch(0.22 0.01 60 / 0.5) 60%, oklch(0.22 0.01 60 / 0.85) 100%)" }} />
        <GrainOverlay opacity={0.25} />
      </motion.div>
      <motion.div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-24" style={{ opacity }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>
            Handbuilt in Steamboat Springs, Colorado · Est. 1981
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6" style={{ color: "oklch(0.945 0.018 78)" }}>
            The Forever<br />
            <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Frame.</em>
          </h1>
          <p className="font-mono-custom text-sm md:text-base max-w-xl leading-relaxed mb-8" style={{ color: "oklch(0.88 0.025 75 / 0.8)" }}>
            No carbon expiration dates. Just the sound of tires on flint and the promise of a cold one at the finish.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#territories" className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3 transition-all duration-300 hover:opacity-80" style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}>
              Explore Territories
            </a>
            <a href="#order" className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3 border transition-all duration-300 hover:opacity-80" style={{ borderColor: "oklch(0.945 0.018 78 / 0.4)", color: "oklch(0.945 0.018 78)" }}>
              Order a Moots
            </a>
            <a href="#book-a-pop-up" className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3 transition-all duration-300 hover:opacity-80" style={{ borderColor: "oklch(0.945 0.018 78 / 0.2)", color: "oklch(0.88 0.025 75 / 0.7)", border: "1px solid oklch(0.945 0.018 78 / 0.2)" }}>
              Book a Pop-Up
            </a>
          </div>
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-8 right-8 flex flex-col items-center gap-2" style={{ opacity }} animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
        <span className="font-mono-custom text-xs tracking-widest" style={{ color: "oklch(0.88 0.025 75 / 0.5)" }}>scroll</span>
        <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, oklch(0.88 0.025 75 / 0.5), transparent)" }} />
      </motion.div>
    </section>
  );
}

// ─── Manifesto ─────────────────────────────────────────────────────────────────
function Manifesto() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <GrainOverlay opacity={0.12} />
      <div className="container relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-8" style={{ color: "oklch(0.72 0.14 65)" }}>The Campaign</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold italic leading-tight mb-8" style={{ color: "oklch(0.945 0.018 78)" }}>
            "Arkansas Dust &<br />Post-Ride Lonestar"
          </h2>
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "oklch(0.52 0.12 45)" }} />
          <p className="font-mono-custom text-sm md:text-base leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Three territories. Three vibes. One frame that outlasts all of them. We're not selling specs. We're selling the feeling of a sunrise gravel ride in the Ozarks, the grit of East Austin asphalt, and the endless Oklahoma horizon. If you know, you know.
          </p>
        </div>
        <div className="mt-20 flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-auto">
          <div className="relative w-48 h-48 flex-shrink-0">
            <img src={BADGE_IMG} alt="Moots titanium badge detail" className="w-full h-full object-cover" style={{ filter: "saturate(0.9)" }} />
            <GrainOverlay opacity={0.2} />
          </div>
          <div>
            <p className="font-label text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>The Metal</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>Titanium doesn't expire.</h3>
            <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
              Every Moots frame is hand-welded in Steamboat Springs, Colorado. Not assembled. Not outsourced. Welded by hand, one at a time, by people who ride the same trails you do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Territory Card ────────────────────────────────────────────────────────────
function TerritoryCard({ territory, index }: { territory: typeof TERRITORIES[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-0 overflow-hidden`}
      style={{ border: "1px solid oklch(0.78 0.03 70 / 0.3)" }}
    >
      <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden">
        <motion.img src={territory.img} alt={territory.name} className="w-full h-full object-cover" style={{ filter: "saturate(0.8) contrast(1.05)" }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.6, ease: "easeOut" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.22 0.01 60 / 0.3) 0%, transparent 60%)" }} />
        <GrainOverlay opacity={0.2} />
        <div className="absolute bottom-4 left-4 font-mono-custom text-xs px-3 py-1" style={{ background: "oklch(0.22 0.01 60 / 0.75)", color: "oklch(0.72 0.14 65)", backdropFilter: "blur(4px)" }}>
          {territory.coords}
        </div>
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between" style={{ background: "oklch(0.945 0.018 78)" }}>
        <div>
          <p className="font-label text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>{territory.tagline}</p>
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: "oklch(0.22 0.01 60)" }}>{territory.name}</h3>
          <p className="font-label text-xs tracking-widest uppercase mb-6" style={{ color: "oklch(0.72 0.14 65)" }}>Featured Model: {territory.model}</p>
          <blockquote className="font-display text-lg italic leading-relaxed mb-4 pl-4" style={{ borderLeft: "2px solid oklch(0.52 0.12 45)", color: "oklch(0.38 0.015 60)" }}>
            "{territory.caption}"
          </blockquote>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.72 0.14 65)" }}>{territory.hashtags}</p>
        </div>
        <div className="mt-8 space-y-4">
          <div className="h-px" style={{ background: "oklch(0.78 0.03 70)" }} />
          <p className="font-label text-xs tracking-[0.25em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Pop-Up Partners</p>
          {[{ icon: "☕", label: "Coffee", partner: territory.coffee }, { icon: "🍺", label: "Brewery", partner: territory.brewery }].map(({ icon, label, partner }) => (
            <div key={label}>
              <div className="flex items-start gap-3">
                <span className="text-sm mt-0.5">{icon}</span>
                <div>
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className="font-label text-sm font-semibold tracking-wide hover:underline" style={{ color: "oklch(0.38 0.015 60)" }}>{partner.name}</a>
                  <p className="font-mono-custom text-xs mt-0.5" style={{ color: "oklch(0.52 0.04 65)" }}>{partner.address}</p>
                  <p className="font-mono-custom text-xs mt-1 leading-relaxed" style={{ color: "oklch(0.52 0.04 65)" }}>{partner.vibe}</p>
                </div>
              </div>
            </div>
          ))}
          <a href="#book-a-pop-up" className="inline-block mt-4 font-label text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all duration-300 hover:opacity-80" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.945 0.018 78)" }}>
            Book This Territory →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Territories Section ───────────────────────────────────────────────────────
function Territories() {
  return (
    <section id="territories" className="py-20" style={{ background: "oklch(0.88 0.025 75)" }}>
      <div className="container mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>The Territory Map</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.22 0.01 60)" }}>
              Three Territories.<br /><em className="italic">One Vibe.</em>
            </h2>
          </div>
          <p className="font-mono-custom text-xs max-w-xs leading-relaxed" style={{ color: "oklch(0.52 0.04 65)" }}>
            Each territory has its own character, its own coffee, its own post-ride reward. All of them deserve a titanium frame.
          </p>
        </div>
      </div>
      <div className="space-y-0">
        {TERRITORIES.map((t, i) => <TerritoryCard key={t.id} territory={t} index={i} />)}
      </div>
    </section>
  );
}

// ─── The Vibe / Share the Vibe ─────────────────────────────────────────────────
function TheVibe() {
  const [shareTerritory, setShareTerritory] = useState<typeof TERRITORIES[0] | null>(null);
  const [shareCaption, setShareCaption] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  const captions = [
    { post: "01", location: "Coler Preserve, Bentonville AR", text: "No carbon expiration dates. Just the sound of tires on flint and the promise of a cold one at the finish. Built in Colorado, proven in the Ozarks.", tags: "#Moots #Titanium #Gravel", territory: TERRITORIES[0] },
    { post: "02", location: "Flat Track Coffee, Austin TX", text: "Some things are built to last. Your frame should be one of them. Hand-welded in Steamboat, right at home in ATX.", tags: "#Moots #ForeverBike #AustinCycling", territory: TERRITORIES[1] },
    { post: "03", location: "Lake Hefner, Oklahoma City OK", text: "Miles fade. Titanium doesn't. Outlasting the light in OKC.", tags: "#Moots #GravelGrinder #Titanium", territory: TERRITORIES[2] },
    { post: "04", location: "Post-ride, any trailhead", text: "Earned the dust. Earned the pour. The ride doesn't end at the trailhead.", tags: "#Moots #PostRide #CraftBeer", territory: TERRITORIES[0] },
  ];

  const generateCard = useCallback(async (captionIndex: number) => {
    const c = captions[captionIndex];
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGenerating(true);

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Load territory image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = c.territory.img;
    await new Promise((res) => { img.onload = res; img.onerror = res; });

    // Draw background image
    ctx.drawImage(img, 0, 0, W, H);

    // Dark overlay
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(28,22,16,0.3)");
    grad.addColorStop(0.4, "rgba(28,22,16,0.55)");
    grad.addColorStop(1, "rgba(28,22,16,0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Grain noise overlay
    const imageData = ctx.getImageData(0, 0, W, H);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 40;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    // Amber accent line top
    ctx.fillStyle = "rgba(184, 115, 51, 0.8)";
    ctx.fillRect(80, 120, 60, 3);

    // Post number
    ctx.font = "300 80px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(184,115,51,0.35)";
    ctx.fillText(c.post, 80, 230);

    // Location label
    ctx.font = "400 28px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(210,185,155,0.7)";
    ctx.fillText(c.location.toUpperCase(), 80, 290);

    // Main quote — word wrap
    ctx.font = "italic 700 68px Georgia, serif";
    ctx.fillStyle = "#F2EDE4";
    const words = `"${c.text}"`.split(" ");
    let line = "";
    let y = H - 520;
    const maxW = W - 160;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), 80, y);
        line = word + " ";
        y += 80;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), 80, y);

    // Divider
    ctx.fillStyle = "rgba(184,115,51,0.5)";
    ctx.fillRect(80, y + 30, 120, 2);

    // Tags
    ctx.font = "400 32px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(184,115,51,0.85)";
    ctx.fillText(c.tags, 80, y + 80);

    // Moots wordmark bottom right
    ctx.font = "bold 36px Georgia, serif";
    ctx.fillStyle = "rgba(242,237,228,0.5)";
    ctx.textAlign = "right";
    ctx.fillText("Moots · The Forever Frame", W - 80, H - 80);
    ctx.textAlign = "left";

    setGenerating(false);
  }, []);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `moots-forever-frame-${captions[shareCaption].post}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Caption card downloaded — ready for Instagram Stories.");
  };

  return (
    <section id="the-vibe" className="py-24 relative overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <GrainOverlay opacity={0.1} />
      <div className="container relative z-20">
        <div className="mb-16 text-center">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>Campaign Captions</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>The Vibe.</h2>
          <p className="font-mono-custom text-sm mt-4" style={{ color: "oklch(0.78 0.03 70)" }}>Ready-to-post. Lo-fi aesthetic. No studio lighting required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "oklch(0.38 0.015 60 / 0.3)" }}>
          {captions.map((c, i) => (
            <motion.div
              key={c.post}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 md:p-10 relative group"
              style={{ background: "oklch(0.22 0.01 60)" }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-mono-custom text-5xl font-light leading-none" style={{ color: "oklch(0.38 0.015 60)" }}>{c.post}</span>
                <span className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>{c.location}</span>
              </div>
              <blockquote className="font-display text-xl md:text-2xl italic leading-snug mb-6" style={{ color: "oklch(0.945 0.018 78)" }}>
                "{c.text}"
              </blockquote>
              <p className="font-mono-custom text-xs mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>{c.tags}</p>
              {/* Share button */}
              <button
                onClick={async () => {
                  setShareCaption(i);
                  await generateCard(i);
                }}
                className="font-label text-xs tracking-[0.2em] uppercase px-5 py-2 transition-all duration-300 hover:opacity-80"
                style={{ background: "oklch(0.38 0.015 60)", color: "oklch(0.88 0.025 75)", border: "1px solid oklch(0.52 0.04 65 / 0.4)" }}
              >
                Generate Story Card →
              </button>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: "oklch(0.72 0.14 65)" }} />
            </motion.div>
          ))}
        </div>

        {/* Share the Vibe Preview */}
        <AnimatePresence>
          {canvasRef.current && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 flex flex-col md:flex-row items-start gap-8"
            >
              <div className="flex-shrink-0">
                <p className="font-label text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
                  Share the Vibe · Instagram Story Preview
                </p>
                <canvas
                  ref={canvasRef}
                  className="w-48 h-auto border"
                  style={{ borderColor: "oklch(0.38 0.015 60)", display: "block" }}
                />
              </div>
              <div className="flex flex-col justify-end gap-4 pt-8">
                <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                  Your lo-fi story card is ready. 1080×1920px, grain overlay applied, Moots wordmark embedded. Drop it straight into Instagram Stories.
                </p>
                <button
                  onClick={downloadCard}
                  disabled={generating}
                  className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3 transition-all duration-300 hover:opacity-80 disabled:opacity-40"
                  style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
                >
                  {generating ? "Generating..." : "Download Story Card"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden canvas always in DOM */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}

// ─── Model Comparison Data ────────────────────────────────────────────────────
const MODELS = [
  {
    name: "Routt 45",
    subtitle: "The All-Day Gravel Bike",
    useCase: "Mixed-surface adventure riding. Flint hills, forest roads, loaded bikepacking. The workhorse.",
    geometry: "Relaxed endurance geometry. Longer wheelbase, more trail. Stable at speed on loose terrain.",
    clearance: "Up to 45mm tire",
    priceTier: "$$$",
    priceNote: "Entry to the titanium life",
    bestFor: ["Gravel racing", "Bikepacking", "Mixed-surface endurance", "First titanium build"],
    territory: "Bentonville, AR",
    highlight: false,
  },
  {
    name: "Routt RSL",
    subtitle: "The Race-Ready Gravel Machine",
    useCase: "Fast gravel. Events like Unbound, Gravel Worlds, or any day you want to go hard on dirt.",
    geometry: "Aggressive race geometry. Snappier handling, stiffer feel, more responsive under power.",
    clearance: "Up to 45mm tire",
    priceTier: "$$$$",
    priceNote: "The flagship gravel frame",
    bestFor: ["Gravel racing", "Fast group rides", "Competitive events", "Riders upgrading from carbon"],
    territory: "Oklahoma City, OK",
    highlight: true,
  },
  {
    name: "Vamoots RSL",
    subtitle: "The Road Purist's Frame",
    useCase: "Pure road riding. Century rides, fast group training, or the smoothest pavement you can find in ATX.",
    geometry: "Classic road race geometry. Responsive, efficient, built for tarmac.",
    clearance: "Up to 32mm tire",
    priceTier: "$$$$",
    priceNote: "The definitive titanium road frame",
    bestFor: ["Road racing", "Century rides", "Fast group training", "Riders retiring their carbon road bike"],
    territory: "Austin, TX",
    highlight: false,
  },
];

// ─── Model Comparison Table ────────────────────────────────────────────────────
function ModelComparison() {
  const [selected, setSelected] = useState<string | null>(null);

  const rows = [
    { label: "Best For", key: "useCase" },
    { label: "Geometry", key: "geometry" },
    { label: "Tire Clearance", key: "clearance" },
    { label: "Territory", key: "territory" },
    { label: "Price Tier", key: "priceTier" },
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <p className="font-label text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Self-Qualify</p>
        <h3 className="font-display text-3xl md:text-4xl font-bold" style={{ color: "oklch(0.22 0.01 60)" }}>
          Which Moots is yours?
        </h3>
        <p className="font-mono-custom text-xs mt-3" style={{ color: "oklch(0.52 0.04 65)" }}>
          Three frames. One metal. Different riders.
        </p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-4">
        {MODELS.map((m) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6"
            style={{
              background: m.highlight ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
              border: m.highlight ? "1px solid oklch(0.72 0.14 65)" : "1px solid oklch(0.78 0.03 70)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display text-xl font-bold" style={{ color: m.highlight ? "oklch(0.945 0.018 78)" : "oklch(0.22 0.01 60)" }}>{m.name}</p>
                <p className="font-mono-custom text-xs mt-0.5" style={{ color: m.highlight ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.12 45)" }}>{m.subtitle}</p>
              </div>
              <span className="font-label text-sm font-bold" style={{ color: "oklch(0.72 0.14 65)" }}>{m.priceTier}</span>
            </div>
            <p className="font-mono-custom text-xs leading-relaxed mb-3" style={{ color: m.highlight ? "oklch(0.78 0.03 70)" : "oklch(0.52 0.04 65)" }}>{m.useCase}</p>
            <div className="space-y-1">
              {m.bestFor.map((b) => (
                <div key={b} className="flex items-center gap-2 font-mono-custom text-xs" style={{ color: m.highlight ? "oklch(0.88 0.025 75)" : "oklch(0.38 0.015 60)" }}>
                  <span style={{ color: "oklch(0.72 0.14 65)" }}>—</span>{b}
                </div>
              ))}
            </div>
            <a
              href="mailto:ianzak@mac.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-label text-xs tracking-[0.2em] uppercase px-5 py-2 transition-all hover:opacity-80"
              style={{
                background: m.highlight ? "oklch(0.72 0.14 65)" : "oklch(0.22 0.01 60)",
                color: m.highlight ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
              }}
            >
              Order This Frame →
            </a>
          </motion.div>
        ))}
      </div>

      {/* Desktop: comparison table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th className="text-left p-4 w-32" style={{ borderBottom: "1px solid oklch(0.78 0.03 70)" }}>
                <span className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Model</span>
              </th>
              {MODELS.map((m) => (
                <th
                  key={m.name}
                  className="p-5 text-left"
                  style={{
                    background: m.highlight ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
                    borderBottom: m.highlight ? "2px solid oklch(0.72 0.14 65)" : "1px solid oklch(0.78 0.03 70)",
                    borderLeft: "1px solid oklch(0.78 0.03 70 / 0.4)",
                  }}
                >
                  {m.highlight && (
                    <span className="font-label text-xs tracking-widest uppercase block mb-1" style={{ color: "oklch(0.72 0.14 65)" }}>Most Popular</span>
                  )}
                  <span className="font-display text-2xl font-bold block" style={{ color: m.highlight ? "oklch(0.945 0.018 78)" : "oklch(0.22 0.01 60)" }}>{m.name}</span>
                  <span className="font-mono-custom text-xs block mt-0.5" style={{ color: m.highlight ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.12 45)" }}>{m.subtitle}</span>
                  <span className="font-label text-lg font-bold block mt-2" style={{ color: "oklch(0.72 0.14 65)" }}>{m.priceTier}</span>
                  <span className="font-mono-custom text-xs" style={{ color: m.highlight ? "oklch(0.52 0.04 65)" : "oklch(0.52 0.04 65)" }}>{m.priceNote}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Use Case", render: (m: typeof MODELS[0]) => m.useCase },
              { label: "Geometry", render: (m: typeof MODELS[0]) => m.geometry },
              { label: "Tire Clearance", render: (m: typeof MODELS[0]) => m.clearance },
              { label: "Territory", render: (m: typeof MODELS[0]) => m.territory },
              { label: "Best For", render: (m: typeof MODELS[0]) => (
                <ul className="space-y-1">
                  {m.bestFor.map((b) => (
                    <li key={b} className="flex items-center gap-2 font-mono-custom text-xs" style={{ color: m.highlight ? "oklch(0.88 0.025 75)" : "oklch(0.38 0.015 60)" }}>
                      <span style={{ color: "oklch(0.72 0.14 65)" }}>—</span>{b}
                    </li>
                  ))}
                </ul>
              )},
            ].map((row, ri) => (
              <tr key={row.label}>
                <td
                  className="p-4 font-label text-xs tracking-widest uppercase align-top"
                  style={{
                    color: "oklch(0.52 0.12 45)",
                    borderBottom: "1px solid oklch(0.78 0.03 70 / 0.5)",
                    background: ri % 2 === 0 ? "oklch(0.88 0.025 75 / 0.3)" : "transparent",
                  }}
                >
                  {row.label}
                </td>
                {MODELS.map((m) => (
                  <td
                    key={m.name}
                    className="p-5 align-top font-mono-custom text-xs leading-relaxed"
                    style={{
                      background: m.highlight
                        ? ri % 2 === 0 ? "oklch(0.25 0.01 60)" : "oklch(0.22 0.01 60)"
                        : ri % 2 === 0 ? "oklch(0.88 0.025 75 / 0.3)" : "oklch(0.945 0.018 78)",
                      color: m.highlight ? "oklch(0.78 0.03 70)" : "oklch(0.38 0.015 60)",
                      borderBottom: "1px solid oklch(0.78 0.03 70 / 0.3)",
                      borderLeft: "1px solid oklch(0.78 0.03 70 / 0.2)",
                    }}
                  >
                    {row.render(m)}
                  </td>
                ))}
              </tr>
            ))}
            {/* CTA row */}
            <tr>
              <td className="p-4" style={{ background: "transparent" }} />
              {MODELS.map((m) => (
                <td key={m.name} className="p-5" style={{ background: m.highlight ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)", borderLeft: "1px solid oklch(0.78 0.03 70 / 0.2)" }}>
                  <a
                    href="mailto:ianzak@mac.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 transition-all hover:opacity-80"
                    style={{
                      background: m.highlight ? "oklch(0.72 0.14 65)" : "oklch(0.22 0.01 60)",
                      color: m.highlight ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
                    }}
                  >
                    Order This Frame →
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Ride Calendar Data ────────────────────────────────────────────────────────
const CALENDAR_EVENTS = [
  // Bentonville
  { id: 1, territory: "bentonville", territoryName: "Bentonville, AR", type: "popup", title: "Moots Pop-Up: Airship Coffee at Coler", date: "2026-04-25", time: "7:00 AM – 10:00 AM", location: "Airship Coffee, Coler Preserve", description: "Demo fleet on-site. Espresso flowing. Bring your gravel bike or test ride a Routt 45.", contact: "917-578-7687" },
  { id: 2, territory: "bentonville", territoryName: "Bentonville, AR", type: "event", title: "Oz Trails Off-Road", date: "2026-05-02", time: "All Day", location: "Bentonville, AR", description: "One of the premier mountain bike events in the Ozarks. Moots will be in the mix.", contact: null },
  { id: 3, territory: "bentonville", territoryName: "Bentonville, AR", type: "popup", title: "Moots Pop-Up: Bike Rack Brewing", date: "2026-05-16", time: "4:00 PM – 7:00 PM", location: "Bike Rack Brewing Co., Bentonville", description: "Post-ride pints and titanium. Demo bikes available. No hard sell — just good beer and better bikes.", contact: "917-578-7687" },
  { id: 4, territory: "bentonville", territoryName: "Bentonville, AR", type: "event", title: "Slaughter Pen Jam", date: "2026-10-10", time: "All Day", location: "Slaughter Pen Trail, Bentonville", description: "Annual gravel and MTB gathering in the Ozarks. Prime demo opportunity.", contact: null },
  // Austin
  { id: 5, territory: "austin", territoryName: "Austin, TX", type: "popup", title: "Moots Pop-Up: Flat Track Coffee", date: "2026-04-19", time: "7:30 AM – 10:30 AM", location: "Flat Track Coffee, East Austin", description: "Vamoots RSL demo fleet. Cortados, titanium, and no carbon in sight.", contact: "917-578-7687" },
  { id: 6, territory: "austin", territoryName: "Austin, TX", type: "event", title: "Gravel Locos", date: "2026-05-09", time: "All Day", location: "Hico, TX (near Austin)", description: "Texas gravel racing staple. 100 miles of Hill Country dirt. Moots territory.", contact: null },
  { id: 7, territory: "austin", territoryName: "Austin, TX", type: "popup", title: "Moots Pop-Up: Cosmic Coffee", date: "2026-06-06", time: "8:00 AM – 11:00 AM", location: "Cosmic Coffee + Beer Garden, Austin", description: "Morning espresso pop-up in the garden. Vamoots RSL and Routt RSL on display.", contact: "917-578-7687" },
  { id: 8, territory: "austin", territoryName: "Austin, TX", type: "event", title: "Hotter 'N Hell Hundred", date: "2026-08-29", time: "All Day", location: "Wichita Falls, TX", description: "100-mile road century. The Vamoots RSL was built for days like this.", contact: null },
  // OKC
  { id: 9, territory: "okc", territoryName: "Oklahoma City, OK", type: "popup", title: "Moots Pop-Up: Elemental Coffee", date: "2026-04-26", time: "8:00 AM – 11:00 AM", location: "Elemental Coffee Roasters, Midtown OKC", description: "Routt RSL demo fleet. Single-origin espresso. The kind of morning that earns a forever bike.", contact: "917-578-7687" },
  { id: 10, territory: "okc", territoryName: "Oklahoma City, OK", type: "event", title: "Red Dirt Gravel Grinder", date: "2026-05-23", time: "All Day", location: "Lake Hefner, Oklahoma City", description: "OKC's signature gravel event. Flat, fast, and relentless. Routt RSL weather.", contact: null },
  { id: 11, territory: "okc", territoryName: "Oklahoma City, OK", type: "popup", title: "Moots Pop-Up: Stonecloud Brewing", date: "2026-06-13", time: "3:00 PM – 6:00 PM", location: "Stonecloud Brewing, OKC", description: "Post-ride taproom takeover. Demo bikes outside, cold pints inside.", contact: "917-578-7687" },
  { id: 12, territory: "okc", territoryName: "Oklahoma City, OK", type: "event", title: "Flint Hills Gravel", date: "2026-10-17", time: "All Day", location: "Emporia, KS (near OKC)", description: "Classic Flint Hills gravel riding. The landscape that inspired the campaign.", contact: null },
];

// ─── RSVP Modal ───────────────────────────────────────────────────────────────
interface RsvpModalProps {
  event: typeof CALENDAR_EVENTS[number];
  onClose: () => void;
}

function RsvpModal({ event, onClose }: RsvpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  // Map territory id to enum
  const territoryEnum = event.territory === "bentonville" ? "AR" : event.territory === "austin" ? "TX" : "OK";

  const rsvpMutation = trpc.rsvp.submit.useMutation({
    onSuccess: (data) => {
      if (data.alreadyRegistered) {
        toast.info("You're already registered for this event.");
        onClose();
      } else {
        setDone(true);
      }
    },
    onError: (err) => toast.error(err.message || "Failed to submit RSVP."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC_SITE) {
      toast.info("RSVP submission is unavailable on the static site. Please use the contact links on this site.");
      return;
    }
    if (!name || !email) { toast.error("Name and email are required."); return; }
    rsvpMutation.mutate({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      territory: territoryEnum as "TX" | "OK" | "AR",
      riderName: name,
      email,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "oklch(0.08 0.005 60 / 0.85)" }} onClick={onClose}>
      <div
        className="w-full max-w-md relative"
        style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.52 0.12 45 / 0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-label text-xs tracking-[0.25em] uppercase mb-1" style={{ color: event.type === "popup" ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.12 45)" }}>
                {event.type === "popup" ? "Moots Pop-Up" : "Gravel Event"} · {event.territoryName}
              </p>
              <h3 className="font-display text-xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>{event.title}</h3>
              <p className="font-mono-custom text-xs mt-1" style={{ color: "oklch(0.52 0.04 65)" }}>{event.time} · {event.location}</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 font-mono-custom text-lg leading-none hover:opacity-60" style={{ color: "oklch(0.52 0.04 65)" }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {done ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mb-4 mx-auto flex items-center justify-center" style={{ border: "1px solid oklch(0.52 0.12 45)" }}>
                <span className="font-display text-xl" style={{ color: "oklch(0.52 0.12 45)" }}>✓</span>
              </div>
              <p className="font-display text-xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>You're in.</p>
              <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Ian will have your name on the list.</p>
              <button onClick={onClose} className="mt-6 font-label text-xs tracking-[0.2em] uppercase px-8 py-3 hover:opacity-80" style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Your Name *</label>
                <input type="text" className="w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none" style={{ borderBottomColor: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" }} placeholder="First Last" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Email *</label>
                <input type="email" className="w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none" style={{ borderBottomColor: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" }} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Notes (optional)</label>
                <textarea rows={2} className="w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none" style={{ borderBottomColor: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)", resize: "none" }} placeholder="Anything Ian should know..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <button type="submit" disabled={rsvpMutation.isPending} className="w-full font-label text-sm tracking-[0.2em] uppercase py-3.5 transition-all hover:opacity-80 disabled:opacity-40" style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}>
                {rsvpMutation.isPending ? "Submitting..." : "Reserve My Spot →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ride Calendar ─────────────────────────────────────────────────────────────
function RideCalendar() {
  const [activeTerritory, setActiveTerritory] = useState<string>("all");
  const [activeType, setActiveType] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rsvpEvent, setRsvpEvent] = useState<typeof CALENDAR_EVENTS[number] | null>(null);

  // Fetch RSVP counts for all events
  const eventIds = CALENDAR_EVENTS.map(e => e.id);
  const { data: rsvpCounts = {} } = trpc.rsvp.counts.useQuery(
    { eventIds },
    { enabled: !IS_STATIC_SITE }
  );

  const filtered = CALENDAR_EVENTS.filter((e) => {
    const tMatch = activeTerritory === "all" || e.territory === activeTerritory;
    const typeMatch = activeType === "all" || e.type === activeType;
    return tMatch && typeMatch;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  const isUpcoming = (dateStr: string) => new Date(dateStr + "T12:00:00") >= new Date();

  const filters = [
    { id: "all", label: "All Territories" },
    { id: "bentonville", label: "Bentonville, AR" },
    { id: "austin", label: "Austin, TX" },
    { id: "okc", label: "Oklahoma City, OK" },
  ];

  const typeFilters = [
    { id: "all", label: "All Events" },
    { id: "popup", label: "Pop-Ups" },
    { id: "event", label: "Gravel Events" },
  ];

  return (
    <>
    <section id="ride-calendar" className="py-24 relative overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <GrainOverlay opacity={0.1} />
      <div className="container relative z-20">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>Upcoming</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                Ride Calendar.
              </h2>
              <p className="font-mono-custom text-sm mt-3" style={{ color: "oklch(0.78 0.03 70)" }}>
                Pop-ups, gravel events, and demo days across TX · OK · AR
              </p>
            </div>
            <a
              href="#book-a-pop-up"
              className="font-label text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all hover:opacity-80 self-start md:self-auto"
              style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
            >
              Request a Date →
            </a>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveTerritory(f.id)}
                className="font-label text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200"
                style={{
                  background: activeTerritory === f.id ? "oklch(0.72 0.14 65)" : "transparent",
                  color: activeTerritory === f.id ? "oklch(0.22 0.01 60)" : "oklch(0.52 0.04 65)",
                  border: `1px solid ${activeTerritory === f.id ? "oklch(0.72 0.14 65)" : "oklch(0.38 0.015 60)"}`,
                }}
              >
                {f.label}
              </button>
            ))}
            <div className="w-px mx-1" style={{ background: "oklch(0.38 0.015 60)" }} />
            {typeFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveType(f.id)}
                className="font-label text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200"
                style={{
                  background: activeType === f.id ? "oklch(0.52 0.12 45)" : "transparent",
                  color: activeType === f.id ? "oklch(0.945 0.018 78)" : "oklch(0.52 0.04 65)",
                  border: `1px solid ${activeType === f.id ? "oklch(0.52 0.12 45)" : "oklch(0.38 0.015 60)"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Event list */}
        <div className="space-y-px">
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                >
                  <div
                    className="flex items-start gap-4 md:gap-8 p-5 md:p-6 transition-all duration-200 group"
                    style={{
                      background: expandedId === event.id ? "oklch(0.28 0.01 60)" : "oklch(0.25 0.008 60)",
                      borderLeft: `3px solid ${event.type === "popup" ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.12 45)"}`,
                    }}
                  >
                    {/* Date block */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <p className="font-display text-2xl font-bold leading-none" style={{ color: event.type === "popup" ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.12 45)" }}>
                        {new Date(event.date + "T12:00:00").getDate()}
                      </p>
                      <p className="font-label text-xs tracking-widest uppercase mt-0.5" style={{ color: "oklch(0.52 0.04 65)" }}>
                        {new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="font-mono-custom text-xs mt-0.5" style={{ color: "oklch(0.38 0.015 60)" }}>
                        {new Date(event.date + "T12:00:00").getFullYear()}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span
                          className="font-label text-xs tracking-widest uppercase px-2 py-0.5"
                          style={{
                            background: event.type === "popup" ? "oklch(0.72 0.14 65 / 0.15)" : "oklch(0.52 0.12 45 / 0.15)",
                            color: event.type === "popup" ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.12 45)",
                          }}
                        >
                          {event.type === "popup" ? "Moots Pop-Up" : "Gravel Event"}
                        </span>
                        <span className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.38 0.015 60)" }}>
                          {event.territoryName}
                        </span>
                        {!isUpcoming(event.date) && (
                          <span className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>Past</span>
                        )}
                      </div>
                      <p className="font-display text-lg font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>{event.title}</p>
                      <p className="font-mono-custom text-xs mt-1" style={{ color: "oklch(0.52 0.04 65)" }}>
                        {event.time} · {event.location}
                      </p>
                    </div>

                    {/* Expand arrow */}
                    <div
                      className="flex-shrink-0 font-mono-custom text-xs transition-transform duration-300"
                      style={{
                        color: "oklch(0.52 0.04 65)",
                        transform: expandedId === event.id ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      →
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expandedId === event.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="px-6 py-5 flex flex-col md:flex-row gap-6 items-start"
                        style={{ background: "oklch(0.28 0.01 60)", borderLeft: `3px solid ${event.type === "popup" ? "oklch(0.72 0.14 65)" : "oklch(0.52 0.12 45)"}` }}
                      >
                        <p className="font-mono-custom text-sm leading-loose flex-1" style={{ color: "oklch(0.78 0.03 70)" }}>
                          {event.description}
                        </p>
                        <div className="flex flex-col gap-3 flex-shrink-0">
                          {event.contact && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setRsvpEvent(event); }}
                              className="font-label text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all hover:opacity-80"
                              style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
                            >
                              RSVP Now →
                            </button>
                          )}
                          {(rsvpCounts as Record<number, number>)[event.id] > 0 && (
                            <p className="font-mono-custom text-xs text-center" style={{ color: "oklch(0.52 0.04 65)" }}>
                              {(rsvpCounts as Record<number, number>)[event.id]} rider{(rsvpCounts as Record<number, number>)[event.id] !== 1 ? 's' : ''} registered
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>No events match this filter. Check back soon — or request a pop-up.</p>
            </div>
          )}
        </div>

        <p className="font-mono-custom text-xs mt-8 text-center" style={{ color: "oklch(0.38 0.015 60)" }}>
          Want to add your event or host a pop-up? Contact Ian at{" "}
          <a href="mailto:ianzak@mac.com" className="hover:underline" style={{ color: "oklch(0.52 0.12 45)" }}>ianzak@mac.com</a>
        </p>
      </div>
    </section>

    {/* RSVP Modal */}
    {rsvpEvent && (
      <RsvpModal event={rsvpEvent} onClose={() => setRsvpEvent(null)} />
    )}
  </>);
}

// ─── Order Section ─────────────────────────────────────────────────────────────
function OrderSection() {
  return (
    <section id="order" className="py-24 relative overflow-hidden" style={{ background: "oklch(0.88 0.025 75)" }}>
      <GrainOverlay opacity={0.08} />
      <div className="container relative z-20">
        <div className="text-center mb-14">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
            Ready to Ride Titanium
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.22 0.01 60)" }}>
            Order a Moots.
          </h2>
          <p className="font-mono-custom text-sm mt-4 max-w-lg mx-auto leading-loose" style={{ color: "oklch(0.52 0.04 65)" }}>
            Whether you're a shop stocking the finest titanium in your region or a rider ready to commit to a forever bike — Ian Zakrocki is your contact for TX, OK, and AR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px max-w-4xl mx-auto" style={{ background: "oklch(0.78 0.03 70)" }}>
          {/* Dealer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-10 flex flex-col gap-6"
            style={{ background: "oklch(0.22 0.01 60)" }}
          >
            <div>
              <p className="font-label text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>For Shops & Dealers</p>
              <h3 className="font-display text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>Carry Moots.</h3>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                Moots is a hand-built, made-in-Colorado titanium brand with zero carbon expiration dates and a loyal customer base that buys once and buys forever. Contact Ian to discuss dealer pricing, demo fleet programs, and territory exclusivity.
              </p>
            </div>
            <ul className="space-y-2">
              {["Dealer pricing & margins", "Demo fleet program", "Co-branded pop-up events", "Territory support (TX · OK · AR)"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-mono-custom text-xs" style={{ color: "oklch(0.88 0.025 75)" }}>
                  <span style={{ color: "oklch(0.72 0.14 65)" }}>—</span> {item}
                </li>
              ))}
            </ul>
            <a
              href="mailto:ianzak@mac.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-label text-sm tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 hover:opacity-80 text-center"
              style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
            >
              Contact Ian — Dealer Inquiry →
            </a>
          </motion.div>

          {/* Individual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="p-10 flex flex-col gap-6"
            style={{ background: "oklch(0.945 0.018 78)" }}
          >
            <div>
              <p className="font-label text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>For Individual Riders</p>
              <h3 className="font-display text-3xl font-bold mb-4" style={{ color: "oklch(0.22 0.01 60)" }}>Buy Your Forever Bike.</h3>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.52 0.04 65)" }}>
                A Moots is not an impulse buy. It's a decision you make once. Ian will walk you through geometry, build options, and the right model for your riding — whether that's gravel in the Ozarks or road miles in Austin.
              </p>
            </div>
            <ul className="space-y-2">
              {["Routt 45 · Routt RSL · Routt 60", "Vamoots RSL · Vamoots DR", "Psychlo X RSL · Mooto X RSL", "Custom geometry consultation"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
                  <span style={{ color: "oklch(0.52 0.12 45)" }}>—</span> {item}
                </li>
              ))}
            </ul>
            <a
              href="mailto:ianzak@mac.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-label text-sm tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 hover:opacity-80 text-center"
              style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.945 0.018 78)" }}
            >
              Contact Ian — Order Your Moots →
            </a>
          </motion.div>
        </div>

        <p className="text-center font-mono-custom text-xs mt-8" style={{ color: "oklch(0.52 0.04 65)" }}>
          All orders and dealer inquiries for TX · OK · AR are handled directly by Ian Zakrocki at{" "}
          <a href="mailto:ianzak@mac.com" className="hover:underline" style={{ color: "oklch(0.52 0.12 45)" }}>
            ianzak@mac.com
          </a>
        </p>

        <ModelComparison />
      </div>
    </section>
  );
}

// ─── Warranty & Trade-Up ──────────────────────────────────────────────────────────────────────────────
function WarrantyTradeUpSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <GrainOverlay opacity={0.12} />
      <div className="container relative z-20">
        <div className="text-center mb-16">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
            The Moots Promise
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            Built to last. Backed forever.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Lifetime Warranty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-10 flex flex-col gap-5"
            style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}
          >
            <div>
              <p className="font-label text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>Lifetime Warranty</p>
              <h3 className="font-display text-2xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>Every MOOTS frame. Forever.</h3>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                Moots titanium frames are backed by a Lifetime Warranty for the original owner, covering any manufacturing defects. This is not a marketing claim — it is the natural consequence of building a frame that is meant to outlast everything else in your garage.
              </p>
            </div>
            <ul className="space-y-2 mt-2">
              {[
                "Original owner, lifetime coverage",
                "Manufacturing defects fully covered",
                "Submit claims to warranty@moots.com",
                "Component warranties via original manufacturers",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-mono-custom text-xs" style={{ color: "oklch(0.88 0.025 75)" }}>
                  <span style={{ color: "oklch(0.72 0.14 65)" }}>—</span> {item}
                </li>
              ))}
            </ul>
            <p className="font-mono-custom text-xs mt-2" style={{ color: "oklch(0.52 0.04 65)" }}>
              Standard builds ship in 6–8 weeks. Custom orders may take longer.
            </p>
          </motion.div>

          {/* Trade-Up Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="p-10 flex flex-col gap-5"
            style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.52 0.12 45 / 0.4)" }}
          >
            <div>
              <p className="font-label text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>Trade-Up Program</p>
              <h3 className="font-display text-2xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>Your old Moots is still worth something.</h3>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                Moots offers an official Trade-Up Program — trade in your existing Moots frame for credit toward a new one. Titanium holds its value in ways carbon never will. If you’re ready for an upgrade, your current bike is part of the deal.
              </p>
            </div>
            <ul className="space-y-2 mt-2">
              {[
                "Trade in any Moots titanium frame",
                "Credit applied toward new frame purchase",
                "Available through Ian for TX · OK · AR riders",
                "No carbon expiration dates — titanium holds value",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-mono-custom text-xs" style={{ color: "oklch(0.88 0.025 75)" }}>
                  <span style={{ color: "oklch(0.52 0.12 45)" }}>—</span> {item}
                </li>
              ))}
            </ul>
            <a
              href="https://moots.com/pages/trade-up-program"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-label text-xs tracking-[0.2em] uppercase px-6 py-3 transition-all duration-300 hover:opacity-80 text-center mt-2"
              style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}
            >
              View Trade-Up Options →
            </a>
          </motion.div>
        </div>

        {/* Refurbishment note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 max-w-2xl mx-auto"
        >
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.52 0.04 65)" }}>
            Moots also offers a{" "}
            <a href="https://moots.com/pages/refurbish-your-frame" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "oklch(0.72 0.14 65)" }}>
              Frame Refurbishment service
            </a>
            {" "}— if your Moots needs new life, they’ll strip it, re-finish it, and send it back like new. Titanium doesn’t wear out. The finish might.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Territory ID → DB enum mapping. Switzerland ("ch") is reserved for a future
// territory expansion — it is intentionally not in the DB enum yet, so the
// form blocks submission and points the rider at Ian by email/phone instead.
const TERRITORY_MAP: Record<string, "TX" | "OK" | "AR"> = {
  bentonville: "AR",
  austin: "TX",
  okc: "OK",
};

const TERRITORY_LABEL: Record<string, string> = {
  bentonville: "Bentonville, AR — The Ozarks",
  austin: "Austin, TX — The East Side",
  okc: "Oklahoma City, OK — Urban Grit",
  ch: "Switzerland (coming soon)",
};

const TERRITORY_CITY: Record<string, string> = {
  bentonville: "Bentonville, AR",
  austin: "Austin, TX",
  okc: "Oklahoma City, OK",
};

// ─── Booking Form ──────────────────────────────────────────────────────────────
function BookingForm() {
  const [form, setForm] = useState({ name: "", email: "", shop: "", territory: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.booking.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Your request has been received. Ian will be in touch.");
    },
    onError: (err) => {
      toast.error(err.message || "Submission failed. Please try again.");
    },
  });

  // Capacity hint — only queried when a real territory + date are picked, and
  // only when running against the live backend (the static site stub returns
  // a graceful null).
  const mappedTerritory = TERRITORY_MAP[form.territory];
  const capacityEnabled = !IS_STATIC_SITE && !!mappedTerritory && !!form.date;
  const capacityQuery = trpc.booking.capacityHint.useQuery(
    { territory: mappedTerritory ?? "TX", date: form.date },
    { enabled: capacityEnabled, retry: false }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC_SITE) {
      toast.info("Booking requests are unavailable on the static site. Please email ianzak@mac.com or call 917-578-7687.");
      return;
    }
    if (form.territory === "ch") {
      toast.info("Switzerland pop-ups aren't bookable here yet. Email ianzak@mac.com or call 917-578-7687 to be the first on the list.");
      return;
    }
    if (!form.name || !form.email || !form.territory || form.territory === "other") {
      toast.error("Please fill in all required fields and select a territory.");
      return;
    }
    if (!mappedTerritory) {
      toast.error("Please select a valid territory.");
      return;
    }
    submitMutation.mutate({
      name: form.name,
      email: form.email,
      territory: mappedTerritory,
      city: TERRITORY_CITY[form.territory] ?? form.territory,
      venue: form.shop || undefined,
      preferredDate: form.date || undefined,
      message: form.message || undefined,
      eventType: "pop-up-espresso",
    });
  };

  const inputClass = "w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none transition-colors duration-200";
  const inputStyle = { borderBottomColor: "oklch(0.78 0.03 70)", color: "oklch(0.22 0.01 60)" };

  const showWeather = !!mappedTerritory; // skip weather for "other" and "ch"

  return (
    <section id="book-a-pop-up" className="py-24 relative" style={{ background: "oklch(0.945 0.018 78)" }}>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            {/* Left */}
            <div className="md:w-2/5">
              <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>Pop-Up Espresso & Dirt</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: "oklch(0.22 0.01 60)" }}>
                Book a<br /><em className="italic" style={{ color: "oklch(0.52 0.12 45)" }}>Pop-Up.</em>
              </h2>
              <div className="h-px mb-6" style={{ background: "oklch(0.78 0.03 70)" }} />
              <p className="font-mono-custom text-sm leading-loose mb-8" style={{ color: "oklch(0.52 0.04 65)" }}>
                Bring a Moots demo fleet to your local coffee shop or trailhead. No massive banners. No hard sell. Just bikes, good espresso, and conversations about titanium welds and tire clearance.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Ideal Temp", value: "72°F, clear skies" },
                  { label: "Best Windows", value: "Mid-Oct or Early April" },
                  { label: "Demo Fleet", value: "Routt 45 · Routt RSL · Vamoots RSL" },
                  { label: "Contact", value: "917-578-7687" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4">
                    <span className="font-label text-xs tracking-widest uppercase w-28 flex-shrink-0 pt-0.5" style={{ color: "oklch(0.52 0.12 45)" }}>{label}</span>
                    <span className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
                      {label === "Contact" ? (
                        value.startsWith('917') ? <span>{value}</span> : <a href="https://mootsframe.com" target="_blank" rel="noopener noreferrer" className="hover:underline">{value}</a>
                      ) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="md:w-3/5">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 mb-6 flex items-center justify-center" style={{ border: "1px solid oklch(0.52 0.12 45)" }}>
                      <span className="font-display text-2xl" style={{ color: "oklch(0.52 0.12 45)" }}>✓</span>
                    </div>
                    <h3 className="font-display text-3xl font-bold mb-3" style={{ color: "oklch(0.22 0.01 60)" }}>Request Received.</h3>
                    <p className="font-label text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "oklch(0.52 0.12 45)" }}>Status · Pending Review</p>
                    <div className="max-w-md mx-auto text-left space-y-3 mb-6 px-4 py-4" style={{ background: "oklch(0.92 0.018 78)", border: "1px solid oklch(0.78 0.03 70)" }}>
                      <p className="font-mono-custom text-xs leading-relaxed" style={{ color: "oklch(0.38 0.015 60)" }}>
                        <span className="font-label tracking-widest uppercase mr-2" style={{ color: "oklch(0.52 0.12 45)" }}>1.</span>
                        Ian will review your request within <strong>2 business days</strong>.
                      </p>
                      <p className="font-mono-custom text-xs leading-relaxed" style={{ color: "oklch(0.38 0.015 60)" }}>
                        <span className="font-label tracking-widest uppercase mr-2" style={{ color: "oklch(0.52 0.12 45)" }}>2.</span>
                        Confirmation email goes to the address you submitted — check spam if it doesn't arrive.
                      </p>
                      <p className="font-mono-custom text-xs leading-relaxed" style={{ color: "oklch(0.38 0.015 60)" }}>
                        <span className="font-label tracking-widest uppercase mr-2" style={{ color: "oklch(0.52 0.12 45)" }}>3.</span>
                        Need to reach Ian directly? He's the sole rep for TX · OK · AR — no other contacts.
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <a href="tel:917-578-7687" className="font-label text-xs tracking-[0.2em] uppercase hover:underline" style={{ color: "oklch(0.52 0.12 45)" }}>
                        Call 917-578-7687 →
                      </a>
                      <a href="mailto:ianzak@mac.com" className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.52 0.04 65)" }}>
                        ianzak@mac.com
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Your Name *</label>
                        <input type="text" className={inputClass} style={inputStyle} placeholder="First Last" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Email *</label>
                        <input type="email" className={inputClass} style={inputStyle} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Shop / Venue Name</label>
                      <input type="text" className={inputClass} style={inputStyle} placeholder="Airship Coffee, Flat Track Coffee, etc." value={form.shop} onChange={(e) => setForm({ ...form, shop: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Territory *</label>
                        <select className={inputClass} style={{ ...inputStyle, appearance: "none" as const }} value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })}>
                          <option value="">Select territory...</option>
                          <option value="bentonville">{TERRITORY_LABEL.bentonville}</option>
                          <option value="austin">{TERRITORY_LABEL.austin}</option>
                          <option value="okc">{TERRITORY_LABEL.okc}</option>
                          <option value="ch" disabled>{TERRITORY_LABEL.ch}</option>
                          <option value="other">Other (specify in notes)</option>
                        </select>
                        {form.territory === "ch" && (
                          <p className="font-mono-custom text-xs mt-2" style={{ color: "oklch(0.52 0.12 45)" }}>
                            Switzerland pop-ups aren't bookable through this form yet. Email <a className="hover:underline" href="mailto:ianzak@mac.com">ianzak@mac.com</a> or call <a className="hover:underline" href="tel:917-578-7687">917-578-7687</a> to be first on the list.
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Preferred Date</label>
                        <input type="date" className={inputClass} style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                      </div>
                    </div>

                    {/* Weather Widget */}
                    <AnimatePresence>
                      {showWeather && (
                        <motion.div key={form.territory} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                          <WeatherWidget territoryId={form.territory} selectedDate={form.date} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Capacity hint — only when DB-backed and a real territory+date are chosen */}
                    {capacityEnabled && capacityQuery.data && capacityQuery.data.cap != null && (
                      <div className="px-4 py-3" style={{ background: "oklch(0.92 0.018 78)", border: "1px solid oklch(0.78 0.03 70)" }}>
                        <p className="font-label text-xs tracking-[0.2em] uppercase mb-1" style={{ color: capacityQuery.data.available ? "oklch(0.35 0.06 145)" : "oklch(0.52 0.12 45)" }}>
                          {capacityQuery.data.available ? "Slots open" : "Date nearly full"}
                        </p>
                        <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
                          {capacityQuery.data.taken} of ~{capacityQuery.data.cap} demo slots requested for this date. Capacity is approximate — Ian will confirm exact availability.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Notes</label>
                      <textarea rows={4} className={inputClass} style={{ ...inputStyle, resize: "none" as const }} placeholder="Tell us about your shop, expected turnout, or any special requests..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                      <button type="submit" disabled={submitMutation.isPending} className="font-label text-sm tracking-[0.2em] uppercase px-10 py-3.5 transition-all duration-300 hover:opacity-80 disabled:opacity-40" style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.945 0.018 78)" }}>
                        {submitMutation.isPending ? "Sending..." : "Request Pop-Up"}
                      </button>
                      <a href="mailto:ianzak@mac.com" className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.52 0.04 65)" }}>
                        or email ianzak@mac.com →
                      </a>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Signup ─────────────────────────────────────────────────────────
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [territory, setTerritory] = useState<"" | "TX" | "OK" | "AR">("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      if (data.alreadySubscribed) {
        toast.success("You're already on the list. Watch your inbox.");
      } else if (data.resubscribed) {
        toast.success("Welcome back. You're resubscribed.");
      } else {
        toast.success("You're on the list. Check your inbox for a welcome.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Could not subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC_SITE) {
      toast.info("Newsletter signup is unavailable on the static site. Email ianzak@mac.com to be added.");
      return;
    }
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    subscribeMutation.mutate({
      email,
      territory: territory || undefined,
      source: "home-footer",
    });
  };

  return (
    <section id="newsletter" className="py-20 relative" style={{ background: "oklch(0.92 0.022 78)" }}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>Signals · Not Spam</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "oklch(0.22 0.01 60)" }}>
            Stay on the <em className="italic" style={{ color: "oklch(0.52 0.12 45)" }}>list.</em>
          </h2>
          <div className="h-px w-24 mx-auto mb-6" style={{ background: "oklch(0.78 0.03 70)" }} />
          <p className="font-mono-custom text-sm leading-loose mb-8" style={{ color: "oklch(0.52 0.04 65)" }}>
            Ride calendar, pop-up dates, dealer testimonials, and Moots stories from TX, OK, and AR. Sent only when there's something worth sending.
          </p>

          {submitted ? (
            <p className="font-mono-custom text-sm" style={{ color: "oklch(0.38 0.015 60)" }}>
              Subscription received. Welcome to the campaign.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto items-stretch">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none transition-colors duration-200"
                style={{ borderBottomColor: "oklch(0.78 0.03 70)", color: "oklch(0.22 0.01 60)" }}
              />
              <select
                value={territory}
                onChange={(e) => setTerritory(e.target.value as "" | "TX" | "OK" | "AR")}
                className="font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none"
                style={{ borderBottomColor: "oklch(0.78 0.03 70)", color: "oklch(0.22 0.01 60)", appearance: "none" as const }}
              >
                <option value="">Territory (optional)</option>
                <option value="TX">Texas</option>
                <option value="OK">Oklahoma</option>
                <option value="AR">Arkansas</option>
              </select>
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 hover:opacity-80 disabled:opacity-40"
                style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.945 0.018 78)" }}
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

          <p className="font-mono-custom text-xs mt-6" style={{ color: "oklch(0.52 0.04 65)" }}>
            Prefer email? Reach Ian directly at <a href="mailto:ianzak@mac.com" className="hover:underline" style={{ color: "oklch(0.38 0.015 60)" }}>ianzak@mac.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 relative overflow-hidden" style={{ background: "oklch(0.18 0.008 60)" }}>
      <GrainOverlay opacity={0.15} />
      <div className="container relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-display text-2xl font-bold mb-1" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</p>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>Handbuilt in Steamboat Springs, CO since 1981</p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Territory Rep · TX · OK · AR</p>
            <a href="mailto:ianzak@mac.com" className="font-mono-custom text-sm hover:underline" style={{ color: "oklch(0.88 0.025 75)" }}>
              ianzak@mac.com
            </a>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>Ian Zakrocki — Dealer & Individual Orders</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>© 2026 Moots Bicycle. The Forever Frame Campaign.</p>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>Built in Colorado. Proven in the Ozarks.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  // Set document title on mount
  useEffect(() => {
    document.title = "Moots Titanium Bikes — The Forever Frame Campaign";
  }, []);
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.945 0.018 78)" }}>
      <Nav />
      <Hero />
      <Manifesto />
      <Territories />
      <TheVibe />
      <OrderSection />
      <WarrantyTradeUpSection />
      <RideCalendar />
      <BookingForm />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
