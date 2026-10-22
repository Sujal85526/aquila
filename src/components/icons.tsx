export function InstagramIcon({ size = 24, strokeWidth = 1, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Header icons redrawn from the brand-deck mockup (thin line, round caps). */
type IconProps = { size?: number; strokeWidth?: number; className?: string };
const base = (size: number, strokeWidth: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export function SearchIcon({ size = 22, strokeWidth = 1.3, className }: IconProps) {
  return (
    <svg {...base(size, strokeWidth, className)}>
      <circle cx="10.2" cy="10.2" r="7.2" />
      <path d="M15.6 15.6 21 21" />
    </svg>
  );
}

export function AccountIcon({ size = 22, strokeWidth = 1.3, className }: IconProps) {
  return (
    <svg {...base(size, strokeWidth, className)}>
      <circle cx="12" cy="7.6" r="3.9" />
      <path d="M4 20.6v-.9c0-2.7 3.6-4.6 8-4.6s8 1.9 8 4.6v.9H4Z" />
    </svg>
  );
}

export function BagIcon({ size = 22, strokeWidth = 1.3, className }: IconProps) {
  return (
    <svg {...base(size, strokeWidth, className)}>
      <path d="M5.4 8.4h13.2l1 12.1c.05.6-.4 1.1-1 1.1H5.4c-.6 0-1.05-.5-1-1.1l1-12.1Z" />
      <path d="M8.9 8.4V6.6a3.1 3.1 0 0 1 6.2 0v1.8" />
    </svg>
  );
}
