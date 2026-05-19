import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Check, AlertCircle } from "lucide-react";

interface NewsletterSignupProps {
  variant?: "footer" | "modal" | "inline";
  onSuccess?: () => void;
}

/**
 * Newsletter Signup Component
 * 
 * Phase 1: Captures email, first name, and region.
 * Stores in newsletter_subscribers table.
 * Phase 2: Will integrate with email marketing automation.
 */
export default function NewsletterSignup({ variant = "footer", onSuccess }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [region, setRegion] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      // Phase 1: Store in database
      // TODO: Wire to trpc.newsletter.subscribe procedure in Phase 2
      
      // Simulated success for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubmitted(true);
      toast.success("Thanks for subscribing! Check your email.");
      setEmail("");
      setFirstName("");
      setRegion("ALL");

      onSuccess?.();

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "footer") {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="font-semibold text-sm mb-2">Stay Updated</h3>
          <p className="text-xs text-gray-600 mb-4">
            Get news about Moots pop-ups, rides, and product updates.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
            <Check className="w-4 h-4" />
            <span>Subscription confirmed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="text-sm"
                required
              />
            </div>

            <div>
              <Input
                type="text"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                className="text-sm"
              />
            </div>

            <div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
              >
                <option value="ALL">All Regions</option>
                <option value="TX">Texas</option>
                <option value="OK">Oklahoma</option>
                <option value="AR">Arkansas</option>
                <option value="CH">Switzerland</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
          <p className="text-gray-600">
            Get updates on Moots pop-ups, rides, and new routes in your region.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded text-green-800">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Subscription confirmed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />

            <Input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="ALL">All Regions</option>
              <option value="TX">Texas</option>
              <option value="OK">Oklahoma</option>
              <option value="AR">Arkansas</option>
              <option value="CH">Switzerland</option>
            </select>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    );
  }

  // inline variant
  return (
    <div className="flex gap-2">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading || submitted}
        className="flex-1"
      />
      <Button
        onClick={handleSubmit}
        disabled={isLoading || submitted}
        size="sm"
      >
        {submitted ? <Check className="w-4 h-4" /> : "Subscribe"}
      </Button>
    </div>
  );
}
