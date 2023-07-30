import { mainContentBelow } from "@/data_fr/index/mainContent";
import Image from "next/image";
import BottomImage1 from "@/assets/images/MainComponentBelowImage1.webp";
import BottomImage2 from "@/assets/images/MainComponentBelowImage2.webp";
import React from "react";

export const MainContentBelow: React.FC = () => {
  return (
    <section className="bg-primary-dark py-2 px-6 sm:py-4 lg:py-6 min-h-fit">
      <div className="container mx-auto flex flex-col items-center max-w-4xl">
        <h4 className="text-lg sm:text-xl md:text-2xl text-gray-200 font-quaternary text-center leading-relaxed :">
          {mainContentBelow.content.map((content, index) => (
            <span
              key={index}
              className={`text-${content.color} leading-relaxed`}
            >
              {content.text}{" "}
            </span>
          ))}
        </h4>
        <h6 className="text-sm sm:text-md text-center font-tertiary text-secondary mt-4 sm:mt-6 max-w-2xl">
          {mainContentBelow.description}
        </h6>
      </div>
      <div className="flex lg:flex-row flex-col gap-y-6 items-center lg:gap-x-32 justify-center lg:pt-28 pt-10 pb-4">
        <div className="max-w-xs">
          <Image
            src={BottomImage1}
            alt={"BottomImage1"}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="max-w-xs">
          <Image
            src={BottomImage2}
            alt={"BottomImage1"}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </section>
  );
};
