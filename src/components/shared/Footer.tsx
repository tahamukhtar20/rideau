import { footerContent } from "@/data/home/footerContent";
import React from "react";
import { InstagramIcon } from "@/utils/Images";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <>
      <footer className="sticky bg-primary-dark min-h-[12rem] font-quaternary w-full text-secondary flex flex-col lg:flex-row">
        <div className="w-full px-5 sm:px-10 py-5">
          <div>
            <h4 className="text-2xl sm:text-3xl md:text-4xl text-start leading-relaxed">
              {footerContent.title.split("\n").map((text, index) => (
                <span key={index}>
                  {text}
                  <br />
                </span>
              ))}
            </h4>
          </div>
          <ul className="flex flex-col sm:flex-row w-full pt-4">
            <li className="flex flex-col w-full sm:w-1/2">
              <span className="text-xl">{footerContent.phone.title}</span>
              <span className="font-tertiary">
                {footerContent.phone.content}
              </span>
            </li>
            <li className="flex flex-col w-full sm:w-1/2">
              <span className="text-xl">{footerContent.email.title}</span>
              <span className="font-tertiary">
                {footerContent.email.content}
              </span>
            </li>
          </ul>
        </div>
        <Link href={"/"} target={"_blank"} className="w-full p-5 sm:p-10">
          <div className="border border-secondary h-16 px-5 flex items-center w-full justify-between">
            <h4 className="text-md sm:text-xl md:text-2xl uppercase text-start leading-loose">
              Social
            </h4>
            <div className="flex w-12">
              <InstagramIcon />
            </div>
          </div>
        </Link>
      </footer>
    </>
  );
};
