import type { ReactNode } from "react";

/**
 * Plain page frame: content, then the footer at the end of the page.
 * The old "curtain" footer (footer pinned behind the page and uncovered on scroll, with a parallax
 * lift of its content) was switched off. It is in git history: see commit "Footer: bigger headline"
 * parent, or `git log -- src/components/page-frame.tsx`.
 */
export function PageFrame({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <>
      <div className="relative bg-paper">{children}</div>
      {footer}
    </>
  );
}
