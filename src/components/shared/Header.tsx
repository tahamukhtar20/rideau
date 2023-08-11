"use client";
import { options, profile } from "@/data/home/header";
import { HamburgerIcon, Logo, ProfileIcon } from "@/utils/Images";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { toast } from "react-toastify";

export const Header: React.FC = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = React.useState(auth.currentUser);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(user);
      } else {
        setLoggedIn(null);
      }
    });
  }, []);
  const handleClick = () => {
    auth
      .signOut()
      .then(() => {
        setLoggedIn(null);
        toast.success("Déconnexion réussie", {
          position: "top-center",
          theme: "colored",
        });
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          toast.error("Utilisateur non trouvé", {
            theme: "colored",
            position: "top-center",
          });
        } else {
          toast.error("Erreur de déconnexion :" + error, {
            theme: "colored",
            position: "top-center",
          });
        }
      });
  };
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
  const userLoggedIn = (
    <>
      <div className="dropdown dropdown-end capitalize font-secondary">
        <label
          tabIndex={0}
          className={"hover:scale-105 transition-all duration-300 flex w-10"}
        >
          <ProfileIcon />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 "
        >
          <li>
            <Link href={"edit-profile"} className="capitalize">
              {profile.editProfile}
            </Link>
          </li>
          <li>
            <Link href={"/projects"} className="capitalize">
              {profile.projects}
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                handleClick();
              }}
              className="capitalize"
            >
              {profile.logout}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
  const notLoggedIn = (
    <>
      <div className="dropdown dropdown-end uppercase font-secondary">
        <label
          tabIndex={0}
          className={"hover:scale-105 transition-all duration-300 flex w-10"}
        >
          <ProfileIcon />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link href={"/signup"} className={"capitalize"}>
              {profile.signup}
            </Link>
          </li>
          <li>
            <Link href={"/login"} className={"capitalize"}>
              {profile.login}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
  const userLoggedInMobile = (
    <>
      <li>
        <button
          onClick={() => {
            document.getElementById("my-drawer-3")?.click();
            router.push("/edit-profile");
          }}
          className=" font-secondary capitalize w-full h-full hover:scale-105 transition-all duration-300 text-sm text-primary hover:text-primary"
        >
          {profile.editProfile}
        </button>
      </li>
      <li>
        <button
          className="w-full h-full font-secondary hover:scale-105 transition-all duration-300 text-sm text-primary hover:text-primary capitalize"
          onClick={() => {
            document.getElementById("my-drawer-3")?.click();
            router.push("/projects");
          }}
        >
          {profile.projects}
        </button>
      </li>
      <li>
        <button
          className=" font-secondary capitalize w-full h-full hover:scale-105 transition-all duration-300 text-sm text-primary hover:text-primary"
          onClick={() => {
            handleClick();
            document.getElementById("my-drawer-3")?.click();
          }}
        >
          {profile.logout}
        </button>
      </li>
    </>
  );
  const notLoggedInMobile = (
    <>
      <li>
        <button
          onClick={() => {
            document.getElementById("my-drawer-3")?.click();
            router.push("/signup");
          }}
          className=" font-secondary capitalize hover:scale-105 transition-all duration-300 text-sm text-primary hover:text-primary w-full h-full"
        >
          {profile.signup}
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            document.getElementById("my-drawer-3")?.click();
            router.push("/login");
          }}
          className="w-full h-full font-secondary hover:scale-105 transition-all duration-300 text-sm text-primary hover:text-primary capitalize"
        >
          {profile.login}
        </button>
      </li>
    </>
  );
  const drawer = (
    <>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side ">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-screen bg-secondary fixed z-[100] top-0 left-0">
          {options.map((option, index) => (
            <li key={index} className="">
              <button
                onClick={() => {
                  document.getElementById("my-drawer-3")?.click();
                  router.push("/" + option.slug);
                }}
                className="w-full h-full font-secondary hover:scale-105 transition-all duration-300 text-sm text-primary hover:text-primary"
              >
                {option.name}
              </button>
            </li>
          ))}
          <>{loggedIn ? userLoggedInMobile : notLoggedInMobile}</>
        </ul>
      </div>
    </>
  );
  return (
    <header className="h-14 sticky w-full text-primary px-2 shadow-lg">
      <nav className="items-center md:flex hidden justify-between w-full h-full flex-row">
        <Link
          href={"/"}
          className="flex w-24 overflow-clip hover:scale-105 transition-all duration-300"
        >
          <Logo />
        </Link>
        {options.map((option, index) => (
          <Link
            href={`/${option.slug}`}
            key={index}
            className="font-secondary hover:scale-105 transition-all duration-300  text-sm text-primary"
          >
            {option.name}
          </Link>
        ))}
        {loggedIn ? userLoggedIn : notLoggedIn}
      </nav>
      <nav className="items-center md:hidden flex justify-between w-full h-full flex-row">
        <Link href={"/"} className="flex w-24 overflow-clip">
          <Logo />
        </Link>
        {hamburgerMenu}
        {drawer}
      </nav>
    </header>
  );
};
