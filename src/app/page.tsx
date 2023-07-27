import { HeroImage } from "@/components/index/HeroImage";
import { Footer } from "@/components/index/Footer";
import { MainContentAbove } from "@/components/index/MainContentAbove";
import { MainContentBelow } from "@/components/index/MainContentBelow";

export default function Home() {
  return (
    <main>
      <HeroImage />
      <MainContentAbove />
      <MainContentBelow />
      <Footer />
    </main>
  );
}
