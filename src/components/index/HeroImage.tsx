import Image from "next/image";
import HeroImageWebP from "@/assets/images/HeroComponentImage.webp";

export const HeroImage: React.FC = () => {
  return (
    <>
      <Image
        alt={"HeroComponentImage"}
        src={HeroImageWebP}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      ></Image>
    </>
  );
};
