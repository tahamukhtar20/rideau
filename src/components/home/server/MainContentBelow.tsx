import { mainContentBelow } from "@/data/home/mainContent";
import Image from "next/image";
import BottomImage1 from "@/assets/images/MainComponentBelowImage1.webp";
import BottomImage2 from "@/assets/images/MainComponentBelowImage2.webp";
import React from "react";

export const MainContentBelow: React.FC = () => {
  return (
    <section className="bg-primary-dark py-6 min-h-[calc(100vh-15.5rem)] flex items-center justify-center">
      <div className="container mx-auto flex-col xl:flex-row justify-around flex px-4">
        <div className="flex flex-col items-center max-w-4xl py-5">
          <h4 className="text-2xl md:text-3xl lg:text-4xl text-gray-200 font-quaternary text-center leading-relaxed">
            {mainContentBelow.content.map((content, index) => (
              <span
                key={index}
                className={`text-${content.color} leading-relaxed`}
              >
                {content.text}
              </span>
            ))}
          </h4>
          <h6 className="text-md md:text-lg lg:text-xl text-center font-tertiary text-secondary mt-6 max-w-2xl">
            {mainContentBelow.description}
          </h6>
        </div>
        <div className="flex flex-col gap-y-12 items-center justify-center">
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
      </div>
    </section>
  );
};
