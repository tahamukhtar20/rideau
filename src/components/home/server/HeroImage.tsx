import Image from "next/image";
import HeroImageWebP from "@/assets/images/HeroComponentImage.webp";
import React from "react";

export const HeroImage: React.FC = () => {
  return (
    <>
      <Image
        className="object-cover w-full min-h-[calc(100vh-15.5rem)]"
        alt={"HeroComponentImage"}
        src={HeroImageWebP}
      ></Image>
    </>
  );
};
