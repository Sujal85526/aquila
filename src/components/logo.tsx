export function Logo({ className = "w-[112px] md:w-[128px]" }: { className?: string }) {
  return <span role="img" aria-label="AQUILA" className={`aq-logo ${className}`} />;
}
