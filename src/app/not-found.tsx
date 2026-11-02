import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-paper px-6 pt-[var(--header-h)] text-center">
      <div>
        <p className="eyebrow text-taupe">404</p>
        <h1 className="display mt-4 text-[clamp(36px,6vw,64px)]">Out of sight.</h1>
        <Link href="/" className="btn-outline mt-8 text-espresso"><span>Back home</span></Link>
      </div>
    </div>
  );
}
