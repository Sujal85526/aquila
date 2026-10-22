import { ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "../reveal";

/** Open hand holding a sprout, matching the "A greater vision" icon in the deck mockup. */
function HandSprout({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
      <path d="M18 17v-6" />
      <path d="M18 14c0-3.2-2-5-5-5 0 3.2 2 5 5 5Z" />
      <path d="M18 12c0-3.2 2-5.2 5.2-5.2 0 3.2-2 5.2-5.2 5.2Z" />
      <path d="M3 24.5h5.5l5.2 2.4h6.1c1.3 0 1.9 1.7.7 2.3l-4.4 2.2" />
      <path d="M8.5 24.5l9.2-3.1c2.3-.8 5.6.2 6.9 2.1L33 22.8" />
      <path d="M13.7 26.9l-.9 1.9H3" />
    </svg>
  );
}

const ITEMS = [
  { icon: <ShieldCheck size={36} strokeWidth={0.9} className="shrink-0" />, title: "Premium quality", sub: "Crafted to last" },
  { icon: <Truck size={36} strokeWidth={0.9} className="shrink-0" />, title: "UAE wide delivery", sub: "Fast & reliable" },
  { icon: <HandSprout />, title: "A greater vision", sub: "People · Culture · A brighter tomorrow" },
];

export function TrustStrip() {
  return (
    <Reveal stagger={0.12} className="grid gap-7 bg-paper px-8 py-10 md:grid-cols-3 md:gap-0 md:px-[3vw] md:py-[1.9vw]">
      {ITEMS.map(({ icon, title, sub }, i) => (
        <div key={title} className={`flex items-center gap-5 md:justify-center ${i ? "md:border-l md:border-ink/20" : ""}`}>
          {icon}
          <div>
            <p className="eyebrow text-[10px] font-normal tracking-[0.2em] md:text-[clamp(9px,0.78vw,13px)]">{title}</p>
            <p className="mt-1.5 text-[8.5px] uppercase tracking-[0.2em] text-taupe md:text-[clamp(7px,0.6vw,10px)]">{sub}</p>
          </div>
        </div>
      ))}
    </Reveal>
  );
}
