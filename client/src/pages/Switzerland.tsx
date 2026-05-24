import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Mountain, Bike } from "lucide-react";

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
];

export default function Switzerland() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "moderate" | "hard" | null>(null);

  // Fetch verified routes
  const { data: routes, isLoading } = trpc.swissRoutes.listPublic.useQuery({
    difficulty: selectedDifficulty || undefined,
  });

  const handleDifficultyChange = (difficulty: "easy" | "moderate" | "hard" | null) => {
    setSelectedDifficulty(difficulty);
  };

  const filteredRoutes = routes || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Swiss Gravel Routes
          </h1>
          <p className="text-lg text-gray-600">
            Verified routes across Switzerland perfect for Moots titanium gravel bikes.
          </p>
        </div>
      </section>

      {/* Difficulty Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-gray-700 mb-3">Filter by difficulty:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDifficulty === null ? "default" : "outline"}
              onClick={() => handleDifficultyChange(null)}
              className="transition-all"
            >
              All Difficulties
            </Button>
            {DIFFICULTIES.map((difficulty) => (
              <Button
                key={difficulty.value}
                variant={selectedDifficulty === difficulty.value ? "default" : "outline"}
                onClick={() => handleDifficultyChange(difficulty.value as any)}
                className="transition-all"
              >
                {difficulty.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredRoutes && filteredRoutes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredRoutes.map((route: any) => (
                <Card key={route.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {route.description}
                        </CardDescription>
                      </div>
                      <Mountain className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Route Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600 font-medium">Distance</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {route.distance} km
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600 font-medium">Elevation</p>
                          <p className="text-lg font-semibold text-gray-900">
                            +{route.elevationGain} m
                          </p>
                        </div>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                          {route.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">
                          Verified
                        </span>
                      </div>

                      {/* Bike Models */}
                      {route.bikeModels && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600 font-medium mb-2 flex items-center gap-1">
                            <Bike className="w-3 h-3" /> Recommended Models
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {JSON.parse(route.bikeModels || "[]").map((model: string) => (
                              <span
                                key={model}
                                className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
                              >
                                {model}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Route Link */}
                      {route.routeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full mt-3"
                        >
                          <a href={route.routeUrl} target="_blank" rel="noopener noreferrer">
                            <MapPin className="w-4 h-4 mr-2" />
                            View on Map
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No routes available for the selected difficulty level.
              </p>
              <p className="text-gray-400 mt-2">
                Check back soon for more verified Swiss gravel routes.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Know a Great Swiss Route?
          </h2>
          <p className="text-gray-600 mb-6">
            Submit your favorite gravel route for verification and inclusion on our map.
          </p>
          <Button size="lg" asChild>
            <a href="mailto:ianzak@mac.com?subject=Swiss%20Route%20Submission">
              Submit a Route
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
