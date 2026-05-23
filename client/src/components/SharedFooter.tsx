import { Link } from "wouter";
import NewsletterSignup from "@/components/NewsletterSignup";

interface SharedFooterProps {
  showLinks?: boolean;
  links?: Array<{ label: string; href: string }>;
}

/**
 * Shared Footer Component
 * 
 * Reusable footer with newsletter signup, contact info, and optional navigation links.
 * Used across all pages: Home, Community, Engineering, Dealers, BuildConfigurator, Switzerland, Comparison
 */
export default function SharedFooter({ showLinks = true, links = [] }: SharedFooterProps) {
  function GrainOverlay({ opacity = 0.15 }: { opacity?: number }) {
    return (
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity,
          mixBlendMode: "multiply",
        }}
      />
    );
  }

  return (
    <footer className="py-12 relative overflow-hidden" style={{ background: "oklch(0.15 0.006 60)" }}>
      <GrainOverlay opacity={0.15} />
      <div className="container relative z-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <Link href="/">
              <p className="font-display text-2xl font-bold mb-1 cursor-pointer hover:opacity-80" style={{ color: "oklch(0.945 0.018 78)" }}>Moots</p>
            </Link>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>Handbuilt in Steamboat Springs, CO since 1981</p>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-1">
            <NewsletterSignup variant="footer" />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-1 text-right">
            <p className="font-label text-xs tracking-widest uppercase" style={{ color: "oklch(0.52 0.12 45)" }}>Territory Rep · TX · OK · AR · CH</p>
            <a href="mailto:ianzak@mac.com" className="font-mono-custom text-sm hover:underline" style={{ color: "oklch(0.88 0.025 75)" }}>
              ianzak@mac.com
            </a>
            <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>917-578-7687</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "oklch(0.38 0.015 60 / 0.4)" }}>
          <p className="font-mono-custom text-xs" style={{ color: "oklch(0.38 0.015 60)" }}>© 2026 Moots Bicycle. The Forever Frame Campaign.</p>
          
          {/* Navigation Links */}
          {showLinks && links.length > 0 && (
            <div className="flex gap-6">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="font-mono-custom text-xs hover:underline cursor-pointer" style={{ color: "oklch(0.38 0.015 60)" }}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
