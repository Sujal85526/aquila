import { Hero } from "@/components/home/hero";
import { Collection } from "@/components/home/collection";
import { StoryPanels } from "@/components/home/story-panels";
import { TrustStrip } from "@/components/home/trust-strip";
import { InstagramStrip } from "@/components/home/instagram-strip";

export default function Home() {
  return (
    <>
      {/* Curtain reveal: the hero stays pinned while the rest of the page slides up over it. */}
      <div className="sticky top-0 z-0">
        <Hero />
      </div>
      <div className="relative z-10 bg-paper shadow-[0_-24px_48px_-12px_rgba(20,14,10,0.45)]">
        <Collection />
        <StoryPanels />
        <TrustStrip />
        <InstagramStrip />
      </div>
    </>
  );
}
