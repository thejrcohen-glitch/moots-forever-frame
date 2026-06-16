import { Link } from "wouter";

const SIGNAL = {
  label: "On the Wheel",
  title: "SBT GRVL",
  href: "/#featured-signal",
};

function WheelMark() {
  const spokes = Array.from({ length: 12 }, (_, index) => index * 30);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-8 w-8 shrink-0"
      fill="none"
    >
      <circle cx="24" cy="24" r="19" stroke="oklch(0.72 0.14 65)" strokeWidth="2" />
      <circle cx="24" cy="24" r="15" stroke="oklch(0.42 0.02 62)" strokeWidth="1" />
      {spokes.map((angle) => (
        <line
          key={angle}
          x1="24"
          y1="24"
          x2="24"
          y2="7"
          stroke="oklch(0.88 0.025 75 / 0.58)"
          strokeWidth="1"
          transform={`rotate(${angle} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="4" fill="oklch(0.72 0.14 65)" />
      <circle cx="24" cy="24" r="2" fill="oklch(0.22 0.01 60)" />
    </svg>
  );
}

export default function OnTheWheelBadge({ className = "" }: { className?: string }) {
  return (
    <Link
      href={SIGNAL.href}
      className={`group inline-flex items-center gap-2.5 rounded-none px-3 py-2 transition-opacity hover:opacity-80 focus:outline focus:outline-2 focus:outline-offset-4 ${className}`}
      style={{
        background: "oklch(0.24 0.01 60)",
        border: "1px solid oklch(0.38 0.015 60 / 0.65)",
      }}
      aria-label="View featured signal: SBT GRVL"
    >
      <WheelMark />
      <span className="flex flex-col leading-none">
        <span
          className="font-label text-[0.62rem] tracking-[0.24em] uppercase"
          style={{ color: "oklch(0.72 0.14 65)" }}
        >
          {SIGNAL.label}
        </span>
        <span
          className="font-display text-sm font-bold tracking-normal mt-1"
          style={{ color: "oklch(0.945 0.018 78)" }}
        >
          {SIGNAL.title}
        </span>
      </span>
    </Link>
  );
}
