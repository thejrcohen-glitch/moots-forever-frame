/**
 * DESIGN: Analog Film / Western Americana
 * Palette: bone, sienna, amber, flint, charcoal
 * Fonts: Playfair Display (headings), IBM Plex Mono (body/data), Barlow Condensed (labels)
 * Aesthetic: Grain over gloss. Lo-fi. Community-driven. Polaroid gallery feel.
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { toast } from "sonner";

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
  useState(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "oklch(0.945 0.018 78 / 0.95)" : "oklch(0.18 0.008 60 / 0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: scrolled ? "1px solid oklch(0.78 0.03 70)" : "1px solid oklch(0.38 0.015 60 / 0.3)",
      }}
    >
      <div className="container flex items-center justify-between py-4">
        <Link href="/">
          <div className="flex flex-col cursor-pointer">
            <span className="font-display text-xl font-bold tracking-tight" style={{ color: scrolled ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)" }}>
              Moots
            </span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: scrolled ? "oklch(0.52 0.12 45)" : "oklch(0.72 0.14 65)" }}>
              The Forever Frame
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/">
            <span className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70 cursor-pointer" style={{ color: scrolled ? "oklch(0.38 0.015 60)" : "oklch(0.88 0.025 75)" }}>
              ← Home
            </span>
          </Link>
          <Link href="/engineering">
            <span className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70 cursor-pointer" style={{ color: scrolled ? "oklch(0.38 0.015 60)" : "oklch(0.88 0.025 75)" }}>
              Engineering
            </span>
          </Link>
          <a href="https://ianzskrocki.com" target="_blank" rel="noopener noreferrer" className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70" style={{ color: "oklch(0.72 0.14 65)" }}>
            Order →
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Seed gallery entries (placeholder community photos using Unsplash) ────────
const SEED_PHOTOS = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    rider: "Marcus T.",
    location: "Bentonville, AR",
    territory: "ar",
    venue: "Airship Coffee at Coler",
    caption: "First gravel ride of the season. The Routt 45 felt like it was made for these trails.",
    model: "Routt 45",
    date: "2026-04-12",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
    rider: "Sarah K.",
    location: "Austin, TX",
    territory: "tx",
    venue: "Flat Track Coffee",
    caption: "Post-ride espresso ritual. Some things don't need improving.",
    model: "Vamoots RSL",
    date: "2026-04-08",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
    rider: "Jake R.",
    location: "Oklahoma City, OK",
    territory: "ok",
    venue: "Lake Hefner Trail",
    caption: "Wind in Oklahoma is not a suggestion. The RSL doesn't care.",
    model: "Routt RSL",
    date: "2026-04-05",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80",
    rider: "Chris M.",
    location: "Fayetteville, AR",
    territory: "ar",
    venue: "Slaughter Pen Trail",
    caption: "Three years on this frame. Not a single regret.",
    model: "Routt RSL",
    date: "2026-03-28",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80",
    rider: "Elena V.",
    location: "Dallas, TX",
    territory: "tx",
    venue: "White Rock Lake",
    caption: "Dawn patrol. Just me, the lake, and a frame that will outlast everything.",
    model: "Vamoots RSL",
    date: "2026-03-22",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&q=80",
    rider: "Tom B.",
    location: "Tulsa, OK",
    territory: "ok",
    venue: "River Parks Trail",
    caption: "Titanium in the golden hour. Worth every penny.",
    model: "Routt 45",
    date: "2026-03-15",
  },
];

type Photo = typeof SEED_PHOTOS[0];

// ─── Photo Card ────────────────────────────────────────────────────────────────
function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const territoryColor = photo.territory === "ar" ? "oklch(0.35 0.06 145)" : photo.territory === "tx" ? "oklch(0.52 0.12 45)" : "oklch(0.38 0.015 60)";
  const territoryLabel = photo.territory === "ar" ? "AR" : photo.territory === "tx" ? "TX" : "OK";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="cursor-pointer group"
      onClick={onClick}
      style={{ background: "oklch(0.22 0.01 60)" }}
    >
      {/* Polaroid-style frame */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={photo.url}
          alt={`${photo.rider} riding a ${photo.model} in ${photo.location}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "saturate(0.8) contrast(1.05)" }}
        />
        <GrainOverlay opacity={0.2} />
        {/* Territory badge */}
        <div className="absolute top-3 right-3 z-20 px-2 py-1 font-label text-xs tracking-widest" style={{ background: territoryColor, color: "oklch(0.945 0.018 78)" }}>
          {territoryLabel}
        </div>
      </div>
      {/* Caption area */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.72 0.14 65)" }}>{photo.rider}</span>
          <span className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>{photo.model}</span>
        </div>
        <p className="font-mono-custom text-xs leading-relaxed mb-2" style={{ color: "oklch(0.78 0.03 70)" }}>"{photo.caption}"</p>
        <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>{photo.venue} · {photo.location}</p>
      </div>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
      style={{ background: "oklch(0.12 0.005 60 / 0.95)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative max-w-4xl w-full"
        style={{ background: "oklch(0.22 0.01 60)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 font-mono-custom text-lg w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ color: "oklch(0.945 0.018 78)" }}
        >
          ×
        </button>
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" style={{ filter: "saturate(0.85) contrast(1.05)" }} />
          <GrainOverlay opacity={0.18} />
        </div>
        <div className="p-8">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <p className="font-label text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "oklch(0.72 0.14 65)" }}>{photo.rider} · {photo.location}</p>
              <p className="font-display text-2xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>{photo.model}</p>
            </div>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>{photo.date}</p>
          </div>
          <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>"{photo.caption}"</p>
          <p className="font-mono-custom text-xs mt-3" style={{ color: "oklch(0.52 0.04 65)" }}>{photo.venue}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Upload Form ───────────────────────────────────────────────────────────────
function UploadForm({ onAdd }: { onAdd: (photo: Photo) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rider: "", location: "", territory: "", venue: "", caption: "", model: "", url: "" });
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Photo must be under 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setForm((f) => ({ ...f, url: result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rider || !form.territory || !form.caption || !form.url) {
      toast.error("Please fill in your name, territory, caption, and upload a photo.");
      return;
    }
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url: form.url,
      rider: form.rider,
      location: form.location || form.territory.toUpperCase(),
      territory: form.territory,
      venue: form.venue || "The trail",
      caption: form.caption,
      model: form.model || "Moots",
      date: new Date().toISOString().split("T")[0],
    };
    onAdd(newPhoto);
    toast.success("Your photo has been added to the community gallery.");
    setForm({ rider: "", location: "", territory: "", venue: "", caption: "", model: "", url: "" });
    setPreview(null);
    setOpen(false);
  };

  const inputClass = "w-full font-mono-custom text-sm px-4 py-3 border-0 border-b-2 bg-transparent outline-none transition-colors duration-200";
  const inputStyle = { borderBottomColor: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-label text-sm tracking-[0.2em] uppercase px-8 py-3.5 transition-all hover:opacity-80"
        style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
      >
        Share Your Ride →
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: "oklch(0.12 0.005 60 / 0.95)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl my-8"
              style={{ background: "oklch(0.22 0.01 60)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="font-label text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "oklch(0.72 0.14 65)" }}>Community Gallery</p>
                    <h3 className="font-display text-3xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>Share Your Ride.</h3>
                  </div>
                  <button onClick={() => setOpen(false)} className="font-mono-custom text-xl w-8 h-8 flex items-center justify-center hover:opacity-70" style={{ color: "oklch(0.945 0.018 78)" }}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Photo upload */}
                  <div>
                    <label className="font-label text-xs tracking-widest uppercase block mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>Your Photo *</label>
                    <div
                      className="relative border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:opacity-80"
                      style={{ borderColor: "oklch(0.38 0.015 60)", minHeight: "160px", background: preview ? "transparent" : "oklch(0.28 0.01 60)" }}
                      onClick={() => fileRef.current?.click()}
                    >
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full object-cover" style={{ maxHeight: "240px" }} />
                      ) : (
                        <div className="text-center p-8">
                          <p className="font-mono-custom text-sm mb-2" style={{ color: "oklch(0.52 0.04 65)" }}>Click to upload</p>
                          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>JPG or PNG · Max 8MB</p>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Your Name *</label>
                      <input type="text" className={inputClass} style={inputStyle} placeholder="First name + last initial" value={form.rider} onChange={(e) => setForm((f) => ({ ...f, rider: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Territory *</label>
                      <select className={inputClass} style={{ ...inputStyle, appearance: "none" as const }} value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })}>
                        <option value="">Select state...</option>
                        <option value="tx">Texas (TX)</option>
                        <option value="ar">Arkansas (AR)</option>
                        <option value="ok">Oklahoma (OK)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>City / Location</label>
                      <input type="text" className={inputClass} style={inputStyle} placeholder="Bentonville, Austin, OKC..." value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Moots Model</label>
                      <select className={inputClass} style={{ ...inputStyle, appearance: "none" as const }} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}>
                        <option value="">Select model...</option>
                        <option value="Routt RSL">Routt RSL</option>
                        <option value="Routt 45">Routt 45</option>
                        <option value="Routt 60">Routt 60</option>
                        <option value="Vamoots RSL">Vamoots RSL</option>
                        <option value="Vamoots DR">Vamoots DR</option>
                        <option value="Psychlo X RSL">Psychlo X RSL</option>
                        <option value="Mooto X RSL">Mooto X RSL</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Coffee Shop / Venue / Trail</label>
                    <input type="text" className={inputClass} style={inputStyle} placeholder="Airship Coffee, Flat Track, Lake Hefner..." value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                  </div>

                  <div>
                    <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Caption *</label>
                    <textarea
                      rows={3}
                      className={inputClass}
                      style={{ ...inputStyle, resize: "none" as const }}
                      placeholder="Short, honest, yours..."
                      value={form.caption}
                      onChange={(e) => setForm({ ...form, caption: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <button type="submit" className="font-label text-sm tracking-[0.2em] uppercase px-10 py-3.5 transition-all hover:opacity-80" style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}>
                      Add to Gallery
                    </button>
                    <button type="button" onClick={() => setOpen(false)} className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.52 0.04 65)" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Community Page ────────────────────────────────────────────────────────────
export default function Community() {
  const [photos, setPhotos] = useState<Photo[]>(SEED_PHOTOS);
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.territory === filter);

  const filters = [
    { id: "all", label: "All States" },
    { id: "tx", label: "Texas" },
    { id: "ar", label: "Arkansas" },
    { id: "ok", label: "Oklahoma" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.18 0.008 60)" }}>
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "oklch(0.18 0.008 60)" }}>
        <GrainOverlay opacity={0.12} />
        <div className="container relative z-20">
          <div className="max-w-3xl">
            <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.72 0.14 65)" }}>
              TX · AR · OK
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-6" style={{ color: "oklch(0.945 0.018 78)" }}>
              The Community<br />
              <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Wall.</em>
            </h1>
            <p className="font-mono-custom text-sm md:text-base leading-loose mb-10" style={{ color: "oklch(0.78 0.03 70)" }}>
              Real riders. Real Moots bikes. Real coffee shops, trailheads, and post-ride porches across Texas, Arkansas, and Oklahoma. If you own a Moots in this territory, this wall is yours.
            </p>
            <UploadForm onAdd={(photo) => setPhotos((prev) => [photo, ...prev])} />
          </div>
        </div>
      </section>

      {/* Filter + Gallery */}
      <section className="pb-24 relative" style={{ background: "oklch(0.18 0.008 60)" }}>
        <div className="container">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="font-label text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-200"
                style={{
                  background: filter === f.id ? "oklch(0.72 0.14 65)" : "transparent",
                  color: filter === f.id ? "oklch(0.22 0.01 60)" : "oklch(0.52 0.04 65)",
                  border: `1px solid ${filter === f.id ? "oklch(0.72 0.14 65)" : "oklch(0.38 0.015 60)"}`,
                }}
              >
                {f.label} {filter === f.id && `(${filtered.length})`}
              </button>
            ))}
          </div>

          {/* Masonry-style grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "oklch(0.28 0.01 60)" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} onClick={() => setLightbox(photo)} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>
                No photos yet for this territory. Be the first to share yours.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 pt-12 text-center" style={{ borderTop: "1px solid oklch(0.28 0.01 60)" }}>
            <p className="font-mono-custom text-sm mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>
              Own a Moots in TX, AR, or OK? This wall is yours.
            </p>
            <UploadForm onAdd={(photo) => setPhotos((prev) => [photo, ...prev])} />
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-16 relative" style={{ background: "oklch(0.22 0.01 60)" }}>
        <GrainOverlay opacity={0.08} />
        <div className="container relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "oklch(0.38 0.015 60)" }}>
            <Link href="/engineering">
              <div className="p-8 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "oklch(0.22 0.01 60)" }}>
                <p className="font-label text-xs tracking-widest uppercase mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Learn</p>
                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>How It's Built →</h3>
                <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>The engineering behind every Moots frame</p>
              </div>
            </Link>
            <a href="/#book-a-pop-up" className="p-8 hover:opacity-90 transition-opacity" style={{ background: "oklch(0.25 0.01 60)" }}>
              <p className="font-label text-xs tracking-widest uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Ride</p>
              <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>Book a Pop-Up →</h3>
              <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>Demo a Moots at your local coffee shop</p>
            </a>
            <a href="https://ianzskrocki.com" target="_blank" rel="noopener noreferrer" className="p-8 hover:opacity-90 transition-opacity" style={{ background: "oklch(0.22 0.01 60)" }}>
              <p className="font-label text-xs tracking-widest uppercase mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Own</p>
              <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>Start a Build →</h3>
              <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>ianzskrocki.com — Ian Zakrocki, TX · OK · AR</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative overflow-hidden" style={{ background: "oklch(0.15 0.006 60)" }}>
        <GrainOverlay opacity={0.15} />
        <div className="container relative z-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <Link href="/"><p className="font-display text-2xl font-bold mb-1 cursor-pointer hover:opacity-80" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</p></Link>
              <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>Handbuilt in Steamboat Springs, CO since 1981</p>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <p className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Territory Rep · TX · OK · AR</p>
              <a href="https://ianzskrocki.com" target="_blank" rel="noopener noreferrer" className="font-mono-custom text-sm hover:underline" style={{ color: "oklch(0.88 0.025 75)" }}>ianzskrocki.com</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>© 2026 Moots Bicycle. The Forever Frame Campaign.</p>
            <div className="flex gap-6">
              <Link href="/engineering"><span className="font-mono-custom text-xs hover:underline cursor-pointer" style={{ color: "oklch(0.38 0.015 60)" }}>Engineering</span></Link>
              <Link href="/"><span className="font-mono-custom text-xs hover:underline cursor-pointer" style={{ color: "oklch(0.38 0.015 60)" }}>Home</span></Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
