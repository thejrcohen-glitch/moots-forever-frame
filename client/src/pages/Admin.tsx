/*
 * ADMIN — Photo Moderation Panel
 * Admin-only page for Ian to approve/reject community wall submissions.
 * Requires admin role (enforced server-side via adminProcedure).
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

type StatusFilter = "pending" | "approved" | "rejected" | "all";

export default function Admin() {
  const { user, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const utils = trpc.useUtils();

  const { data: photos = [], isLoading, error } = trpc.moderation.listAll.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const approveMutation = trpc.moderation.approve.useMutation({
    onSuccess: () => {
      toast.success("Photo approved — visible on Community Wall.");
      utils.moderation.listAll.invalidate();
    },
    onError: () => toast.error("Failed to approve photo."),
  });

  const rejectMutation = trpc.moderation.reject.useMutation({
    onSuccess: () => {
      toast.success("Photo rejected.");
      utils.moderation.listAll.invalidate();
    },
    onError: () => toast.error("Failed to reject photo."),
  });

  const deleteMutation = trpc.moderation.delete.useMutation({
    onSuccess: () => {
      toast.success("Photo permanently deleted.");
      utils.moderation.listAll.invalidate();
    },
    onError: () => toast.error("Failed to delete photo."),
  });

  // Auth guard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.22 0.01 60)" }}>
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "oklch(0.52 0.12 45)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "oklch(0.22 0.01 60)" }}>
        <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>You must be logged in to access this page.</p>
        <a href={getLoginUrl()} className="font-label text-xs tracking-[0.2em] uppercase px-8 py-3" style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}>
          Log In
        </a>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "oklch(0.22 0.01 60)" }}>
        <p className="font-display text-2xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>Access Denied</p>
        <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>This page is restricted to administrators.</p>
        <Link href="/" className="font-label text-xs tracking-[0.2em] uppercase hover:underline" style={{ color: "oklch(0.52 0.12 45)" }}>← Back to Home</Link>
      </div>
    );
  }

  const filtered = photos.filter(p => {
    if (statusFilter === "all") return true;
    return p.approved === statusFilter;
  });

  const counts = {
    pending: photos.filter(p => p.approved === "pending").length,
    approved: photos.filter(p => p.approved === "approved").length,
    rejected: photos.filter(p => p.approved === "rejected").length,
    all: photos.length,
  };

  const TERRITORY_COLORS: Record<string, string> = {
    TX: "oklch(0.52 0.12 45)",
    OK: "oklch(0.38 0.015 60)",
    AR: "oklch(0.35 0.06 145)",
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "oklch(0.22 0.01 60 / 0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex flex-col cursor-pointer">
              <span className="font-display text-xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</span>
              <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Admin Panel</span>
            </div>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/community" className="font-label text-xs tracking-widest uppercase hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>Community Wall</Link>
            <span className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>{user.name}</span>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 container">
        {/* Header */}
        <div className="mb-8">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Admin · Moderation</p>
          <h1 className="font-display text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>Photo Queue</h1>
          <p className="font-mono-custom text-sm mt-2" style={{ color: "oklch(0.52 0.04 65)" }}>
            Approve or reject community photo submissions before they appear on the public wall.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(["pending", "approved", "rejected", "all"] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-200"
              style={{
                background: statusFilter === s ? "oklch(0.52 0.12 45)" : "transparent",
                color: statusFilter === s ? "oklch(0.945 0.018 78)" : "oklch(0.52 0.04 65)",
                border: `1px solid ${statusFilter === s ? "oklch(0.52 0.12 45)" : "oklch(0.38 0.015 60)"}`,
              }}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-3 py-12">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "oklch(0.52 0.12 45)", borderTopColor: "transparent" }} />
            <span className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Loading photos...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.12 45)" }}>Failed to load photos. {error.message}</p>
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>
              {statusFilter === "pending" ? "Queue is clear." : "No photos here."}
            </p>
            <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>
              {statusFilter === "pending" ? "All submissions have been reviewed." : `No ${statusFilter} photos found.`}
            </p>
          </div>
        )}

        {/* Photo Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(photo => (
              <div
                key={photo.id}
                className="relative overflow-hidden"
                style={{
                  background: "oklch(0.28 0.01 60)",
                  border: `1px solid ${photo.approved === "pending" ? "oklch(0.72 0.14 65 / 0.6)" : photo.approved === "approved" ? "oklch(0.35 0.06 145 / 0.6)" : "oklch(0.52 0.12 45 / 0.4)"}`,
                }}
              >
                {/* Status badge */}
                <div
                  className="absolute top-3 right-3 z-10 font-label text-xs tracking-widest uppercase px-2 py-1"
                  style={{
                    background: photo.approved === "pending" ? "oklch(0.72 0.14 65)" : photo.approved === "approved" ? "oklch(0.35 0.06 145)" : "oklch(0.38 0.015 60)",
                    color: "oklch(0.945 0.018 78)",
                  }}
                >
                  {photo.approved}
                </div>

                {/* Photo */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={`${photo.riderName}'s Moots`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-label text-xs tracking-[0.25em] uppercase mb-1" style={{ color: TERRITORY_COLORS[photo.territory] ?? "oklch(0.52 0.12 45)" }}>
                    {photo.territory} · {photo.location}
                  </p>
                  <p className="font-display text-base font-bold mb-1" style={{ color: "oklch(0.945 0.018 78)" }}>{photo.riderName}</p>
                  {photo.mootsModel && (
                    <p className="font-mono-custom text-xs mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>{photo.mootsModel}</p>
                  )}
                  {photo.caption && (
                    <p className="font-mono-custom text-xs leading-relaxed mb-3" style={{ color: "oklch(0.52 0.04 65)" }}>"{photo.caption}"</p>
                  )}
                  <p className="font-mono-custom text-xs mb-4" style={{ color: "oklch(0.38 0.015 60)" }}>
                    {new Date(photo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {photo.approved !== "approved" && (
                      <button
                        onClick={() => approveMutation.mutate({ id: photo.id })}
                        disabled={approveMutation.isPending}
                        className="flex-1 font-label text-xs tracking-[0.15em] uppercase py-2.5 transition-all hover:opacity-80 disabled:opacity-40"
                        style={{ background: "oklch(0.35 0.06 145)", color: "oklch(0.945 0.018 78)" }}
                      >
                        Approve
                      </button>
                    )}
                    {photo.approved !== "rejected" && (
                      <button
                        onClick={() => rejectMutation.mutate({ id: photo.id })}
                        disabled={rejectMutation.isPending}
                        className="flex-1 font-label text-xs tracking-[0.15em] uppercase py-2.5 transition-all hover:opacity-80 disabled:opacity-40"
                        style={{ background: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" }}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("Permanently delete this photo? This cannot be undone.")) {
                          deleteMutation.mutate({ id: photo.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="px-3 font-label text-xs tracking-[0.15em] uppercase py-2.5 transition-all hover:opacity-80 disabled:opacity-40"
                      style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)", border: "1px solid oklch(0.38 0.015 60)" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
