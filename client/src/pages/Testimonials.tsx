import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Quote } from "lucide-react";

const TERRITORIES = [
  { value: "ALL", label: "All Territories" },
  { value: "TX", label: "Texas" },
  { value: "OK", label: "Oklahoma" },
  { value: "AR", label: "Arkansas" },
];

export default function Testimonials() {
  const [selectedTerritory, setSelectedTerritory] = useState<"TX" | "OK" | "AR" | "ALL">("ALL");

  // Fetch verified testimonials
  const query = trpc.testimonials.listPublic.useQuery({
    territory: selectedTerritory,
  });
  const testimonials = query.data || [];
  const isLoading = query.isLoading;

  const handleTerritoryChange = (territory: "TX" | "OK" | "AR" | "ALL") => {
    setSelectedTerritory(territory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dealer & Rider Testimonials
          </h1>
          <p className="text-lg text-gray-600">
            Hear from the community about their Moots experiences across Texas, Oklahoma, and Arkansas.
          </p>
        </div>
      </section>

      {/* Territory Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {TERRITORIES.map((territory) => (
              <Button
                key={territory.value}
                variant={selectedTerritory === territory.value ? "default" : "outline"}
                onClick={() => handleTerritoryChange(territory.value as any)}
                className="transition-all"
              >
                {territory.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : query.error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">
                Failed to load testimonials. Please try again.
              </p>
              <Button onClick={() => query.refetch()} variant="outline">
                Retry
              </Button>
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial: any) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{testimonial.personName}</CardTitle>
                        <CardDescription>
                          {testimonial.context && (
                            <>
                              <span className="font-medium">{testimonial.context}</span>
                              {" at "}
                            </>
                          )}
                          <span className="font-medium">{testimonial.dealerName}</span>
                        </CardDescription>
                      </div>
                      <Quote className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {testimonial.territory === "TX" && "Texas"}
                        {testimonial.territory === "OK" && "Oklahoma"}
                        {testimonial.territory === "AR" && "Arkansas"}
                      </span>
                      <span className="text-gray-500">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No testimonials available for the selected territory yet.
              </p>
              <p className="text-gray-400 mt-2">
                Check back soon to see what dealers and riders are saying about Moots.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Share Your Moots Story
          </h2>
          <p className="text-gray-600 mb-6">
            Have a testimonial about your Moots experience? We'd love to hear from you.
          </p>
          <Button size="lg" asChild>
            <a href="mailto:ianzak@mac.com?subject=Moots%20Testimonial">
              Submit Your Testimonial
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
