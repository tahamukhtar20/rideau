import React from "react";
import Link from "next/link";

export const HeroImage: React.FC = () => {
  return (
    <>
      <div
        className="min-h-[calc(100vh-3.5rem)] text-4xl font-tertiary uppercase text-primary bg-cover bg-center bg-no-repeat md:p-24 sm:p-16 p-8 flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/HeroComponentImage.webp)`,
        }}
      >
        <div className="">
          <h1 className="lg:text-7xl md:text-6xl sm:text-5xl text-4xl pb-5 font-tertiary">
            Lorem ipsum dolor sit
          </h1>
          <h2 className="md:text-3xl text-xl font-tertiary text-primary text-start pb-5">
            Lorem ipsum dolor sit amet consectetur
          </h2>
          <Link
            href={"/projects"}
            className="btn btn-primary bg-primary font-secondary sm:btn-md btn-sm sm:p-2 text-lg text-white hover:bg-white hover:text-primary hover:border-primary rounded border-primary"
          >
            View Projects
          </Link>
        </div>
      </div>
    </>
  );
};
