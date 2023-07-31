import { options } from "@/data/home/header";
import { HamburgerIcon, Logo, ProfileIcon } from "@/utils/SVG";
import Link from "next/link";
import React from "react";

export const Header: React.FC = () => {
  const hamburgerMenu = (
    <div className="flex-none lg:hidden">
      <label
        htmlFor="my-drawer-3"
        className="btn btn-square btn-ghost text-primary"
      >
        <HamburgerIcon />
      </label>
    </div>
  );

  const drawer = (
    <>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side ">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-secondary z-50">
          {options.map((option, index) => (
            <li key={index}>
              <a
                href={`/${option.slug}`}
                className="font-secondary hover:scale-105 transition-all duration-300 text-sm text-primary hover:text-primary"
              >
                {option.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
  return (
    <header className="h-14 sticky w-full text-primary px-2">
      <nav className="items-center md:flex hidden justify-between w-full h-full flex-row">
        <Link href={"/"} className="flex w-24 overflow-clip">
          <Logo />
        </Link>
        {options.map((option, index) => (
          <a
            href={`/${option.slug}`}
            key={index}
            className="font-secondary hover:scale-105 transition-all duration-300  text-sm text-primary"
          >
            {option.name}
          </a>
        ))}
        <Link href={"/signup"}>
          <ProfileIcon />
        </Link>
      </nav>
      <nav className="items-center md:hidden flex justify-between w-full h-full flex-row">
        <div className="flex w-24 overflow-clip">
          <Logo />
        </div>
        {hamburgerMenu}
        {drawer}
      </nav>
    </header>
  );
};
