import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface NewsletterSignupProps {
  variant?: "footer" | "modal" | "inline";
  onSuccess?: () => void;
}

/**
 * Newsletter Signup Component
 * 
 * Phase 2: Wired to trpc.newsletter.subscribe procedure
 * Captures email and territory, stores in newsletter_subscribers table
 */
export default function NewsletterSignup({ variant = "footer", onSuccess }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [region, setRegion] = useState("ALL");
  const [submitted, setSubmitted] = useState(false);

  // Use tRPC mutation hook
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Successfully subscribed! Check your email for updates.");
      setEmail("");
      setFirstName("");
      setRegion("ALL");
      onSuccess?.();
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    },
    onError: (error) => {
      console.error("Newsletter subscription error:", error);
      if (error.message.includes("already subscribed")) {
        toast.info("You're already subscribed!");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    subscribeMutation.mutate({
      email,
      territory: region as any,
    });
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
              disabled={subscribeMutation.isPending}
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
              disabled={subscribeMutation.isPending}
              className="text-sm"
            />
          </div>

          <div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={subscribeMutation.isPending}
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
              disabled={subscribeMutation.isPending}
              className="w-full"
              size="sm"
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
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
              disabled={subscribeMutation.isPending}
              required
            />

            <Input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={subscribeMutation.isPending}
            />

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={subscribeMutation.isPending}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="ALL">All Regions</option>
              <option value="TX">Texas</option>
              <option value="OK">Oklahoma</option>
              <option value="AR">Arkansas</option>
              <option value="CH">Switzerland</option>
            </select>

            <Button type="submit" disabled={subscribeMutation.isPending} className="w-full">
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
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
        disabled={subscribeMutation.isPending || submitted}
        className="flex-1"
      />
      <Button
        onClick={(e) => handleSubmit(e as any)}
        disabled={subscribeMutation.isPending || submitted}
        size="sm"
      >
        {submitted ? <Check className="w-4 h-4" /> : "Subscribe"}
      </Button>
    </div>
  );
}
