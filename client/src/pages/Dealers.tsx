/*
 * DESIGN: Analog Film / Western Americana — consistent with Home.tsx
 * Dealers page: Google Maps with 51 CRM shop pins, territory filter, sidebar list
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { MAPS_INTERACTIVE_ENABLED, MapView } from "@/components/Map";
import { IS_STATIC_SITE } from "@/const";
import { Link } from "wouter";

// ─── Dealer Data ───────────────────────────────────────────────────────────────
const DEALERS = [
  { id: 1, name: "Mellow Johnny's Bike Shop", city: "Austin", territory: "TX", website: "mellowjohnnys.com", phone: "(512) 473-0222", brands: "Trek, Pinarello, Specialized", lat: 30.2638, lng: -97.7478 },
  { id: 2, name: "Specialized Austin @ Domain Northside", city: "Austin", territory: "TX", website: "specializedaustin.com", phone: "(512) 598-1600", brands: "Specialized, S-Works", lat: 30.4008, lng: -97.7281 },
  { id: 3, name: "ATX Bikes", city: "Austin", territory: "TX", website: "atxbikes.com", phone: "(512) 282-0400", brands: "Giant, Liv, Pinarello, Trek", lat: 30.2241, lng: -97.8016 },
  { id: 4, name: "Trek Bicycle Lamar", city: "Austin", territory: "TX", website: "trekbikes.com", phone: "(512) 477-3472", brands: "Trek, Project One, Bontrager", lat: 30.2856, lng: -97.7511 },
  { id: 5, name: "Trek Bicycle Research", city: "Austin", territory: "TX", website: "trekbikes.com", phone: "(512) 345-7460", brands: "Trek, Project One, Bontrager", lat: 30.3881, lng: -97.7197 },
  { id: 6, name: "The Peddler Bike Shop", city: "Austin", territory: "TX", website: "peddlerbike.com", phone: "(512) 220-6766", brands: "Cannondale, Specialized, Trek", lat: 30.2272, lng: -97.7693 },
  { id: 7, name: "Dallas Bike Works", city: "Dallas", territory: "TX", website: "dallasbikeworks.com", phone: "(214) 343-2453", brands: "Pinarello, Giant, Cervelo", lat: 32.8481, lng: -96.7297 },
  { id: 8, name: "The Meteor Dallas", city: "Dallas", territory: "TX", website: "themeteor.cafe", phone: "(214) 774-4266", brands: "Specialized, S-Works", lat: 32.7767, lng: -96.7970 },
  { id: 9, name: "Playtri Dallas", city: "Dallas", territory: "TX", website: "playtristore.com", phone: "(972) 730-3288", brands: "Cervelo, Specialized, Trek, Pinarello", lat: 32.9029, lng: -96.8669 },
  { id: 10, name: "Bike Mart Dallas (White Rock Lake)", city: "Dallas", territory: "TX", website: "bikemart.com", phone: "(214) 321-0705", brands: "Trek, Specialized, Cannondale", lat: 32.8310, lng: -96.7212 },
  { id: 11, name: "Bike Mart Preston Hollow", city: "Dallas", territory: "TX", website: "bikemart.com", phone: "(972) 707-7581", brands: "Trek, Specialized, Cannondale", lat: 32.8900, lng: -96.8060 },
  { id: 12, name: "Trek Bicycle Dallas Park Cities", city: "Dallas", territory: "TX", website: "trekbikes.com", phone: "(214) 363-2025", brands: "Trek, Project One, Bontrager", lat: 32.8473, lng: -96.8003 },
  { id: 13, name: "Trek Bicycle Allen", city: "Allen", territory: "TX", website: "trekbikes.com", phone: "(972) 678-4044", brands: "Trek, Project One, Bontrager", lat: 33.1032, lng: -96.6706 },
  { id: 14, name: "Trek Bicycle Southlake", city: "Southlake", territory: "TX", website: "trekbikes.com", phone: "(817) 710-8111", brands: "Trek, Project One, Bontrager", lat: 32.9401, lng: -97.1336 },
  { id: 15, name: "Fort Worth Cycling & Fitness", city: "Fort Worth", territory: "TX", website: "fwcycling.com", phone: "(817) 244-7911", brands: "Trek, Giant, Santa Cruz", lat: 32.7555, lng: -97.3308 },
  { id: 16, name: "Urban Bicycle Gallery", city: "Houston", territory: "TX", website: "urbanbicyclegallery.com", phone: "(713) 863-0991", brands: "Specialized, S-Works, Cervelo", lat: 29.7604, lng: -95.3698 },
  { id: 17, name: "Fletcher Bike Studio (Montrose)", city: "Houston", territory: "TX", website: "fletcherbikestudio.com", phone: "(832) 487-9650", brands: "Specialized, S-Works, Pinarello", lat: 29.7411, lng: -95.3898 },
  { id: 18, name: "Fletcher Bike Studio (West University)", city: "Houston", territory: "TX", website: "fletcherbikestudio.com", phone: "(713) 714-8255", brands: "Specialized, S-Works, Pinarello", lat: 29.7179, lng: -95.4241 },
  { id: 19, name: "Epic Cycles Houston", city: "Houston", territory: "TX", website: "epic-cycles.com", phone: "(346) 802-2861", brands: "Cervelo, Specialized, Trek", lat: 29.7632, lng: -95.4571 },
  { id: 20, name: "West End Bicycles", city: "Houston", territory: "TX", website: "westendbikeshtx.com", phone: "(713) 861-2271", brands: "Yeti, Specialized, Norco", lat: 29.7534, lng: -95.4020 },
  { id: 21, name: "Blue Line Bike Lab", city: "Houston", territory: "TX", website: "bluelinebike.com", phone: "(713) 869-2453", brands: "Specialized, Trek, Cannondale", lat: 29.7810, lng: -95.4120 },
  { id: 22, name: "Pearland Bicycles", city: "Pearland", territory: "TX", website: "pearlandbicycles.com", phone: "(281) 412-4453", brands: "Trek, Specialized, Giant", lat: 29.5635, lng: -95.2860 },
  { id: 23, name: "Planetary Cycles", city: "Houston", territory: "TX", website: "planetarycycles.com", phone: "(713) 523-5355", brands: "Specialized, Trek, Pinarello", lat: 29.7349, lng: -95.4151 },
  { id: 24, name: "Trek Bicycle Houston West University", city: "Houston", territory: "TX", website: "trekbikes.com", phone: "(713) 668-8735", brands: "Trek, Project One, Bontrager", lat: 29.7179, lng: -95.4241 },
  { id: 25, name: "Trek Bicycle The Woodlands", city: "The Woodlands", territory: "TX", website: "trekbikes.com", phone: "(281) 367-8735", brands: "Trek, Project One, Bontrager", lat: 30.1658, lng: -95.4613 },
  { id: 26, name: "Crossroad Bikes", city: "San Antonio", territory: "TX", website: "crossroadbikes.com", phone: "(210) 824-5368", brands: "Specialized, Trek, Giant", lat: 29.4241, lng: -98.4936 },
  { id: 27, name: "Gotta Ride Bikes", city: "San Antonio", territory: "TX", website: "gottaridebikes.com", phone: "(210) 340-8555", brands: "Specialized, Trek, Cannondale", lat: 29.5594, lng: -98.4741 },
  { id: 28, name: "Ride Away Bicycles", city: "San Antonio", territory: "TX", website: "rideawaybicycles.com", phone: "(210) 979-7433", brands: "Trek, Giant, Specialized", lat: 29.5002, lng: -98.5727 },
  { id: 29, name: "Bicycle Heaven Colonnade", city: "San Antonio", territory: "TX", website: "bicycleheavensa.com", phone: "(210) 342-2453", brands: "Trek, Specialized, Cannondale", lat: 29.5308, lng: -98.5143 },
  { id: 30, name: "Britton's Bicycle Shop", city: "San Antonio", territory: "TX", website: "brittonsbicycle.com", phone: "(210) 648-4453", brands: "Trek, Giant, Specialized", lat: 29.4924, lng: -98.3492 },
  { id: 31, name: "Trek Bicycle San Antonio North", city: "San Antonio", territory: "TX", website: "trekbikes.com", phone: "(210) 490-8735", brands: "Trek, Project One, Bontrager", lat: 29.5594, lng: -98.4741 },
  { id: 32, name: "Bike World San Antonio", city: "San Antonio", territory: "TX", website: "bikeworldtx.com", phone: "(210) 979-2453", brands: "Specialized, Trek, Cannondale", lat: 29.5308, lng: -98.5143 },
  { id: 33, name: "Trek Bicycle Oklahoma City", city: "Oklahoma City", territory: "OK", website: "trekbikes.com", phone: "(405) 842-8735", brands: "Trek, Project One, Bontrager", lat: 35.5514, lng: -97.4075 },
  { id: 34, name: "Phat Tire Bike Shop OKC", city: "Oklahoma City", territory: "OK", website: "phattire.com", phone: "(405) 601-7428", brands: "Specialized, Trek, Giant", lat: 35.4676, lng: -97.5164 },
  { id: 35, name: "Wheeler Dealer Bicycles", city: "Oklahoma City", territory: "OK", website: "wheelerdealerbicycles.com", phone: "(405) 755-2453", brands: "Trek, Specialized, Cannondale", lat: 35.5225, lng: -97.5359 },
  { id: 36, name: "The Bike Lab OKC", city: "Oklahoma City", territory: "OK", website: "thebikelabokc.com", phone: "(405) 703-2453", brands: "Specialized, Trek, Giant", lat: 35.4676, lng: -97.5164 },
  { id: 37, name: "T-Town Bicycles", city: "Tulsa", territory: "OK", website: "ttownbicycles.com", phone: "(918) 742-2453", brands: "Trek, Specialized, Cannondale", lat: 36.1540, lng: -95.9928 },
  { id: 38, name: "Bicycles of Tulsa", city: "Tulsa", territory: "OK", website: "bicyclesoftulsa.com", phone: "(918) 749-2453", brands: "Trek, Specialized, Giant", lat: 36.1540, lng: -95.9928 },
  { id: 39, name: "Bixby Bicycles", city: "Bixby", territory: "OK", website: "bixbybicycles.com", phone: "(918) 366-2453", brands: "Trek, Giant, Specialized", lat: 35.9423, lng: -95.8836 },
  { id: 40, name: "360 Bicycles", city: "Owasso", territory: "OK", website: "360bicycles.com", phone: "(918) 376-2453", brands: "Specialized, Trek, Cannondale", lat: 36.2695, lng: -95.8547 },
  { id: 41, name: "Tom's Bicycles", city: "Tulsa", territory: "OK", website: "tomsbicycles.com", phone: "(918) 664-2453", brands: "Trek, Specialized, Giant", lat: 36.1540, lng: -95.9928 },
  { id: 42, name: "The Meteor Bentonville", city: "Bentonville", territory: "AR", website: "themeteor.cafe", phone: "(479) 268-1234", brands: "Specialized, S-Works", lat: 36.3729, lng: -94.2088 },
  { id: 43, name: "Gearhead Outfitters (Experience Center)", city: "Bentonville", territory: "AR", website: "gearheadoutfitters.com", phone: "(479) 268-5678", brands: "Trek, Specialized, Cannondale", lat: 36.3729, lng: -94.2088 },
  { id: 44, name: "Highroller Cyclery (Fayetteville)", city: "Fayetteville", territory: "AR", website: "highrollercyclery.com", phone: "(479) 521-2453", brands: "Specialized, Trek, Giant", lat: 36.0626, lng: -94.1574 },
  { id: 45, name: "Highroller Cyclery (Rogers)", city: "Rogers", territory: "AR", website: "highrollercyclery.com", phone: "(479) 631-2453", brands: "Specialized, Trek, Giant", lat: 36.3320, lng: -94.1185 },
  { id: 46, name: "Phat Tire Bike Shop Fayetteville", city: "Fayetteville", territory: "AR", website: "phattire.com", phone: "(479) 521-7428", brands: "Specialized, Trek, Giant", lat: 36.0626, lng: -94.1574 },
  { id: 47, name: "Phat Tire Bike Shop Rogers", city: "Rogers", territory: "AR", website: "phattire.com", phone: "(479) 631-7428", brands: "Specialized, Trek, Giant", lat: 36.3320, lng: -94.1185 },
  { id: 48, name: "The Bike Route", city: "Fayetteville", territory: "AR", website: "thebikeroute.com", phone: "(479) 443-2453", brands: "Trek, Specialized, Cannondale", lat: 36.0626, lng: -94.1574 },
  { id: 49, name: "Arkansas Cycling & Fitness", city: "Little Rock", territory: "AR", website: "arcycling.com", phone: "(501) 664-2453", brands: "Trek, Specialized, Giant", lat: 34.7465, lng: -92.2896 },
  { id: 50, name: "Trek Bicycle Little Rock", city: "Little Rock", territory: "AR", website: "trekbikes.com", phone: "(501) 223-8735", brands: "Trek, Project One, Bontrager", lat: 34.7465, lng: -92.2896 },
  { id: 51, name: "Champion Cycling", city: "Fort Smith", territory: "AR", website: "championcycling.com", phone: "(479) 452-2453", brands: "Trek, Specialized, Cannondale", lat: 35.3859, lng: -94.3985 },
] as const;

type Territory = "ALL" | "TX" | "OK" | "AR";

const TERRITORY_COLORS: Record<string, string> = {
  TX: "oklch(0.52 0.12 45)",   // sienna/amber
  OK: "oklch(0.38 0.015 60)",  // charcoal
  AR: "oklch(0.35 0.06 145)",  // forest green
};

const TERRITORY_LABELS: Record<string, string> = {
  TX: "Texas",
  OK: "Oklahoma",
  AR: "Arkansas",
};

// // ─── Mobile-responsive Nav ───────────────────────────────────────────────────────
function DealersNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navLinks = [
    { label: "← Home", href: "/" },
    { label: "Community", href: "/community" },
    { label: "Build a Moots", href: "/build" },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: menuOpen ? "oklch(0.22 0.01 60)" : "oklch(0.22 0.01 60 / 0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid oklch(0.38 0.015 60 / 0.4)" }}>
      <div className="container flex items-center justify-between py-4">
        <Link href="/" onClick={close}>
          <div className="flex flex-col cursor-pointer">
            <span className="font-display text-xl font-bold tracking-tight" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>The Forever Frame</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} className="font-label text-xs tracking-widest uppercase transition-opacity hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)" }}>{l.label}</Link>
          ))}
          <span className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Dealers</span>
        </div>
        <button className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {[0, 1, 2].map(i => (
            <span key={i} className="block h-0.5 w-6 transition-all duration-300" style={{
              background: "oklch(0.945 0.018 78)",
              transform: i === 0 && menuOpen ? "translateY(8px) rotate(45deg)" : i === 2 && menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
              opacity: i === 1 && menuOpen ? 0 : 1,
            }} />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t" style={{ background: "oklch(0.28 0.01 60)", borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <div className="container py-6 flex flex-col gap-5">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} onClick={close} className="font-label text-sm tracking-widest uppercase hover:opacity-60" style={{ color: "oklch(0.945 0.018 78)" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Dealers Page ──────────────────────────────────────────────────────────────────
function Dealers() {
  const [filter, setFilter] = useState<Territory>("ALL");
  const [selected, setSelected] = useState<number | null>(null);
  // Store markers keyed by dealer id so we can show/hide them on filter change
  const markersRef = useRef<Map<number, google.maps.Marker>>(new Map());
  const mapRef = useRef<google.maps.Map | null>(null);

  const filtered = filter === "ALL" ? DEALERS : DEALERS.filter(d => d.territory === filter);
  const selectedDealer = selected !== null ? DEALERS.find(d => d.id === selected) : null;

  // When filter changes, show/hide markers on the map
  useEffect(() => {
    if (!MAPS_INTERACTIVE_ENABLED) {
      return;
    }
    if (!window.google?.maps) {
      return;
    }
    markersRef.current.forEach((marker: google.maps.Marker, id: number) => {
      const dealer = DEALERS.find(d => d.id === id);
      if (!dealer) return;
      const visible = filter === "ALL" || dealer.territory === filter;
      marker.setVisible(visible);
    });
    // Refit bounds to visible markers
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach((_marker: google.maps.Marker, id: number) => {
        const dealer = DEALERS.find(d => d.id === id);
        if (!dealer) return;
        if (filter === "ALL" || dealer.territory === filter) {
          bounds.extend({ lat: dealer.lat, lng: dealer.lng });
        }
      });
      if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
    }
  }, [filter]);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    if (!MAPS_INTERACTIVE_ENABLED) {
      return;
    }
    if (!window.google?.maps) {
      return;
    }
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();
    const infoWindow = new window.google.maps.InfoWindow();

    DEALERS.forEach(dealer => {
      const color = TERRITORY_COLORS[dealer.territory] ?? "#888";
      const hexColor = dealer.territory === "TX" ? "#c2692a" : dealer.territory === "AR" ? "#3a6e3a" : "#555";
      const marker = new window.google.maps.Marker({
        position: { lat: dealer.lat, lng: dealer.lng },
        map,
        title: dealer.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: hexColor,
          fillOpacity: 0.9,
          strokeColor: "#fff",
          strokeWeight: 1.5,
        },
      });

      markersRef.current.set(dealer.id, marker);
      bounds.extend({ lat: dealer.lat, lng: dealer.lng });

      marker.addListener("click", () => {
        setSelected(dealer.id);
        infoWindow.setContent(`
          <div style="font-family: 'IBM Plex Mono', monospace; padding: 8px; max-width: 220px;">
            <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: ${color}; margin-bottom: 4px;">${dealer.territory} · ${dealer.city}</div>
            <div style="font-size: 13px; font-weight: 600; color: #1a1208; margin-bottom: 4px;">${dealer.name}</div>
            <div style="font-size: 11px; color: #6b5e4a;">${dealer.phone}</div>
            <a href="https://${dealer.website}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: ${color}; text-decoration: none; display: block; margin-top: 4px;">${dealer.website} →</a>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    });

    map.fitBounds(bounds);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      {/* Nav */}
      <DealersNav />

      {/* Header */}
      <div className="pt-28 pb-10 container">
        <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>Territory Network</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
          Find a <em className="italic" style={{ color: "oklch(0.72 0.14 65)" }}>Dealer.</em>
        </h1>
        <p className="font-mono-custom text-sm max-w-xl" style={{ color: "oklch(0.52 0.04 65)" }}>
          51 premium shops across Texas, Oklahoma, and Arkansas. All carry the brands that understand what titanium means.
        </p>

        {/* Territory Filter */}
        <div className="flex gap-3 mt-8">
          {(["ALL", "TX", "OK", "AR"] as Territory[]).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-200"
              style={{
                background: filter === t ? "oklch(0.52 0.12 45)" : "transparent",
                color: filter === t ? "oklch(0.945 0.018 78)" : "oklch(0.52 0.04 65)",
                border: `1px solid ${filter === t ? "oklch(0.52 0.12 45)" : "oklch(0.38 0.015 60)"}`,
              }}
            >
              {t === "ALL" ? "All Territories" : `${TERRITORY_LABELS[t]} (${DEALERS.filter(d => d.territory === t).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Map + List layout */}
      <div className="container pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map */}
          <div className="lg:w-2/3 h-[500px] lg:h-[640px] relative overflow-hidden" style={{ border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
            {MAPS_INTERACTIVE_ENABLED ? (
              <>
                <MapView
                  onMapReady={handleMapReady}
                  className="w-full h-full"
                />
                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex gap-3" style={{ background: "oklch(0.22 0.01 60 / 0.9)", padding: "8px 12px" }}>
                  {["TX", "OK", "AR"].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: t === "TX" ? "#c2692a" : t === "AR" ? "#3a6e3a" : "#555" }} />
                      <span className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.72 0.04 65)" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8" style={{ background: "oklch(0.24 0.01 60)" }}>
                <p className="font-label text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "oklch(0.52 0.12 45)" }}>
                  Interactive Map Unavailable
                </p>
                <h2 className="font-display text-2xl font-bold mb-3" style={{ color: "oklch(0.945 0.018 78)" }}>
                  Browse dealers from the list.
                </h2>
                <p className="font-mono-custom text-sm max-w-md" style={{ color: "oklch(0.52 0.04 65)" }}>
                  {IS_STATIC_SITE
                    ? "The GitHub Pages version uses static hosting, so the live map is disabled."
                    : "Map configuration is missing, so the dealer list is shown instead."}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar list */}
          <div className="lg:w-1/3 h-[500px] lg:h-[640px] overflow-y-auto" style={{ border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
            {/* Selected dealer detail */}
            {selectedDealer && (
              <div className="p-5 border-b" style={{ background: "oklch(0.28 0.01 60)", borderColor: "oklch(0.52 0.12 45 / 0.5)" }}>
                <p className="font-label text-xs tracking-[0.25em] uppercase mb-1" style={{ color: TERRITORY_COLORS[selectedDealer.territory] }}>
                  {TERRITORY_LABELS[selectedDealer.territory]} · {selectedDealer.city}
                </p>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: "oklch(0.945 0.018 78)" }}>{selectedDealer.name}</h3>
                <p className="font-mono-custom text-xs mb-1" style={{ color: "oklch(0.52 0.04 65)" }}>{selectedDealer.phone}</p>
                <p className="font-mono-custom text-xs mb-3" style={{ color: "oklch(0.52 0.04 65)" }}>{selectedDealer.brands}</p>
                <a
                  href={`https://${selectedDealer.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity"
                  style={{ color: TERRITORY_COLORS[selectedDealer.territory] }}
                >
                  {selectedDealer.website} →
                </a>
              </div>
            )}

            {/* Shop list */}
            <div>
              {filtered.map(dealer => (
                <button
                  key={dealer.id}
                  onClick={() => setSelected(dealer.id)}
                  className="w-full text-left px-5 py-4 border-b transition-all duration-150 hover:opacity-80"
                  style={{
                    background: selected === dealer.id ? "oklch(0.28 0.01 60)" : "transparent",
                    borderColor: "oklch(0.38 0.015 60 / 0.4)",
                    borderLeft: selected === dealer.id ? `3px solid ${TERRITORY_COLORS[dealer.territory]}` : "3px solid transparent",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono-custom text-sm font-medium truncate" style={{ color: "oklch(0.88 0.025 75)" }}>{dealer.name}</p>
                      <p className="font-label text-xs tracking-widest uppercase mt-0.5" style={{ color: TERRITORY_COLORS[dealer.territory] }}>
                        {dealer.city} · {dealer.territory}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: TERRITORY_COLORS[dealer.territory] }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Ian CTA */}
        <div className="mt-10 p-8 text-center" style={{ background: "oklch(0.28 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.52 0.12 45)" }}>Territory Rep · TX · OK · AR</p>
          <h2 className="font-display text-3xl font-bold mb-3" style={{ color: "oklch(0.945 0.018 78)" }}>Want to carry Moots?</h2>
          <p className="font-mono-custom text-sm mb-6" style={{ color: "oklch(0.52 0.04 65)" }}>
            Ian Zakrocki handles all dealer and individual orders across Texas, Oklahoma, and Arkansas.
          </p>
          <a
            href="mailto:ianzak@mac.com"
            className="inline-block font-label text-sm tracking-[0.2em] uppercase px-10 py-3.5 transition-all duration-300 hover:opacity-80"
            style={{ background: "oklch(0.52 0.12 45)", color: "oklch(0.945 0.018 78)" }}
          >
            Contact Ian: ianzak@mac.com · 917-578-7687
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dealers;
