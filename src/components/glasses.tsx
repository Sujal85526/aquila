import { useId } from "react";
import type { Product } from "@/lib/products";

/**
 * Stand-in product illustration (front view). Replace with real Aquila product photography —
 * every <Glasses> call site only needs the product's `slug` mapped to an image.
 */
const PATHS = {
  slim: {
    left: "M34 46 Q34 38 44 38 L168 40 Q186 41 184 60 L180 74 Q176 88 158 88 L62 88 Q42 88 38 72 Z",
    right: "M366 46 Q366 38 356 38 L232 40 Q214 41 216 60 L220 74 Q224 88 242 88 L338 88 Q358 88 362 72 Z",
    bridge: "M184 52 Q200 44 216 52",
    temple: [20, 44, 34, 46],
  },
  rect: {
    left: "M38 42 Q38 32 50 32 L166 34 Q188 36 186 56 L182 82 Q179 98 160 98 L66 98 Q44 98 41 78 Z",
    right: "M362 42 Q362 32 350 32 L234 34 Q212 36 214 56 L218 82 Q221 98 240 98 L334 98 Q356 98 359 78 Z",
    bridge: "M186 50 Q200 42 214 50",
    temple: [20, 40, 38, 42],
  },
  round: {
    left: "M40 58 Q40 36 74 36 L158 37 Q190 38 188 62 Q186 94 150 96 L76 96 Q40 94 40 58 Z",
    right: "M360 58 Q360 36 326 36 L242 37 Q210 38 212 62 Q214 94 250 96 L324 96 Q360 94 360 58 Z",
    bridge: "M188 52 Q200 44 212 52",
    temple: [20, 48, 40, 52],
  },
  oval: {
    left: "M36 62 Q36 36 78 36 L152 38 Q192 42 188 66 Q184 94 140 96 L76 96 Q36 94 36 62 Z",
    right: "M364 62 Q364 36 322 36 L248 38 Q208 42 212 66 Q216 94 260 96 L324 96 Q364 94 364 62 Z",
    bridge: "M188 54 Q200 48 212 54",
    temple: [20, 50, 36, 54],
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
  const s = PATHS[product.shape];
  const inset = product.shape === "slim" ? 4.5 : 6;
  return (
    <svg
      viewBox="0 0 400 130"
      role="img"
      aria-label={`${product.slug.replace("the-", "The ")} sunglasses`}
      className={className}
    >
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={product.frame} />
          <stop offset="1" stopColor={product.frameDark} />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={product.lens} />
          <stop offset="1" stopColor={product.lensDark} />
        </linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`s${id}`}>
          <stop offset="0" stopColor="#3a2c22" stopOpacity="0.32" />
          <stop offset="1" stopColor="#3a2c22" stopOpacity="0" />
        </radialGradient>
        {product.tortoise && (
          <filter id={`t${id}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="3" seed="7" />
            <feColorMatrix
              values="0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0 0.02  0 0 0 2.4 -0.95"
              result="spots"
            />
            <feComposite in="spots" in2="SourceGraphic" operator="in" />
          </filter>
        )}
        <clipPath id={`cl${id}`}>
          <path d={s.left} />
          <path d={s.right} />
        </clipPath>
      </defs>
      <ellipse cx="200" cy="112" rx="170" ry="9" fill={`url(#s${id})`} />
      {/* temples */}
      <path d={`M${s.temple[2]} ${s.temple[3]} L${s.temple[0]} ${s.temple[1] + 4}`} stroke={product.frameDark} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${400 - s.temple[2]} ${s.temple[3]} L${400 - s.temple[0]} ${s.temple[1] + 4}`} stroke={product.frameDark} strokeWidth="7" strokeLinecap="round" />
      {/* frame */}
      <g fill={`url(#f${id})`}>
        <path d={s.left} />
        <path d={s.right} />
        <path d={s.bridge} stroke={`url(#f${id})`} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {product.tortoise && (
        <g clipPath={`url(#cl${id})`}>
          <rect x="0" y="0" width="400" height="130" fill="#000" filter={`url(#t${id})`} opacity="0.85" />
        </g>
      )}
      {/* lenses */}
      <g transform={`translate(${inset} ${inset}) scale(${1 - (inset * 2) / 160})`} style={{ transformOrigin: "100px 66px" }}>
        <path d={s.left} fill={`url(#l${id})`} transform="translate(0 0)" />
      </g>
      <g transform={`translate(${-inset} ${inset}) scale(${1 - (inset * 2) / 160})`} style={{ transformOrigin: "300px 66px" }}>
        <path d={s.right} fill={`url(#l${id})`} />
      </g>
      <g clipPath={`url(#cl${id})`} opacity="0.9">
        <rect x="46" y="38" width="46" height="70" fill={`url(#g${id})`} transform="skewX(-22) translate(46 0)" />
        <rect x="246" y="38" width="46" height="70" fill={`url(#g${id})`} transform="skewX(-22) translate(60 0)" />
      </g>
      {/* temple mark */}
      <circle cx={s.temple[2] + 4} cy={s.temple[3] + 2} r="1.4" fill="#d6b27a" opacity="0.85" />
    </svg>
  );
}
