import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  personName: string;
  location?: string;
  organization?: string;
  imageUrl?: string;
  displayOrder: number;
}

interface DealerTestimonialsProps {
  testimonials?: Testimonial[];
  autoRotate?: boolean;
  rotateInterval?: number;
}

/**
 * Dealer Testimonials Carousel
 * 
 * Phase 1: Manual testimonial data with carousel navigation.
 * Phase 2: Will load from database via tRPC.
 */
export default function DealerTestimonials({
  testimonials = DEFAULT_TESTIMONIALS,
  autoRotate = true,
  rotateInterval = 5000,
}: DealerTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);

  useEffect(() => {
    if (!isAutoRotating || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [isAutoRotating, testimonials.length, rotateInterval]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoRotating(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoRotating(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoRotating(false);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Dealers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from Moots dealers across Texas, Oklahoma, and Arkansas about their experience with our titanium bikes.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Testimonial Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
            {/* Quote Icon */}
            <div className="mb-6">
              <Quote className="w-12 h-12 text-blue-200" />
            </div>

            {/* Quote */}
            <blockquote className="mb-8">
              <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed mb-6">
                "{current.quote}"
              </p>
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center gap-4">
              {current.imageUrl && (
                <img
                  src={current.imageUrl}
                  alt={current.personName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{current.personName}</p>
                {current.organization && (
                  <p className="text-sm text-gray-600">{current.organization}</p>
                )}
                {current.location && (
                  <p className="text-sm text-gray-500">{current.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Counter */}
          <div className="text-center mt-6 text-sm text-gray-600">
            {currentIndex + 1} / {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
}

// Phase 1: Manual testimonial data
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "tx_001",
    personName: "Marcus Chen",
    organization: "Lone Star Cycles",
    location: "Austin, TX",
    quote:
      "Moots frames have become our flagship recommendation for serious gravel riders. The titanium compliance on rough terrain is unmatched. Our customers come back specifically asking for Moots.",
    displayOrder: 1,
  },
  {
    id: "ok_001",
    personName: "Sarah Williams",
    organization: "Red Dirt Bikes",
    location: "Oklahoma City, OK",
    quote:
      "We've been selling Moots for five years. The build quality and customer support are exceptional. Our riders trust these frames for multi-day adventures.",
    displayOrder: 2,
  },
  {
    id: "ar_001",
    personName: "James Patterson",
    organization: "Ozark Mountain Cycles",
    location: "Bentonville, AR",
    quote:
      "Moots isn't just a bike—it's a lifetime investment. Our customers appreciate the warranty and the fact that these frames will outlast trends. That's what we sell.",
    displayOrder: 3,
  },
  {
    id: "tx_002",
    personName: "Elena Rodriguez",
    organization: "Hill Country Gravel",
    location: "Dripping Springs, TX",
    quote:
      "The titanium tuning options give us flexibility to recommend the perfect geometry for each rider. Moots understands that one size doesn't fit all.",
    displayOrder: 4,
  },
];
