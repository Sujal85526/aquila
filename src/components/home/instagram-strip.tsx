import Image from "next/image";
import { CONTACT } from "@/lib/products";
import { InstagramIcon } from "../icons";
import { Reveal, SplitHeading } from "../motion";

const FEED = [
  { src: "/photos/DSC00403.jpg", pos: "50% 30%" },
  { src: "/deck/story-1c.jpg", pos: "62% 50%" },
  { src: "/photos/DSC00436.jpg", pos: "62% 30%" },
  { src: "/deck/story-2c.jpg", pos: "78% 50%" },
  { src: "/photos/DSC00712.jpg", pos: "66% 35%" },
  { src: "/photos/DSC00361.jpg", pos: "28% 40%" },
];

/** Follow strip: handle as the heading, a follow link, and a row of square photos that open Instagram. */
export function InstagramStrip() {
  return (
    <section className="bg-paper py-20 md:py-32" aria-labelledby="ig-title">
      <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-end md:px-12">
        <div>
          <p className="eyebrow text-ink/45">Follow Aquila</p>
          <SplitHeading as="h2" className="mt-4 font-serif text-[clamp(34px,5vw,64px)] uppercase leading-none tracking-[0.02em] text-ink">
            <span id="ig-title">{CONTACT.instagramHandle}</span>
          </SplitHeading>
        </div>
        <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" data-cursor="Follow" className="eyebrow link-underline flex items-center gap-2.5 pb-1 text-ink">
          <InstagramIcon size={16} strokeWidth={1.2} /> Follow on Instagram
        </a>
      </div>
      <Reveal stagger={0.06} className="mx-auto mt-10 grid max-w-[1480px] grid-cols-3 gap-2 px-6 md:mt-12 md:gap-3 md:px-12 lg:grid-cols-6">
        {FEED.map((f) => (
          <a key={f.src} href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" data-cursor="View" aria-label="Aquila on Instagram" className="group relative block aspect-square overflow-hidden bg-cocoa">
            <Image
              src={f.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 16vw, 33vw"
              className="object-cover transition duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:opacity-80"
              style={{ objectPosition: f.pos }}
            />
          </a>
        ))}
      </Reveal>
    </section>
  );
}
