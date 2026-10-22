declare global {
  interface Window {
    __aqReady?: boolean;
  }
}

export const READY_EVENT = "aquila:ready";

/** Runs `cb` once the intro loader has lifted (immediately if it already has). Returns a cleanup. */
export function whenReady(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.__aqReady) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener(READY_EVENT, h, { once: true });
  return () => window.removeEventListener(READY_EVENT, h);
}

export function markReady() {
  window.__aqReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}
