/*
 * ADMIN — Moderation Panel
 * Admin-only page for Ian to:
 *   1. Approve/reject community photo submissions
 *   2. View all event RSVPs grouped by event
 *   3. View all build configurator leads
 * Requires admin role (enforced server-side).
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { NotificationCenter } from "@/components/NotificationCenter";
import AdminVerificationPanel from "@/components/AdminVerificationPanel";

type StatusFilter = "pending" | "approved" | "rejected" | "all";
type AdminTab = "photos" | "rsvps" | "leads" | "analytics" | "notifications" | "verification";

const TERRITORY_COLORS: Record<string, string> = {
  TX: "oklch(0.52 0.12 45)",
  OK: "oklch(0.38 0.015 60)",
  AR: "oklch(0.35 0.06 145)",
  CH: "oklch(0.45 0.15 145)",
};

export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("photos");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const utils = trpc.useUtils();

  const { data: photos = [], isLoading: photosLoading, error: photosError } = trpc.moderation.listAll.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const { data: rsvps = [], isLoading: rsvpsLoading } = trpc.rsvp.listAll.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const { data: analytics, isLoading: analyticsLoading } = trpc.analytics.summary.useQuery(undefined, {
    enabled: !!user && user.role === "admin" && activeTab === "analytics",
  });

  const { data: unreadCount = 0 } = trpc.notification.unreadCount.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const approveMutation = trpc.moderation.approve.useMutation({
    onSuccess: () => { toast.success("Photo approved — visible on Community Wall."); utils.moderation.listAll.invalidate(); },
    onError: () => toast.error("Failed to approve photo."),
  });
  const rejectMutation = trpc.moderation.reject.useMutation({
    onSuccess: () => { toast.success("Photo rejected."); utils.moderation.listAll.invalidate(); },
    onError: () => toast.error("Failed to reject photo."),
  });
  const deleteMutation = trpc.moderation.delete.useMutation({
    onSuccess: () => { toast.success("Photo permanently deleted."); utils.moderation.listAll.invalidate(); },
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
        <Link href="/" className="font-label text-xs tracking-widest uppercase hover:underline" style={{ color: "oklch(0.52 0.12 45)" }}>← Back to Home</Link>
      </div>
    );
  }

  // Photos tab helpers
  const filtered = photos.filter(p => statusFilter === "all" || p.approved === statusFilter);
  const photoCounts = {
    pending: photos.filter(p => p.approved === "pending").length,
    approved: photos.filter(p => p.approved === "approved").length,
    rejected: photos.filter(p => p.approved === "rejected").length,
    all: photos.length,
  };

  // RSVPs grouped by event
  const rsvpsByEvent: Record<string, typeof rsvps> = {};
  for (const r of rsvps) {
    const key = `${r.eventId}::${r.eventTitle}`;
    if (!rsvpsByEvent[key]) rsvpsByEvent[key] = [];
    rsvpsByEvent[key].push(r);
  }

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
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "oklch(0.52 0.12 45)" }}>Admin · Dashboard</p>
          <h1 className="font-display text-4xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>Control Panel</h1>
          <p className="font-mono-custom text-sm mt-2" style={{ color: "oklch(0.52 0.04 65)" }}>
            Manage community photos, event RSVPs, and build configurator leads.
          </p>
        </div>

         {/* Main Tabs */}
        <div className="flex gap-2 mb-10 border-b" style={{ borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          {([
            { id: "photos" as AdminTab, label: `Photos (${photoCounts.pending} pending)` },
            { id: "rsvps" as AdminTab, label: `RSVPs (${rsvps.length})` },
            { id: "notifications" as AdminTab, label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
            { id: "verification" as AdminTab, label: "Verification" },
            { id: "analytics" as AdminTab, label: "Analytics" },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="font-label text-xs tracking-[0.2em] uppercase px-6 py-3 transition-all duration-200 -mb-px"
              style={{
                color: activeTab === tab.id ? "oklch(0.945 0.018 78)" : "oklch(0.52 0.04 65)",
                borderBottom: activeTab === tab.id ? "2px solid oklch(0.52 0.12 45)" : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PHOTOS TAB ── */}
        {activeTab === "photos" && (
          <>
            {/* Status Filter */}
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
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} ({photoCounts[s]})
                </button>
              ))}
            </div>

            {photosLoading && (
              <div className="flex items-center gap-3 py-12">
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "oklch(0.52 0.12 45)", borderTopColor: "transparent" }} />
                <span className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Loading photos...</span>
              </div>
            )}
            {photosError && <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.12 45)" }}>Failed to load photos. {photosError.message}</p>}
            {!photosLoading && !photosError && filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>
                  {statusFilter === "pending" ? "Queue is clear." : "No photos here."}
                </p>
                <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>
                  {statusFilter === "pending" ? "All submissions have been reviewed." : `No ${statusFilter} photos found.`}
                </p>
              </div>
            )}
            {!photosLoading && filtered.length > 0 && (
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
                    <div className="absolute top-3 right-3 z-10 font-label text-xs tracking-widest uppercase px-2 py-1"
                      style={{ background: photo.approved === "pending" ? "oklch(0.72 0.14 65)" : photo.approved === "approved" ? "oklch(0.35 0.06 145)" : "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" }}>
                      {photo.approved}
                    </div>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={photo.imageUrl} alt={`${photo.riderName}'s Moots`} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="font-label text-xs tracking-[0.25em] uppercase mb-1" style={{ color: TERRITORY_COLORS[photo.territory] ?? "oklch(0.52 0.12 45)" }}>
                        {photo.territory} · {photo.location}
                      </p>
                      <p className="font-display text-base font-bold mb-1" style={{ color: "oklch(0.945 0.018 78)" }}>{photo.riderName}</p>
                      {photo.mootsModel && <p className="font-mono-custom text-xs mb-2" style={{ color: "oklch(0.72 0.14 65)" }}>{photo.mootsModel}</p>}
                      {photo.caption && <p className="font-mono-custom text-xs leading-relaxed mb-3" style={{ color: "oklch(0.52 0.04 65)" }}>"{photo.caption}"</p>}
                      <p className="font-mono-custom text-xs mb-4" style={{ color: "oklch(0.38 0.015 60)" }}>
                        {new Date(photo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <div className="flex gap-2">
                        {photo.approved !== "approved" && (
                          <button onClick={() => approveMutation.mutate({ id: photo.id })} disabled={approveMutation.isPending}
                            className="flex-1 font-label text-xs tracking-[0.15em] uppercase py-2.5 transition-all hover:opacity-80 disabled:opacity-40"
                            style={{ background: "oklch(0.35 0.06 145)", color: "oklch(0.945 0.018 78)" }}>
                            Approve
                          </button>
                        )}
                        {photo.approved !== "rejected" && (
                          <button onClick={() => rejectMutation.mutate({ id: photo.id })} disabled={rejectMutation.isPending}
                            className="flex-1 font-label text-xs tracking-[0.15em] uppercase py-2.5 transition-all hover:opacity-80 disabled:opacity-40"
                            style={{ background: "oklch(0.38 0.015 60)", color: "oklch(0.945 0.018 78)" }}>
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => { if (confirm("Permanently delete this photo? This cannot be undone.")) deleteMutation.mutate({ id: photo.id }); }}
                          disabled={deleteMutation.isPending}
                          className="px-3 font-label text-xs tracking-[0.15em] uppercase py-2.5 transition-all hover:opacity-80 disabled:opacity-40"
                          style={{ background: "oklch(0.22 0.01 60)", color: "oklch(0.52 0.04 65)", border: "1px solid oklch(0.38 0.015 60)" }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── RSVPS TAB ── */}
        {activeTab === "rsvps" && (
          <>
            {rsvpsLoading && (
              <div className="flex items-center gap-3 py-12">
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "oklch(0.52 0.12 45)", borderTopColor: "transparent" }} />
                <span className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Loading RSVPs...</span>
              </div>
            )}
            {!rsvpsLoading && rsvps.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-display text-2xl font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>No RSVPs yet.</p>
                <p className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>RSVPs will appear here once riders sign up for events.</p>
              </div>
            )}
            {!rsvpsLoading && rsvps.length > 0 && (
              <div className="space-y-10">
                {Object.entries(rsvpsByEvent)
                  .sort(([, a], [, b]) => (a[0]?.eventDate ?? "").localeCompare(b[0]?.eventDate ?? ""))
                  .map(([key, eventRsvpList]) => {
                    const first = eventRsvpList[0]!;
                    return (
                      <div key={key}>
                        <div className="flex items-end justify-between mb-4 pb-3" style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
                          <div>
                            <p className="font-label text-xs tracking-[0.25em] uppercase mb-1" style={{ color: TERRITORY_COLORS[first.territory] ?? "oklch(0.52 0.12 45)" }}>
                              {first.territory} · {first.eventDate}
                            </p>
                            <h2 className="font-display text-xl font-bold" style={{ color: "oklch(0.945 0.018 78)" }}>{first.eventTitle}</h2>
                          </div>
                          <span className="font-mono-custom text-sm" style={{ color: "oklch(0.72 0.14 65)" }}>
                            {eventRsvpList.length} rider{eventRsvpList.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.3)" }}>
                                {["Name", "Email", "Notes", "Signed Up"].map(h => (
                                  <th key={h} className="font-label text-xs tracking-[0.2em] uppercase pb-3 pr-6" style={{ color: "oklch(0.52 0.04 65)" }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {eventRsvpList.map(r => (
                                <tr key={r.id} style={{ borderBottom: "1px solid oklch(0.38 0.015 60 / 0.2)" }}>
                                  <td className="font-mono-custom text-sm py-3 pr-6" style={{ color: "oklch(0.945 0.018 78)" }}>{r.riderName}</td>
                                  <td className="font-mono-custom text-sm py-3 pr-6" style={{ color: "oklch(0.72 0.14 65)" }}>
                                    <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                                  </td>
                                  <td className="font-mono-custom text-xs py-3 pr-6 max-w-xs" style={{ color: "oklch(0.52 0.04 65)" }}>{r.notes ?? "—"}</td>
                                  <td className="font-mono-custom text-xs py-3" style={{ color: "oklch(0.38 0.015 60)" }}>
                                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === "analytics" && (
          <>
            {analyticsLoading && (
              <div className="flex items-center gap-3 py-12">
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "oklch(0.52 0.12 45)", borderTopColor: "transparent" }} />
                <span className="font-mono-custom text-sm" style={{ color: "oklch(0.52 0.04 65)" }}>Loading analytics...</span>
              </div>
            )}
            {!analyticsLoading && analytics && (
              <div className="space-y-10">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: "Total RSVPs", value: analytics.rsvps.total, sub: `${analytics.rsvps.thisMonth} this month`, color: "oklch(0.52 0.12 45)" },
                    { label: "Build Leads", value: analytics.leads.total, sub: `${analytics.leads.thisMonth} this month`, color: "oklch(0.72 0.14 65)" },
                    { label: "Pop-Up Bookings", value: analytics.bookings.total, sub: `${analytics.bookings.thisMonth} this month`, color: "oklch(0.55 0.08 60)" },
                    { label: "Photos Submitted", value: analytics.photos.total, sub: `${analytics.photos.pending} pending review`, color: "oklch(0.35 0.06 145)" },
                    { label: "Photos Approved", value: analytics.photos.approved, sub: `${analytics.photos.rejected} rejected`, color: "oklch(0.55 0.04 145)" },
                  ].map(card => (
                    <div key={card.label} className="p-6" style={{ background: "oklch(0.28 0.01 60)", border: `1px solid ${card.color} / 0.4` }}>
                      <p className="font-label text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "oklch(0.52 0.04 65)" }}>{card.label}</p>
                      <p className="font-display text-4xl font-bold mb-1" style={{ color: card.color }}>{card.value}</p>
                      <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>{card.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Territory breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6" style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
                    <p className="font-label text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>RSVPs by Territory</p>
                    {Object.entries(analytics.rsvps.byTerritory ?? {}).length === 0 ? (
                      <p className="font-mono-custom text-sm" style={{ color: "oklch(0.38 0.015 60)" }}>No RSVPs yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(analytics.rsvps.byTerritory ?? {})
                          .sort(([, a], [, b]) => b - a)
                          .map(([territory, count]) => (
                            <div key={territory}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-label text-xs tracking-widest uppercase" style={{ color: TERRITORY_COLORS[territory] ?? "oklch(0.52 0.12 45)" }}>{territory}</span>
                                <span className="font-mono-custom text-sm" style={{ color: "oklch(0.945 0.018 78)" }}>{count}</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full" style={{ background: "oklch(0.38 0.015 60)" }}>
                                <div className="h-1.5 rounded-full transition-all duration-700"
                                  style={{ width: `${Math.round((count / analytics.rsvps.total) * 100)}%`, background: TERRITORY_COLORS[territory] ?? "oklch(0.52 0.12 45)" }} />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6" style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
                    <p className="font-label text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>Top Events by RSVP</p>
                    {(analytics.rsvps.topEvents ?? []).length === 0 ? (
                      <p className="font-mono-custom text-sm" style={{ color: "oklch(0.38 0.015 60)" }}>No RSVPs yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {(analytics.rsvps.topEvents ?? []).map((e, i) => (
                          <div key={e.title} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono-custom text-xs w-5" style={{ color: "oklch(0.38 0.015 60)" }}>#{i + 1}</span>
                              <span className="font-mono-custom text-sm" style={{ color: "oklch(0.945 0.018 78)" }}>{e.title}</span>
                            </div>
                            <span className="font-mono-custom text-sm" style={{ color: "oklch(0.72 0.14 65)" }}>{e.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Top models */}
                <div className="p-6" style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
                  <p className="font-label text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>Top Models from Build Configurator</p>
                  {(analytics.leads.topModels ?? []).length === 0 ? (
                    <p className="font-mono-custom text-sm" style={{ color: "oklch(0.38 0.015 60)" }}>No leads yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {(analytics.leads.topModels ?? []).map((m, i) => (
                        <div key={m.model} className="p-4 text-center" style={{ background: "oklch(0.22 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
                          <p className="font-mono-custom text-xs mb-1" style={{ color: "oklch(0.38 0.015 60)" }}>#{i + 1}</p>
                          <p className="font-display text-2xl font-bold mb-1" style={{ color: "oklch(0.72 0.14 65)" }}>{m.count}</p>
                          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.72 0.04 65)" }}>{m.model}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === "notifications" && (
          <NotificationCenter />
        )}

        {/* ── VERIFICATION TAB ── */}
        {activeTab === "verification" && (
          <AdminVerificationPanel />
        )}
      </div>
    </div>
  );
}
