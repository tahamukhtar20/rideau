import { mainContentAbove } from "@/data_fr/index/mainContent";
import React from "react";

export const MainContentAbove: React.FC = () => {
  return (
    <section className="bg-secondary min-h-fit px-6 py-8 sm:py-16 lg:py-24">
      <div className="container mx-auto flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-quaternary text-primary-dark mb-8 sm:mb-12 md:mb-16">
          {mainContentAbove.title}
        </h2>
        <h4 className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-gray-200 font-quaternary text-center leading-relaxed max-w-2xl">
          {mainContentAbove.content.map((content, index) => (
            <span
              key={index}
              className={`text-${content.color} leading-relaxed`}
            >
              {content.text}{" "}
            </span>
          ))}
        </h4>
      </div>
    </section>
  );
};
