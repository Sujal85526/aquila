import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** Standard inner-page wrapper that clears the fixed header. */
export function PageShell({ eyebrow, title, children, narrow }: { eyebrow?: string; title: ReactNode; children: ReactNode; narrow?: boolean }) {
  return (
    <div className="px-6 pb-24 pt-[calc(var(--header-h)+56px)] md:px-12 md:pt-[calc(var(--header-h)+80px)]">
      <div className={`mx-auto ${narrow ? "max-w-3xl" : "max-w-[1480px]"}`}>
        <Reveal className="mb-12 md:mb-16">
          {eyebrow && <p className="eyebrow text-taupe">{eyebrow}</p>}
          <h1 className="display mt-4 text-[clamp(38px,6vw,72px)]">{title}</h1>
        </Reveal>
        {children}
      </div>
    </div>
  );
}
