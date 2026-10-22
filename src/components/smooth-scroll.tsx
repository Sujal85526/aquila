"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, Suspense, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    if (prefersReducedMotion()) return () => window.removeEventListener("load", refresh);
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, syncTouch: false });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Lenis only exists in the browser, so it is created here and then shared through context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <Suspense fallback={null}>
        <RouteReset lenis={lenis} />
      </Suspense>
      {children}
    </LenisContext.Provider>
  );
}

/** New page: jump to the top before paint, and reset Lenis' own scroll target too. */
function RouteReset({ lenis }: { lenis: Lenis | null }) {
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    requestAnimationFrame(() => {
      lenis?.resize();
      ScrollTrigger.refresh();
    });
  }, [pathname, lenis]);
  return null;
}
