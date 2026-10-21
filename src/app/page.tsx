import { Hero } from "@/components/home/hero";
import { Collection } from "@/components/home/collection";
import { StoryPanels } from "@/components/home/story-panels";
import { TrustStrip } from "@/components/home/trust-strip";

export default function Home() {
  return (
    <>
      <Hero />
      <Collection />
      <StoryPanels />
      <TrustStrip />
    </>
  );
}
