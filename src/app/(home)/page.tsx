import { HeroImage } from "@/components/home/server/HeroImage";
import { MainContentAbove } from "@/components/home/server/MainContentAbove";
import { MainContentBelow } from "@/components/home/server/MainContentBelow";
import Image from "next/image";
import FooterImage from "@/assets/images/MainFooterImage.webp";
import React from "react";

export default function Home() {
  return (
    <main>
      <HeroImage />
      <MainContentAbove />
      <MainContentBelow />
      <div>
        <Image
          src={FooterImage}
          alt={"FooterImage"}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
    </main>
  );
}
