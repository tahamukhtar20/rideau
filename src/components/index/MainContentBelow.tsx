import { mainContentBelow } from "@/data_fr/index/mainContent";

export const MainContentBelow: React.FC = () => {
  return (
    <section className="bg-primary-dark py-8  px-6 sm:py-16 lg:py-24 min-h-fit">
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
    </section>
  );
};
