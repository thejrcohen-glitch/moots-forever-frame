import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface BikeModel {
  id: string;
  modelId: string;
  name: string;
  category: "gravel" | "adventure" | "legacy";
  description: string;
  useCase: string;
  terrainFocus: string;
  keyFeatures: string[];
  priceUsd?: string;
  imageUrl?: string;
}

interface BikeModelsShowcaseProps {
  models?: BikeModel[];
  title?: string;
  description?: string;
}

/**
 * Bike Models Showcase Component
 * 
 * Phase 1: Manual bike model data with category filtering.
 * Phase 2: Will load from database via tRPC.
 */
export default function BikeModelsShowcase({
  models = DEFAULT_MODELS,
  title = "Moots Bike Models",
  description = "Explore our complete lineup of titanium gravel and adventure bikes.",
}: BikeModelsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(models.map((m) => m.category)));

  const filteredModels = selectedCategory
    ? models.filter((m) => m.category === selectedCategory)
    : models;

  return (
    <div className="py-12 px-4 bg-white">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">{description}</p>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              All Models
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              {/* Image */}
              {model.imageUrl && (
                <div className="aspect-square overflow-hidden bg-gray-200">
                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{model.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                      {model.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{model.useCase}</p>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 flex-1">{model.description}</p>

                {/* Terrain Focus */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Terrain Focus</p>
                  <p className="text-sm text-gray-700">{model.terrainFocus}</p>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Key Features</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {model.keyFeatures.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto pt-4 border-t">
                  {model.priceUsd && (
                    <p className="text-lg font-bold mb-3">
                      ${model.priceUsd}
                    </p>
                  )}
                  <Button className="w-full" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Result Count */}
        <div className="text-center mt-8 text-sm text-gray-600">
          Showing {filteredModels.length} of {models.length} models
        </div>
      </div>
    </div>
  );
}

// Phase 1: Official Moots bike models
const DEFAULT_MODELS: BikeModel[] = [
  {
    id: "model_001",
    modelId: "routt_45",
    name: "Routt 45",
    category: "gravel",
    description:
      "The versatile all-rounder. Balanced geometry for mixed terrain, from smooth gravel to technical singletrack.",
    useCase: "Gravel riding, bikepacking, mixed terrain",
    terrainFocus: "Mixed surface gravel, light singletrack",
    keyFeatures: [
      "Titanium frame for durability and compliance",
      "Geometry optimized for 45mm tire clearance",
      "Smooth ride quality on rough terrain",
    ],
    priceUsd: "3,200",
  },
  {
    id: "model_002",
    modelId: "routt_rsl",
    name: "Routt RSL",
    category: "gravel",
    description:
      "Race-focused geometry with responsive handling. Built for speed on gravel without sacrificing comfort.",
    useCase: "Gravel racing, fast group rides, aggressive riding",
    terrainFocus: "Fast gravel, hardpack, limestone",
    keyFeatures: [
      "Lightweight titanium construction",
      "Aggressive geometry for racing",
      "Responsive handling and acceleration",
    ],
    priceUsd: "3,400",
  },
  {
    id: "model_003",
    modelId: "vamoots_rsl",
    name: "Vamoots RSL",
    category: "adventure",
    description:
      "Extended reach and relaxed geometry for all-day comfort. Perfect for bikepacking and long-distance adventures.",
    useCase: "Bikepacking, long-distance touring, adventure riding",
    terrainFocus: "Mixed terrain, high-altitude alpine, technical descents",
    keyFeatures: [
      "Relaxed geometry for comfort on long rides",
      "Increased tire clearance for adventure tires",
      "Titanium compliance for rough terrain",
    ],
    priceUsd: "3,600",
  },
  {
    id: "model_004",
    modelId: "routt_esc",
    name: "Routt ESC",
    category: "adventure",
    description:
      "Extended seatstay cluster for maximum tire clearance. Built for monster cross and aggressive terrain.",
    useCase: "Monster cross, extreme gravel, technical singletrack",
    terrainFocus: "Chunky gravel, technical terrain, rocky descents",
    keyFeatures: [
      "50mm+ tire clearance",
      "Aggressive geometry with extended reach",
      "Titanium durability for rough terrain",
    ],
    priceUsd: "3,700",
  },
  {
    id: "model_005",
    modelId: "routt_legacy",
    name: "Routt Legacy",
    category: "legacy",
    description:
      "The original Moots gravel frame. A timeless design that defined the category and continues to inspire.",
    useCase: "Gravel riding, mixed terrain, collector's item",
    terrainFocus: "Mixed surface gravel, general purpose",
    keyFeatures: [
      "Iconic geometry and design",
      "Proven performance over decades",
      "Titanium durability for life",
    ],
    priceUsd: "2,800",
  },
  {
    id: "model_006",
    modelId: "vamoots_legacy",
    name: "Vamoots Legacy",
    category: "legacy",
    description:
      "The original adventure frame. Built for touring and long-distance riding with timeless appeal.",
    useCase: "Touring, bikepacking, long-distance riding",
    terrainFocus: "Mixed terrain, touring, general purpose",
    keyFeatures: [
      "Proven touring geometry",
      "Comfortable for all-day riding",
      "Titanium reliability",
    ],
    priceUsd: "3,000",
  },
];
