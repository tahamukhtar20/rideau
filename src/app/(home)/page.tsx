import { HeroImage } from "@/components/home/server/HeroImage";
import { Footer } from "@/components/home/server/Footer";
import { MainContentAbove } from "@/components/home/server/MainContentAbove";
import { MainContentBelow } from "@/components/home/server/MainContentBelow";

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
