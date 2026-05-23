import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Map, Mountain, Zap } from "lucide-react";
import SharedFooter from "@/components/SharedFooter";

/**
 * Switzerland Territory Page
 * 
 * Displays curated Swiss gravel routes with verification status.
 * Phase 1: Manual route cards with verification-ready fields.
 * Phase 2: Will integrate with database and dynamic route loading.
 */

interface RouteCard {
  id: string;
  name: string;
  region: string;
  distanceKm: string;
  elevationGainM: string;
  terrainType: string;
  description: string;
  mootsInsiderTip: string;
  verificationStatus: "unverified" | "verified" | "disputed";
  sourceAttribution?: string;
}

// Phase 1: Manual route data (to be replaced with database in Phase 2)
const SWISS_ROUTES: RouteCard[] = [
  {
    id: "CH_TREMOLA",
    name: "The Tremola Climb (Gotthard Pass)",
    region: "Ticino / Central Switzerland",
    distanceKm: "12.5",
    elevationGainM: "900",
    terrainType: "Historic Granite Cobblestones",
    description: "Conquer the infamous Tremola on the Gotthard Pass. Ride ancient, rattling granite cobblestones on your premium titanium frame.",
    mootsInsiderTip: "Lower your tire pressure by 5-8 PSI below your normal gravel standard. The legendary dampening of your titanium stays will eat up the high-frequency vibrations of these historic blocks.",
    verificationStatus: "unverified",
    sourceAttribution: "Cycling Thread (to be verified)",
  },
  {
    id: "CH_JURA",
    name: "Gravel Trans Jura Range",
    region: "Baden to Nyon",
    distanceKm: "340",
    elevationGainM: "8500",
    terrainType: "Chunky Hardpack Limestone & Forest Singletrack",
    description: "Crossing the Swiss Jura range. Relentless 10%+ gradients, chunky gravel ridges, and remote, densely forested terrain.",
    mootsInsiderTip: "Water stops are incredibly scarce along the highest ridges. Pack extra bottles or a frame pump bladder inside your Moots setup.",
    verificationStatus: "unverified",
    sourceAttribution: "SwitzerlandMobility (to be verified)",
  },
  {
    id: "CH_BERNINA",
    name: "Bernina Express Route",
    region: "Graubünden",
    distanceKm: "TBD",
    elevationGainM: "TBD",
    terrainType: "Alpine Fire Roads & Glacial Moraine",
    description: "Trace the path of the world-famous UNESCO World Heritage railway from St. Moritz to the Italian border. This route delivers dramatic alpine scenery shifts.",
    mootsInsiderTip: "Rapid terrain transitions from pristine alpine fire roads to chunky, technical glacial moraine showcase a bike with massive tire clearance and smooth titanium dampening.",
    verificationStatus: "unverified",
    sourceAttribution: "Cycling Thread (to be verified)",
  },
];

export default function Switzerland() {
  const [selectedRoute, setSelectedRoute] = useState<RouteCard | null>(null);

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "disputed":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Verified</span>;
      case "disputed":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Disputed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Unverified</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Switzerland</h1>
          <p className="text-lg text-gray-300 mb-6">
            Epic alpine gravel routes where titanium frames meet high-altitude terrain.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button variant="default" size="lg">
              Explore Routes
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-slate-900">
              Join Community
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto py-12 px-4">
        {/* Verification Notice */}
        <div className="mb-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Phase 1: Verification in Progress</h3>
              <p className="text-sm text-blue-800">
                Route data is being verified against official sources (UCI Gravel World Series, SwitzerlandMobility, local race organizers). 
                Unverified routes are marked below. Phase 2 will add dynamic route loading and real-time GPX integration.
              </p>
            </div>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {SWISS_ROUTES.map((route) => (
            <Card
              key={route.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedRoute(route)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{route.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{route.region}</p>
                </div>
                {getVerificationIcon(route.verificationStatus)}
              </div>

              {/* Route Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Distance</p>
                  <p className="font-semibold">{route.distanceKm} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Elevation</p>
                  <p className="font-semibold">{route.elevationGainM} m</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Terrain</p>
                  <p className="font-semibold text-sm">{route.terrainType}</p>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="flex items-center justify-between">
                {getVerificationBadge(route.verificationStatus)}
                <Button variant="ghost" size="sm">
                  View Details →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Route Detail Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedRoute.name}</h2>
                    <p className="text-gray-600">{selectedRoute.region}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRoute(null)}
                    className="text-2xl font-bold text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded">
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Mountain className="w-4 h-4" /> Distance
                    </p>
                    <p className="font-semibold">{selectedRoute.distanceKm} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Zap className="w-4 h-4" /> Elevation
                    </p>
                    <p className="font-semibold">{selectedRoute.elevationGainM} m</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Map className="w-4 h-4" /> Terrain
                    </p>
                    <p className="font-semibold text-sm">{selectedRoute.terrainType}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Route Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedRoute.description}</p>
                </div>

                {/* Moots Insider Tip */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded">
                  <h3 className="font-semibold mb-2 text-amber-900">Moots Insider Tip</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">{selectedRoute.mootsInsiderTip}</p>
                </div>

                {/* Verification Status */}
                <div className="mb-6 p-4 bg-gray-50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    {getVerificationIcon(selectedRoute.verificationStatus)}
                    <span className="font-semibold">
                      {selectedRoute.verificationStatus === "verified"
                        ? "Verified Route"
                        : selectedRoute.verificationStatus === "disputed"
                        ? "Disputed Information"
                        : "Awaiting Verification"}
                    </span>
                  </div>
                  {selectedRoute.sourceAttribution && (
                    <p className="text-sm text-gray-600">Source: {selectedRoute.sourceAttribution}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Phase 2 will add verified GPX data and real-time route information.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <Button className="flex-1">Upload Photo from This Route</Button>
                  <Button variant="outline" className="flex-1">
                    Save Route
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      <SharedFooter showLinks={true} links={[
        { label: "Home", href: "/" },
        { label: "Community", href: "/community" },
        { label: "Dealers", href: "/dealers" },
      ]} />
    </div>
  );
}