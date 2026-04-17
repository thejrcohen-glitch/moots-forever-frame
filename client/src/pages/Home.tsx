/*
 * DESIGN: Analog Film / Western Americana
 * Palette: bone (#F2EDE4), sienna, amber, flint, charcoal
 * Fonts: Playfair Display (headings), IBM Plex Mono (body/data), Barlow Condensed (labels)
 * Aesthetic: Grain over gloss. Lo-fi. Cinematic scroll.
 */

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663557843772/QUvoVjeKdQzxhUCD9R3yK5/territory-okc-UNC9ch2ArK2NfhctY2yUxW.webp",
    coffee: { name: "Elemental Coffee Roasters", address: "815 N Hudson Ave, Oklahoma City, OK", url: "https://elementalcoffee.com", vibe: "A staple of Midtown OKC, known for excellent roasts and a strong connection to the local cycling community." },
    brewery: { name: "Stonecloud Brewing Company", address: "1012 NW 1st St, Oklahoma City, OK", url: "https://stonecloudbrewing.com", vibe: "Housed in a historic renovated laundry building, a short ride from downtown trails." },
    model: "Routt RSL",
    color: "oklch(0.38 0.015 60)",
  },
];

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
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "oklch(0.945 0.018 78 / 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(0.78 0.03 70)" : "none",
      }}
    >
      <div className="container flex items-center justify-between py-4">
        <div className="flex flex-col">
          <span
            className="font-display text-xl font-bold tracking-tight"
            style={{ color: scrolled ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)" }}
          >
            Moots
          </span>
          <span
            className="font-label text-xs tracking-[0.2em] uppercase"
            style={{ color: scrolled ? "oklch(0.52 0.12 45)" : "oklch(0.88 0.025 75 / 0.8)" }}
          >
            The Forever Frame
          </span>
        </div>
        <div className="flex items-center gap-6">
          {["Territories", "The Vibe", "Book a Pop-Up"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "")}`}
              className="font-label text-sm tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{ color: scrolled ? "oklch(0.38 0.015 60)" : "oklch(0.945 0.018 78)" }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
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
        <img
          src={HERO_IMG}
          alt="Moots titanium gravel bike at a trailhead"
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.85) contrast(1.05)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, oklch(0.22 0.01 60 / 0.2) 0%, oklch(0.22 0.01 60 / 0.5) 60%, oklch(0.22 0.01 60 / 0.85) 100%)" }} />
        <GrainOverlay opacity={0.25} />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-24"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="font-label text-xs tracking-[0.35em] uppercase mb-4"
            style={{ color: "oklch(0.72 0.14 65)" }}
          >
            Handbuilt in Steamboat Springs, Colorado · Est. 1981
          </p>
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
            style={{ color: "oklch(0.945 0.018 78)" }}
          >
            The Forever<br />
            <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Frame.</em>
          </h1>
          <p
            className="font-mono-custom text-sm md:text-base max-w-xl leading-relaxed mb-8"
            style={{ color: "oklch(0.88 0.025 75 / 0.8)" }}
          >
            No carbon expiration dates. Just the sound of tires on flint and the promise of a cold one at the finish.
          </p>
          <div className="flex items-center gap-8">
            <a
              href="#territories"
              className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3 transition-all duration-300 hover:opacity-80"
              style={{
                background: "oklch(0.72 0.14 65)",
                color: "oklch(0.22 0.01 60)",
              }}
            >
              Explore Territories
            </a>
            <a
              href="#book-a-pop-up"
              className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3 border transition-all duration-300 hover:opacity-80"
              style={{
                borderColor: "oklch(0.945 0.018 78 / 0.4)",
                color: "oklch(0.945 0.018 78)",
              }}
            >
              Book a Pop-Up
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
        style={{ opacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="font-mono-custom text-xs tracking-widest" style={{ color: "oklch(0.88 0.025 75 / 0.5)" }}>scroll</span>
        <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, oklch(0.88 0.025 75 / 0.5), transparent)" }} />
      </motion.div>
    </section>
  );
}

// ─── Manifesto ─────────────────────────────────────────────────────────────────
function Manifesto() {
  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "oklch(0.22 0.01 60)" }}
    >
      <GrainOverlay opacity={0.12} />
      <div className="container relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-8" style={{ color: "oklch(0.72 0.14 65)" }}>
            The Campaign
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold italic leading-tight mb-8" style={{ color: "oklch(0.945 0.018 78)" }}>
            "Arkansas Dust &<br />Post-Ride Lonestar"
          </h2>
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "oklch(0.52 0.12 45)" }} />
          <p className="font-mono-custom text-sm md:text-base leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
            Three territories. Three vibes. One frame that outlasts all of them.
            We're not selling specs. We're selling the feeling of a sunrise gravel ride in the Ozarks,
            the grit of East Austin asphalt, and the endless Oklahoma horizon.
            If you know, you know.
          </p>
        </div>

        {/* Badge detail */}
        <div className="mt-20 flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-auto">
          <div className="relative w-48 h-48 flex-shrink-0">
            <img
              src={BADGE_IMG}
              alt="Moots titanium badge detail"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.9)" }}
            />
            <GrainOverlay opacity={0.2} />
          </div>
          <div>
            <p className="font-label text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
              The Metal
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
              Titanium doesn't expire.
            </h3>
            <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
              Every Moots frame is hand-welded in Steamboat Springs, Colorado.
              Not assembled. Not outsourced. Welded by hand, one at a time,
              by people who ride the same trails you do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Territory Card ────────────────────────────────────────────────────────────
function TerritoryCard({ territory, index }: { territory: typeof TERRITORIES[0]; index: number }) {
  const [flipped, setFlipped] = useState(false);
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
      {/* Image panel */}
      <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden">
        <motion.img
          src={territory.img}
          alt={territory.name}
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.8) contrast(1.05)" }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, oklch(0.22 0.01 60 / 0.3) 0%, transparent 60%)" }}
        />
        <GrainOverlay opacity={0.2} />
        {/* Coordinate tag */}
        <div
          className="absolute bottom-4 left-4 font-mono-custom text-xs px-3 py-1"
          style={{ background: "oklch(0.22 0.01 60 / 0.75)", color: "oklch(0.72 0.14 65)", backdropFilter: "blur(4px)" }}
        >
          {territory.coords}
        </div>
      </div>

      {/* Content panel */}
      <div
        className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between"
        style={{ background: "oklch(0.945 0.018 78)" }}
      >
        <div>
          <p className="font-label text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
            {territory.tagline}
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: "oklch(0.22 0.01 60)" }}>
            {territory.name}
          </h3>
          <p className="font-label text-xs tracking-widest uppercase mb-6" style={{ color: "oklch(0.72 0.14 65)" }}>
            Featured Model: {territory.model}
          </p>
          <blockquote
            className="font-display text-lg italic leading-relaxed mb-4 pl-4"
            style={{ borderLeft: "2px solid oklch(0.52 0.12 45)", color: "oklch(0.38 0.015 60)" }}
          >
            "{territory.caption}"
          </blockquote>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.72 0.14 65)" }}>
            {territory.hashtags}
          </p>
        </div>

        {/* Partners */}
        <div className="mt-8 space-y-4">
          <div className="h-px" style={{ background: "oklch(0.78 0.03 70)" }} />
          <p className="font-label text-xs tracking-[0.25em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>
            Pop-Up Partners
          </p>
          {[
            { icon: "☕", label: "Coffee", partner: territory.coffee },
            { icon: "🍺", label: "Brewery", partner: territory.brewery },
          ].map(({ icon, label, partner }) => (
            <div key={label}>
              <div className="flex items-start gap-3">
                <span className="text-sm mt-0.5">{icon}</span>
                <div>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-label text-sm font-semibold tracking-wide hover:underline"
                    style={{ color: "oklch(0.38 0.015 60)" }}
                  >
                    {partner.name}
                  </a>
                  <p className="font-mono-custom text-xs mt-0.5" style={{ color: "oklch(0.52 0.04 65)" }}>
                    {partner.address}
                  </p>
                  <p className="font-mono-custom text-xs mt-1 leading-relaxed" style={{ color: "oklch(0.52 0.04 65)" }}>
                    {partner.vibe}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <a
            href="#book-a-pop-up"
            className="inline-block mt-4 font-label text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all duration-300 hover:opacity-80"
            style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.945 0.018 78)" }}
          >
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
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
              The Territory Map
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.22 0.01 60)" }}>
              Three Territories.<br />
              <em className="italic">One Vibe.</em>
            </h2>
          </div>
          <p className="font-mono-custom text-xs max-w-xs leading-relaxed" style={{ color: "oklch(0.52 0.04 65)" }}>
            Each territory has its own character, its own coffee, its own post-ride reward.
            All of them deserve a titanium frame.
          </p>
        </div>
      </div>
      <div className="space-y-0">
        {TERRITORIES.map((t, i) => (
          <TerritoryCard key={t.id} territory={t} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── The Vibe Section ──────────────────────────────────────────────────────────
function TheVibe() {
  const captions = [
    {
      post: "01",
      location: "Coler Preserve, Bentonville AR",
      text: "No carbon expiration dates. Just the sound of tires on flint and the promise of a cold one at the finish. Built in Colorado, proven in the Ozarks.",
      tags: "#Moots #Titanium #Gravel",
    },
    {
      post: "02",
      location: "Flat Track Coffee, Austin TX",
      text: "Some things are built to last. Your frame should be one of them. Hand-welded in Steamboat, right at home in ATX.",
      tags: "#Moots #ForeverBike #AustinCycling",
    },
    {
      post: "03",
      location: "Lake Hefner, Oklahoma City OK",
      text: "Miles fade. Titanium doesn't. Outlasting the light in OKC.",
      tags: "#Moots #GravelGrinder #Titanium",
    },
    {
      post: "04",
      location: "Post-ride, any trailhead",
      text: "Earned the dust. Earned the pour. The ride doesn't end at the trailhead.",
      tags: "#Moots #PostRide #CraftBeer",
    },
  ];

  return (
    <section id="the-vibe" className="py-24 relative overflow-hidden" style={{ background: "oklch(0.22 0.01 60)" }}>
      <GrainOverlay opacity={0.1} />
      <div className="container relative z-20">
        <div className="mb-16 text-center">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
            Campaign Captions
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
            The Vibe.
          </h2>
          <p className="font-mono-custom text-sm mt-4" style={{ color: "oklch(0.78 0.03 70)" }}>
            Ready-to-post. Lo-fi aesthetic. No studio lighting required.
          </p>
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
                <span
                  className="font-mono-custom text-5xl font-light leading-none"
                  style={{ color: "oklch(0.38 0.015 60)" }}
                >
                  {c.post}
                </span>
                <span
                  className="font-mono-custom text-xs"
                  style={{ color: "oklch(0.52 0.04 65)" }}
                >
                  {c.location}
                </span>
              </div>
              <blockquote
                className="font-display text-xl md:text-2xl italic leading-snug mb-6"
                style={{ color: "oklch(0.945 0.018 78)" }}
              >
                "{c.text}"
              </blockquote>
              <p className="font-mono-custom text-xs" style={{ color: "oklch(0.72 0.14 65)" }}>
                {c.tags}
              </p>
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: "oklch(0.72 0.14 65)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Booking Form ──────────────────────────────────────────────────────────────
function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    shop: "",
    territory: "",
    date: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.territory) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Your request has been received. Ian will be in touch.");
  };

  const inputClass = "w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none transition-colors duration-200 focus:border-b-amber-600";
  const inputStyle = {
    borderBottomColor: "oklch(0.78 0.03 70)",
    color: "oklch(0.22 0.01 60)",
  };

  return (
    <section id="book-a-pop-up" className="py-24 relative" style={{ background: "oklch(0.945 0.018 78)" }}>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            {/* Left: Info */}
            <div className="md:w-2/5">
              <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>
                Pop-Up Espresso & Dirt
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: "oklch(0.22 0.01 60)" }}>
                Book a<br />
                <em className="italic" style={{ color: "oklch(0.52 0.12 45)" }}>Pop-Up.</em>
              </h2>
              <div className="h-px mb-6" style={{ background: "oklch(0.78 0.03 70)" }} />
              <p className="font-mono-custom text-sm leading-loose mb-8" style={{ color: "oklch(0.52 0.04 65)" }}>
                Bring a Moots demo fleet to your local coffee shop or trailhead.
                No massive banners. No hard sell. Just bikes, good espresso,
                and conversations about titanium welds and tire clearance.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Ideal Temperature", value: "72°F, clear skies" },
                  { label: "Best Windows", value: "Mid-Oct or Early April" },
                  { label: "Demo Fleet", value: "Routt 45 · Routt RSL · Vamoots RSL" },
                  { label: "Contact", value: "ianzskrocki.com" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4">
                    <span className="font-label text-xs tracking-widest uppercase w-32 flex-shrink-0 pt-0.5" style={{ color: "oklch(0.52 0.12 45)" }}>
                      {label}
                    </span>
                    <span className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
                      {label === "Contact" ? (
                        <a href="https://ianzskrocki.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {value}
                        </a>
                      ) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="md:w-3/5">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full py-20 text-center"
                  >
                    <div className="w-16 h-16 mb-6 flex items-center justify-center" style={{ border: "1px solid oklch(0.52 0.12 45)" }}>
                      <span className="font-display text-2xl" style={{ color: "oklch(0.52 0.12 45)" }}>✓</span>
                    </div>
                    <h3 className="font-display text-3xl font-bold mb-4" style={{ color: "oklch(0.22 0.01 60)" }}>
                      Request Received.
                    </h3>
                    <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>
                      Ian will be in touch to confirm your pop-up details.
                    </p>
                    <a
                      href="https://ianzskrocki.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 font-label text-xs tracking-[0.2em] uppercase hover:underline"
                      style={{ color: "oklch(0.52 0.12 45)" }}
                    >
                      Visit ianzskrocki.com →
                    </a>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
                          Your Name *
                        </label>
                        <input
                          type="text"
                          className={inputClass}
                          style={inputStyle}
                          placeholder="First Last"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          className={inputClass}
                          style={inputStyle}
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
                        Shop / Venue Name
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Airship Coffee, Flat Track Coffee, etc."
                        value={form.shop}
                        onChange={(e) => setForm({ ...form, shop: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
                          Territory *
                        </label>
                        <select
                          className={inputClass}
                          style={{ ...inputStyle, appearance: "none" }}
                          value={form.territory}
                          onChange={(e) => setForm({ ...form, territory: e.target.value })}
                        >
                          <option value="">Select territory...</option>
                          <option value="bentonville">Bentonville, AR — The Ozarks</option>
                          <option value="austin">Austin, TX — The East Side</option>
                          <option value="okc">Oklahoma City, OK — Urban Grit</option>
                          <option value="other">Other (specify in notes)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          className={inputClass}
                          style={inputStyle}
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>
                        Notes
                      </label>
                      <textarea
                        rows={4}
                        className={inputClass}
                        style={{ ...inputStyle, resize: "none" }}
                        placeholder="Tell us about your shop, expected turnout, or any special requests..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                      <button
                        type="submit"
                        className="font-label text-sm tracking-[0.2em] uppercase px-10 py-3.5 transition-all duration-300 hover:opacity-80"
                        style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.945 0.018 78)" }}
                      >
                        Request Pop-Up
                      </button>
                      <a
                        href="https://ianzskrocki.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-custom text-xs hover:underline"
                        style={{ color: "oklch(0.52 0.04 65)" }}
                      >
                        or visit ianzskrocki.com →
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

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-12 relative overflow-hidden"
      style={{ background: "oklch(0.18 0.008 60)" }}
    >
      <GrainOverlay opacity={0.15} />
      <div className="container relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-display text-2xl font-bold mb-1" style={{ color: "oklch(0.945 0.018 78)" }}>
              Moots
            </p>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>
              Handbuilt in Steamboat Springs, CO since 1981
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>
              Territory Rep
            </p>
            <a
              href="https://ianzskrocki.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-custom text-sm hover:underline"
              style={{ color: "oklch(0.88 0.025 75)" }}
            >
              ianzskrocki.com
            </a>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>
              TX · OK · AR
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
            © 2026 Moots Bicycle. The Forever Frame Campaign.
          </p>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
            Built in Colorado. Proven in the Ozarks.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.945 0.018 78)" }}>
      <Nav />
      <Hero />
      <Manifesto />
      <Territories />
      <TheVibe />
      <BookingForm />
      <Footer />
    </div>
  );
}
