import { useId } from "react";
import type { Product } from "@/lib/products";

/**
 * Stand-in product illustration (front view) until real Aquila product photography is supplied.
 * Frames are drawn as thick strokes around the lens shapes so they read like polished acetate.
 */
const SHAPES = {
  slim: {
    l: "M46 48 Q46 41 54 41 L166 42 Q180 43 179 58 L175 74 Q172 86 158 86 L68 86 Q52 86 49 72 Z",
    bar: 8, bridge: 5, temple: 7,
  },
  rect: {
    l: "M46 44 Q46 36 56 36 L166 37 Q182 38 181 55 L177 80 Q174 94 160 94 L68 94 Q52 94 49 78 Z",
    bar: 12, bridge: 8, temple: 9,
  },
  round: {
    l: "M46 60 Q46 38 76 38 L156 39 Q182 40 181 62 Q179 90 152 92 L76 92 Q46 90 46 60 Z",
    bar: 12, bridge: 9, temple: 9,
  },
  oval: {
    l: "M44 62 Q44 38 80 38 L152 40 Q184 44 181 66 Q177 92 140 93 L78 93 Q44 91 44 62 Z",
    bar: 11, bridge: 8, temple: 8,
  },
} as const;

export function Glasses({
  product,
  className,
}: {
  product: Pick<Product, "shape" | "frame" | "frameDark" | "lens" | "lensDark" | "tortoise" | "slug">;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const s = SHAPES[product.shape];
  const right = `translate(400 0) scale(-1 1)`;
  const lensPath = <path d={s.l} />;
  return (
    <svg viewBox="0 0 400 130" role="img" aria-label={`${product.slug.replace("the-", "The ")} sunglasses`} className={className}>
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={product.frame} />
          <stop offset="1" stopColor={product.frameDark} />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={product.lens} />
          <stop offset="1" stopColor={product.lensDark} />
        </linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.26" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`s${id}`}>
          <stop offset="0" stopColor="#3a2c22" stopOpacity="0.3" />
          <stop offset="1" stopColor="#3a2c22" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`c${id}`}>
          <path d={s.l} />
          <path d={s.l} transform={right} />
        </clipPath>
        {product.tortoise && (
          <filter id={`t${id}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.09" numOctaves="3" seed="11" result="n" />
            <feColorMatrix in="n" values="0 0 0 0 0.09  0 0 0 0 0.03  0 0 0 0 0.01  0 0 0 3.2 -1.35" result="spots" />
            <feComposite in="spots" in2="SourceAlpha" operator="in" />
          </filter>
        )}
      </defs>

      <ellipse cx="200" cy="112" rx="165" ry="6" fill={`url(#s${id})`} />

      <g transform="translate(0 -23 ) scale(1 1.35)">
      {/* temples */}
      <g stroke={product.frameDark} strokeWidth={s.temple} strokeLinecap="round" fill="none">
        <path d="M48 48 L24 54" />
        <path d="M352 48 L376 54" />
      </g>

      {/* lenses */}
      {[0, 1].map((k) => (
        <g key={k} transform={k ? right : undefined}>
          <g fill={`url(#l${id})`}>{lensPath}</g>
        </g>
      ))}
      <g clipPath={`url(#c${id})`}>
        <rect x="70" y="20" width="40" height="90" fill={`url(#g${id})`} transform="skewX(-20) translate(40 0)" />
        <rect x="250" y="20" width="40" height="90" fill={`url(#g${id})`} transform="skewX(-20) translate(40 0)" />
      </g>

      {/* frame */}
      <g fill="none" stroke={`url(#f${id})`} strokeLinejoin="round" strokeLinecap="round">
        {[0, 1].map((k) => (
          <path key={k} d={s.l} strokeWidth={s.bar} transform={k ? right : undefined} />
        ))}
        <path d="M181 50 Q200 42 219 50" strokeWidth={s.bridge} />
      </g>
      {product.tortoise && (
        <g fill="none" stroke="#000" strokeLinejoin="round" strokeLinecap="round" filter={`url(#t${id})`}>
          {[0, 1].map((k) => (
            <path key={k} d={s.l} strokeWidth={s.bar} transform={k ? right : undefined} />
          ))}
          <path d="M181 50 Q200 42 219 50" strokeWidth={s.bridge} />
        </g>
      )}
      {/* frame highlight */}
      <g fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="1.4" strokeLinecap="round">
        <path d="M58 37 L160 38" transform="translate(0 -1)" />
        <path d="M240 38 L342 37" transform="translate(0 -1)" />
      </g>
      <circle cx="42" cy="53" r="1.3" fill="#d9b787" opacity="0.8" />
      <circle cx="358" cy="53" r="1.3" fill="#d9b787" opacity="0.8" />
      </g>
    </svg>
  );
}
