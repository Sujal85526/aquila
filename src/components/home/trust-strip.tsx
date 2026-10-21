import { HandHeart, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "../reveal";

const ITEMS = [
  { icon: ShieldCheck, title: "Premium quality", sub: "Crafted to last" },
  { icon: Truck, title: "UAE wide delivery", sub: "Fast & reliable" },
  { icon: HandHeart, title: "A greater vision", sub: "People · Culture · A brighter tomorrow" },
];

export function TrustStrip() {
  return (
    <Reveal stagger={0.12} className="mx-auto grid max-w-[1480px] gap-8 bg-paper px-8 py-12 md:grid-cols-3 md:gap-0 md:px-12 md:py-14">
      {ITEMS.map(({ icon: Icon, title, sub }, i) => (
        <div key={title} className={`flex items-center gap-5 md:justify-center ${i ? "md:border-l md:border-ink/25" : ""}`}>
          <Icon size={34} strokeWidth={0.9} className="shrink-0" />
          <div>
            <p className="eyebrow text-[10.5px] font-normal tracking-[0.24em]">{title}</p>
            <p className="mt-1.5 text-[9.5px] uppercase tracking-[0.2em] text-taupe">{sub}</p>
          </div>
        </div>
      ))}
    </Reveal>
  );
}
