/**
 * DESIGN: Analog Film / Western Americana
 * Palette: bone, sienna, amber, flint, charcoal
 * Fonts: Playfair Display (headings), IBM Plex Mono (body/data), Barlow Condensed (labels)
 * Aesthetic: Grain over gloss. Lo-fi. Community-driven. Polaroid gallery feel.
 *
 * DATA LAYER: Persistent tRPC API — photos stored in MySQL + S3
 * Territory enum: "TX" | "OK" | "AR" (uppercase, matches DB schema)
 */

import { useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/routers";
import {
  COMMUNITY_PHOTO_TAGS,
  COMMUNITY_PHOTO_TAG_LABELS,
  MAX_COMMUNITY_PHOTO_TAGS,
  type CommunityPhotoTagSlug,
  MOOTS_BIKE_MODELS,
  MOOTS_BIKE_MODEL_LABELS,
  type MootsBikeModelSlug,
} from "../../../shared/const";

// Row shape returned by community.list — tags is a decoded slug[] (not raw JSON).
type CommunityPhoto = inferRouterOutputs<AppRouter>["community"]["list"][number];

// ─── Grain overlay ─────────────────────────────────────────────────────────────
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

  useState(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Engineering", href: "/engineering" },
    { label: "Dealers", href: "/dealers" },
    { label: "Build a Moots", href: "/build" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled || menuOpen ? "oklch(0.945 0.018 78 / 0.97)" : "oklch(0.18 0.008 60 / 0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: scrolled || menuOpen ? "1px solid oklch(0.78 0.03 70)" : "1px solid oklch(0.38 0.015 60 / 0.3)",
        }}
      >
        <div className="container flex items-center justify-between py-4">
          <Link href="/" onClick={close}>
            <div className="flex flex-col cursor-pointer">
              <span className="font-display text-xl font-bold tracking-tight" style={{ color: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)" }}>Moots</span>
              <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: scrolled || menuOpen ? "oklch(0.52 0.12 45)" : "oklch(0.72 0.14 65)" }}>The Forever Frame</span>
            </div>
          </Link>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href}>
                <span className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70 cursor-pointer" style={{ color: scrolled ? "oklch(0.38 0.015 60)" : "oklch(0.88 0.025 75)" }}>{l.label}</span>
              </Link>
            ))}
            <a href="mailto:ianzak@mac.com" className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70" style={{ color: "oklch(0.72 0.14 65)" }}>Order →</a>
          </div>
          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {[0, 1, 2].map(i => (
              <span key={i} className="block h-0.5 w-6 transition-all duration-300" style={{
                background: scrolled || menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.945 0.018 78)",
                transform: i === 0 && menuOpen ? "translateY(8px) rotate(45deg)" : i === 2 && menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden border-t" style={{ background: "oklch(0.945 0.018 78)", borderColor: "oklch(0.78 0.03 70)" }}>
            <div className="container py-6 flex flex-col gap-5">
              {navLinks.map(l => (
                <Link key={l.label} href={l.href} onClick={close}>
                  <span className="font-label text-sm tracking-widest uppercase hover:opacity-60 cursor-pointer" style={{ color: "oklch(0.22 0.01 60)" }}>{l.label}</span>
                </Link>
              ))}
              <a href="mailto:ianzak@mac.com" onClick={close} className="font-label text-sm tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Order →</a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── Territory helpers ─────────────────────────────────────────────────────────
function territoryColor(territory: string): string {
  if (territory === "AR") return "oklch(0.35 0.06 145)";
  if (territory === "TX") return "oklch(0.52 0.12 45)";
  return "oklch(0.38 0.015 60)";
}

function formatDate(ts: Date | string): string {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  return d.toISOString().split("T")[0];
}

// ─── Photo Card ────────────────────────────────────────────────────────────────
function PhotoCard({ photo, onClick }: { photo: CommunityPhoto; onClick: () => void }) {
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
          src={photo.imageUrl}
          alt={`${photo.riderName} riding a ${photo.mootsModel ?? "Moots"} in ${photo.location}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "saturate(0.8) contrast(1.05)" }}
        />
        <GrainOverlay opacity={0.2} />
        {/* Territory badge */}
        <div
          className="absolute top-3 right-3 z-20 px-2 py-1 font-label text-xs tracking-widest"
          style={{ background: territoryColor(photo.territory), color: "oklch(0.945 0.018 78)" }}
        >
          {photo.territory}
        </div>
      </div>
      {/* Caption area */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.72 0.14 65)" }}>{photo.riderName}</span>
          <span className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>{photo.mootsModel ?? "Moots"}</span>
        </div>
        {photo.caption && (
          <p className="font-mono-custom text-xs leading-relaxed mb-2" style={{ color: "oklch(0.78 0.03 70)" }}>"{photo.caption}"</p>
        )}
        <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
          {photo.venue ? `${photo.venue} · ` : ""}{photo.location}
        </p>
        {photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {photo.tags.map(slug => (
              <span
                key={slug}
                className="font-label text-[10px] tracking-widest uppercase px-2 py-0.5"
                style={{ background: "oklch(0.28 0.01 60)", color: "oklch(0.72 0.14 65)", border: "1px solid oklch(0.38 0.015 60)" }}
              >
                {COMMUNITY_PHOTO_TAG_LABELS[slug] ?? slug}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose }: { photo: CommunityPhoto; onClose: () => void }) {
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
          <img
            src={photo.imageUrl}
            alt={photo.caption ?? `${photo.riderName} on a Moots`}
            className="w-full h-full object-cover"
            style={{ filter: "saturate(0.85) contrast(1.05)" }}
          />
          <GrainOverlay opacity={0.18} />
        </div>
        <div className="p-8">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <p className="font-label text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "oklch(0.72 0.14 65)" }}>
                {photo.riderName} · {photo.location}
              </p>
              <p className="font-display text-2xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>
                {photo.mootsModel ?? "Moots"}
              </p>
            </div>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>
              {formatDate(photo.createdAt)}
            </p>
          </div>
          {photo.caption && (
            <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>"{photo.caption}"</p>
          )}
          {photo.venue && (
            <p className="font-mono-custom text-xs mt-3" style={{ color: "oklch(0.52 0.04 65)" }}>{photo.venue}</p>
          )}
          {photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {photo.tags.map(slug => (
                <span
                  key={slug}
                  className="font-label text-xs tracking-widest uppercase px-3 py-1"
                  style={{ background: "oklch(0.28 0.01 60)", color: "oklch(0.72 0.14 65)", border: "1px solid oklch(0.38 0.015 60)" }}
                >
                  {COMMUNITY_PHOTO_TAG_LABELS[slug] ?? slug}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Upload Form ───────────────────────────────────────────────────────────────
function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    riderName: "",
    location: "",
    territory: "" as "TX" | "OK" | "AR" | "",
    venue: "",
    caption: "",
    mootsModel: "",
  });
  const [selectedTags, setSelectedTags] = useState<CommunityPhotoTagSlug[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleTag = useCallback((slug: CommunityPhotoTagSlug) => {
    setSelectedTags(prev => {
      if (prev.includes(slug)) return prev.filter(t => t !== slug);
      if (prev.length >= MAX_COMMUNITY_PHOTO_TAGS) {
        toast.error(`You can pick up to ${MAX_COMMUNITY_PHOTO_TAGS} tags.`);
        return prev;
      }
      return [...prev, slug];
    });
  }, []);

  const uploadMutation = trpc.community.upload.useMutation({
    onSuccess: () => {
      toast.success("Photo submitted — it'll appear on the wall once Ian approves it.");
      setForm({ riderName: "", location: "", territory: "", venue: "", caption: "", mootsModel: "" });
      setSelectedTags([]);
      setPreview(null);
      setImageData(null);
      setOpen(false);
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message || "Upload failed. Please try again.");
    },
  });

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Photo must be under 8MB.");
      return;
    }
    const mime = file.type as "image/jpeg" | "image/png" | "image/webp";
    setImageMimeType(mime || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setImageData(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.riderName || !form.territory || !form.caption || !imageData) {
      toast.error("Please fill in your name, territory, caption, and upload a photo.");
      return;
    }
    if (!form.location) {
      toast.error("Please enter a city or location.");
      return;
    }
    uploadMutation.mutate({
      riderName: form.riderName,
      territory: form.territory as "TX" | "OK" | "AR",
      location: form.location,
      venue: form.venue || undefined,
      mootsModel: form.mootsModel || undefined,
      caption: form.caption,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      imageData,
      imageMimeType,
    });
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
                  <button
                    onClick={() => setOpen(false)}
                    className="font-mono-custom text-xl w-8 h-8 flex items-center justify-center hover:opacity-70"
                    style={{ color: "oklch(0.945 0.018 78)" }}
                  >
                    ×
                  </button>
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
                          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>JPG, PNG, or WebP · Max 8MB</p>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Your Name *</label>
                      <input
                        type="text"
                        className={inputClass}
                        style={inputStyle}
                        placeholder="First name + last initial"
                        value={form.riderName}
                        onChange={(e) => setForm((f) => ({ ...f, riderName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Territory *</label>
                      <select
                        className={inputClass}
                        style={{ ...inputStyle, appearance: "none" as const }}
                        value={form.territory}
                        onChange={(e) => setForm({ ...form, territory: e.target.value as "TX" | "OK" | "AR" | "" })}
                      >
                        <option value="">Select state...</option>
                        <option value="TX">Texas (TX)</option>
                        <option value="AR">Arkansas (AR)</option>
                        <option value="OK">Oklahoma (OK)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>City / Location *</label>
                      <input
                        type="text"
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Bentonville, Austin, OKC..."
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="font-label text-xs tracking-widest uppercase block mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Moots Model</label>
                      <select
                        className={inputClass}
                        style={{ ...inputStyle, appearance: "none" as const }}
                        value={form.mootsModel}
                        onChange={(e) => setForm({ ...form, mootsModel: e.target.value })}
                      >
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
                    <input
                      type="text"
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Airship Coffee, Flat Track, Lake Hefner..."
                      value={form.venue}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="font-label text-xs tracking-widest uppercase block mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
                      Tags <span className="opacity-60 normal-case">(optional · up to {MAX_COMMUNITY_PHOTO_TAGS})</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMUNITY_PHOTO_TAGS.map(tag => {
                        const active = selectedTags.includes(tag.slug);
                        return (
                          <button
                            key={tag.slug}
                            type="button"
                            onClick={() => toggleTag(tag.slug)}
                            aria-pressed={active}
                            className="font-label text-xs tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                            style={{
                              background: active ? "oklch(0.72 0.14 65)" : "transparent",
                              color: active ? "oklch(0.22 0.01 60)" : "oklch(0.78 0.03 70)",
                              border: `1px solid ${active ? "oklch(0.72 0.14 65)" : "oklch(0.38 0.015 60)"}`,
                            }}
                          >
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
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
                    <button
                      type="submit"
                      disabled={uploadMutation.isPending}
                      className="font-label text-sm tracking-[0.2em] uppercase px-10 py-3.5 transition-all hover:opacity-80 disabled:opacity-40"
                      style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
                    >
                      {uploadMutation.isPending ? "Uploading..." : "Add to Gallery"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="font-mono-custom text-xs hover:underline"
                      style={{ color: "oklch(0.52 0.04 65)" }}
                    >
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

// // ─── Community Page ────────────────────────────────────────────────────────
export default function Community() {
  const [filter, setFilter] = useState<"ALL" | "TX" | "OK" | "AR">("ALL");
  const [activeTagFilters, setActiveTagFilters] = useState<CommunityPhotoTagSlug[]>([]);
  const [selectedModels, setSelectedModels] = useState<MootsBikeModelSlug[]>([]);
  const [lightbox, setLightbox] = useState<CommunityPhoto | null>(null);;

  const utils = trpc.useUtils();

  const { data: photos, isLoading, isError } = trpc.community.list.useQuery(
    {
      territory: filter,
      tags: activeTagFilters.length > 0 ? activeTagFilters : undefined,
      models: selectedModels.length > 0 ? selectedModels : undefined,
    },
    { refetchOnWindowFocus: false }
  );

  const handleUploadSuccess = () => {
    utils.community.list.invalidate();
  };

  const toggleTagFilter = (slug: CommunityPhotoTagSlug) => {
    setActiveTagFilters(prev => (prev.includes(slug) ? prev.filter(t => t !== slug) : [...prev, slug]));
  };

  const toggleModelFilter = (slug: MootsBikeModelSlug) => {
    setSelectedModels(prev => (prev.includes(slug) ? prev.filter(m => m !== slug) : [...prev, slug]));
  };

  const filters: { id: "ALL" | "TX" | "OK" | "AR"; label: string }[] = [
    { id: "ALL", label: "All States" },
    { id: "TX", label: "Texas" },
    { id: "AR", label: "Arkansas" },
    { id: "OK", label: "Oklahoma" },
  ];

  const displayPhotos = photos ?? [];
  const territoryFilteredCount = useMemo(() => displayPhotos.length, [displayPhotos]);

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
            <UploadForm onSuccess={handleUploadSuccess} />
          </div>
        </div>
      </section>

      {/* Filter + Gallery */}
      <section className="pb-24 relative" style={{ background: "oklch(0.18 0.008 60)" }}>
        <div className="container">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
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
                {f.label} {filter === f.id && activeTagFilters.length === 0 && territoryFilteredCount > 0 ? `(${territoryFilteredCount})` : ""}
              </button>
            ))}
          </div>

          {/* Bike Model filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-label text-xs tracking-[0.25em] uppercase mr-1" style={{ color: "oklch(0.52 0.04 65)" }}>Models:</span>
            {MOOTS_BIKE_MODELS.map(model => {
              const active = selectedModels.includes(model.slug);
              return (
                <button
                  key={model.slug}
                  onClick={() => toggleModelFilter(model.slug)}
                  aria-pressed={active}
                  className="font-label text-xs tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                  style={{
                    background: active ? "oklch(0.45 0.15 145)" : "transparent",
                    color: active ? "oklch(0.22 0.01 60)" : "oklch(0.52 0.04 65)",
                    border: `1px solid ${active ? "oklch(0.45 0.15 145)" : "oklch(0.38 0.015 60)"}`,
                  }}
                >
                  {model.label}
                </button>
              );
            })}
            {selectedModels.length > 0 && (
              <button
                onClick={() => setSelectedModels([])}
                className="font-mono-custom text-xs ml-1 hover:underline"
                style={{ color: "oklch(0.52 0.04 65)" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Tag filters — combine with territory above (AND) */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="font-label text-xs tracking-[0.25em] uppercase mr-1" style={{ color: "oklch(0.52 0.04 65)" }}>Tags:</span>
            {COMMUNITY_PHOTO_TAGS.map(tag => {
              const active = activeTagFilters.includes(tag.slug);
              return (
                <button
                  key={tag.slug}
                  onClick={() => toggleTagFilter(tag.slug)}
                  aria-pressed={active}
                  className="font-label text-xs tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                  style={{
                    background: active ? "oklch(0.72 0.14 65)" : "transparent",
                    color: active ? "oklch(0.22 0.01 60)" : "oklch(0.52 0.04 65)",
                    border: `1px solid ${active ? "oklch(0.72 0.14 65)" : "oklch(0.38 0.015 60)"}`,
                  }}
                >
                  {tag.label}
                </button>
              );
            })}
            {activeTagFilters.length > 0 && (
              <button
                onClick={() => setActiveTagFilters([])}
                className="font-mono-custom text-xs ml-1 hover:underline"
                style={{ color: "oklch(0.52 0.04 65)" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="py-24 flex justify-center">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "oklch(0.72 0.14 65)", borderTopColor: "transparent" }}
              />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="py-24 text-center">
              <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>
                Could not load photos. Please refresh and try again.
              </p>
            </div>
          )}

          {/* Masonry-style grid */}
          {!isLoading && !isError && (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: "oklch(0.28 0.01 60)" }}
            >
              <AnimatePresence mode="popLayout">
                {displayPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onClick={() => setLightbox(photo)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && displayPhotos.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>
                {activeTagFilters.length > 0 || selectedModels.length > 0
                  ? "No photos match your filters. Try adjusting your selection."
                  : "No photos yet for this territory. Be the first to share yours."}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 pt-12 text-center" style={{ borderTop: "1px solid oklch(0.28 0.01 60)" }}>
            <p className="font-mono-custom text-sm mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>
              Own a Moots in TX, AR, or OK? This wall is yours.
            </p>
            <UploadForm onSuccess={handleUploadSuccess} />
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
            <a href="mailto:ianzak@mac.com" className="p-8 hover:opacity-90 transition-opacity" style={{ background: "oklch(0.22 0.01 60)" }}>
              <p className="font-label text-xs tracking-widest uppercase mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>Own</p>
              <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>Start a Build →</h3>
              <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>ianzak@mac.com — Ian Zakrocki, TX · OK · AR</p>
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
              <a href="mailto:ianzak@mac.com" className="font-mono-custom text-sm hover:underline" style={{ color: "oklch(0.88 0.025 75)" }}>ianzak@mac.com</a>
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
